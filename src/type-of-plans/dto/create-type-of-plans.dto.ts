import { IsArray, IsBoolean, IsString } from 'class-validator'

export class CreateTypeOfPlansDto {
	@IsString()
	type: string
	@IsString()
	title: string
	@IsString()
	description: string
	@IsString()
	price: string
	@IsString()
	color: string
	@IsArray()
	@IsString({ each: true })
	optionForTypeOfPlans: string[]
	@IsArray()
	@IsString({ each: true })
	plans: string[]
	@IsBoolean()
	isSelect: boolean
}
