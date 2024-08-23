import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { getJwtConfig } from 'src/config/jwt.config'
import { FileService } from 'src/file/file.service'
import { MailService } from 'src/mail/mail.service'
import { OpenaiChatService } from 'src/openai-chat/openai-chat.service'
import { OpenaiMessageService } from 'src/openai-message/openai-message.service'
import { OpenaiService } from 'src/openai/openai.service'
import { PlanService } from 'src/plan/plan.service'
import { PrismaService } from 'src/prisma.service'
import { ReferralsService } from 'src/referrals/referrals.service'
import { SubscriptionsService } from 'src/subscriptions/subscriptions.service'
import { UserService } from 'src/user/user.service'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtStrategy } from './strategies/jwt.strategy'

@Module({
	controllers: [AuthController],
	providers: [
		AuthService,
		JwtStrategy,
		UserService,
		PrismaService,
		OpenaiChatService,
		OpenaiService,
		OpenaiMessageService,
		SubscriptionsService,
		FileService,
		ReferralsService,
		PrismaService,
		PlanService,
		MailService,
	],
	imports: [
		ConfigModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getJwtConfig,
		}),
	],
})
export class AuthModule {}
