import { Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'


@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
	async onModuleInit() {
		await this.$connect()
	}
}


// Установка призмы - yarn add prisma
// Установка клиента - yarn add @prisma/client
// Подключение призмы - npx prisma init
// Читаем инструкицю в консоле
// Описываем модель
// npx prisma generate
//
//
//
//
//
//
//
//
//


