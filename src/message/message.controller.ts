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
import { CreateMessageDto } from './dto/create-message.dto'
import { MessageService } from './message.service'

@Controller('messages')
export class MessageController {
	constructor(private readonly messageService: MessageService) {}

	@Post('create-message')
	@Auth()
	@HttpCode(200)
	async createMessage(@Body() dto: CreateMessageDto) {
		return this.messageService.createMessage(dto)
	}

	@Get(':chatId')
	@Auth()
	async findAllMessages(
		@Param('chatId') chatId: string,
		@CurrentUser('id') userId: number
	) {
		return this.messageService.findAllMessages(+chatId, userId)
	}

	@Delete(':chatId')
	@Auth()
	@HttpCode(200)
	async deleteAllMessages(
		@Param('chatId') chatId: string,
		@CurrentUser('id') userId: number
	) {
		return this.messageService.deleteAllMessages(+chatId, userId)
	}
}
