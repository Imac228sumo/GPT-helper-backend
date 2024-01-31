import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	Res,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { Response } from 'express'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/user/decorators/user.decorator'
import { SendMessageDto } from 'src/yandex-chat/dto/update-chat.dto'
import { SetNameDto } from './dto/update-chat.dto'
import { OpenaiChatService } from './openai-chat.service'

@Controller('openai-chats')
export class OpenaiChatController {
	constructor(private readonly openaiChatService: OpenaiChatService) {}

	// Unauthorized section
	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	@Post('send-message-stream-unauthorized')
	async sendMessageStreamUnauthorized(
		@Body() dto: SendMessageDto,
		@Res() res: Response
	) {
		await this.openaiChatService.sendMessageStreamUnauthorized(dto, res)
	}

	// Authorized section
	@Auth()
	@Get('create-chat')
	async createChatOpenAi(@CurrentUser('id') userId: number) {
		return this.openaiChatService.createChat(userId)
	}

	@Auth()
	@Get(':chatId')
	async getChat(
		@Param('chatId') chatId: string,
		@CurrentUser('id') userId: number
	) {
		return this.openaiChatService.getChat(+chatId, userId)
	}

	@Auth()
	@Get()
	async getAllChats(@CurrentUser('id') userId: number) {
		return this.openaiChatService.getAllChats(userId)
	}

	@Auth()
	@Get('get-last-message/:chatId')
	async getLastMessage(
		@Param('chatId') chatId: string,
		@CurrentUser('id') userId: number
	) {
		return this.openaiChatService.getLastMessage(+chatId, userId)
	}

	@Auth()
	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	@Post('set-name')
	async setName(@Body() dto: SetNameDto, @CurrentUser('id') userId: number) {
		await this.openaiChatService.setName(userId, dto)
	}

	@Auth()
	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	@Put('send-message/:chatId')
	async sendMessage(
		@Param('chatId') chatId: string,
		@CurrentUser('id') userId: number,
		@Body() dto: SendMessageDto
	) {
		return this.openaiChatService.sendMessage(+chatId, userId, dto)
	}

	@Auth()
	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	@Put('send-message-stream/:chatId')
	async sendMessageStream(
		@Param('chatId') chatId: string,
		@CurrentUser('id') userId: number,
		@Body() dto: SendMessageDto,
		@Res() res: Response
	) {
		return this.openaiChatService.sendMessageStream(+chatId, userId, dto, res)
	}

	@Auth()
	@HttpCode(200)
	@Delete('delete-chat/:chatId')
	async deleteChat(
		@Param('chatId') chatId: string,
		@CurrentUser('id') userId: number
	) {
		return this.openaiChatService.deleteChat(+chatId, userId)
	}
}
