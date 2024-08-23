import { IsNumber } from 'class-validator'

export class MakePaymentDto {
	@IsNumber()
	planId: number
}
