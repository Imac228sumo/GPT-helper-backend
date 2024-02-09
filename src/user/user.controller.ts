import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Put,
	Query,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { OpenaiChatService } from 'src/openai-chat/openai-chat.service'
import { IdValidationPipe } from 'src/pipes/id.validation.pipe'
import { CurrentUser } from './decorators/user.decorator'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserService } from './user.service'

@Controller('users')
export class UserController {
	constructor(
		private readonly userService: UserService,
		private openaiChatService: OpenaiChatService
	) {}

	// Authorized section
	@Auth()
	@Get('profile')
	async getProfile(@CurrentUser('id') id: number) {
		return this.userService.getUserById(id)
	}

	@Auth()
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put('profile')
	async updateProfile(
		@CurrentUser('id') id: number,
		@Body() dto: UpdateUserDto
	) {
		return this.userService.updateProfileById(id, dto)
	}

	@Auth()
	@Delete('profile')
	async deleteProfile(@CurrentUser('id') id: number) {
		return this.userService.deleteUser(id)
	}

	// Admin section
	@Get('count')
	@Auth('admin')
	async getCountUsers() {
		return this.userService.getCountUsers()
	}

	@Auth('admin')
	@Get()
	async getAllUsers(@Query('searchTerm') searchTerm?: string) {
		return this.userService.getAllUsers(searchTerm)
	}

	@Get(':id')
	@Auth('admin')
	async getUserById(@Param('id', IdValidationPipe) id: string) {
		return this.userService.getUserById(+id)
	}

	@Auth('admin')
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put(':_id')
	async updateUser(
		@CurrentUser('id') id: number,
		@Param('_id', IdValidationPipe) _id: string,
		@Body() dto: UpdateUserDto
	) {
		return this.userService.updateUserById(id, +_id, dto)
	}

	@Delete(':id')
	@HttpCode(200)
	@Auth('admin')
	async deleteUser(@Param('id', IdValidationPipe) id: string) {
		return this.userService.deleteUser(+id)
	}
}
