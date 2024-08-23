import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { ToolController } from './tool.controller'
import { ToolService } from './tool.service'

@Module({
	controllers: [ToolController],
	providers: [ToolService, PrismaService],
})
export class ToolModule {}
