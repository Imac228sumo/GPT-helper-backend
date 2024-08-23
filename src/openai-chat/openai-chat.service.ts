import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common'
import { isNumber } from 'class-validator'
import { Response } from 'express'
import { ChatCompletion, ChatCompletionMessageParam } from 'openai/resources'
import { OpenaiMessageService } from 'src/openai-message/openai-message.service'
import { IOpenAiMessagesQuery } from 'src/openai-message/types'
import { OpenaiService } from 'src/openai/openai.service'
import { PrismaService } from 'src/prisma.service'
import { SubscriptionsService } from 'src/subscriptions/subscriptions.service'
import { errors } from 'src/utils/errors'
import { CreateChatDto } from './dto/create-chat.dto'
import {
	SendMessageDto,
	SetNameDto,
	UpdateChatDto,
} from './dto/update-chat.dto'
import { IOpenAiChatsQuery } from './types'

@Injectable()
export class OpenaiChatService {
	constructor(
		private prisma: PrismaService,
		private openaiService: OpenaiService,
		private openaiMessageService: OpenaiMessageService,
		private subscriptionsService: SubscriptionsService
	) {}
	// Unauthorized section
	async sendMessageStreamUnauthorized(dto: SendMessageDto, res: Response) {
		const messages = [
			{
				role: 'system',
				content: 'ты помощник ассистент',
			},
			{
				role: 'user',
				content: dto.message,
			},
		] as ChatCompletionMessageParam[]

		const stream = await this.openaiService.generateResponseStreamUnauthorized({
			messages,
		})
		res.setHeader('Content-Type', 'text/plain')

		for await (const chunk of stream) {
			res.write(chunk.choices[0]?.delta?.content || '')
		}
		res.end()
	}

