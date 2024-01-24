import {
	Body,
	Controller,
	Get,
	HttpCode,
	Param,
	Post,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { YandexApiDto, YandexDto } from './dto/create-yandex.dto'
import { YandexService } from './yandex.service'

@Controller('yandex')
export class YandexController {
	constructor(private readonly yandexService: YandexService) {}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('generateResponse')
	async generateResponse(@Body() dto: YandexDto) {
		return this.yandexService.generateResponse(dto)
	}

	// Admin section
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('createOrUpdateYandexApiParams')
	async createOrUpdateYandexApiParams(@Body() dto: YandexApiDto) {
		return this.yandexService.createOrUpdateYandexApiParams(dto)
	}

	@Get('getYandexApiParams/:id')
	async getYandexApiParams(@Param('id') id: string) {
		return this.yandexService.getYandexApiParams(+id)
	}
}
