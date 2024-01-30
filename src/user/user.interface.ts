import prisma from '@prisma/client'

//export interface IUser extends prisma.User {}
export interface IUser extends prisma.User {
	freeSubscription?: prisma.FreeSubscription
	standardSubscription?: prisma.StandardSubscription
}
