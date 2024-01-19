import { HttpService } from '@nestjs/axios'
import { BadGatewayException, Injectable } from '@nestjs/common'
import { AxiosError } from 'axios'
import { catchError, firstValueFrom } from 'rxjs'
import { PrismaService } from 'src/prisma.service'
import { YandexApiDto, YandexDto } from './dto/create-yandex.dto'

@Injectable()
export class YandexService {
	constructor(
		private readonly httpService: HttpService,
		private prisma: PrismaService
	) {}

	async generateResponseSync(dto: YandexDto) {
		const yandexApiParams = await this.prisma.yandexAPI.findUnique({
			where: { name: 'generateResponseSync' },
			include: {
				completionOptions: true,
			},
		})

		if (!yandexApiParams)
			throw new BadGatewayException('Problems with Yandex API')

		const headers = {
			'Content-Type': 'application/json',
			Authorization: yandexApiParams.apiKey,
		}

		const modifiedDto = {
			...dto,
			modelUri: yandexApiParams.modelUri,
			completionOptions: {
				stream: yandexApiParams.completionOptions.stream,
				temperature: yandexApiParams.completionOptions.temperature,
				maxTokens: yandexApiParams.completionOptions.maxTokens,
			},
		}

		const { data } = await firstValueFrom(
			this.httpService
				.post<any>(yandexApiParams.url, modifiedDto, { headers })
				.pipe(
					catchError((error: AxiosError) => {
						throw new BadGatewayException('Problems with Yandex API', error)
					})
				)
		)

		return data
	}

	async generateResponseSyncChat() {
		const url = 'https://api.openai.com/v1/chat/completions'

		const headers = {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${process.env.API_KEY_CHATGPT}`,
		}

		const modifiedDto = {
			model: 'gpt-3.5-turbo',
			messages: [
				{
					role: 'user',
					content: 'Say this is a test!',
				},
				{
					role: 'assistant',
					content: 'This is a test!',
				},
				{
					role: 'user',
					content: 'Hello! How are you?',
				},
			],
			temperature: 0.7,
		}

		const { data } = await firstValueFrom(
			this.httpService.post<any>(url, modifiedDto, { headers }).pipe(
				catchError((error: AxiosError) => {
					throw new BadGatewayException(error)
				})
			)
		)

		return data
	}

	// Admin section

	async createOrUpdateYandexApi(dto: YandexApiDto) {
		const yandexApi = await this.prisma.yandexAPI.upsert({
			where: { name: dto.name },
			update: {
				url: dto.url,
				apiKey: dto.apiKey,
				modelUri: dto.modelUri,
				completionOptions: {
					update: {
						stream: dto.completionOptions.stream,
						temperature: dto.completionOptions.temperature,
						maxTokens: dto.completionOptions.maxTokens,
					},
				},
			},
			create: {
				url: dto.url,
				apiKey: dto.apiKey,
				modelUri: dto.modelUri,
				name: dto.name,
				completionOptions: {
					create: {
						stream: dto.completionOptions.stream,
						temperature: dto.completionOptions.temperature,
						maxTokens: dto.completionOptions.maxTokens,
					},
				},
			},
			include: {
				completionOptions: true,
			},
		})

		return yandexApi
	}
}
