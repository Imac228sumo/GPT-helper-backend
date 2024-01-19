import {
	Body,
	Controller,
	HttpCode,
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
	@Post('generateResponseSync')
	generateResponseSync(@Body() dto: YandexDto) {
		return this.yandexService.generateResponseSync(dto)
	}

	@HttpCode(200)
	@Post('generateResponseSyncChat')
	generateResponseSyncChat() {
		return this.yandexService.generateResponseSyncChat()
	}

	// Admin section
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('createOrUpdateYandexApi')
	createOrUpdateYandexApi(@Body() dto: YandexApiDto) {
		return this.yandexService.createOrUpdateYandexApi(dto)
	}
}
