import {
	ForbiddenException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { YandexMessageService } from 'src/yandex-message/yandex-message.service'
import { YandexService } from 'src/yandex/yandex.service'
import { ResponseYandexDto } from './dto/response-yandex.dto'
import { SendMessageDto, UpdateChatDto } from './dto/update-chat.dto'

@Injectable()
export class YandexChatService {
	constructor(
		private prisma: PrismaService,
		private yandexMessageService: YandexMessageService,
		private yandexService: YandexService
	) {}

	async createChat(userId: number) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId,
			},
		})
		if (!user) throw new NotFoundException('User not found')

		const countChat = await this.prisma.yandexChat.findMany({
			where: {
				userId: userId,
			},
		})

		if (countChat.length > 5)
			throw new ForbiddenException('The chat limit has been exceeded')

		const chat = await this.prisma.yandexChat.create({
			data: {
				user: {
					connect: {
						id: user.id,
					},
				},
			},
		})

		const modifiedDto = {
			chatId: chat.id,
			role: 'system',
			text: 'Ты ассистент дроид, способный помочь в галактических приключениях.',
		}

		await this.yandexMessageService.createMessage(modifiedDto)

		if (!chat) throw new InternalServerErrorException('failed to create a chat')

		return chat
	}

	async getChat(chatId: number, userId: number) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId,
			},
		})
		if (!user) throw new NotFoundException('User not found')

		const chat = await this.prisma.yandexChat.findUnique({
			where: {
				id: chatId,
			},
			include: {
				messages: true,
			},
		})

		if (!chat) throw new NotFoundException('Chat not found')

		return chat
	}

	async updateChat(id: number, dto: UpdateChatDto) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: dto.userId,
			},
		})

		if (!user) throw new NotFoundException('User not found')

		const modifiedDto = {
			chatId: id,
			role: dto.role,
			text: dto.text,
		}

		await this.yandexMessageService.createMessage(modifiedDto)

		const chat = await this.prisma.yandexChat.findUnique({
			where: {
				id: id,
			},
			include: {
				messages: {
					orderBy: {
						createdAt: 'asc',
					},
				},
			},
		})
		return chat
	}

	async sendMessage(chatId: number, userId: number, dto: SendMessageDto) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId,
			},
		})

		if (!user) throw new NotFoundException('User not found')

		const chat = await this.prisma.yandexChat.findUnique({
			where: {
				id: chatId,
			},
		})

		if (!chat) throw new NotFoundException('Chat not found')

		const createMessageDto = {
			chatId: chatId,
			role: 'user',
			text: dto.message,
		}
		await this.yandexMessageService.createMessage(createMessageDto)

		const messages = await this.yandexMessageService.findAllMessages(
			chatId,
			userId
		)

		const response: ResponseYandexDto =
			await this.yandexService.generateResponse({ messages })
		const aiResponse = response.result.alternatives[0].message

		const updateChatDtoAi = {
			userId: userId,
			...aiResponse,
		}

		const chatResponse = await this.updateChat(chatId, updateChatDtoAi)
		return chatResponse
	}

	async deleteChat(chatId: number, userId: number) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId,
			},
		})

		if (!user) throw new NotFoundException('User not found')

		await this.yandexMessageService.deleteAllMessages(chatId, userId)

		const chat = await this.prisma.yandexChat.delete({
			where: {
				id: chatId,
			},
		})

		return chat
	}
}
