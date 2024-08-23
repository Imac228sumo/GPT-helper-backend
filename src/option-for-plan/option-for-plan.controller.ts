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
import { UpdateOptionForPlanDto } from './dto/update-option-for-plan.dto'
import { OptionForPlanService } from './option-for-plan.service'

@Controller('option-for-plan')
export class OptionForPlanController {
	constructor(private readonly optionForPlanService: OptionForPlanService) {}

	@Auth('ADMIN')
	@Get()
	async getAllOptionsForPlan(@Query('searchTerm') searchTerm?: string) {
		return this.optionForPlanService.getAllOptionsForPlan(searchTerm)
	}

	@Auth('ADMIN')
	@Get(':id')
	async getOptionForPlanById(@Param('id', IdValidationPipe) id: string) {
		return this.optionForPlanService.getOptionForPlanById(+id)
	}

	@Auth('ADMIN')
	@HttpCode(200)
	@Post()
	@UsePipes(new ValidationPipe())
	async addNewOptionForPlan() {
		return this.optionForPlanService.addNewOptionForPlan()
	}

	@Auth('ADMIN')
	@HttpCode(200)
	@Put(':id')
	@UsePipes(new ValidationPipe())
	async updateOptionForPlan(
		@Param('id', IdValidationPipe) id: string,
		@Body() dto: UpdateOptionForPlanDto
	) {
		return this.optionForPlanService.updateOptionForPlan(+id, dto)
	}

	@Auth('ADMIN')
	@HttpCode(200)
	@Delete(':id')
	@UsePipes(new ValidationPipe())
	async deleteOptionForPlan(@Param('id', IdValidationPipe) id: string) {
		return this.optionForPlanService.deleteOptionForPlan(+id)
	}
}
