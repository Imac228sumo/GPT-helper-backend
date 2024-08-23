import { IsNumber } from 'class-validator'

export class CreateSubscriptionDto {
	@IsNumber()
	planId: number
	@IsNumber()
	userId: number
	@IsNumber()
	months: number
}
