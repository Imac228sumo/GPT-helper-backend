import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/user/decorators/user.decorator'
import { CreateYandexMessageDto } from './dto/create-yandex-message.dto'
import { YandexMessageService } from './yandex-message.service'

@Controller('yandex-message')
export class YandexMessageController {
	constructor(private readonly yandexMessageService: YandexMessageService) {}

	@Post('create-message')
	@Auth()
	@HttpCode(200)
	async createMessage(@Body() dto: CreateYandexMessageDto) {
		return this.yandexMessageService.createMessage(dto)
	}

	@Get(':chatId')
	@Auth()
	async findAllMessages(
		@Param('chatId') chatId: string,
		@CurrentUser('id') userId: number
	) {
		return this.yandexMessageService.findAllMessages(+chatId, userId)
	}

	@Delete(':chatId')
	@Auth()
	@HttpCode(200)
	async deleteAllMessages(
		@Param('chatId') chatId: string,
		@CurrentUser('id') userId: number
	) {
		return this.yandexMessageService.deleteAllMessages(+chatId, userId)
	}
}
