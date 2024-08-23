import { IsNumber } from 'class-validator'

export class CreateReferralDto {
	@IsNumber()
	userId: number
	@IsNumber()
	referredByUserId: number
}
