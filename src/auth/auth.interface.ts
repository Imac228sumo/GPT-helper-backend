export type TypeRole = 'admin' | 'user' | undefined

export interface ITokenUserData {
	id: number
	name: string
	email: string
	isAdmin: boolean
}
