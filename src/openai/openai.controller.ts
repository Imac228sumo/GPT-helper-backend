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
import { OpenAiApiDto, OpenAiDto } from './dto/create-openai.dto'
import { OpenaiService } from './openai.service'

@Controller('openai')
export class OpenaiController {
	constructor(private readonly openaiService: OpenaiService) {}

	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	@Post('generateResponse')
	async generateResponse(@Body() dto: OpenAiDto) {
		return this.openaiService.generateResponse(dto)
	}

	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	@Post('generateResponseStream')
	async generateResponseStream(@Body() dto: OpenAiDto) {
		return this.openaiService.generateResponseStream(dto)
	}

	// Admin section
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('createOrUpdateOpenAiApiParams')
	async createOrUpdateYandexApiParams(@Body() dto: OpenAiApiDto) {
		return this.openaiService.createOrUpdateOpenAiApiParams(dto)
	}

	@Get('getOpenAiApiParams/:id')
	async getYandexApiParams(@Param('id') id: string) {
		return this.openaiService.getOpenAiApiParams(+id)
	}
}
