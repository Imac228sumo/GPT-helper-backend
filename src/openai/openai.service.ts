import {
	BadGatewayException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { HttpsProxyAgent } from 'https-proxy-agent'
import OpenAI from 'openai'
import { PrismaService } from 'src/prisma.service'
import { OpenAiApiDto, OpenAiDto } from './dto/create-openai.dto'

@Injectable()
export class OpenaiService {
	constructor(private prisma: PrismaService) {}

	async generateResponse(dto: OpenAiDto) {
		const openAiApiParams = await this.prisma.openAiAPI.findUnique({
			where: { name: 'gpt-3.5-turbo' },
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
			stream: openAiApiParams.completionOptionsOpenAi.stream,
			messages: dto.messages,
			temperature: openAiApiParams.completionOptionsOpenAi.temperature,
			max_tokens: openAiApiParams.completionOptionsOpenAi.maxTokens,
		})

		return response
	}

	async generateResponseStream(dto: OpenAiDto) {
		const openAiApiParams = await this.prisma.openAiAPI.findUnique({
			where: { name: 'gpt-3.5-turbo' },
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
				max_tokens: openAiApiParams.completionOptionsOpenAi.maxTokens,
			})
			return stream
		} catch (error) {
			throw new BadGatewayException('Problems with OpenAi API', error)
		}

		//res.setHeader('Content-Type', 'text/plain')
		//for await (const chunk of stream) {
		// process.stdout.write(chunk.choices[0]?.delta?.content || '')
		//res.write(chunk.choices[0]?.delta?.content || '')
		//}
		//res.end()
		// return stream
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
						maxTokens: dto.completionOptionsOpenAi.maxTokens,
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
						maxTokens: dto.completionOptionsOpenAi.maxTokens,
					},
				},
			},
			include: {
				completionOptionsOpenAi: true,
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
