import { IsArray, IsNumber, IsObject, IsString } from 'class-validator'

class Message {
	@IsString()
	role: string
	@IsString()
	content: string
}

class Choices {
	index: number
	@IsObject()
	message: Message
	@IsString()
	logprobs: string
	@IsString()
	finish_reason: string
}

class Usage {
	@IsNumber()
	prompt_tokens: number
	@IsNumber()
	completion_tokens: number
	@IsNumber()
	total_tokens: number
}

export class ResponseOpenAiDto {
	@IsString()
	id: string
	@IsString()
	object: string
	@IsNumber()
	created: number
	@IsString()
	model: string
	@IsArray()
	choices: Choices[]
	@IsObject()
	usage: Usage
	@IsString()
	system_fingerprint: string
}
