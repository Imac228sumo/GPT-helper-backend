import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateOpenaiMessageDto {
	@IsNotEmpty()
	@IsNumber()
	chatId: number
	@IsNotEmpty()
	@IsString()
	role: string
	@IsNotEmpty()
	@IsString()
	content: string
	@IsString()
	name?: string
}
