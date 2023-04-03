export const resolveTest = (time = 1000) => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve('true')
		}, time)
	})
}

export const rejectTest = (time = 1000) => {
	return new Promise((_, reject) => {
		setTimeout(() => {
			reject('false')
		}, time)
	})
}