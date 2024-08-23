import { IsNumber, IsString, MinLength } from 'class-validator'

export class PasswordResetDto {
	@IsNumber()
	userId: number

	@MinLength(6, {
		message: 'Password cannot be less then 6 character!',
	})
	@IsString()
	newPassword: string

	@IsString()
	resetToken: string
}
