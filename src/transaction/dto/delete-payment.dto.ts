import { IsString } from 'class-validator'

export class DeletePaymentDto {
	@IsString()
	paymentId: string
}
