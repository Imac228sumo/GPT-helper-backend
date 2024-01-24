import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { OpenaiMessageController } from './openai-message.controller'
import { OpenaiMessageService } from './openai-message.service'

@Module({
	controllers: [OpenaiMessageController],
	providers: [OpenaiMessageService, PrismaService],
})
export class OpenaiMessageModule {}
