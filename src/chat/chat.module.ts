import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { MessageService } from 'src/message/message.service'
import { PrismaService } from 'src/prisma.service'
import { YandexService } from 'src/yandex/yandex.service'
import { ChatController } from './chat.controller'
import { ChatService } from './chat.service'

@Module({
	imports: [HttpModule],
	controllers: [ChatController],
	providers: [ChatService, PrismaService, MessageService, YandexService],
})
export class ChatModule {}
