import { Injectable } from '@nestjs/common'
import { PaymentStatusDto } from 'src/lib/yookassa/types/yookassa.types'
import { PrismaService } from 'src/prisma.service'
import { ReferralsService } from 'src/referrals/referrals.service'
import { SubscriptionsService } from 'src/subscriptions/subscriptions.service'

@Injectable()
export class WebhookService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly subscriptionsService: SubscriptionsService,
		private readonly referralsService: ReferralsService
	) {}

	async yookassa(dto: PaymentStatusDto) {
		const { object } = dto

		const transaction = await this.prisma.transaction.findUnique({
			where: {
				paymentId: object.id,
			},
			include: {
				user: true,
			},
		})

		if (!transaction) {
			// eslint-disable-next-line
			console.error('Transaction not found')
			return
		}

		if (dto.event === 'payment.succeeded') {
			await this.prisma.transaction.update({
				where: {
					id: transaction.id,
				},
				data: {
					status: object.status,
					paymentMethod: object.payment_method.type,
				},
			})

			const subscription = await this.subscriptionsService.createSubscription({
				months: transaction.months,
				userId: transaction.userId,
				planId: transaction.planId,
			})

			const referral = await this.referralsService.getReferralByUserId(
				transaction.userId
			)

			if (!!referral) {
				if (referral.countProcessing < referral.countPaid)
					await this.referralsService.updateReferralPaidByUserId(
						transaction.userId
					)
			}

			const plan = await this.prisma.plan.findFirst({
				where: {
					referred: true,
				},
			})

			if (subscription && plan && referral) {
				await this.subscriptionsService.createSubscription({
					months: transaction.months,
					planId: plan.id,
					userId: referral.referredByUserId,
				})
			}
		}
	}
}
