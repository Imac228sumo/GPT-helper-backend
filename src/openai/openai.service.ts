import {
	BadGatewayException,
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { HttpsProxyAgent } from 'https-proxy-agent'
import OpenAI from 'openai'
import { ModelType } from 'openai-gpt-token-counter'
import { PrismaService } from 'src/prisma.service'
import { Message, OpenAiApiDto, OpenAiDto } from './dto/create-openai.dto'
const openaiTokenCounter = require('openai-gpt-token-counter')

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

		return response
	}

	async generateResponseStream(
		dto: OpenAiDto,
		nameSubscription: string = 'none'
	) {
		//free/standard/unique/unlimited
		if (nameSubscription === 'none') {
			throw new BadGatewayException('Subscription ended')
		}
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
		// console.log(messagesTMP)

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

//https://nBM1a2:TLx66Y@185.88.98.71:8000 - proxy
// 	try {
// 		const response = await httpsProxyAgent.post(
// 			'https://api.openai.com/v1/chat/completions',
// 			data,
// 			{ headers }
// 		)
// 		//console.log('response:', response.data)
// 		return response.data
// 	} catch (error) {
// 		//console.error('error while making axios POST request with proxy', error)
// 		throw error
// 	}
