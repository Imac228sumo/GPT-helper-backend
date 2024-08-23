import { IsArray, IsString } from 'class-validator'

export class CreateOptionForPlanDto {
	@IsString()
	type: string
	@IsString()
	title: string
	@IsString()
	price: string
	@IsString()
	color: string
	@IsString()
	descriptions: string
	@IsString()
	information: string
	@IsArray()
	@IsString({ each: true })
	subOptions: string[]
}
