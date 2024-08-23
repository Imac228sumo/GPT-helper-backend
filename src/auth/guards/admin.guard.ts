import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Role, User } from '@prisma/client'
import { IUser } from 'src/user/user.interface'

@Injectable()
export class OnlyAdminGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const request = context.switchToHttp().getRequest<{ user: IUser }>()
		const user = request.user as User

		if (user.role !== Role.ADMIN)
			throw new ForbiddenException('You have no rights!')

		return true
	}
}
