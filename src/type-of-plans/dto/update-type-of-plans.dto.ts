import { PartialType } from '@nestjs/mapped-types'
import { CreateTypeOfPlansDto } from './create-type-of-plans.dto'

export class UpdateTypeOfPlansDto extends PartialType(CreateTypeOfPlansDto) {}
