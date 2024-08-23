import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class UpdateChatDto {
	@IsNumber()
	userId: number
	@IsNotEmpty()
	@IsString()
	role: string
	@IsNotEmpty()
	@IsString()
	content: string
	@IsString()
	name?: string
}

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
