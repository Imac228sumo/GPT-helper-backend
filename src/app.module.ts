import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { OpenaiChatModule } from './openai-chat/openai-chat.module'
import { OpenaiModule } from './openai/openai.module'
import { UserModule } from './user/user.module'
import { YandexChatModule } from './yandex-chat/yandex-chat.module'
import { YandexMessageModule } from './yandex-message/yandex-message.module'
import { YandexModule } from './yandex/yandex.module'
import { OpenaiMessageModule } from './openai-message/openai-message.module';

@Module({
	imports: [
		ConfigModule.forRoot(),
		AuthModule,
		UserModule,
		YandexModule,
		OpenaiModule,
		YandexChatModule,
		OpenaiChatModule,
		YandexMessageModule,
		OpenaiMessageModule,
	],
})
export class AppModule {}
