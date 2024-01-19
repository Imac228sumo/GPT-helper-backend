import { Injectable, NotFoundException } from '@nestjs/common'
import { hash } from 'argon2'
import { AuthDto } from 'src/auth/dto/auth.dto'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	async getAllUsers() {
		return this.prisma.user.findMany({
			select: {
				name: true,
				email: true,
				id: true,
				password: false,
				isAdmin: true,
			},
		})
	}

	async getUserById(id: number) {
		const user = await this.prisma.user.findUnique({
			where: {
				id,
			},
		})
		if (!user) throw new NotFoundException('User not fount')
		return user
	}

	async getUserByEmail(email: string) {
		return this.prisma.user.findUnique({
			where: {
				email,
			},
		})
	}

	async createUser(dto: AuthDto) {
		// const users = await this.getAllUsers()

		const user = {
			// id: users.length + 1,
			email: dto.email,
			name: dto.email,
			password: await hash(dto.password),
		}

		return this.prisma.user.create({
			data: user,
		})
	}
}
