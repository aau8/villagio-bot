import $db from "../src/db/index.js"
import * as dotenv from "dotenv"
dotenv.config()

const methods = {}

methods.get = async (req, res) => {
	const query = req.query
	const options = query

	if (query.project_id) options.project_id = Number(query.project_id)
	if (query.price_min) options.price.min = Number(query.price_min)
	if (query.price_max) options.price.max = Number(query.price_max)
	if (query.type) options.type = query.type

	const projects = await $db.projects.getAll(options)
	res.json({ data: projects, total: projects.length })
}

methods.post = async (req, res) => {
	if (!req.body.project_id) {
		res.status(400).send('Не указан обязательный параметр project_id')
	}

	const body = req.body
	const project = await $db.projects.get(body.project_id)
	const options = { project_id: body.project_id, price: {} }

	if (project) {
		res.status(400).send(`В базе данных уже есть проект с project_id ${body.project_id}`)
		return
	}

	if (body.name) options.name = body.name
	if (body.description) options.description = body.description
	if (body.city) options.city = body.city
	if (body.status) options.status = body.status
	if (body.url) options.url = body.url
	if (body?.price?.min) options.price.min = Number(body.price.min)
	if (body?.price?.max) options.price.max = Number(body.price.max)
	if (body.type) options.type = body.type
	if (body.images && typeof body.images === 'object' || body.images === null) {
		options.images = body.images
	}

	$db.projects.add(options)
	.then(data => {
		console.log(data)
		res.send("ok")
	})
	.catch(err => {
		res.status(500).send('Ошибка при создании проекта')
		throw err
	})
}

methods.patch = async (req, res) => {
	if (!req.body.project_id) {
		res.status(400).send('Не указан обязательный параметр project_id')
	}

	const body = req.body
	const project = await $db.projects.get(body.project_id)
	const options = { price: {} }

	if (!project) {
		res.status(400).send('Проект с переданным id не найден')
	}

	if (body.name) options.name = body.name
	if (body.description) options.description = body.description
	if (body.city) options.city = body.city
	if (body.status) options.status = body.status
	if (body.url) options.url = body.url
	if (body?.price?.min) options.price.min = Number(body.price.min)
	if (body?.price?.max) options.price.max = Number(body.price.max)
	if (body.type) options.type = body.type
	if (body.images && typeof body.images === 'object' || body.images === null) {
		options.images = body.images
	}

	$db.projects.update({ project_id: body.project_id }, options )
	.then(async data => {
		console.log(data)
		res.send("ok")
	})
	.catch(err => {
		res.status(500).send('Ошибка при обновлении проекта')
		throw err
	})
}

methods.delete = async (req, res) => {
	if (!req.query.project_id) {
		res.status(400).send('Не указан обязательный параметр project_id')
	}
	const query = req.query
	const project = await $db.projects.get(Number(query.project_id))

	if (!project) {
		res.status(400).send('Проект с переданным id не найден')
	}

	$db.projects.delete({ project_id: Number(query.project_id) })
	.then(() => {
		res.statusCode = 200
		res.send("ok")
	})
	.catch(err => {
		res.status(500).send('Ошибка при удалении проекта')
		throw err
	})
}

const projects = async (req, res) => {
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

		if (req.method === 'GET') {
			methods.get(req, res)
			return
		}

		if (req.method === 'POST') {
			methods.post(req, res)
			return
		}
		if (req.method === 'PATCH') {
			methods.patch(req, res)
			return
		}
		if (req.method === 'DELETE') {
			methods.delete(req, res)
			return
		}
	} catch(err) {
		res.status(500).send('Internal Server Error')
		throw err
	}
}

export default projects