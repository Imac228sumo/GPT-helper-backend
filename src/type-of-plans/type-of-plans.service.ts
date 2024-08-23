import {
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CreateTypeOfPlansDto } from './dto/create-type-of-plans.dto'
import { UpdateTypeOfPlansDto } from './dto/update-type-of-plans.dto'

@Injectable()
export class TypeOfPlansService {
	constructor(private prisma: PrismaService) {}

	async getTypeOfPlansById(id: number) {
		const typeOfPlans = await this.prisma.typeOfPlans.findUnique({
			where: {
				id: id,
			},
			include: {
				optionsForTypeOfPlans: {
					include: {
						optionForTypeOfPlans: true,
					},
				},
			},
		})
		if (!typeOfPlans) throw new NotFoundException('TypeOfPlans not found')
		return typeOfPlans
	}

	async getAllTypesOfPlans(searchTerm?: string) {
		const typesOfPlans = await this.prisma.typeOfPlans.findMany({
			where: searchTerm
				? {
						OR: [
							{
								type: {
									contains: searchTerm,
									mode: 'insensitive',
								},
								title: {
									contains: searchTerm,
									mode: 'insensitive',
								},
								price: {
									contains: searchTerm,
									mode: 'insensitive',
								},
							},
						],
					}
				: {},
			include: {
				optionsForTypeOfPlans: {
					include: {
						optionForTypeOfPlans: true,
					},
				},
				plans: {
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
					},
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
		})

		return typesOfPlans
	}

	async addNewTypeOfPlans() {
		const defaultValue: CreateTypeOfPlansDto = {
			type: '',
			title: '',
			price: '',
			description: '',
			color: '',
			plans: [],
			optionForTypeOfPlans: [],
			isSelect: false,
		}

		const newTypeOfPlans = await this.prisma.typeOfPlans.create({
			data: {
				type: defaultValue.type,
				title: defaultValue.title,
				price: defaultValue.price,
				color: defaultValue.color,
				isSelect: defaultValue.isSelect,
			},
		})

		if (!newTypeOfPlans) {
			throw new InternalServerErrorException(
				"Unable to create TypeOfPlans's data"
			)
		}

		return newTypeOfPlans.id
	}

	async updateTypeOfPlans(id: number, dto: UpdateTypeOfPlansDto) {
		const typeOfPlans = await this.prisma.typeOfPlans.findUnique({
			where: {
				id: id,
			},
		})

		if (!typeOfPlans) {
			throw new NotFoundException('TypeOfPlans not found')
		}

		const currentOptionForPlans =
			await this.prisma.typeOfPlansONOptionForTypeOfPlans.findMany({
				where: { typeOfPlansId: id },
				select: { optionForTypeOfPlansId: true },
			})
		const currentOptionForPlansIds = currentOptionForPlans.map(
			(option) => option.optionForTypeOfPlansId
		)
		const optionsToConnect = dto.optionForTypeOfPlans.filter(
			(optionId) => !currentOptionForPlansIds.includes(+optionId)
		)
		const optionsToDisconnect = currentOptionForPlansIds.filter(
			(toolId) => !dto.optionForTypeOfPlans.includes(toolId.toString())
		)

		const updatingTypeOfPlans = await this.prisma.typeOfPlans.update({
			where: {
				id: id,
			},
			data: {
				type: dto.type,
				title: dto.title,
				price: dto.price,
				description: dto.description,
				color: dto.color,
				isSelect: dto.isSelect,
				plans: {
					connect: dto.plans.map((planId) => ({ id: +planId })),
				},
			},
			include: {
				plans: true,
				optionsForTypeOfPlans: true,
			},
		})

		await Promise.all([
			...optionsToConnect.map((optionForTypeOfPlansId) =>
				this.prisma.typeOfPlansONOptionForTypeOfPlans.create({
					data: {
						typeOfPlansId: id,
						optionForTypeOfPlansId: +optionForTypeOfPlansId,
					},
				})
			),
			...optionsToDisconnect.map((optionForTypeOfPlansId) =>
				this.prisma.typeOfPlansONOptionForTypeOfPlans.delete({
					where: {
						typeOfPlansId_optionForTypeOfPlansId: {
							typeOfPlansId: id,
							optionForTypeOfPlansId: optionForTypeOfPlansId,
						},
					},
				})
			),
		])

		if (!updatingTypeOfPlans) {
			throw new InternalServerErrorException(
				"Unable to update TypeOfPlans's data"
			)
		}

		const upTypeOfPlans = await this.prisma.typeOfPlans.findUnique({
			where: { id: id },
			include: {
				optionsForTypeOfPlans: {
					include: {
						optionForTypeOfPlans: true,
					},
				},
				plans: {
					include: {
						optionsForPlan: {
							include: {
								optionForPlan: true,
							},
						},
					},
				},
			},
		})

		if (!upTypeOfPlans) {
			throw new InternalServerErrorException(
				"Unable to update TypeOfPlans's data"
			)
		}

		return upTypeOfPlans
	}

	async deleteTypeOfPlans(id: number) {
		const typeOfPlans = await this.prisma.typeOfPlans.findUnique({
			where: {
				id: id,
			},
		})

		if (!typeOfPlans) {
			throw new NotFoundException('TypeOfPlans not found')
		}

		const deletingTypeOfPlans = await this.prisma.typeOfPlans.delete({
			where: {
				id: id,
			},
			include: {
				plans: true,
				optionsForTypeOfPlans: true,
			},
		})

		if (!deletingTypeOfPlans) {
			throw new InternalServerErrorException(
				"Unable to delete TypeOfPlans's data"
			)
		}

		return deletingTypeOfPlans
	}
}
