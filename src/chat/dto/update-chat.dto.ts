import { IntersectionType, OmitType } from '@nestjs/mapped-types'
import { IsNotEmpty, IsString } from 'class-validator'
import { CreateMessageDto } from 'src/message/dto/create-message.dto'
import { CreateChatDto } from './create-chat.dto'

export class UpdateChatDto extends IntersectionType(
	CreateChatDto,
	OmitType(CreateMessageDto, ['chatId'] as const)
) {}

export class SendMessageDto {
	@IsNotEmpty()
	@IsString()
	message: string
}
