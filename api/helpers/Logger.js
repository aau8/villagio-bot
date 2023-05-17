class Logger {
	constructor(req, res) {
		this.req = req
		this.res = res
	}

	log(text) {
		console.log(text)
	}

	getReqData() {
		let data = {}

		if (Object.keys(this.req.query).length !== 0) {
			data.query = this.req.query
		}
		if (Object.keys(this.req.body).length !== 0) {
			data.body = this.req.body
		}

		return data
	}

	send(text) {
		console.log(text, this.getReqData())
		this.res.send(text)
	}

	sendError(status, text, err) {
		console.warn(text, err ? err : '')
		console.log("Приходящие данные", this.getReqData())
		this.res.status(status).send(text)
	}
}

export default Logger