import {
	IsEmail,
	IsNumber,
	IsOptional,
	IsString,
	MinLength,
} from 'class-validator'

export class CreateUserDto {
	@IsEmail()
	email: string

	@MinLength(2, {
		message: 'Password must be at least 2 characters long',
	})
	@IsOptional()
	@IsString()
	name?: string

	@MinLength(8, {
		message: 'Password must be at least 8 characters long',
	})
	@IsString()
	password: string

	@IsNumber()
	@IsOptional()
	referralCount?: number

	@IsString()
	@IsOptional()
	referralCode?: string
}
