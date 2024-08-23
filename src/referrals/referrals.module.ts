import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { ReferralsService } from './referrals.service'

@Module({
	providers: [ReferralsService, PrismaService],
})
export class ReferralsModule {}
