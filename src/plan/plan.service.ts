import {
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CreatePlanDto } from './dto/create-plan.dto'
import { UpdatePlanDto } from './dto/update-plan.dto'

@Injectable()
export class PlanService {
	constructor(private prisma: PrismaService) {}

	async getAllPlans(searchTerm?: string) {
		return this.prisma.plan.findMany({
			where: searchTerm
				? {
						OR: [
							{
								name: {
									contains: searchTerm,
									mode: 'insensitive',
								},
							},
						],
					}
				: {},
			include: {
				optionsForPlan: {
					include: {
						optionForPlan: true,
					},
				},
				tools: {
					include: {
						tool: true,
					},
				},
				typeOfPlans: true,
			},
			orderBy: {
				createdAt: 'desc',
			},
		})
	}

	async getPlanById(id: number) {
		const plan = await this.prisma.plan.findUnique({
			where: {
				id: id,
			},
			include: {
				optionsForPlan: {
					include: {
						optionForPlan: true,
					},
				},
				tools: {
					include: {
						tool: true,
					},
				},
				typeOfPlans: true,
			},
		})
		if (!plan) throw new NotFoundException('Plan not found')
		return plan
	}

	async getPlansById(ids: number[]) {
		const plans = await this.prisma.plan.findMany({
			where: {
				id: {
					in: ids,
				},
			},
		})
		return plans
	}

	async addNewPlan() {
		const defaultValue: CreatePlanDto = {
			type: '',
			name: '',
			balance: 0,
			price: 0,
			quantityOfMonths: 0,
			tools: [],
			optionsForPlan: [],
			isUnlimited: false,

			referred: false,
			discount: 0,
			additionalGenerations: 0,
		}

		const newPlan = await this.prisma.plan.create({
			data: {
				type: defaultValue.type,
				name: defaultValue.name,
				balance: defaultValue.balance,
				price: defaultValue.price,
				quantityOfMonths: defaultValue.quantityOfMonths,
				isUnlimited: defaultValue.isUnlimited,

				referred: defaultValue.referred,
				discount: defaultValue.discount,
				additionalGenerations: defaultValue.additionalGenerations,
			},
		})

		if (!newPlan) {
			throw new InternalServerErrorException("Unable to create Plan's data")
		}

		return newPlan.id
	}

	async updatePlan(id: number, dto: UpdatePlanDto) {
		const plan = await this.prisma.plan.findUnique({
			where: {
				id: id,
			},
		})

		if (!plan) {
			throw new NotFoundException('Plan not found')
		}

		const currentOptionsForPlan =
			await this.prisma.planONOptionForPlan.findMany({
				where: { planId: id },
				select: { optionForPlanId: true },
			})
		const currentOptionsForPlanIds = currentOptionsForPlan.map(
			(optionForPlan) => optionForPlan.optionForPlanId
		)
		const optionsForPlanToConnect = dto.optionsForPlan.filter(
			(optionForPlanId) => !currentOptionsForPlanIds.includes(+optionForPlanId)
		)
		const optionsForPlanToDisconnect = currentOptionsForPlanIds.filter(
			(optionForPlanId) =>
				!dto.optionsForPlan.includes(optionForPlanId.toString())
		)

		const currentTools = await this.prisma.planONTool.findMany({
			where: { planId: id },
			select: { toolId: true },
		})
		const currentToolIds = currentTools.map((tool) => tool.toolId)
		const toolsToConnect = dto.tools.filter(
			(toolId) => !currentToolIds.includes(+toolId)
		)
		const toolsToDisconnect = currentToolIds.filter(
			(toolId) => !dto.tools.includes(toolId.toString())
		)

		await this.prisma.plan.update({
			where: {
				id: id,
			},
			data: {
				type: dto.type,
				balance: dto.balance,
				quantityOfMonths: dto.quantityOfMonths,
				name: dto.name,
				isUnlimited: dto.isUnlimited,
				price: dto.price,

				referred: dto.referred,
				discount: dto.discount,
				additionalGenerations: dto.additionalGenerations,
			},
			include: {
				tools: true,
				typeOfPlans: true,
			},
		})

		await Promise.all([
			...toolsToConnect.map((toolId) =>
				this.prisma.planONTool.create({
					data: {
						planId: id,
						toolId: +toolId,
					},
				})
			),
			...toolsToDisconnect.map((toolId) =>
				this.prisma.planONTool.delete({
					where: {
						planId_toolId: {
							planId: id,
							toolId: toolId,
						},
					},
				})
			),

			...optionsForPlanToConnect.map((optionForPlanId) =>
				this.prisma.planONOptionForPlan.create({
					data: {
						planId: id,
						optionForPlanId: +optionForPlanId,
					},
				})
			),
			...optionsForPlanToDisconnect.map((optionForPlanId) =>
				this.prisma.planONOptionForPlan.delete({
					where: {
						planId_optionForPlanId: {
							planId: id,
							optionForPlanId: optionForPlanId,
						},
					},
				})
			),
		])

		const upPlan = await this.prisma.plan.findUnique({
			where: { id: id },
			include: {
				optionsForPlan: {
					include: {
						optionForPlan: true,
					},
				},
				tools: {
					include: {
						tool: true,
					},
				},
				typeOfPlans: true,
			},
		})

		if (!upPlan) {
			throw new InternalServerErrorException("Unable to update Plan's data")
		}

		return upPlan
	}

	async deletePlan(id: number) {
		const plan = await this.prisma.plan.findUnique({
			where: {
				id: id,
			},
		})

		if (!plan) {
			throw new NotFoundException('Plan not found')
		}

		const deletingPlan = await this.prisma.plan.delete({
			where: {
				id: id,
			},
			include: {
				tools: true,
				typeOfPlans: true,
			},
		})

		if (!deletingPlan) {
			throw new InternalServerErrorException("Unable to delete Plan's data")
		}

		return deletingPlan
	}
}
