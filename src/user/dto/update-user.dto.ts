import {
	IsBoolean,
	IsEmail,
	IsOptional,
	IsString,
	MinLength,
} from 'class-validator'

export class UpdateUserDto {
	@IsEmail()
	email: string

	@MinLength(2, {
		message: 'Name cannot be less then 2 character!',
	})
	@IsString()
	@IsOptional()
	name?: string

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
