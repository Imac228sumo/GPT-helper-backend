import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { AuthModule } from './auth/auth.module'
import { OpenaiChatModule } from './openai-chat/openai-chat.module'
import { OpenaiMessageModule } from './openai-message/openai-message.module'
import { OpenaiModule } from './openai/openai.module'
import { SubscriptionsModule } from './subscriptions/subscriptions.module'
import { UserModule } from './user/user.module'
import { YandexChatModule } from './yandex-chat/yandex-chat.module'
import { YandexMessageModule } from './yandex-message/yandex-message.module'
import { YandexModule } from './yandex/yandex.module'

@Module({
	imports: [
		ConfigModule.forRoot(),
		ScheduleModule.forRoot(),
		AuthModule,
		UserModule,
		YandexModule,
		OpenaiModule,
		YandexChatModule,
		OpenaiChatModule,
		YandexMessageModule,
		OpenaiMessageModule,
		SubscriptionsModule,
	],
})
export class AppModule {}
