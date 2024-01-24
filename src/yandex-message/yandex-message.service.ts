import {
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CreateYandexMessageDto } from './dto/create-yandex-message.dto'

@Injectable()
export class YandexMessageService {
	constructor(private prisma: PrismaService) {}

	async createMessage(dto: CreateYandexMessageDto) {
		const message = await this.prisma.yandexMessage.create({
			data: {
				chat: {
					connect: {
						id: dto.chatId,
					},
				},
				role: dto.role,
				text: dto.text,
			},
		})
		if (!message)
			throw new InternalServerErrorException('failed to create a message')
		return message
	}

	async findAllMessages(chatId: number, userId: number) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId,
			},
		})
		if (!user) throw new NotFoundException('User not found')

		const messages = await this.prisma.yandexMessage.findMany({
			where: {
				chatId: chatId,
			},
			orderBy: {
				createdAt: 'asc',
			},
			select: {
				role: true,
				text: true,
			},
		})
		if (!messages) throw new NotFoundException('messages not found')

		return messages
	}

	async deleteAllMessages(chatId: number, userId: number) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId,
			},
		})
		if (!user) throw new NotFoundException('User not found')

		const messages = await this.prisma.yandexMessage.deleteMany({
			where: {
				chatId: chatId,
			},
		})
		if (!messages) throw new NotFoundException('messages not found')

		return messages
	}
}
