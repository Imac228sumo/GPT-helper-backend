import { Role } from '@prisma/client'
import {
	IsEmail,
	IsNumber,
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

	@MinLength(8, {
		message: 'Password cannot be less then 6 character!',
	})
	@IsString()
	@IsOptional()
	password?: string

	@IsString()
	@IsOptional()
	role?: Role

	@IsNumber()
	@IsOptional()
	referralCount?: number

	@IsString()
	@IsOptional()
	referralCode?: string
}

export class UpdatePasswordDto {
	@IsString()
	oldPassword?: string
	@MinLength(8, {
		message: 'Password cannot be less then 6 character!',
	})
	@IsString()
	newPassword: string
}
