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
		const { url, apiKey, modelUri, completionOptions } =
			await this.prisma.yandexAPI.findUnique({
				where: { name: 'generateResponseSync' },
				include: {
					completionOptions: true,
				},
			})

		const headers = {
			'Content-Type': 'application/json',
			Authorization: apiKey,
		}

		const modifiedDto = {
			...dto,
			modelUri: modelUri,
			completionOptions: {
				stream: completionOptions.stream,
				temperature: completionOptions.temperature,
				maxTokens: completionOptions.maxTokens,
			},
		}

		const { data } = await firstValueFrom(
			this.httpService.post<any>(url, modifiedDto, { headers }).pipe(
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
			Authorization: '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',
		}

		const modifiedDto = {
			model: 'gpt-3.5-turbo',
			messages: [
				{
					role: 'system',
					content:
						'You are a poetic assistant, skilled in explaining complex programming concepts with creative flair.',
				},
				{
					role: 'user',
					content:
						'Compose a poem that explains the concept of recursion in programming.',
				},
			],
		}

		const { data } = await firstValueFrom(
			this.httpService.post<any>(url, modifiedDto, { headers }).pipe(
				catchError((error: AxiosError) => {
					throw new BadGatewayException('Problems with OpenAI API', error)
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
