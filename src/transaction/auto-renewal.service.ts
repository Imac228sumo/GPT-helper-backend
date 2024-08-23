import { Injectable } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'

import { YookassaService } from 'src/lib/yookassa/yookassa.service'
import { PrismaService } from 'src/prisma.service'
import { SubscriptionsService } from 'src/subscriptions/subscriptions.service'
import { TransactionService } from './transaction.service'

@Injectable()
export class AutoRenewalService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly yookassa: YookassaService,
		private readonly transactionService: TransactionService,
		private readonly subscriptionsService: SubscriptionsService
	) {}

	// @Cron(CronExpression.EVERY_MINUTE)
	@Cron(CronExpression.EVERY_DAY_AT_11AM)
	// @Cron(CronExpression.EVERY_10_MINUTES)
	async autoRenewal() {
		// eslint-disable-next-line
		console.log('autoRenewal')
		const subscriptions = await this.prisma.subscription.findMany({
			where: {
				expirationDate: {
					lte: new Date(new Date().setHours(23, 59, 59, 999)),
				},
			},
			include: {
				user: true,
			},
		})

		await Promise.all(
			subscriptions.map(async (subscription) => {
				const subscriptionId = subscription.id
				const planId = subscription.planId
				const userId = subscription.userId

				if (!subscription.isAutoRenewal) {
					return this.subscriptionsService.deleteSubscriptionById(
						subscriptionId
					)
				}

				const lastTransaction = await this.prisma.transaction.findFirst({
					where: {
						planId,
						userId,
					},
				})

				if (!lastTransaction) {
					return this.subscriptionsService.deleteSubscriptionById(
						subscriptionId
					)
				} else if (lastTransaction.status === 'canceled') {
					return this.subscriptionsService.deleteSubscriptionById(
						subscriptionId
					)
				}

				const amount = lastTransaction.amount
				console.log(lastTransaction)

				try {
					const paymentResponse = await this.yookassa.createPaymentBySavedCard({
						currency: 'RUB',
						customerEmail: subscription.user.email,
						items: [
							{
								description: `Продление подписки`,
								quantity: '1.00',
								amount: {
									value: amount,
									currency: 'RUB',
								},
								vat_code: '1',
							},
						],
						total: amount,
						paymentId: lastTransaction.paymentId,
					})

					await this.transactionService.updateTransaction({
						payment: paymentResponse,
						transactionId: lastTransaction.id,
						months: lastTransaction.months,
						planId: planId,
						userId: userId,
					})
				} catch (error) {
					// eslint-disable-next-line
					console.log('cancel sub')
					return this.subscriptionsService.deleteSubscriptionById(
						subscriptionId
					)
				}
			})
		)
	}
}
