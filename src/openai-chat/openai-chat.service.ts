import {
	ForbiddenException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common'
import { Response } from 'express'
import { ChatCompletion } from 'openai/resources'
import { OpenaiMessageService } from 'src/openai-message/openai-message.service'
import { OpenaiService } from 'src/openai/openai.service'
import { PrismaService } from 'src/prisma.service'
import { SendMessageDto, UpdateChatDto } from './dto/update-chat.dto'

@Injectable()
export class OpenaiChatService {
	constructor(
		private prisma: PrismaService,
		private openaiService: OpenaiService,
		private openaiMessageService: OpenaiMessageService
	) {}

	async createChat(userId: number) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId,
			},
		})
		if (!user) throw new NotFoundException('User not found')

		const countChat = await this.prisma.openAiChat.findMany({
			where: {
				userId: userId,
			},
		})

		if (countChat.length > 5)
			throw new ForbiddenException('The chat limit has been exceeded')

		const chat = await this.prisma.openAiChat.create({
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
			content: 'Ты ассистент',
		}

		await this.openaiMessageService.createMessage(modifiedDto)

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

	async getLastMessage(chatId: number, userId: number) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId,
			},
		})
		if (!user) throw new NotFoundException('User not found')

		const message = this.openaiMessageService.findLastMessage(chatId, userId)

		if (!message) throw new NotFoundException('Message not found')

		return message
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
			content: dto.content,
		}

		await this.openaiMessageService.createMessage(modifiedDto)

		const chat = await this.prisma.openAiChat.findUnique({
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

	async updateChatStream(id: number, dto: UpdateChatDto) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: dto.userId,
			},
		})

		if (!user) throw new NotFoundException('User not found')

		const modifiedDto = {
			chatId: id,
			role: dto.role,
			content: dto.content,
		}

		await this.openaiMessageService.createMessage(modifiedDto)
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

		const messages = await this.openaiMessageService.findAllMessages(
			chatId,
			userId
		)

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

		const messages = await this.openaiMessageService.findAllMessages(
			chatId,
			userId
		)

		let resultResponse = ''
		const stream = await this.openaiService.generateResponseStream({ messages })
		res.setHeader('Content-Type', 'text/plain')

		for await (const chunk of stream) {
			//process.stdout.write(chunk.choices[0]?.delta?.content || '')
			res.write(chunk.choices[0]?.delta?.content || '')
			resultResponse += chunk.choices[0]?.delta?.content || ''
		}
		res.end()

		// console.log(resultResponse)
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

		await this.openaiMessageService.deleteAllMessages(chatId, userId)

		const chat = await this.prisma.openAiChat.delete({
			where: {
				id: chatId,
			},
		})

		return chat
	}
}
