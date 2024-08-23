import { Body, Controller, Post } from '@nestjs/common'
import { User } from '@prisma/client'
import { Auth } from 'src/auth/decorators/auth.decorator'

import { CurrentUser } from 'src/user/decorators/user.decorator'
import { DeletePaymentDto } from './dto/delete-payment.dto'
import { MakePaymentDto } from './dto/make-payment.dto'
import { TransactionService } from './transaction.service'

@Controller('transaction')
export class TransactionController {
	constructor(private readonly transactionService: TransactionService) {}

	@Post('make-payment')
	@Auth()
	makePayment(@Body() dto: MakePaymentDto, @CurrentUser() user: User) {
		return this.transactionService.makePayment(dto, user)
	}

	@Post('delete-payment')
	@Auth()
	deletePayment(@Body() dto: DeletePaymentDto, @CurrentUser() user: User) {
		return this.transactionService.deletePayment(dto, user)
	}
}
