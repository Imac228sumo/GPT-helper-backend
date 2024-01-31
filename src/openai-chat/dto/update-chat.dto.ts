import { IntersectionType, OmitType } from '@nestjs/mapped-types'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'
import { CreateOpenaiMessageDto } from 'src/openai-message/dto/create-openai-message.dto'
import { CreateChatDto } from './create-chat.dto'

export class UpdateChatDto extends IntersectionType(
	CreateChatDto,
	OmitType(CreateOpenaiMessageDto, ['chatId'] as const)
) {}

export class SendMessageDto {
	@IsNotEmpty()
	@IsString()
	message: string
}

export class SetNameDto {
	@IsNotEmpty()
	@IsString()
	name: string
	@IsNotEmpty()
	@IsNumber()
	chatId: number
}
