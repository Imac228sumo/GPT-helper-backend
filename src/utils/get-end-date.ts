export const getEndDate = (months: number): Date => {
	return new Date(Date.now() + months * 30 * 24 * 60 * 60 * 1000)
}
