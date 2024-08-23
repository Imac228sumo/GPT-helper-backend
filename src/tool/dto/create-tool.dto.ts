import { IsString } from 'class-validator'

export class CreateToolDto {
	@IsString()
	title: string
	@IsString()
	subTitleToolsItem: string
	@IsString()
	subTitleChatsItem: string
	@IsString()
	model: string
	@IsString()
	about: string
	@IsString()
	subAbout: string
	@IsString()
	description: string
	@IsString()
	link: string
	@IsString()
	iconSmall: string
	@IsString()
	iconMedium: string
	@IsString()
	iconBig: string
	@IsString()
	iconSquare: string
}
