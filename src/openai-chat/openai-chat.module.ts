import { Module } from '@nestjs/common'
import { OpenaiMessageService } from 'src/openai-message/openai-message.service'
import { OpenaiService } from 'src/openai/openai.service'
import { PrismaService } from 'src/prisma.service'
import { OpenaiChatController } from './openai-chat.controller'
import { OpenaiChatService } from './openai-chat.service'

@Module({
	controllers: [OpenaiChatController],
	providers: [
		OpenaiChatService,
		PrismaService,
		OpenaiService,
		OpenaiMessageService,
	],
})
export class OpenaiChatModule {}
