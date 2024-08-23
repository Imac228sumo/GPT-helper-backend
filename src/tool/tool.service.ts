import {
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CreateToolDto } from './dto/create-tool.dto'
import { UpdateToolDto } from './dto/update-tool.dto'

@Injectable()
export class ToolService {
	constructor(private prisma: PrismaService) {}

	async getToolById(id: number) {
		const tool = await this.prisma.tool.findUnique({
			where: {
				id: id,
			},
		})
		if (!tool) throw new NotFoundException('Tool not found')
		return tool
	}

	async getAllTools(searchTerm?: string) {
		return this.prisma.tool.findMany({
			where: searchTerm
				? {
						OR: [
							{
								title: {
									contains: searchTerm,
									mode: 'insensitive',
								},
								about: {
									contains: searchTerm,
									mode: 'insensitive',
								},
								description: {
									contains: searchTerm,
									mode: 'insensitive',
								},
								model: {
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

	async getTools(userId: number) {
		const [usedTools, availableTools, unavailableTools] = await Promise.all([
			this.getAllUsedTools(userId),
			this.getAllAvailableTools(),
			this.getAllUnavailableTools(),
		])

		return { usedTools, availableTools, unavailableTools }
	}

	async getAllUsedTools(userId: number) {
		return this.prisma.tool.findMany({
			where: {
				plans: {
					some: {
						plan: {
							subscriptions: {
								some: {
									userId: userId,
									expirationDate: {
										gt: new Date(),
									},
								},
							},
						},
					},
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
		})
	}

	async getAllAvailableTools() {
		return this.prisma.tool.findMany({
			where: {
				NOT: {
					plans: {
						every: {
							plan: {
								typeOfPlans: {
									isNot: {},
								},
							},
						},
					},
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
		})
	}

	async getAllUnavailableTools() {
		return this.prisma.tool.findMany({
			where: {
				plans: {
					every: {
						plan: {
							typeOfPlans: {
								isNot: {},
							},
						},
					},
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
		})
	}

	async addNewTool() {
		const defaultValue: CreateToolDto = {
			title: '',
			subTitleToolsItem: '',
			subTitleChatsItem: '',
			model: '',
			about: '',
			subAbout: '',
			description: '',
			link: '',
			iconSmall: '',
			iconMedium: '',
			iconBig: '',
			iconSquare: '',
		}

		const tool = await this.prisma.tool.create({
			data: defaultValue,
		})

		if (!tool) {
			throw new InternalServerErrorException("Unable to create Tool's data")
		}

		return tool.id
	}

	async updateTool(id: number, dto: UpdateToolDto) {
		const tool = await this.prisma.tool.findUnique({
			where: {
				id: id,
			},
		})

		if (!tool) {
			throw new NotFoundException('Tool not found')
		}

		const updatingTool = await this.prisma.tool.update({
			where: {
				id: id,
			},
			data: dto,
		})

		if (!updatingTool) {
			throw new InternalServerErrorException("Unable to update Tool's data")
		}

		return updatingTool
	}

	async deleteTool(id: number) {
		const tool = await this.prisma.tool.findUnique({
			where: {
				id: id,
			},
		})

		if (!tool) {
			throw new NotFoundException('Tool not found')
		}

		const deletingTool = await this.prisma.tool.delete({
			where: {
				id: id,
			},
		})

		if (!deletingTool) {
			throw new InternalServerErrorException("Unable to delete Tool's data")
		}

		return deletingTool
	}
}
