import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { YandexMessageController } from './yandex-message.controller'
import { YandexMessageService } from './yandex-message.service'

@Module({
	controllers: [YandexMessageController],
	providers: [YandexMessageService, PrismaService],
})
export class YandexMessageModule {}
