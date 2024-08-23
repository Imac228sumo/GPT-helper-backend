import {
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CreateOptionForPlanDto } from './dto/create-option-for-plan.dto'
import { UpdateOptionForPlanDto } from './dto/update-option-for-plan.dto'

@Injectable()
export class OptionForPlanService {
	constructor(private prisma: PrismaService) {}

	async getAllOptionsForPlan(searchTerm?: string) {
		return this.prisma.optionForPlan.findMany({
			where: searchTerm
				? {
						OR: [
							{
								title: {
									contains: searchTerm,
									mode: 'insensitive',
								},
							},
						],
					}
				: {},
			orderBy: {
				createdAt: 'desc',
			},
		})
	}

	async getOptionForPlanById(id: number) {
		const optionForPlan = await this.prisma.optionForPlan.findUnique({
			where: {
				id: id,
			},
		})
		if (!optionForPlan) throw new NotFoundException('OptionForPlan not found')
		return optionForPlan
	}

	async addNewOptionForPlan() {
		const defaultValue: CreateOptionForPlanDto = {
			type: '',
			title: '',
			price: '',
			color: '',
			descriptions: '',
			information: '',
			subOptions: [],
		}

		const newOptionForPlan = await this.prisma.optionForPlan.create({
			data: defaultValue,
		})

		if (!newOptionForPlan) {
			throw new InternalServerErrorException(
				"Unable to create OptionForPlan's data"
			)
		}

		return newOptionForPlan.id
	}

	async updateOptionForPlan(id: number, dto: UpdateOptionForPlanDto) {
		const optionForPlan = await this.prisma.optionForPlan.findUnique({
			where: {
				id: id,
			},
		})

		if (!optionForPlan) {
			throw new NotFoundException('OptionForPlan not found')
		}

		const newOptionForPlan = await this.prisma.optionForPlan.update({
			where: {
				id: id,
			},
			data: dto,
		})

		if (!newOptionForPlan) {
			throw new InternalServerErrorException(
				"Unable to update OptionForPlan's data"
			)
		}

		return newOptionForPlan
	}

	async deleteOptionForPlan(id: number) {
		const optionForPlan = await this.prisma.optionForPlan.findUnique({
			where: {
				id: id,
			},
		})

		if (!optionForPlan) {
			throw new NotFoundException('OptionForPlan not found')
		}

		const deletingOptionForPlan = await this.prisma.optionForPlan.delete({
			where: {
				id: id,
			},
		})

		if (!deletingOptionForPlan) {
			throw new InternalServerErrorException(
				"Unable to delete OptionForPlan's data"
			)
		}

		return deletingOptionForPlan
	}
}
