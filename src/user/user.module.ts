import { Module } from '@nestjs/common'
import { FileService } from 'src/file/file.service'
import { OpenaiChatModule } from 'src/openai-chat/openai-chat.module'
import { OpenaiChatService } from 'src/openai-chat/openai-chat.service'
import { OpenaiMessageModule } from 'src/openai-message/openai-message.module'
import { OpenaiMessageService } from 'src/openai-message/openai-message.service'
import { OpenaiModule } from 'src/openai/openai.module'
import { OpenaiService } from 'src/openai/openai.service'
import { PlanService } from 'src/plan/plan.service'
import { PrismaService } from 'src/prisma.service'
import { ReferralsService } from 'src/referrals/referrals.service'
import { SubscriptionsService } from 'src/subscriptions/subscriptions.service'
import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
	imports: [OpenaiModule, OpenaiChatModule, OpenaiMessageModule],
	controllers: [UserController],
	providers: [
		UserService,
		PrismaService,
		OpenaiChatService,
		OpenaiService,
		OpenaiMessageService,
		SubscriptionsService,
		FileService,
		ReferralsService,
		SubscriptionsService,
		PlanService,
	],
	exports: [UserService],
})
export class UserModule {}
