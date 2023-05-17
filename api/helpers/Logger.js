class Logger {
	constructor(res) {
		this.res = res
	}

	done(text) {
		console.log(text)
		this.res.send(text)
	}

	error(status, text) {
		console.warn(text)
		this.res.status(status).send(text)
	}
}

export default Logger