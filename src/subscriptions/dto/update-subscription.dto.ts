import { PartialType } from '@nestjs/mapped-types'
import { IsNumber } from 'class-validator'
import { CreateSubscriptionDto } from './create-subscription.dto'

export class UpdateSubscriptionDto extends PartialType(CreateSubscriptionDto) {}

export class DeleteSubscriptionDto {
	@IsNumber()
	userId: number
	@IsNumber()
	planId: number
}
