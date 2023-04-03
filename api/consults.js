import $bot from "../src/bot.js"
import $db from "../src/db/index.js"
import * as dotenv from "dotenv"
dotenv.config()

const methods = {}

methods.get = async (req, res) => {
	const query = req.query

	res.send('ok')
}

const statistic = async (req, res) => {
	try {
		if (req.method === 'GET') {
			methods.get(req, res)
			return
		}
	} catch(err) {
		res.status(500).send('Internal Server Error')
		throw err
	}
}

export default statistic