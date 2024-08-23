import { PartialType } from '@nestjs/mapped-types';
import { CreateStableDto } from './create-stable.dto';

export class UpdateStableDto extends PartialType(CreateStableDto) {}
