import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common'
import * as crypto from 'crypto'
import { PrismaService } from 'src/prisma.service'
import { errors } from 'src/utils/errors'
import { CreateReferralDto } from './dto/create-referral.dto'

@Injectable()
export class ReferralsService {
	constructor(private prisma: PrismaService) {}

	async getReferralByUserId(userId: number) {
		const referral = await this.prisma.referral.findUnique({
			where: {
				userId: userId,
			},
		})

		return referral
	}

	async updateReferralProcessingByUserId(userId: number) {
		const updatedReferral = await this.prisma.referral.update({
			where: {
				userId: userId,
			},
			data: {
				countProcessing: { increment: 1 },
			},
		})

		return updatedReferral
	}

	async updateReferralPaidByUserId(userId: number) {
		const updatedReferral = await this.prisma.referral.update({
			where: {
				userId: userId,
			},
			data: {
				countPaid: { increment: 1 },
			},
		})

		return updatedReferral
	}

	async createReferral(createReferralDto: CreateReferralDto) {
		const referral = await this.prisma.referral.create({
			data: {
				referredByUser: {
					connect: {
						id: createReferralDto.referredByUserId,
					},
				},
				user: {
					connect: {
						id: createReferralDto.userId,
					},
				},
			},
		})

		if (!referral) {
			throw new BadRequestException("Unable to create referral's data")
		}

		return referral
	}

	async generateReferralCode(source: string) {
		const hash = crypto.createHash('sha256')
		const hashValue = hash.update(source).digest('hex')

		const codePart1 = hashValue.substr(0, 8)
		const codePart2 = hashValue.substr(8, 4)
		const codePart3 = hashValue.substr(12, 4)
		const codePart4 = hashValue.substr(16, 4)
		const codePart5 = hashValue.substr(20, 12)

		const newCode = `${codePart1}-${codePart2}-${codePart3}-${codePart4}-${codePart5}`

		const oldCode = await this.prisma.user.findFirst({
			where: {
				referralCode: newCode,
			},
		})

		if (oldCode) {
			return this.generateReferralCode(source)
		}

		return newCode
	}

	async getReferralIdByCode(referralCode: string) {
		const referrer = await this.prisma.user.findFirst({
			where: {
				referralCode: referralCode,
			},
		})

		if (!referrer) {
			throw new NotFoundException(errors.InvalidReferralCode)
		}

		const { id } = referrer
		return id
	}

	async incrementReferrer(userId: number) {
		const referredBy = await this.prisma.user.update({
			where: { id: userId },
			data: {
				referralCount: {
					increment: 1,
				},
			},
		})

		if (!referredBy) return false
		if (!referredBy) throw Error('Unable to increment referral count')
		return true
	}

	async deleteReferral(referralId: number, userId: number) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId,
			},
		})

		if (!user) throw new NotFoundException('User not found')

		const referral = await this.prisma.referral.delete({
			where: {
				id: referralId,
			},
		})

		if (!referral) {
			throw new InternalServerErrorException("Unable to delete referral's data")
		}

		return referral
	}
}
