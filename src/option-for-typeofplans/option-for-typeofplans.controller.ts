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
import { UpdateOptionForTypeOfPlanDto } from './dto/update-option-for-typeofplans.dto'
import { OptionForTypeOfPlanService } from './option-for-typeofplans.service'

@Controller('option-for-typeofplans')
export class OptionForTypeOfPlanController {
	constructor(
		private readonly optionForTypeOfPlanService: OptionForTypeOfPlanService
	) {}

	@Auth('ADMIN')
	@Get()
	async getAllOptionsForTypeOfPlan(@Query('searchTerm') searchTerm?: string) {
		return this.optionForTypeOfPlanService.getAllOptionsForTypeOfPlan(
			searchTerm
		)
	}

	@Auth('ADMIN')
	@Get(':id')
	async getOptionForTypeOfPlanById(@Param('id', IdValidationPipe) id: string) {
		return this.optionForTypeOfPlanService.getOptionForTypeOfPlanById(+id)
	}

	@Auth('ADMIN')
	@HttpCode(200)
	@Post()
	@UsePipes(new ValidationPipe())
	async addNewOptionForTypeOfPlan() {
		return this.optionForTypeOfPlanService.addNewOptionForTypeOfPlan()
	}

	@Auth('ADMIN')
	@HttpCode(200)
	@Put(':id')
	@UsePipes(new ValidationPipe())
	async updateOptionForTypeOfPlan(
		@Param('id', IdValidationPipe) id: string,
		@Body() dto: UpdateOptionForTypeOfPlanDto
	) {
		return this.optionForTypeOfPlanService.updateOptionForTypeOfPlan(+id, dto)
	}

	@Auth('ADMIN')
	@HttpCode(200)
	@Delete(':id')
	@UsePipes(new ValidationPipe())
	async deleteOptionForTypeOfPlan(@Param('id', IdValidationPipe) id: string) {
		return this.optionForTypeOfPlanService.deleteOptionForTypeOfPlan(+id)
	}
}
