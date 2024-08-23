import {
	BadGatewayException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common'
import { HttpsProxyAgent } from 'https-proxy-agent'
import OpenAI from 'openai'
import { ModelType } from 'openai-gpt-token-counter'
import { Stream } from 'openai/streaming'
import { PrismaService } from 'src/prisma.service'
import { errors } from 'src/utils/errors'
import { Message, OpenAiApiDto, OpenAiDto } from './dto/create-openai.dto'
const openaiTokenCounter = require('openai-gpt-token-counter') // eslint-disable-line
@Injectable()
export class OpenaiService {
	constructor(private prisma: PrismaService) {}

	async generateResponse(dto: OpenAiDto) {
		const openAiApiParams = await this.prisma.openAiAPI.findUnique({
			where: { name: 'free' },
			include: {
				completionOptionsOpenAi: true,
			},
		})

		if (!openAiApiParams)
			throw new BadGatewayException('Problems with OpenAi API')

		const httpProxyUrl = openAiApiParams.httpProxyUrl

		const openai = new OpenAI({
			apiKey: openAiApiParams.apiKey,
			httpAgent: new HttpsProxyAgent(httpProxyUrl),
		})

		const response = await openai.chat.completions.create({
			model: openAiApiParams.model,
			stream: false,
			messages: dto.messages,
			temperature: openAiApiParams.completionOptionsOpenAi.temperature,
			max_tokens: openAiApiParams.completionOptionsOpenAi.maxTokensOutput,
		})

		if (!response)
			throw new InternalServerErrorException("Unable to create response's data")

		return response
	}

	async generateResponseStream(
		dto: OpenAiDto,
		nameSubscription: string = 'none'
	): Promise<string | Stream<OpenAI.Chat.Completions.ChatCompletionChunk>> {
		const errorResponse = errors.ProblemsWithOpenAiAPI
		const openAiApiParams = await this.prisma.openAiAPI.findUnique({
			where: { name: nameSubscription },
			include: {
				completionOptionsOpenAi: true,
			},
		})

		if (!openAiApiParams) return errorResponse

		const httpProxyUrl = openAiApiParams.httpProxyUrl

		const openai = new OpenAI({
			apiKey: openAiApiParams.apiKey,
			httpAgent: new HttpsProxyAgent(httpProxyUrl),
		})

		if (!openai) return errorResponse

		const messagesTMP = [dto.messages.slice(-1)[0]] as Message[]
		const tokenCount = openaiTokenCounter.chat(
			messagesTMP,
			openAiApiParams.model as ModelType
		)

		if (tokenCount > openAiApiParams.completionOptionsOpenAi.maxTokensInput) {
			const error = `!!!***123-Too many tokens: ${tokenCount}. The maximum number of tokens is ${openAiApiParams.completionOptionsOpenAi.maxTokensInput}-321***!!!`
			return error
		}

		try {
			const stream = await openai.chat.completions.create({
				model: openAiApiParams.model,
				stream: true,
				messages: dto.messages,
				temperature: openAiApiParams.completionOptionsOpenAi.temperature,
				max_tokens: openAiApiParams.completionOptionsOpenAi.maxTokensOutput,
			})
			return stream
		} catch (error) {
			console.log(error)
			return errorResponse
		}
	}

	async generateResponseStreamUnauthorized(dto: OpenAiDto) {
		const openAiApiParams = await this.prisma.openAiAPI.findUnique({
			where: { name: 'free' },
			include: {
				completionOptionsOpenAi: true,
			},
		})

		if (!openAiApiParams)
			throw new BadGatewayException('Problems with OpenAi API')

		const httpProxyUrl = openAiApiParams.httpProxyUrl

		const openai = new OpenAI({
			apiKey: openAiApiParams.apiKey,
			httpAgent: new HttpsProxyAgent(httpProxyUrl),
		})
		if (!openai) throw new BadGatewayException('Problems with OpenAi API')

		try {
			const stream = await openai.chat.completions.create({
				model: openAiApiParams.model,
				stream: true,
				messages: dto.messages,
				temperature: openAiApiParams.completionOptionsOpenAi.temperature,
				max_tokens: openAiApiParams.completionOptionsOpenAi.maxTokensOutput,
			})
			return stream
		} catch (error) {
			throw new BadGatewayException('Problems with OpenAi API', error)
		}
	}

	async getOpenAiApiParams(id: number) {
		const openAiApi = await this.prisma.openAiAPI.findUnique({
			where: {
				id: id,
			},
			include: {
				completionOptionsOpenAi: true,
			},
		})
		if (!openAiApi) throw new NotFoundException('OpenAi API  params not found')
		return openAiApi
	}

	async createOrUpdateOpenAiApiParams(dto: OpenAiApiDto) {
		const openAiApi = await this.prisma.openAiAPI.upsert({
			where: { name: dto.name },
			update: {
				httpProxyUrl: dto.httpProxyUrl,
				apiKey: dto.apiKey,
				model: dto.model,
				completionOptionsOpenAi: {
					update: {
						stream: dto.completionOptionsOpenAi.stream,
						temperature: dto.completionOptionsOpenAi.temperature,
						maxTokensInput: dto.completionOptionsOpenAi.maxTokensInput,
						maxTokensOutput: dto.completionOptionsOpenAi.maxTokensOutput,
					},
				},
			},
			create: {
				httpProxyUrl: dto.httpProxyUrl,
				apiKey: dto.apiKey,
				model: dto.model,
				name: dto.name,
				completionOptionsOpenAi: {
					create: {
						stream: dto.completionOptionsOpenAi.stream,
						temperature: dto.completionOptionsOpenAi.temperature,
						maxTokensInput: dto.completionOptionsOpenAi.maxTokensInput,
						maxTokensOutput: dto.completionOptionsOpenAi.maxTokensOutput,
					},
				},
			},
			include: {
				completionOptionsOpenAi: true,
			},
		})

		if (!openAiApi) {
			throw new InternalServerErrorException(
				"Unable to create or update openAiApi's data"
			)
		}

		return openAiApi
	}

	async getAllOpenAiApiParams() {
		const openAiApi = await this.prisma.openAiAPI.findMany({
			include: {
				completionOptionsOpenAi: true,
			},
			orderBy: {
				updatedAt: 'desc',
			},
		})
		return openAiApi
	}
}

/*

async generateResponseStream(
		dto: OpenAiDto,
		nameSubscription: string = 'none'
	) {
		//free/standard/unique/unlimited

		const openAiApiParams = await this.prisma.openAiAPI.findUnique({
			where: { name: nameSubscription },
			include: {
				completionOptionsOpenAi: true,
			},
		})

		if (!openAiApiParams)
			throw new BadGatewayException('Problems with OpenAi API')

		const httpProxyUrl = openAiApiParams.httpProxyUrl

		const openai = new OpenAI({
			apiKey: openAiApiParams.apiKey,
			httpAgent: new HttpsProxyAgent(httpProxyUrl),
		})
		if (!openai) throw new BadGatewayException('Problems with OpenAi API')

		const messagesTMP = [dto.messages.slice(-1)[0]] as Message[]
		const tokenCount = openaiTokenCounter.chat(
			messagesTMP,
			openAiApiParams.model as ModelType
		)

		if (tokenCount > openAiApiParams.completionOptionsOpenAi.maxTokensInput) {
			throw new BadRequestException(
				`Too many tokens: ${tokenCount}. The maximum number of tokens is ${openAiApiParams.completionOptionsOpenAi.maxTokensInput}`
			)
		}

		try {
			const stream = await openai.chat.completions.create({
				model: openAiApiParams.model,
				stream: true,
				messages: dto.messages,
				temperature: openAiApiParams.completionOptionsOpenAi.temperature,
				max_tokens: openAiApiParams.completionOptionsOpenAi.maxTokensOutput,
			})
			return stream
		} catch (error) {
			throw new BadGatewayException('Problems with OpenAi API', error)
		}
	}

*/
