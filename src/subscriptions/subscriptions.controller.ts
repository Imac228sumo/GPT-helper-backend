import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Put,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/user/decorators/user.decorator'
import { CreateSubscriptionDto } from './dto/create-subscription.dto'
import { DeleteSubscriptionDto } from './dto/update-subscription.dto'
import { SubscriptionsService } from './subscriptions.service'

@Controller('subscriptions')
export class SubscriptionsController {
	constructor(private readonly subscriptionsService: SubscriptionsService) {}

	@Auth()
	@Get()
	async getAllSubscription(@CurrentUser('id') userId: number) {
		return this.subscriptionsService.getAllSubscriptions(userId)
	}

	@Auth()
	@Get()
	async getAvailableTools(@CurrentUser('id') userId: number) {
		return this.subscriptionsService.getAvailableTools(userId)
	}

	@Auth()
	@Get('check')
	async checkAllSubscriptions(@CurrentUser('id') userId: number) {
		return this.subscriptionsService.checkAllSubscriptions(userId)
	}

	@Auth()
	@HttpCode(200)
	@Put()
	@UsePipes(new ValidationPipe())
	async createSubscription(@Body() dto: CreateSubscriptionDto) {
		return this.subscriptionsService.createSubscription(dto)
	}

	@Auth()
	@HttpCode(200)
	@Delete()
	async deleteSubscription(@Body() dto: DeleteSubscriptionDto) {
		return this.subscriptionsService.deleteSubscription(dto)
	}
}
