import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Put,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/user/decorators/user.decorator'
import { ChatService } from './chat.service'
import { SendMessageDto } from './dto/update-chat.dto'

@Controller('chats')
export class ChatController {
	constructor(private readonly chatService: ChatService) {}

	@Auth()
	@Get('create-chat')
	async createChat(@CurrentUser('id') userId: number) {
		return this.chatService.createChat(userId)
	}

	@Auth()
	@Get(':chatId')
	async getChat(
		@Param('chatId') chatId: string,
		@CurrentUser('id') userId: number
	) {
		return this.chatService.getChat(+chatId, userId)
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
		return this.chatService.sendMessage(+chatId, userId, dto)
	}

	@Auth()
	@HttpCode(200)
	@Delete('delete-chat/:chatId')
	async deleteChat(
		@Param('chatId') chatId: string,
		@CurrentUser('id') userId: number
	) {
		return this.chatService.deleteChat(+chatId, userId)
	}
}
