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
import { IdValidationPipe } from 'src/pipes/id.validation.pipe'
import { CurrentUser } from 'src/user/decorators/user.decorator'
import { SendMessageDto } from './dto/update-chat.dto'
import { YandexChatService } from './yandex-chat.service'

@Controller('yandex-chats')
export class YandexChatController {
	constructor(private readonly yandexChatService: YandexChatService) {}

	@Auth()
	@Get('create-chat')
	async createChat(@CurrentUser('id') userId: number) {
		return this.yandexChatService.createChat(userId)
	}

	@Auth()
	@Get(':chatId')
	async getChat(
		@Param('chatId', IdValidationPipe) chatId: string,
		@CurrentUser('id') userId: number
	) {
		return this.yandexChatService.getChat(+chatId, userId)
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
		return this.yandexChatService.sendMessage(+chatId, userId, dto)
	}

	@Auth()
	@HttpCode(200)
	@Delete('delete-chat/:chatId')
	async deleteChat(
		@Param('chatId', IdValidationPipe) chatId: string,
		@CurrentUser('id') userId: number
	) {
		return this.yandexChatService.deleteChat(+chatId, userId)
	}
}
