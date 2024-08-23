/* eslint-disable @typescript-eslint/no-unused-vars */
import {
	ConflictException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Role } from '@prisma/client'
import { hash, verify } from 'argon2'
import { Response } from 'express'
import { MailService } from 'src/mail/mail.service'
import { PrismaService } from 'src/prisma.service'
import { SubscriptionsService } from 'src/subscriptions/subscriptions.service'
import { CreateUserDto } from 'src/user/dto/create-user.dto'
import { UserService } from 'src/user/user.service'
import { errors } from 'src/utils/errors'
import { AuthDto } from './dto/auth.dto'
import { PasswordRecoveryDto } from './dto/password-recovery.dto'
import { PasswordResetDto } from './dto/password-reset.dto'
import { RefreshTokenDto } from './dto/refresh-token.dto'

@Injectable()
export class AuthService {
	EXPIRE_DAY_REFRESH_TOKEN = 30
	REFRESH_TOKEN_NAME = 'refreshToken'
	ORIGIN = process.env.ORIGIN

	constructor(
		private prisma: PrismaService,
		private jwtService: JwtService,
		private userService: UserService,
		private subscriptionsService: SubscriptionsService,
		private mailService: MailService,
		private configService: ConfigService
	) {}

	async login(dto: AuthDto) {
		const { password, ...user } = await this.validateUser(dto)
		const tokens = await this.issueTokens(user.id, user.role)

		return {
			user,
			...tokens,
		}
	}

	async register(dto: CreateUserDto) {
		const oldUser = await this.userService.getUserByEmail(dto.email)

		if (oldUser)
			throw new ConflictException(errors.UserWithEmailIsAlreadyInSystem)

		const { password, ...user } = await this.userService.createUser(dto)

		if (user.id !== 1 && user.id !== 0) {
			const plan = await this.prisma.plan.findFirst({
				where: {
					type: 'free',
				},
				orderBy: {
					createdAt: 'desc',
				},
			})
			if (plan) {
				await this.subscriptionsService.createSubscription({
					months: 1,
					userId: user.id,
					planId: plan.id,
				})
			}
		}

		const tokens = await this.issueTokens(user.id, user.role)

		return {
			user,
			...tokens,
		}
	}

	async passwordRecovery(dto: PasswordRecoveryDto) {
		const user = await this.userService.getUserByEmail(dto.email)
		if (!user) throw new NotFoundException(errors.UserIsNotFound)

		const payload = { userId: user.id, email: user.email }
		const passResetToken = this.jwtService.sign(payload, {
			expiresIn: '1m',
		})
		const link = `${this.ORIGIN}/password_reset/${passResetToken}`
		return this.mailService.sendEmailResetPass(user.email, link)
	}

	async passwordReset(dto: PasswordResetDto) {
		const user = await this.userService.getUserById(dto.userId)
		if (!user) throw new NotFoundException(errors.UserIsNotFound)

		try {
			const result = await this.jwtService.verifyAsync(dto.resetToken)
			if (!result) throw new UnauthorizedException(errors.ResetPassJwtInvalid)

			const updatedUser = await this.prisma.user.update({
				where: {
					id: dto.userId,
				},
				data: {
					password: await hash(dto.newPassword),
				},
			})

			if (!updatedUser) {
				throw new InternalServerErrorException("Unable to update user's data")
			}

			return updatedUser
		} catch (error) {
			throw new UnauthorizedException(errors.ResetPassJwtInvalid)
		}
	}

	async getNewTokens(dto: RefreshTokenDto) {
		if (!dto.refreshToken) throw new UnauthorizedException('Please sign in!')

		try {
			const result = await this.jwtService.verifyAsync(dto.refreshToken)
			if (!result) throw new UnauthorizedException('Invalid refresh token')

			const { password, ...user } = await this.userService.getUserById(
				result.id
			)

			const tokens = await this.issueTokens(user.id, user.role)

			return {
				user,
				...tokens,
			}
		} catch (error) {
			throw new UnauthorizedException('Invalid refresh token')
		}
	}

	private async issueTokens(userId: number, role?: Role) {
		const data = { id: userId, role: role }

		const accessToken = this.jwtService.sign(data, {
			expiresIn: '1d',
		})

		const refreshToken = this.jwtService.sign(data, {
			expiresIn: '7d',
		})

		return { accessToken, refreshToken }
	}

	private async validateUser(dto: AuthDto) {
		const user = await this.userService.getUserByEmail(dto.email)

		if (!user) throw new NotFoundException('Email or password invalid')

		const isValid = await verify(user.password, dto.password)

		if (!isValid) throw new UnauthorizedException('Email or password invalid')

		return user
	}

	addRefreshTokenToResponse(res: Response, refreshToken: string) {
		const expiresIn = new Date()
		expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN)

		res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
			httpOnly: true,
			domain:
				process.env.NODE_ENV === 'production'
					? process.env.DOMAIN
					: 'localhost',
			expires: expiresIn,
			secure: process.env.NODE_ENV === 'production' ? true : false,
			sameSite: process.env.NODE_ENV === 'production' ? 'lax' : true,
		})
	}

	removeRefreshTokenFromResponse(res: Response) {
		res.cookie(this.REFRESH_TOKEN_NAME, '', {
			httpOnly: true,
			domain:
				process.env.NODE_ENV === 'production'
					? process.env.DOMAIN
					: 'localhost',
			expires: new Date(0),
			secure: process.env.NODE_ENV === 'production' ? true : false,
			sameSite: process.env.NODE_ENV === 'production' ? 'lax' : true,
		})
	}
}
