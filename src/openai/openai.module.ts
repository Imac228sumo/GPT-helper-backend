import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { OpenaiController } from './openai.controller'
import { OpenaiService } from './openai.service'

@Module({
	controllers: [OpenaiController],
	providers: [OpenaiService, PrismaService],
})
export class OpenaiModule {}
