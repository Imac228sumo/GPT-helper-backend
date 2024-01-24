import { IntersectionType, OmitType } from '@nestjs/mapped-types'
import { IsNotEmpty, IsString } from 'class-validator'
import { CreateYandexMessageDto } from 'src/yandex-message/dto/create-yandex-message.dto'
import { CreateChatDto } from './create-chat.dto'

export class UpdateChatDto extends IntersectionType(
	CreateChatDto,
	OmitType(CreateYandexMessageDto, ['chatId'] as const)
) {}

export class SendMessageDto {
	@IsNotEmpty()
	@IsString()
	message: string
}
