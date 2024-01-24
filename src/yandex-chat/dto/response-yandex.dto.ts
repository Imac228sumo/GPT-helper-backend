import { IsArray, IsObject, IsString } from 'class-validator'

export class ResponseYandexDto {
	@IsObject()
	result: ResultYandexDto
}

class ResultYandexDto {
	@IsArray()
	alternatives: AlternativeYandexDto[]
	@IsObject()
	usage: UsageYandexDto
	@IsString()
	modelVersion: string
}

class AlternativeYandexDto {
	@IsObject()
	message: MessageYandexDto
	@IsString()
	status: string
}

class MessageYandexDto {
	@IsString()
	role: string
	@IsString()
	text: string
}

class UsageYandexDto {
	@IsString()
	inputTextTokens: string
	@IsString()
	completionTokens: string
	@IsString()
	totalTokens: string
}
