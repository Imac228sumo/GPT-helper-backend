import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { isNumber } from 'class-validator'
import { ChatCompletionMessageParam } from 'openai/resources'
import { PrismaService } from 'src/prisma.service'
import { CreateOpenaiMessageDto } from './dto/create-openai-message.dto'
import { IOpenAiMessagesQuery } from './types'

@Injectable()
export class OpenaiMessageService {
	constructor(private prisma: PrismaService) {}

	async createMessage(dto: CreateOpenaiMessageDto) {
		const message = await this.prisma.openAiMessage.create({
			data: {
				chat: {
					connect: {
						id: dto.chatId,
					},
				},
				role: dto.role,
				content: dto.content,
			},
		})
		return message
	}

	async getAllMessages(chatId: number) {
		const messages = await this.prisma.openAiMessage.findMany({
			where: {
				chatId: chatId,
			},
			orderBy: {
				id: 'asc',
			},
			select: {
				role: true,
				content: true,
			},
		})
		return messages as ChatCompletionMessageParam[]
	}

	async getAllMessagesQuery(chatId: number, query: IOpenAiMessagesQuery) {
		if (query.page && query.limit) {
			if (
				!(isNumber(+query.page) && +query.page > 0) ||
				!(isNumber(+query.limit) && +query.limit >= 0)
			)
				throw new BadRequestException('Invalid format query params')

			const skip = (+query.page - 1) * +query.limit
			const messages = await this.prisma.openAiMessage.findMany({
				where: {
					chatId: chatId,
				},
				orderBy: {
					id: 'desc',
				},
				skip,
				take: +query.limit,
			})

			return messages
		} else {
			const messages = await this.prisma.openAiMessage.findMany({
				where: {
					chatId: chatId,
				},
				orderBy: {
					id: 'asc',
				},
			})
			return messages
		}
	}

	async findLastMessage(chatId: number): Promise<ChatCompletionMessageParam> {
		const message = await this.prisma.openAiMessage.findFirst({
			where: {
				chatId: chatId,
			},
			orderBy: {
				id: 'desc',
			},
			select: {
				role: true,
				content: true,
			},
		})
		if (!message) throw new NotFoundException('Message not found')
		return message as ChatCompletionMessageParam
	}

	async deleteAllMessages(chatId: number) {
		const chat = await this.prisma.openAiChat.findFirst({
			where: {
				id: chatId,
			},
		})

		if (!chat) throw new NotFoundException('Chat not found')

		const messages = await this.prisma.openAiMessage.deleteMany({
			where: {
				chatId: chatId,
			},
		})
		if (!messages) return []
		return messages
	}

	async deleteLastMessage(chatId: number) {
		const chat = await this.prisma.openAiChat.findFirst({
			where: {
				id: chatId,
			},
		})

		if (!chat) throw new NotFoundException('Chat not found')

		const lastMessage = await this.prisma.openAiMessage.findFirst({
			where: {
				chatId: chatId,
			},
			orderBy: {
				id: 'desc',
			},
		})

		if (lastMessage) {
			const deletedMessage = await this.prisma.openAiMessage.delete({
				where: {
					id: lastMessage.id,
				},
			})

			return deletedMessage
		} else {
			throw new NotFoundException('Message not found')
		}
	}
}

/*

	async getAllMessagesQuery(chatId: number, query: IOpenAiMessagesQuery) {
		if (query.page && query.limit) {
			if (
				!(isNumber(+query.page) && +query.page > 0) ||
				!(isNumber(+query.limit) && +query.limit >= 0)
			)
				throw new BadRequestException('Invalid format query params')

			const totalCount = await this.prisma.openAiMessage.count({
				where: {
					chatId: chatId,
				},
			})

			const totalPages = Math.ceil(totalCount / +query.limit)
			if (totalPages < +query.page) {
				return []
			} else if (totalPages === +query.page) {
				let totalMessage = totalCount % +query.limit
				return this.prisma.openAiMessage.findMany({
					where: {
						chatId: chatId,
					},
					orderBy: {
						createdAt: 'desc',
					},
					take: totalMessage,
				})
			}
			const skip = Math.max(0, totalCount - +query.page * +query.limit)
			const messages = await this.prisma.openAiMessage.findMany({
				where: {
					chatId: chatId,
				},
				orderBy: {
					createdAt: 'desc',
				},
				skip,
				take: +query.limit,
			})

			return messages
		} else {
			const messages = await this.prisma.openAiMessage.findMany({
				where: {
					chatId: chatId,
				},
				orderBy: {
					createdAt: 'asc',
				},
			})
			return messages
		}
	}

*/