	// Authorized section
	async createChat(userId: number, dto: CreateChatDto) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId,
			},
		})
		if (!user) throw new NotFoundException('User not found')

		const timeLastRequest = new Date()
		const chat = await this.prisma.openAiChat.create({
			data: {
				user: {
					connect: {
						id: user.id,
					},
				},
				name: dto.name,
				aiName: dto.aiName,
				modelName: dto.modelName,
				timeLastRequest: timeLastRequest,
			},
		})

		if (!chat)
			throw new InternalServerErrorException("Unable to create chat's data")

		return chat
	}

	async getChat(chatId: number, userId: number) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId,
			},
		})
		if (!user) throw new NotFoundException('User not found')

		const chat = await this.prisma.openAiChat.findUnique({
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

	async getAllChats(userId: number, query: IOpenAiChatsQuery) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId,
			},
		})
		if (!user) throw new NotFoundException('User not found')

		if (query.page && query.limit) {
			if (
				!(isNumber(+query.page) && +query.page > 0) ||
				!(isNumber(+query.limit) && +query.limit >= 0)
			)
				throw new BadRequestException('Invalid format query params')

			if (query.recent === 'true') {
				const skip = (+query.page - 1) * +query.limit
				const chats = await this.prisma.openAiChat.findMany({
					orderBy: {
						timeLastRequest: {
							sort: 'desc',
						},
					},
					include: {
						messages: false,
					},
					skip,
					take: +query.limit,
				})

				return chats
			} else {
				const skip = (+query.page - 1) * +query.limit
				const chats = await this.prisma.openAiChat.findMany({
					orderBy: {
						id: 'desc',
					},
					include: {
						messages: false,
					},
					skip,
					take: +query.limit,
				})

				return chats
			}
		} else {
			const chats = await this.prisma.openAiChat.findMany({
				orderBy: {
					id: 'desc',
				},
				include: {
					messages: false,
				},
			})
			return chats
		}
	}

	async getAllRecentChats(userId: number, query: IOpenAiChatsQuery) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId,
			},
		})
		if (!user) throw new NotFoundException('User not found')

		if (query.page && query.limit) {
			if (
				!(isNumber(+query.page) && +query.page > 0) ||
				!(isNumber(+query.limit) && +query.limit >= 0)
			)
				throw new BadRequestException('Invalid format query params')
			const skip = (+query.page - 1) * +query.limit
			const chats = await this.prisma.openAiChat.findMany({
				orderBy: {
					timeLastRequest: 'desc',
				},
				include: {
					messages: false,
				},
				skip,
				take: +query.limit,
			})

			return chats
		} else {
			const chats = await this.prisma.openAiChat.findMany({
				orderBy: {
					timeLastRequest: 'desc',
				},
				include: {
					messages: false,
				},
			})
			return chats
		}
	}

	async getAllMessages(
		userId: number,
		chatId: number,
		query: IOpenAiMessagesQuery
	) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId,
			},
		})
		if (!user) throw new NotFoundException('User not found')

		const messages = this.openaiMessageService.getAllMessagesQuery(
			chatId,
			query
		)

		return messages
	}

	async setName(userId: number, { name, chatId }: SetNameDto) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId,
			},
		})
		if (!user) throw new NotFoundException('User not found')

		const chat = await this.prisma.openAiChat.update({
			where: {
				id: chatId,
			},
			data: {
				name: name,
			},
			include: {
				messages: true,
			},
		})

		if (!chat) {
			throw new InternalServerErrorException("Unable to update chat's data")
		}

		return chat
	}

	async getLastMessage(chatId: number, userId: number) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId,
			},
		})
		if (!user) throw new NotFoundException('User not found')

		const message = this.openaiMessageService.findLastMessage(chatId)

		if (!message) throw new NotFoundException('Message not found')

		return message
	}

	async updateChat(id: number, dto: UpdateChatDto) {
		const modifiedDto = {
			chatId: id,
			role: dto.role,
			content: dto.content,
		}

		const message = await this.openaiMessageService.createMessage(modifiedDto)
		if (!message)
			throw new InternalServerErrorException("Unable to create message's data")

		const timeLastRequest = new Date()
		const chat = await this.prisma.openAiChat.update({
			where: {
				id: id,
			},
			data: {
				timeLastRequest: timeLastRequest,
			},
		})

		if (!chat)
			throw new InternalServerErrorException("Unable to update chat's data")
	}

	async updateChatStream(id: number, dto: UpdateChatDto) {
		const modifiedDto = {
			chatId: id,
			role: dto.role,
			content: dto.content,
		}

		const message = await this.openaiMessageService.createMessage(modifiedDto)
		if (!message)
			throw new InternalServerErrorException("Unable to create message's data")

		const timeLastRequest = new Date()
		const chat = await this.prisma.openAiChat.update({
			where: {
				id: id,
			},
			data: {
				timeLastRequest: timeLastRequest,
			},
		})

		if (!chat)
			throw new InternalServerErrorException("Unable to update chat's data")
	}

	async sendMessage(chatId: number, userId: number, dto: SendMessageDto) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId,
			},
		})

		if (!user) throw new NotFoundException('User not found')

		const chat = await this.prisma.openAiChat.findUnique({
			where: {
				id: chatId,
			},
		})

		if (!chat) throw new NotFoundException('Chat not found')

		const createMessageDto = {
			chatId: chatId,
			role: 'user',
			content: dto.message,
		}
		await this.openaiMessageService.createMessage(createMessageDto)

		const messages = await this.openaiMessageService.getAllMessages(chatId)

		const response: ChatCompletion = (await this.openaiService.generateResponse(
			{ messages }
		)) as ChatCompletion
		const aiResponse = response.choices[0].message

		const updateChatDtoAi = {
			userId: userId,
			...aiResponse,
		}

		const chatResponse = await this.updateChat(chatId, updateChatDtoAi)
		return chatResponse
	}

	async sendMessageStream(
		chatId: number,
		userId: number,
		dto: SendMessageDto,
		res: Response
	) {
		const toolName = 'gpt-3.5-turbo'

		const user = await this.prisma.user.findUnique({
			where: {
				id: userId,
			},
			include: {
				subscriptions: true,
			},
		})

		if (!user) {
			res.setHeader('Content-Type', 'text/plain')
			res.write(errors.UserNotFound)
			return
		}

		const isPossible = await this.subscriptionsService.isPermissionMakeRequest(
			userId,
			toolName
		)

		const chat = await this.prisma.openAiChat.findUnique({
			where: {
				id: chatId,
			},
		})

		if (!chat) {
			res.setHeader('Content-Type', 'text/plain')
			res.write(errors.ChatNotFound)
			return
		}

		const createMessageDto = {
			chatId: chatId,
			role: 'user',
			content: dto.message,
		}
		const message =
			await this.openaiMessageService.createMessage(createMessageDto)
		if (!message) {
			res.setHeader('Content-Type', 'text/plain')
			res.write(errors.UnableCreateMessage)
			return
		}

		createMessageDto
		if (typeof isPossible === 'string') {
			res.setHeader('Content-Type', 'text/plain')
			res.write(isPossible)
			const updateChatDtoAi = {
				userId: userId,
				content: isPossible,
				role: 'assistant',
			}
			await this.updateChatStream(chatId, updateChatDtoAi)
			return isPossible
		}

		const messages = await this.openaiMessageService.getAllMessages(chatId)

		let resultResponse = ''
		const stream = await this.openaiService.generateResponseStream(
			{ messages },
			isPossible.nameSubscription
		)
		res.setHeader('Content-Type', 'text/plain')
		if (typeof stream === 'string') {
			res.write(stream)
			resultResponse = stream
		} else {
			for await (const chunk of stream) {
				// process.stdout.write(chunk.choices[0]?.delta?.content || '')
				res.write(chunk.choices[0]?.delta?.content || '')
				resultResponse += chunk.choices[0]?.delta?.content || ''
			}
			if (!isPossible.isUnlimited) {
				await this.subscriptionsService.decrementSubscriptionBalance(
					isPossible.subscriptionsId
				)
			}
		}
		res.end()

		const updateChatDtoAi = {
			userId: userId,
			content: resultResponse,
			role: 'assistant',
		}
		await this.updateChatStream(chatId, updateChatDtoAi)
	}

	async regenerateMessageStream(
		chatId: number,
		userId: number,
		dto: SendMessageDto,
		res: Response
	) {
		const toolName = 'gpt-3.5-turbo'

		const user = await this.prisma.user.findUnique({
			where: {
				id: userId,
			},
			include: {
				subscriptions: true,
			},
		})
		if (!user)
			if (!user) {
				res.setHeader('Content-Type', 'text/plain')
				res.write(errors.UserNotFound)
				return
			}

		const isPossible = await this.subscriptionsService.isPermissionMakeRequest(
			userId,
			toolName
		)
		if (typeof isPossible === 'string') {
			res.setHeader('Content-Type', 'text/plain')
			res.write(isPossible)
			const updateChatDtoAi = {
				userId: userId,
				content: isPossible,
				role: 'assistant',
			}
			await this.openaiMessageService.deleteLastMessage(chatId)
			await this.updateChatStream(chatId, updateChatDtoAi)
			return
		}

		const chat = await this.prisma.openAiChat.findUnique({
			where: {
				id: chatId,
			},
		})
		if (!chat)
			if (!chat) {
				res.setHeader('Content-Type', 'text/plain')
				res.write(errors.ChatNotFound)
				return
			}

		await this.openaiMessageService.deleteLastMessage(chatId)
		const messages = await this.openaiMessageService.getAllMessages(chatId)
		let resultResponse = ''
		const stream = await this.openaiService.generateResponseStream(
			{ messages },
			isPossible.nameSubscription
		)
		res.setHeader('Content-Type', 'text/plain')
		if (typeof stream === 'string') {
			res.write(stream)
			resultResponse = stream
		} else {
			for await (const chunk of stream) {
				// process.stdout.write(chunk.choices[0]?.delta?.content || '')
				res.write(chunk.choices[0]?.delta?.content || '')
				resultResponse += chunk.choices[0]?.delta?.content || ''
			}
			if (!isPossible.isUnlimited) {
				await this.subscriptionsService.decrementSubscriptionBalance(
					isPossible.subscriptionsId
				)
			}
		}
		res.end()

		const updateChatDtoAi = {
			userId: userId,
			content: resultResponse,
			role: 'assistant',
		}
		await this.updateChatStream(chatId, updateChatDtoAi)
	}

	async deleteChat(chatId: number, userId: number) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId,
			},
		})

		if (!user) throw new NotFoundException('User not found')

		const chat = await this.prisma.openAiChat.delete({
			where: {
				id: chatId,
			},
		})

		if (!chat)
			throw new InternalServerErrorException("Unable to delete chat's data")

		return chat
	}
}
