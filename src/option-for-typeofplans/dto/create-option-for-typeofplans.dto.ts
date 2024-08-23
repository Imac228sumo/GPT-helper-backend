import { IsBoolean, IsString } from 'class-validator'

export class CreateOptionForTypeOfPlansDto {
	@IsString()
	type: string
	@IsString()
	title: string
	@IsBoolean()
	isActive: boolean
}
