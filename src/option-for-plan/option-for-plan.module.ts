import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { OptionForPlanController } from './option-for-plan.controller'
import { OptionForPlanService } from './option-for-plan.service'

@Module({
	controllers: [OptionForPlanController],
	providers: [OptionForPlanService, PrismaService],
})
export class OptionForPlanModule {}
