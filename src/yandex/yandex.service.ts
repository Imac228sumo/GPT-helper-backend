import { HttpService } from '@nestjs/axios'
import {
	BadGatewayException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
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

	async generateResponse(dto: YandexDto) {
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

	// Admin section

	async getYandexApiParams(id: number) {
		const yandexApi = await this.prisma.yandexAPI.findUnique({
			where: {
				id: id,
			},
			include: {
				completionOptions: true,
			},
		})

		if (!yandexApi) throw new NotFoundException('Yandex API  params not found')

		return yandexApi
	}

	async createOrUpdateYandexApiParams(dto: YandexApiDto) {
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
