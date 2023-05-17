class Logger {
	constructor(req, res) {
		this.req = req
		this.res = res
	}

	log(text) {
		console.log(text)
	}

	sendReqData() {
		let data = {}

		if (Object.keys(this.req.query).length !== 0) {
			data.query = this.req.query
		}
		if (Object.keys(this.req.body).length !== 0) {
			data.body = this.req.body
		}
		if (Object.keys(data).length !== 0) {
			console.log("Приходящие данные", JSON.stringify(data))
		}
	}

	send(text) {
		console.log(text)
		this.sendReqData()
		this.res.send(text)
	}

	sendError(status, text, err) {

		console.warn(text, err ? err : '')
		this.sendReqData()
		this.res.status(status).send(text)
	}
}

export default Logger