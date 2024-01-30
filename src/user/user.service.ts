import {
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { hash } from 'argon2'
import { AuthDto } from 'src/auth/dto/auth.dto'
import { OpenaiChatService } from 'src/openai-chat/openai-chat.service'
import { PrismaService } from 'src/prisma.service'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UserService {
	constructor(
		private prisma: PrismaService,
		private openaiChatService: OpenaiChatService
	) {}

	async getUserById(id: number) {
		const user = await this.prisma.user.findUnique({
			where: {
				id,
			},
			include: {
				freeSubscription: true,
				standardSubscription: true,
			},
		})
		if (!user) throw new NotFoundException('User not fount')
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
				isAdmin: true,
			},
			orderBy: {
				createdAt: 'desc',
			},
		})
	}

	async getCountUsers() {
		return this.prisma.user.count()
	}

	async createUser(dto: AuthDto) {
		// const users = await this.getAllUsers()

		const user = {
			// id: users.length + 1,
			email: dto.email,
			name: dto.name !== undefined ? dto.name : dto.email,
			password: await hash(dto.password),
		}

		return this.prisma.user.create({
			data: user,
		})
	}

	async updateProfileById(id: number, dto: UpdateUserDto) {
		const user = await this.getUserById(id)

		if (user.email != dto.email) {
			const oldUser = await this.getUserByEmail(dto.email)

			if (oldUser)
				throw new ConflictException(
					'User  with this email is already in the system'
				)
		}

		const isSameUser = await this.prisma.user.findUnique({
			where: {
				email: dto.email,
			},
		})

		if (isSameUser && String(id) !== String(isSameUser.id)) {
			throw new NotFoundException('Email busy')
		}

		await this.prisma.user.update({
			where: {
				id: id,
			},
			data: {
				email: dto.email,
				name: dto.name !== undefined ? dto.name : user.name,
				password:
					dto.password !== undefined ? await hash(dto.password) : user.password,
			},
		})

		return
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

		await this.prisma.user.update({
			where: {
				id: _id,
			},
			data: {
				email: dto.email,
				name: dto.name !== undefined ? dto.name : user.name,
				password: dto.password ? await hash(dto.password) : user.password,
				isAdmin: dto.isAdmin !== undefined ? dto.isAdmin : user.isAdmin,
			},
		})

		return
	}

	async deleteUser(id: number) {
		const user = await this.prisma.user.findUnique({
			where: {
				id,
			},
			include: {
				openAiChats: true,
				yandexChats: true,
			},
		})
		if (!user) throw new NotFoundException('User not fount')

		for (const chat of user.openAiChats) {
			await this.openaiChatService.deleteChat(chat.id, user.id)
		}

		const removesUser = await this.prisma.user.delete({
			where: {
				id: id,
			},
		})
		if (!removesUser) throw new NotFoundException('User not found')
		return removesUser
	}
}
