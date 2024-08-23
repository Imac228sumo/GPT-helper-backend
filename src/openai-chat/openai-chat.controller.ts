import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	Query,
	Res,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { Response } from 'express'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { IOpenAiMessagesQuery } from 'src/openai-message/types'
import { IdValidationPipe } from 'src/pipes/id.validation.pipe'
import { CurrentUser } from 'src/user/decorators/user.decorator'
import { CreateChatDto } from './dto/create-chat.dto'
import { SendMessageDto, SetNameDto } from './dto/update-chat.dto'
import { OpenaiChatService } from './openai-chat.service'
import { IOpenAiChatsQuery } from './types'

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
	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	@Post('create-chat')
	async createChatOpenAi(
		@CurrentUser('id') userId: number,
		@Body() name: CreateChatDto
	) {
		return this.openaiChatService.createChat(userId, name)
	}

	@Auth()
	@Get(':chatId')
	async getChat(
		@Param('chatId', IdValidationPipe) chatId: string,
		@CurrentUser('id') userId: number
	) {
		return this.openaiChatService.getChat(+chatId, userId)
	}

	@Auth()
	@Get()
	async getAllChats(
		@CurrentUser('id') userId: number,
		@Query() query: IOpenAiChatsQuery
	) {
		return this.openaiChatService.getAllChats(userId, query)
	}

	@Auth()
	@Get('messages/:chatId')
	async getAllMessages(
		@CurrentUser('id') userId: number,
		@Param('chatId', IdValidationPipe) chatId: string,
		@Query() query: IOpenAiMessagesQuery
	) {
		return this.openaiChatService.getAllMessages(userId, +chatId, query)
	}

	@Auth()
	@Get('get-last-message/:chatId')
	async getLastMessage(
		@Param('chatId', IdValidationPipe) chatId: string,
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
		@Param('chatId', IdValidationPipe) chatId: string,
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
		@CurrentUser('id') userId: number,
		@Body() dto: SendMessageDto,
		@Res() res: Response,
		@Param('chatId', IdValidationPipe) chatId: string
	) {
		return this.openaiChatService.sendMessageStream(+chatId, userId, dto, res)
	}

	@Auth()
	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	@Put('regenerate-message-stream/:chatId')
	async regenerateMessageStream(
		@CurrentUser('id') userId: number,
		@Body() dto: SendMessageDto,
		@Res() res: Response,
		@Param('chatId', IdValidationPipe) chatId: string
	) {
		return this.openaiChatService.regenerateMessageStream(
			+chatId,
			userId,
			dto,
			res
		)
	}

	@Auth()
	@HttpCode(200)
	@Delete('delete-chat/:chatId')
	async deleteChat(
		@Param('chatId', IdValidationPipe) chatId: string,
		@CurrentUser('id') userId: number
	) {
		return this.openaiChatService.deleteChat(+chatId, userId)
	}
}
