export function getInitials(name: string) {
	if (name) {
		const names = name.split(' ')
		if (names.length >= 2) {
			const initials =
				names[0].slice(0, 1).toUpperCase() + names[1].slice(0, 1).toUpperCase()
			return initials
		} else if (names.length === 1) {
			const initials = names[0].slice(0, 2).toUpperCase().toUpperCase()
			return initials
		} else {
			return null
		}
	} else {
		return null
	}
}
