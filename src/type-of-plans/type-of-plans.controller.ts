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
import { UpdateTypeOfPlansDto } from './dto/update-type-of-plans.dto'
import { TypeOfPlansService } from './type-of-plans.service'

@Controller('type-of-plans')
export class TypeOfPlansController {
	constructor(private readonly typeOfPlansService: TypeOfPlansService) {}

	@Auth()
	@Get()
	async getAllTypesOfPlans(@Query('searchTerm') searchTerm?: string) {
		return this.typeOfPlansService.getAllTypesOfPlans(searchTerm)
	}

	@Auth('ADMIN')
	@Get(':id')
	async getTypeOfPlansById(@Param('id', IdValidationPipe) id: string) {
		return this.typeOfPlansService.getTypeOfPlansById(+id)
	}

	@Auth('ADMIN')
	@HttpCode(200)
	@Post()
	@UsePipes(new ValidationPipe())
	async addNewTypeOfPlans() {
		return this.typeOfPlansService.addNewTypeOfPlans()
	}

	@Auth('ADMIN')
	@HttpCode(200)
	@Put(':id')
	@UsePipes(new ValidationPipe())
	async updateTypeOfPlans(
		@Param('id', IdValidationPipe) id: string,
		@Body() dto: UpdateTypeOfPlansDto
	) {
		return this.typeOfPlansService.updateTypeOfPlans(+id, dto)
	}

	@Auth('ADMIN')
	@HttpCode(200)
	@Delete(':id')
	@UsePipes(new ValidationPipe())
	async deleteTypeOfPlans(@Param('id', IdValidationPipe) id: string) {
		return this.typeOfPlansService.deleteTypeOfPlans(+id)
	}
}
