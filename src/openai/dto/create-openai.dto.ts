import {
	IsArray,
	IsBoolean,
	IsNumber,
	IsObject,
	IsString,
} from 'class-validator'
import { ChatCompletionMessageParam } from 'openai/resources'

class CompletionOptionsOpenAiDto {
	@IsBoolean()
	stream: boolean
	@IsNumber()
	temperature: number
	@IsNumber()
	maxTokens: number
}

export class OpenAiApiDto {
	@IsString()
	httpProxyUrl: string
	@IsString()
	apiKey: string
	@IsString()
	model: string
	@IsString()
	name: string
	@IsObject()
	completionOptionsOpenAi: CompletionOptionsOpenAiDto
}

export class OpenAiDto {
	@IsArray()
	messages: ChatCompletionMessageParam[]
}
