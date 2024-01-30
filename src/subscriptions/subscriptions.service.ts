import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class SubscriptionsService {
	constructor(private prisma: PrismaService) {}
	private readonly logger = new Logger(SubscriptionsService.name)
	// Free subscription

	async getFreeSubscription(userId: number) {
		const subscription = await this.prisma.freeSubscription.findUnique({
			where: {
				userId: userId,
			},
		})
		if (!subscription) throw new NotFoundException('Subscription not fount')
		return subscription
	}

	async createFreeSubscription(userId: number, durationInDays: number = 30) {
		const existingSubscription = await this.prisma.freeSubscription.findUnique({
			where: {
				userId: userId,
			},
		})

		let expirationDate = new Date()
		if (existingSubscription) {
			const date = new Date(existingSubscription.expirationDate)
			date.setDate(date.getDate() + durationInDays)
			expirationDate = date
		} else {
			expirationDate.setDate(expirationDate.getDate() + durationInDays)
		}

		const subscription = await this.prisma.freeSubscription.upsert({
			where: {
				userId: userId,
			},
			update: {
				isActive: true,
				balance: { increment: 2 },
				expirationDate: expirationDate,
			},
			create: {
				userId: userId,
				isActive: true,
				balance: 2,
				expirationDate: expirationDate,
			},
		})

		return subscription
	}

	async checkFreeSubscription(userId: number) {
		const existingSubscription = await this.prisma.freeSubscription.findUnique({
			where: {
				userId: userId,
			},
		})

		if (existingSubscription) {
			let currentDate = new Date()
			if (currentDate > existingSubscription.expirationDate) {
				await this.deleteStandardSubscription(userId)
			}
		}
	}

	async deleteFreeSubscription(userId: number) {
		const existingSubscription = await this.prisma.freeSubscription.delete({
			where: {
				userId: userId,
			},
		})

		return existingSubscription
	}

	// Standard subscription
	async getStandardSubscription(userId: number) {
		const subscription = await this.prisma.standardSubscription.findUnique({
			where: {
				userId: userId,
			},
		})
		if (!subscription) throw new NotFoundException('Subscription not fount')
		return subscription
	}

	async createStandardSubscription(
		userId: number,
		durationInDays: number = 30
	) {
		const existingSubscription =
			await this.prisma.standardSubscription.findUnique({
				where: {
					userId: userId,
				},
			})

		let expirationDate = new Date()
		if (existingSubscription) {
			const date = new Date(existingSubscription.expirationDate)
			date.setDate(date.getDate() + durationInDays)
			expirationDate = date
		} else {
			expirationDate.setDate(expirationDate.getDate() + durationInDays)
		}

		const subscription = await this.prisma.standardSubscription.upsert({
			where: {
				userId: userId,
			},
			update: {
				isActive: true,
				balance: { increment: 25 },
				expirationDate: expirationDate,
			},
			create: {
				userId: userId,
				isActive: true,
				balance: 25,
				expirationDate: expirationDate,
			},
		})

		return subscription
	}

	async checkStandardSubscription(userId: number) {
		const existingSubscription =
			await this.prisma.standardSubscription.findUnique({
				where: {
					userId: userId,
				},
			})

		if (existingSubscription) {
			let currentDate = new Date()
			if (currentDate > existingSubscription.expirationDate) {
				await this.deleteStandardSubscription(userId)
			}
		}
	}

	async deleteStandardSubscription(userId: number) {
		const existingSubscription = await this.prisma.standardSubscription.delete({
			where: {
				userId: userId,
			},
		})

		return existingSubscription
	}
}

/*

	// @Cron('45 * * * * *')
	@Cron(CronExpression.EVERY_30_SECONDS)
	async renewFreeSubscription() {
		// const users = await this.prisma.user.updateMany({
		// 	data: {
		// 		usedRequestFreeSubscription: 2,
		// 	},
		// })
	}

*/
