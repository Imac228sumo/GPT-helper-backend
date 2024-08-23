import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { OptionForTypeOfPlanController } from './option-for-typeofplans.controller'
import { OptionForTypeOfPlanService } from './option-for-typeofplans.service'

@Module({
	controllers: [OptionForTypeOfPlanController],
	providers: [OptionForTypeOfPlanService, PrismaService],
})
export class OptionForTypeOfPlanModule {}
