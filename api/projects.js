import $db from "../src/db/index.js"
import * as dotenv from "dotenv"
import { isAuth } from "./helpers.js"
dotenv.config()

const methods = {}

methods.get = async (req, res) => {
	try {
		const query = req.query
		const options = query

		if (query.project_id) {
			options.project_id = Number(query.project_id)
		}
		if (query.price_min) {
			options.price.min = Number(query.price_min)
		}
		if (query.price_max) {
			options.price.max = Number(query.price_max)
		}

		const projects = await $db.projects.getAll(options)
		res.json({ data: projects, total: projects.length })
	} catch(err) {
		res.status(500).json('Internal Server Error')
	}
}

methods.post = async (req, res) => {
	const body = req.body
	if (!isAuth(req)) {
		res.status(401).send('Unauthorized')
		return
	}
	if (!body.project_id) {
		res.status(400).send('Не указан обязательный параметр project_id')
		return
	}

	const project = await $db.projects.get(body.project_id)

	if (project) {
		res.status(400).send('Проект уже существует')
		return
	}

	$db.projects.add(body)
	.then(data => {
		res.send(data)
	})
	.catch(err => {
		res.status(500).send('Ошибка при создании проекта')
		throw err
	})
}

methods.patch = async (req, res) => {
	const body = req.body

	if (!isAuth(req)) {
		res.status(401).send('Unauthorized')
		return
	}
	if (!body.project_id) {
		res.status(400).send('Не указан обязательный параметр project_id')
		return
	}

	const project = await $db.projects.get(body.project_id)
	const options = {
		price: {}
	}

	if (!project) {
		res.status(400).send('Проект с переданным id не найден')
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

	$db.projects.update({ project_id: body.project_id }, options )
	.then(data => {
		res.send(data)
	})
	.catch(err => {
		res.status(500).send('Ошибка при обновлении проекта')
		throw err
	})
}

methods.delete = async (req, res) => {
	const body = req.body
	if (!isAuth(req)) {
		res.status(401).send('Unauthorized')
		return
	}
	if (!body.project_id) {
		res.status(400).send('Не указан обязательный параметр project_id')
		return
	}

	const project = await $db.projects.get(body.project_id)

	if (!project) {
		res.status(400).send('Проект с переданным id не найден')
		return
	}

	$db.projects.delete({ project_id: body.project_id })
	.then(data => {
		res.send(data)
	})
	.catch(err => {
		res.status(500).send('Ошибка при удалении проекта')
		throw err
	})
}

const projects = async (req, res) => {
	if (req.method === 'GET') methods.get(req, res)
	if (req.method === 'POST') methods.post(req, res)
	if (req.method === 'PATCH') methods.patch(req, res)
	if (req.method === 'DELETE') methods.delete(req, res)
}

export default projects