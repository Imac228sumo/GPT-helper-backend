import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { YandexController } from './yandex.controller'
import { YandexService } from './yandex.service'

@Module({
	imports: [HttpModule],
	controllers: [YandexController],
	providers: [YandexService, PrismaService],
})
export class YandexModule {}
