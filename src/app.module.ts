import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { ChatModule } from './chat/chat.module'
import { MessageModule } from './message/message.module'
import { UserModule } from './user/user.module'
import { YandexModule } from './yandex/yandex.module'

@Module({
	imports: [
		ConfigModule.forRoot(),
		AuthModule,
		UserModule,
		YandexModule,
		ChatModule,
		MessageModule,
	],
})
export class AppModule {}
