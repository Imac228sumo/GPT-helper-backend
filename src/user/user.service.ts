import {
	BadRequestException,
	ConflictException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common'
import { hash, verify } from 'argon2'
import { OpenaiChatService } from 'src/openai-chat/openai-chat.service'
import { PrismaService } from 'src/prisma.service'
import { ReferralsService } from 'src/referrals/referrals.service'
import { errors } from 'src/utils/errors'
import { getInitials } from 'src/utils/get-initials'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdatePasswordDto, UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UserService {
	constructor(
		private prisma: PrismaService,
		private openaiChatService: OpenaiChatService,
		private referralsService: ReferralsService
	) {}

	async getUserById(id: number) {
		const user = await this.prisma.user.findUnique({
			where: {
				id,
			},
			include: {
				subscriptions: {
					include: {
						plan: {
							include: {
								tools: {
									include: {
										tool: true,
									},
								},
								optionsForPlan: {
									include: {
										optionForPlan: true,
									},
								},
							},
						},
					},
				},
				referrals: {
					select: {
						id: true,
						referredByUserId: true,
						userId: true,
						countPaid: true,
						countProcessing: true,
					},
				},
				referral: {
					select: {
						id: true,
						referredByUserId: true,
						userId: true,
						countPaid: true,
						countProcessing: true,
					},
				},
			},
		})
		if (!user) throw new NotFoundException('User not found')
		return user
	}

	async getUserByEmail(email: string) {
		const user = await this.prisma.user.findUnique({
			where: {
				email,
			},
		})
		return user
	}

	async getAllUsers(searchTerm?: string) {
		return this.prisma.user.findMany({
			where: searchTerm
				? {
						OR: [
							{
								email: {
									contains: searchTerm,
									mode: 'insensitive',
								},
							},
							{
								name: {
									contains: searchTerm,
									mode: 'insensitive',
								},
							},
						],
					}
				: {},
			select: {
				name: true,
				email: true,
				id: true,
				password: false,
				role: true,
			},
			orderBy: {
				createdAt: 'desc',
			},
		})
	}

	async getCountUsers() {
		return this.prisma.user.count()
	}

	async createUser(dto: CreateUserDto) {
		if (dto.referralCode) {
			const referrer = await this.referralsService.getReferralIdByCode(
				dto.referralCode
			)

			const shortName = getInitials(
				dto.name !== undefined ? dto.name : dto.email
			)
			const user = {
				email: dto.email,
				name: dto.name !== undefined ? dto.name : dto.email,
				shortName: shortName,
				password: await hash(dto.password),
				referralCode: await this.referralsService.generateReferralCode(
					dto.email
				),
			}

			const newUser = await this.prisma.user.create({
				data: user,
			})

			if (!newUser) {
				throw new InternalServerErrorException("Unable to create user's data")
			}

			const referral = await this.referralsService.createReferral({
				referredByUserId: referrer,
				userId: newUser.id,
			})

			if (!referral) {
				throw new InternalServerErrorException(
					"Unable to create referral's data"
				)
			}

			await this.referralsService.incrementReferrer(referrer)

			return newUser
		} else {
			const shortName = getInitials(
				dto.name !== undefined ? dto.name : dto.email
			)
			const user = {
				email: dto.email,
				name: dto.name !== undefined ? dto.name : dto.email,
				shortName: shortName,
				password: await hash(dto.password),
				referralCode: await this.referralsService.generateReferralCode(
					dto.email
				),
			}

			const newUser = await this.prisma.user.create({
				data: user,
			})

			if (!newUser) {
				throw new InternalServerErrorException("Unable to create user's data")
			}
			return newUser
		}
	}

	async updateProfileById(id: number, dto: UpdateUserDto) {
		const user = await this.getUserById(id)

		if (user.email != dto.email) {
			const oldUser = await this.getUserByEmail(dto.email)

			if (oldUser)
				throw new ConflictException(errors.UserWithEmailIsAlreadyInSystem)
		}

		const isSameUser = await this.prisma.user.findUnique({
			where: {
				email: dto.email,
			},
		})

		if (isSameUser && String(id) !== String(isSameUser.id)) {
			throw new NotFoundException('Email busy')
		}

		const updatedUser = await this.prisma.user.update({
			where: {
				id: id,
			},
			data: {
				email: dto.email,
				name: dto.name !== undefined ? dto.name : user.name,
				password:
					dto.password !== undefined ? await hash(dto.password) : user.password,
				role: dto.role,
			},
		})

		if (!updatedUser) {
			throw new InternalServerErrorException("Unable to update user's data")
		}

		return updatedUser
	}

	async updatePasswordById(id: number, dto: UpdatePasswordDto) {
		const user = await this.getUserById(id)
		if (!user) throw new NotFoundException(errors.UserIsNotFound)

		if (!(await verify(user.password, dto.oldPassword))) {
			throw new BadRequestException(errors.CurrentPasswordIncorrect)
		}

		const updatedUser = await this.prisma.user.update({
			where: {
				id: id,
			},
			data: {
				password: await hash(dto.newPassword),
			},
		})

		if (!updatedUser) {
			throw new InternalServerErrorException("Unable to update user's data")
		}

		return updatedUser
	}

	async updateUserById(id: number, _id: number, dto: UpdateUserDto) {
		if (id === _id)
			throw new ConflictException(
				'Your profile matches the one you are editing'
			)

		const user = await this.getUserById(_id)
		const isSameUser = await this.prisma.user.findUnique({
			where: {
				email: dto.email,
			},
		})

		if (isSameUser && String(_id) !== String(isSameUser.id)) {
			throw new NotFoundException('Email busy')
		}

		const updatedUser = await this.prisma.user.update({
			where: {
				id: _id,
			},
			data: {
				email: dto.email,
				name: dto.name !== undefined ? dto.name : user.name,
				password: dto.password ? await hash(dto.password) : user.password,
			},
		})

		if (!updatedUser) {
			throw new InternalServerErrorException("Unable to update user's data")
		}

		return updatedUser
	}

	async deleteUser(id: number) {
		const user = await this.prisma.user.findUnique({
			where: {
				id,
			},
		})
		if (!user) throw new NotFoundException('User not found')

		const removesUser = await this.prisma.user.delete({
			where: {
				id: id,
			},
		})

		if (!removesUser) {
			throw new InternalServerErrorException("Unable to delete user's data")
		}

		return removesUser
	}
}
