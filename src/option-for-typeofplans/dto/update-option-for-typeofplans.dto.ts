import { PartialType } from '@nestjs/mapped-types'
import { CreateOptionForTypeOfPlansDto } from './create-option-for-typeofplans.dto'

export class UpdateOptionForTypeOfPlanDto extends PartialType(
	CreateOptionForTypeOfPlansDto
) {}
