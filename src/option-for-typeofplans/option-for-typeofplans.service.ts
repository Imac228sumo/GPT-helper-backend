import {
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CreateOptionForTypeOfPlansDto } from './dto/create-option-for-typeofplans.dto'
import { UpdateOptionForTypeOfPlanDto } from './dto/update-option-for-typeofplans.dto'

@Injectable()
export class OptionForTypeOfPlanService {
	constructor(private prisma: PrismaService) {}

	async getAllOptionsForTypeOfPlan(searchTerm?: string) {
		return this.prisma.optionForTypeOfPlans.findMany({
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

	async getOptionForTypeOfPlanById(id: number) {
		const optionForTypeOfPlan =
			await this.prisma.optionForTypeOfPlans.findUnique({
				where: {
					id: id,
				},
			})
		if (!optionForTypeOfPlan)
			throw new NotFoundException('OptionForTypeOfPlan not found')
		return optionForTypeOfPlan
	}

	async addNewOptionForTypeOfPlan() {
		const defaultValue: CreateOptionForTypeOfPlansDto = {
			type: '',
			title: '',
			isActive: false,
		}

		const newOptionForTypeOfPlans =
			await this.prisma.optionForTypeOfPlans.create({
				data: defaultValue,
			})

		if (!newOptionForTypeOfPlans) {
			throw new InternalServerErrorException(
				"Unable to create OptionForTypeOfPlan's data"
			)
		}

		return newOptionForTypeOfPlans.id
	}

	async updateOptionForTypeOfPlan(
		id: number,
		dto: UpdateOptionForTypeOfPlanDto
	) {
		const optionForTypeOfPlan =
			await this.prisma.optionForTypeOfPlans.findUnique({
				where: {
					id: id,
				},
			})

		if (!optionForTypeOfPlan) {
			throw new NotFoundException('OptionForTypeOfPlan not found')
		}

		const newOptionForTypeOfPlan =
			await this.prisma.optionForTypeOfPlans.update({
				where: {
					id: id,
				},
				data: dto,
			})

		if (!newOptionForTypeOfPlan) {
			throw new InternalServerErrorException(
				"Unable to update OptionForTypeOfPlan's data"
			)
		}

		return newOptionForTypeOfPlan
	}

	async deleteOptionForTypeOfPlan(id: number) {
		const optionForTypeOfPlan =
			await this.prisma.optionForTypeOfPlans.findUnique({
				where: {
					id: id,
				},
			})

		if (!optionForTypeOfPlan) {
			throw new NotFoundException('OptionForTypeOfPlan not found')
		}

		const deletingOptionForTypeOfPlan =
			await this.prisma.optionForTypeOfPlans.delete({
				where: {
					id: id,
				},
			})

		if (!deletingOptionForTypeOfPlan) {
			throw new InternalServerErrorException(
				"Unable to delete OptionForTypeOfPlan's data"
			)
		}

		return deletingOptionForTypeOfPlan
	}
}
