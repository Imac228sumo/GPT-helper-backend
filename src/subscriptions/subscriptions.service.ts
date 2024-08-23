import {
	BadGatewayException,
	Injectable,
	InternalServerErrorException,
	Logger,
	NotFoundException,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { errors } from 'src/utils/errors'
import { getEndDate } from 'src/utils/get-end-date'
import { CreateSubscriptionDto } from './dto/create-subscription.dto'
import {
	DeleteSubscriptionDto,
	UpdateSubscriptionDto,
} from './dto/update-subscription.dto'

@Injectable()
export class SubscriptionsService {
	constructor(private prisma: PrismaService) {}
	private readonly logger = new Logger(SubscriptionsService.name)

	async getAllSubscriptions(userId: number) {
		const subscriptions = await this.prisma.subscription.findMany({
			where: {
				userId: userId,
			},
		})
		if (!subscriptions) throw new NotFoundException('Subscriptions not fount')
		return subscriptions
	}

	async getAvailableTools(userId: number) {
		const subscriptions = await this.prisma.subscription.findMany({
			where: {
				userId: userId,
			},
		})
		if (!subscriptions) throw new NotFoundException('Subscriptions not fount')
		return subscriptions
	}

	async createSubscription(dto: CreateSubscriptionDto) {
		const existingSubscription = await this.prisma.subscription.findUnique({
			where: {
				userId_planId: {
					userId: dto.userId,
					planId: dto.planId,
				},
			},
		})

		const plan = await this.prisma.plan.findUnique({
			where: {
				id: dto.planId,
			},
		})
		if (!plan) {
			throw new InternalServerErrorException(
				"Unable to create subscription's data"
			)
		}

		if (existingSubscription) {
			const targetDate = new Date(existingSubscription.expirationDate)
			const currentDate = new Date()
			let months = 0
			if (targetDate > currentDate) {
				const timeDiff = targetDate.getTime() - currentDate.getTime()
				months = timeDiff / (30 * 24 * 60 * 60 * 1000)
			}

			const subscription = await this.prisma.subscription.update({
				where: {
					userId_planId: {
						userId: dto.userId,
						planId: dto.planId,
					},
				},
				data: {
					total: { increment: plan.balance },
					balance: { increment: plan.balance },
					expirationDate: getEndDate(plan.quantityOfMonths + months),
					plan: {
						connect: {
							id: dto.planId,
						},
					},
					user: {
						connect: {
							id: dto.userId,
						},
					},
				},
			})
			if (!subscription) {
				throw new InternalServerErrorException(
					"Unable to update subscription's data"
				)
			}

			return subscription
		} else if (!existingSubscription) {
			const subscription = await this.prisma.subscription.create({
				data: {
					type: plan.type,
					name: plan.name,
					expirationDate: getEndDate(plan.quantityOfMonths),
					total: plan.balance,
					balance: plan.balance,
					plan: {
						connect: {
							id: dto.planId,
						},
					},
					user: {
						connect: {
							id: dto.userId,
						},
					},
				},
			})
			if (!subscription) {
				throw new InternalServerErrorException(
					"Unable to create subscription's data"
				)
			}

			return subscription
		}
	}

	async updateSubscription(dto: UpdateSubscriptionDto) {
		const existingSubscription = await this.prisma.subscription.findUnique({
			where: {
				userId_planId: {
					userId: dto.userId,
					planId: dto.planId,
				},
			},
		})

		const plan = await this.prisma.plan.findUnique({
			where: {
				id: dto.planId,
			},
		})
		if (!plan) {
			throw new InternalServerErrorException(
				"Unable to update subscription's data"
			)
		}

		if (existingSubscription) {
			const subscription = await this.prisma.subscription.update({
				where: {
					userId_planId: {
						userId: dto.userId,
						planId: dto.planId,
					},
				},
				data: {
					total: plan.balance,
					balance: plan.balance,
					expirationDate: getEndDate(dto.months),
					plan: {
						connect: {
							id: dto.planId,
						},
					},
					user: {
						connect: {
							id: dto.userId,
						},
					},
				},
			})
			if (!subscription) {
				throw new InternalServerErrorException(
					"Unable to update subscription's data"
				)
			}

			return subscription
		}
	}

	async isPermissionMakeRequest(userId: number, toolName: string) {
		const existingSubscriptions = await this.prisma.subscription.findMany({
			where: {
				userId: userId,
			},
			orderBy: {
				planId: 'asc',
			},
			include: {
				plan: {
					include: {
						tools: {
							select: {
								tool: true,
							},
						},
					},
				},
			},
		})

		const currentDate = new Date() //currentDate > subscription.expirationDate
		let isBalanceEnded = false
		let isSubscriptionEnded = false
		if (existingSubscriptions) {
			for (const subscription of existingSubscriptions) {
				if (currentDate <= subscription.expirationDate) {
					isSubscriptionEnded = false
					if (subscription.plan.tools) {
						for (const tool of subscription.plan.tools) {
							if (toolName === tool.tool.model) {
								if (subscription.plan.isUnlimited) {
									return {
										isPermission: true,
										subscriptionsId: subscription.id,
										nameSubscription: subscription.name,
										model: toolName,
										isUnlimited: true,
									}
								} else if (!subscription.plan.isUnlimited) {
									if (subscription.balance > 0) {
										return {
											isPermission: true,
											subscriptionsId: subscription.id,
											nameSubscription: subscription.name,
											model: toolName,
											isUnlimited: false,
										}
									} else {
										isBalanceEnded = true
									}
								}
							}
						}
					} else {
						return errors.ProblemsWithSubscriptions
					}
				} else if (currentDate > subscription.expirationDate) {
					isSubscriptionEnded = true
				}
			}
		}

		if (isSubscriptionEnded === true) {
			return errors.SubscriptionEnded
		} else if (isBalanceEnded === true) {
			return errors.BalanceEnded
		}
		return errors.ThereIsNoSuchSubscription
	}

	async decrementSubscriptionBalance(subscriptionsId: number) {
		const subscription = await this.prisma.subscription.update({
			where: {
				id: subscriptionsId,
			},
			data: {
				balance: {
					decrement: 1,
				},
			},
		})

		if (!subscription) {
			throw new InternalServerErrorException(
				"Unable to decrement subscription's data"
			)
		}
	}

	async checkAllSubscriptions(userId: number) {
		const existingSubscriptions = await this.prisma.subscription.findMany({
			where: {
				userId: userId,
			},
		})

		if (existingSubscriptions) {
			const currentDate = new Date()
			for (const subscription of existingSubscriptions) {
				if (currentDate > subscription.expirationDate) {
					throw new BadGatewayException('Subscription ended')
				}
			}
		} else {
			throw new BadGatewayException('Subscriptions ended')
		}

		return { status: 'ok' }
	}

	async deleteSubscription(dto: DeleteSubscriptionDto) {
		const deletedSubscription = await this.prisma.subscription.delete({
			where: {
				userId_planId: {
					userId: dto.userId,
					planId: dto.planId,
				},
			},
		})

		if (!deletedSubscription) {
			throw new InternalServerErrorException(
				"Unable to delete subscription's data"
			)
		}

		return deletedSubscription
	}

	async deleteSubscriptionById(subscriptionId: number) {
		const deletedSubscription = await this.prisma.subscription.delete({
			where: {
				id: subscriptionId,
			},
		})

		if (!deletedSubscription) {
			throw new InternalServerErrorException(
				"Unable to delete subscription's data"
			)
		}

		return deletedSubscription
	}
}
