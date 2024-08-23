import { BadRequestException, Injectable } from '@nestjs/common'
import { User } from '@prisma/client'
import { YookassaService } from 'src/lib/yookassa/yookassa.service'

import { PrismaService } from 'src/prisma.service'
import { ReferralsService } from 'src/referrals/referrals.service'
import { CreateTransactionDto } from './dto/create-transaction.dto'
import { DeletePaymentDto } from './dto/delete-payment.dto'
import { MakePaymentDto } from './dto/make-payment.dto'
import { UpdateTransactionDto } from './dto/update-transaction.dto'
import { YookassaPaymentResponse } from './response/payment-response'

@Injectable()
export class TransactionService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly yookassa: YookassaService,
		private readonly referralsService: ReferralsService
	) {}

	async makePayment(
		dto: MakePaymentDto,
		user: User
	): Promise<YookassaPaymentResponse> {
		const plan = await this.prisma.plan.findUnique({
			where: {
				id: dto.planId,
			},
		})

		const payment = await this.makeYooKassaPayment(
			user,
			plan.id,
			plan.price,
			plan.quantityOfMonths
		)

		return {
			paymentId: payment.id,
			confirmationToken: payment.confirmation.confirmation_token,
		}
	}

	async deletePayment(dto: DeletePaymentDto, user: User) {
		return this.prisma.transaction.delete({
			where: {
				paymentId: dto.paymentId,
				userId: user.id,
			},
		})
	}

	async makeYooKassaPayment(
		user: User,
		planId: number,
		price: number,
		months: number
	) {
		const referral = await this.referralsService.getReferralByUserId(user.id)
		if (!!referral) {
			await this.referralsService.updateReferralProcessingByUserId(
				referral.userId
			)
		}

		try {
			const paymentResponse = await this.yookassa.createPayment({
				currency: 'RUB',
				customerEmail: user.email,
				items: [
					{
						description: `Подписка, на ${months} мес.`,
						quantity: '1.00',
						amount: {
							value: price.toString(),
							currency: 'RUB',
						},
						vat_code: '1',
					},
				],
				total: price.toString(),
			})

			if (paymentResponse) {
				await this.createTransaction({
					payment: paymentResponse,
					userId: user.id,
					planId: planId,
					months: months,
				})
			}

			return paymentResponse
		} catch (error) {
			// eslint-disable-next-line
			console.log('make payment error', error)
			throw new BadRequestException('Ошибка при создании платежа')
		}
	}

	async createTransaction({
		userId,
		months,
		payment,
		planId,
	}: CreateTransactionDto) {
		return this.prisma.transaction.create({
			data: {
				months: months,
				amount: payment.amount.value,
				paymentId: payment.id,
				status: payment.status,
				planId: planId,
				user: {
					connect: {
						id: userId,
					},
				},
			},
		})
	}

	async updateTransaction({
		payment,
		transactionId,
		months,
		planId,
		userId,
	}: UpdateTransactionDto) {
		const paymentData = payment
			? {
					amount: payment.amount.value,
					paymentId: payment.id,
					paymentMethod: payment.payment_method.type,
					status: payment.status,
				}
			: {}

		return this.prisma.transaction.update({
			where: {
				id: transactionId,
			},
			data: {
				months,
				planId,
				userId,
				...paymentData,
			},
		})
	}
}
