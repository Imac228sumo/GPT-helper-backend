import { PartialType } from '@nestjs/mapped-types';
import { CreateOptionForPlanDto } from './create-option-for-plan.dto';

export class UpdateOptionForPlanDto extends PartialType(CreateOptionForPlanDto) {}
