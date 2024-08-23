import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { AuthModule } from './auth/auth.module'
import { OpenaiChatModule } from './openai-chat/openai-chat.module'
import { OpenaiMessageModule } from './openai-message/openai-message.module'
import { OpenaiModule } from './openai/openai.module'
import { OptionForPlanModule } from './option-for-plan/option-for-plan.module'
import { OptionForTypeOfPlanModule } from './option-for-typeofplans/option-for-typeofplans.module'
import { PlanModule } from './plan/plan.module'
import { ReferralsModule } from './referrals/referrals.module'
import { SubscriptionsModule } from './subscriptions/subscriptions.module'
import { ToolModule } from './tool/tool.module'
import { TransactionModule } from './transaction/transaction.module'
import { TypeOfPlansModule } from './type-of-plans/type-of-plans.module'
import { UserModule } from './user/user.module'
import { StableModule } from './stable/stable.module';

@Module({
	imports: [
		ConfigModule.forRoot(),
		ScheduleModule.forRoot(),
		AuthModule,
		UserModule,
		TransactionModule,
		OpenaiModule,
		OpenaiChatModule,
		OpenaiMessageModule,
		SubscriptionsModule,
		ReferralsModule,
		PlanModule,
		ToolModule,
		TypeOfPlansModule,
		OptionForTypeOfPlanModule,
		OptionForPlanModule,
		StableModule,
	],
})
export class AppModule {}
