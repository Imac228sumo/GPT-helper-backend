import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateMessageDto {
	@IsNotEmpty()
	@IsNumber()
	chatId: number
	@IsNotEmpty()
	@IsString()
	role: string
	@IsNotEmpty()
	@IsString()
	text: string
}
