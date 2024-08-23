import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator'

export class AuthDto {
	@IsEmail()
	email: string

	@MinLength(2, {
		message: 'Password must be at least 2 characters long',
	})
	@IsOptional()
	@IsString()
	name?: string

	@MinLength(8, {
		message: 'Password must be at least 6 characters long',
	})
	@IsString()
	password: string
}
