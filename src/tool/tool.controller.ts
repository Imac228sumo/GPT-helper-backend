import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	Query,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { IdValidationPipe } from 'src/pipes/id.validation.pipe'
import { CurrentUser } from 'src/user/decorators/user.decorator'
import { UpdateToolDto } from './dto/update-tool.dto'
import { ToolService } from './tool.service'

@Controller('tool')
export class ToolController {
	constructor(private readonly toolService: ToolService) {}

	@Auth('USER')
	@Get()
	async getAllTools(@Query('searchTerm') searchTerm?: string) {
		return this.toolService.getAllTools(searchTerm)
	}

	@Auth('USER')
	@Get('/tools')
	async getTools(@CurrentUser('id') userId: number) {
		return this.toolService.getTools(userId)
	}

	@Auth('USER')
	@Get('/used')
	async getAllUsedTools(@CurrentUser('id') userId: number) {
		return this.toolService.getAllUsedTools(userId)
	}

	@Auth('USER')
	@Get('/available')
	async getAllAvailableTools() {
		return this.toolService.getAllAvailableTools()
	}

	@Auth('USER')
	@Get('/unavailable')
	async getAllUnavailableTools() {
		return this.toolService.getAllUnavailableTools()
	}

	@Auth('ADMIN')
	@Get(':id')
	async getToolById(@Param('id', IdValidationPipe) id: string) {
		return this.toolService.getToolById(+id)
	}

	@Auth('ADMIN')
	@HttpCode(200)
	@Post()
	@UsePipes(new ValidationPipe())
	async addNewTool() {
		return this.toolService.addNewTool()
	}

	@Auth('ADMIN')
	@HttpCode(200)
	@Put(':id')
	@UsePipes(new ValidationPipe())
	async updateTool(
		@Param('id', IdValidationPipe) id: string,
		@Body() dto: UpdateToolDto
	) {
		return this.toolService.updateTool(+id, dto)
	}

	@Auth('ADMIN')
	@HttpCode(200)
	@Delete(':id')
	@UsePipes(new ValidationPipe())
	async deleteTool(@Param('id', IdValidationPipe) id: string) {
		return this.toolService.deleteTool(+id)
	}
}
