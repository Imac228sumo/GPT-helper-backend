/* eslint-disable @typescript-eslint/no-unused-vars */
import {
	ConflictException,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { verify } from 'argon2'
import { Response } from 'express'
import { UserService } from 'src/user/user.service'
import { AuthDto } from './dto/auth.dto'
import { RefreshTokenDto } from './dto/refresh-token.dto'

@Injectable()
export class AuthService {
	EXPIRE_DAY_REFRESH_TOKEN = 1
	REFRESH_TOKEN_NAME = 'refreshToken'

	constructor(
		private jwtService: JwtService,
		private userService: UserService
	) {}

	async login(dto: AuthDto) {
		const { password, ...user } = await this.validateUser(dto)
		const tokens = await this.issueTokens(user.id)

		return {
			user,
			...tokens,
		}
	}

	async register(dto: AuthDto) {
		const oldUser = await this.userService.getUserByEmail(dto.email)

		if (oldUser)
			throw new ConflictException(
				'User  with this email is already in the system'
			)

		const { password, ...user } = await this.userService.createUser(dto)

		const tokens = await this.issueTokens(user.id)

		return {
			user,
			...tokens,
		}
	}

	async getNewTokens(dto: RefreshTokenDto) {
		if (!dto.refreshToken) throw new UnauthorizedException('Please sign in!')
		const result = await this.jwtService.verifyAsync(dto.refreshToken)
		if (!result) throw new UnauthorizedException('Invalid refresh token')

		const { password, ...user } = await this.userService.getUserById(result.id)

		const tokens = await this.issueTokens(user.id)

		return {
			user,
			...tokens,
		}
	}

	private async issueTokens(userId: number) {
		const data = { id: userId }

		const accessToken = this.jwtService.sign(data, {
			expiresIn: '1h',
		})

		const refreshToken = this.jwtService.sign(data, {
			expiresIn: '1d',
		})

		return { accessToken, refreshToken }
	}

	private async validateUser(dto: AuthDto) {
		const user = await this.userService.getUserByEmail(dto.email)

		if (!user) throw new NotFoundException('User not found')

		const isValid = await verify(user.password, dto.password)

		if (!isValid) throw new UnauthorizedException('Invalid password')

		return user
	}

	addRefreshTokenToResponse(res: Response, refreshToken: string) {
		const expiresIn = new Date()
		expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN)

		res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
			httpOnly: true,
			domain:
				process.env.NODE_ENV === 'production'
					? `.${process.env.DOMAIN}`
					: 'localhost',
			path: '/',
			expires: expiresIn,
			maxAge: 60 * 60 * 24 * 7,
			// true if production
			secure: process.env.NODE_ENV === 'production' ? true : false,
			// lax if production
			sameSite: process.env.NODE_ENV === 'production' ? 'none' : true,
		})
	}

	removeRefreshTokenFromResponse(res: Response) {
		res.cookie(this.REFRESH_TOKEN_NAME, '', {
			httpOnly: true,
			domain:
				process.env.NODE_ENV === 'production'
					? `.${process.env.DOMAIN}`
					: 'localhost',
			path: '/',
			expires: new Date(0),
			maxAge: 0,
			// true if production
			secure: process.env.NODE_ENV === 'production' ? true : false,
			// lax if production
			sameSite: process.env.NODE_ENV === 'production' ? 'none' : true,
		})
	}
}
