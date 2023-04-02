import $db from "../src/db/index.js"

const methods = {}

methods.get = async (req, res) => {
	const users = await $db.users.getAll()
	res.json(users)
}

const users = async (req, res) => {
	try {
		const token = req.headers.authorization

		if (!token) {
			res.status(400).send('Не указан обязательный параметр "token"')
			return
		}
		else if (token.replace('Bearer', '').trim() !== process.env.API_TOKEN) {
			res.status(401).send('Неправильный токен. Доступ закрыт')
			return
		}

		if (req.method === 'GET') methods.get(req, res)
	} catch(err) {
		res.status(500).send('Internal Server Error')
		throw err
	}
}

export default users