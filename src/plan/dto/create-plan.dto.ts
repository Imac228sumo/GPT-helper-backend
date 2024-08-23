import {
	IsArray,
	IsBoolean,
	IsNumber,
	IsOptional,
	IsString,
} from 'class-validator'

export class CreatePlanDto {
	@IsString()
	type: string
	@IsString()
	name: string
	@IsNumber()
	balance: number
	@IsNumber()
	price: number
	@IsNumber()
	quantityOfMonths: number
	@IsArray()
	@IsString({ each: true })
	tools: string[]
	@IsArray()
	@IsString({ each: true })
	optionsForPlan: string[]
	@IsBoolean()
	isUnlimited: boolean

	@IsOptional()
	@IsBoolean()
	referred: boolean
	@IsNumber()
	discount: number
	@IsNumber()
	additionalGenerations: number
}
