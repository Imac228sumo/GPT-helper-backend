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
import { IdValidationPipe } from 'src/pipes/id.validation.pipe'
import { CurrentUser } from 'src/user/decorators/user.decorator'
import { CreateOpenaiMessageDto } from './dto/create-openai-message.dto'
import { OpenaiMessageService } from './openai-message.service'

@Controller('openai-messages')
export class OpenaiMessageController {
	constructor(private readonly openaiMessageService: OpenaiMessageService) {}

	@Post('create-message')
	@Auth()
	@HttpCode(200)
	async createMessage(@Body() dto: CreateOpenaiMessageDto) {
		return this.openaiMessageService.createMessage(dto)
	}

	@Get(':chatId')
	@Auth()
	async findAllMessages(
		@Param('chatId', IdValidationPipe) chatId: string,
		@CurrentUser('id') userId: number
	) {
		return this.openaiMessageService.findAllMessages(+chatId, userId)
	}

	@Get('get-last-message/:chatId')
	@Auth()
	async findLastMessage(
		@Param('chatId', IdValidationPipe) chatId: string,
		@CurrentUser('id') userId: number
	) {
		return this.openaiMessageService.findLastMessage(+chatId, userId)
	}

	@Delete(':chatId')
	@Auth()
	@HttpCode(200)
	async deleteAllMessages(
		@Param('chatId', IdValidationPipe) chatId: string,
		@CurrentUser('id') userId: number
	) {
		return this.openaiMessageService.deleteAllMessages(+chatId, userId)
	}
}
