class Logger {
	constructor(res) {
		this.res = res
	}

	log(text) {

	}

	send(text) {
		console.log(text)
		this.res.send(text)
	}

	sendError(status, text, err) {
		console.warn(text, err ? err : '')
		this.res.status(status).send(text)
	}
}

export default Logger