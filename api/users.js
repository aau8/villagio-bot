import $db from "../src/db/index.js"

const methods = {}

methods.get = async (req, res) => {
	const users = await $db.users.getAll()
	res.json(users)
}

const projects = async (req, res) => {
	if (req.method === 'GET') methods.get(req, res)
}

export default projects