import { Controller, Get } from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from './decorators/user.decorator'
import { UserService } from './user.service'

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Auth()
	@Get('profile')
	async getProfile(@CurrentUser('id') id: number) {
		return this.userService.getUserById(id)
	}

	@Auth('admin')
	@Get()
	async getAllUsers() {
		return this.userService.getAllUsers()
	}
}
