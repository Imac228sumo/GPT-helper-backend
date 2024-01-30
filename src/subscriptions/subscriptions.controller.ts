import { Controller, Delete, Get, HttpCode, Put } from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/user/decorators/user.decorator'
import { SubscriptionsService } from './subscriptions.service'

@Controller('subscriptions')
export class SubscriptionsController {
	constructor(private readonly subscriptionsService: SubscriptionsService) {}

	// Free subscription
	@Auth()
	@Get('free')
	async getFreeSubscription(@CurrentUser('id') userId: number) {
		return this.subscriptionsService.getFreeSubscription(userId)
	}

	@Auth()
	@Get('free/check')
	async checkFreeSubscription(@CurrentUser('id') userId: number) {
		return this.subscriptionsService.checkFreeSubscription(userId)
	}

	@Auth()
	@HttpCode(200)
	@Put('free')
	async createFreeSubscription(@CurrentUser('id') userId: number) {
		return this.subscriptionsService.createFreeSubscription(userId)
	}

	@Auth()
	@HttpCode(200)
	@Delete('free')
	async deleteFreeSubscription(@CurrentUser('id') userId: number) {
		return this.subscriptionsService.deleteFreeSubscription(userId)
	}

	// Standard subscription
	@Auth()
	@Get('standard')
	async getStandardSubscription(@CurrentUser('id') userId: number) {
		return this.subscriptionsService.getStandardSubscription(userId)
	}

	@Auth()
	@Get('standard/check')
	async checkStandardSubscription(@CurrentUser('id') userId: number) {
		return this.subscriptionsService.checkStandardSubscription(userId)
	}

	@Auth()
	@HttpCode(200)
	@Put('standard')
	async createStandardSubscription(@CurrentUser('id') userId: number) {
		return this.subscriptionsService.createStandardSubscription(userId)
	}

	@Auth()
	@HttpCode(200)
	@Delete('standard')
	async deleteStandardSubscription(@CurrentUser('id') userId: number) {
		return this.subscriptionsService.deleteStandardSubscription(userId)
	}
}

/*

{
	"id": 20,
	"userId": 1,
	"isActive": true,
	"expirationDate": "2024-02-28T14:29:36.963Z",
	"balance": 25,
	"createdAt": "2024-01-29T14:29:36.965Z",
	"updatedAt": "2024-01-29T14:29:36.965Z"
}

{
	"id": 20,
	"userId": 1,
	"isActive": true,
	"expirationDate": "2024-03-27T14:30:16.498Z",
	"balance": 50,
	"createdAt": "2024-01-29T14:29:36.965Z",
	"updatedAt": "2024-01-29T14:30:16.499Z"
}

{
	"id": 20,
	"userId": 1,
	"isActive": true,
	"expirationDate": "2024-03-26T14:30:32.449Z",
	"balance": 75,
	"createdAt": "2024-01-29T14:29:36.965Z",
	"updatedAt": "2024-01-29T14:30:32.452Z"
}

*/
