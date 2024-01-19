import {
	IsArray,
	IsBoolean,
	IsNumber,
	IsObject,
	IsString,
} from 'class-validator'

class messagesDto {
	@IsString()
	role: string
	@IsString()
	text: string
}

export class CompletionOptionsDto {
	@IsBoolean()
	stream: boolean
	@IsNumber()
	temperature: number
	@IsString()
	maxTokens: string
}

export class YandexDto {
	@IsArray()
	messages: messagesDto[]
}

export class YandexApiDto {
	@IsString()
	url: string
	@IsString()
	apiKey: string
	@IsString()
	modelUri: string
	@IsString()
	name: string
	@IsObject()
	completionOptions: CompletionOptionsDto
}
