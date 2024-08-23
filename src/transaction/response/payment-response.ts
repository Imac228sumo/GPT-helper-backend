import { IsOptional, IsString } from 'class-validator'

export class YookassaPaymentResponse {
	@IsOptional()
	@IsString()
	confirmationToken?: string
	@IsOptional()
	@IsString()
	paymentId?: string
}
