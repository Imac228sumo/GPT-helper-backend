import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { YandexMessageService } from 'src/yandex-message/yandex-message.service'
import { YandexService } from 'src/yandex/yandex.service'
import { YandexChatController } from './yandex-chat.controller'
import { YandexChatService } from './yandex-chat.service'

@Module({
	imports: [HttpModule],
	controllers: [YandexChatController],
	providers: [
		YandexChatService,
		PrismaService,
		YandexMessageService,
		YandexService,
	],
})
export class YandexChatModule {}
