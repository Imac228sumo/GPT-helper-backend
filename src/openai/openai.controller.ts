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
import { Auth } from 'src/auth/decorators/auth.decorator'
import { OpenAiApiDto, OpenAiDto } from './dto/create-openai.dto'
import { OpenaiService } from './openai.service'

@Controller('openai')
export class OpenaiController {
	constructor(private readonly openaiService: OpenaiService) {}

	@Auth()
	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	@Post('generateResponse')
	async generateResponse(@Body() dto: OpenAiDto) {
		return this.openaiService.generateResponse(dto)
	}

	@Auth()
	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	@Post('generateResponseStream')
	async generateResponseStream(@Body() dto: OpenAiDto) {
		return this.openaiService.generateResponseStream(dto)
	}

	// Admin section
	@Auth('admin')
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('createOrUpdateOpenAiApiParams')
	async createOrUpdateOpenAiApiParams(@Body() dto: OpenAiApiDto) {
		return this.openaiService.createOrUpdateOpenAiApiParams(dto)
	}

	@Auth('admin')
	@Get('getOpenAiApiParams/:id')
	async getOpenAiApiParams(@Param('id') id: string) {
		return this.openaiService.getOpenAiApiParams(+id)
	}

	@Auth('admin')
	@Get('getAllOpenAiApiParams')
	async getAllOpenAiApiParams() {
		return this.openaiService.getAllOpenAiApiParams()
	}
}
