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
import { UpdatePlanDto } from './dto/update-plan.dto'
import { PlanService } from './plan.service'

@Controller('plan')
export class PlanController {
	constructor(private readonly planService: PlanService) {}

	@Auth('ADMIN')
	@Get()
	async getAllPlans(@Query('searchTerm') searchTerm?: string) {
		return this.planService.getAllPlans(searchTerm)
	}

	@Auth('ADMIN')
	@Get(':id')
	async getPlanById(@Param('id', IdValidationPipe) id: string) {
		return this.planService.getPlanById(+id)
	}

	@Auth('ADMIN')
	@HttpCode(200)
	@Post()
	@UsePipes(new ValidationPipe())
	async addNewPlan() {
		return this.planService.addNewPlan()
	}

	@Auth('ADMIN')
	@HttpCode(200)
	@Put(':id')
	@UsePipes(new ValidationPipe())
	async updatePlan(
		@Param('id', IdValidationPipe) id: string,
		@Body() dto: UpdatePlanDto
	) {
		return this.planService.updatePlan(+id, dto)
	}

	@Auth('ADMIN')
	@HttpCode(200)
	@Delete(':id')
	@UsePipes(new ValidationPipe())
	async deletePlan(@Param('id', IdValidationPipe) id: string) {
		return this.planService.deletePlan(+id)
	}
}
