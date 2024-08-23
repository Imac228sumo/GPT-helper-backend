import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { TypeOfPlansController } from './type-of-plans.controller'
import { TypeOfPlansService } from './type-of-plans.service'

@Module({
	controllers: [TypeOfPlansController],
	providers: [TypeOfPlansService, PrismaService],
})
export class TypeOfPlansModule {}
