import {
	IsBoolean,
	IsEmail,
	IsOptional,
	IsString,
	MinLength,
} from 'class-validator'

export class UserDto {
	@IsEmail()
	email: string

	@MinLength(6, {
		message: 'Password cannot be less then 6 character!',
	})
	@IsString()
	@IsOptional()
	password?: string

	@IsBoolean()
	@IsOptional()
	isAdmin?: boolean
}
