import {
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common'
import { ChatCompletionMessageParam } from 'openai/resources'
import { PrismaService } from 'src/prisma.service'
import { CreateOpenaiMessageDto } from './dto/create-openai-message.dto'

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
		if (!message)
			throw new InternalServerErrorException('failed to create a message')
		return message
	}

	async findAllMessages(
		chatId: number,
		userId: number
	): Promise<ChatCompletionMessageParam[]> {
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId,
			},
		})
		if (!user) throw new NotFoundException('User not found')

		const messages = await this.prisma.openAiMessage.findMany({
			where: {
				chatId: chatId,
			},
			orderBy: {
				createdAt: 'asc',
			},
			select: {
				role: true,
				content: true,
			},
		})
		if (!messages) throw new NotFoundException('messages not found')

		return messages as ChatCompletionMessageParam[]
	}

	async findLastMessage(
		chatId: number,
		userId: number
	): Promise<ChatCompletionMessageParam> {
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId,
			},
		})
		if (!user) throw new NotFoundException('User not found')

		const message = await this.prisma.openAiMessage.findFirst({
			where: {
				chatId: chatId,
			},
			orderBy: {
				createdAt: 'desc',
			},
			select: {
				role: true,
				content: true,
			},
		})
		if (!message) throw new NotFoundException('Message not found')

		return message as ChatCompletionMessageParam
	}

	async deleteAllMessages(chatId: number, userId: number) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId,
			},
		})
		if (!user) throw new NotFoundException('User not found')

		const messages = await this.prisma.openAiMessage.deleteMany({
			where: {
				chatId: chatId,
			},
		})
		if (!messages) throw new NotFoundException('messages not found')

		return messages
	}
}
