import $bot from "../src/bot.js"
import $db from "../src/db/index.js"
import { config as dotenvConfig } from "dotenv"
import Logger from "./helpers/Logger.js"
import getParseDescr from "./helpers/getParseDescr.js"

dotenvConfig()

const methods = {}

methods.get = async (req, res) => {
	const query = req.query
	const options = query

	if (query.project_id) options.project_id = Number(query.project_id)
	if (query?.price?.min) options.price.min = Number(query?.price?.min)
	if (query?.price?.max) options.price.max = Number(query?.price?.max)
	if (query.type) options.type = query.type

	const projects = await $db.projects.getAll(options)
	res.json({ data: projects, total: projects.length })
}

methods.post = async (req, res, logger) => {

	if (!req.body.project_id) {
		logger.sendError(400, 'Не указан обязательный параметр project_id')
		return
	}

	const body = req.body
	const project = await $db.projects.get(body.project_id)
	const options = { project_id: body.project_id, price: {}, users: [] }

	if (project) {
		logger.sendError(400, `В базе данных уже есть проект с project_id ${body.project_id}`)
		return
	}

	if (body.name) options.name = body.name
	if (body.description) options.description = getParseDescr(body)
	if (body.city) options.city = body.city
	if (body.status) options.status = body.status
	if (body.url) options.url = body.url
	if (body?.price?.min) options.price.min = Number(body.price.min)
	if (body?.price?.max) options.price.max = Number(body.price.max)
	if (body.type) options.type = body.type
	if (body.images && typeof body.images === 'object' || body.images === null) {
		options.images = body.images
	}

	await $db.projects.add(options)
	.then(() => {
		logger.send(`Проект ${body.project_id} создан`)
	})
	.catch(err => {
		logger.sendError(500, 'Ошибка при создании проекта', err)
	})
}

methods.patch = async (req, res, logger) => {

	if (!req.body.project_id) {
		logger.sendError(400, 'Не указан обязательный параметр project_id')
		return
	}

	const body = req.body
	const notifyUsers = body.notify
	const projectId = body.project_id
	const project = await $db.projects.get(projectId)
	const options = { price: {} }

	if (!project) {
		logger.sendError(400, 'Проект с переданным id не найден')
		return
	}

	// TODO: Укоротить приходящий текст до 2000 символов. Telegram не допускает текст в 1 сообщении больше 4096 символов
	if (body.name) options.name = body.name
	if (body.description) options.description = getParseDescr(body)
	if (body.city) options.city = body.city
	if (body.status) options.status = body.status
	if (body.url) options.url = body.url
	if (body?.price?.min) options.price.min = Number(body.price.min)
	if (body?.price?.max) options.price.max = Number(body.price.max)
	if (body.type) options.type = body.type
	if (body.images && typeof body.images === 'object' || body.images === null) {
		options.images = body.images
	}

	await $db.projects.update({ project_id: projectId }, options )
	.then(async () => {
		if (notifyUsers) {
			const users = project.users
			const text = `<b>🔔 Уведомление!</b>\n\nУ проекта <b>${body.name || project.name}</b> изменилась информация!`

			for (const userId of users) {
				const user = await $db.users.get({ tg_id: userId })

				if (user?.subscription) {
					await $bot.telegram.sendMessage(userId, text, {
						reply_markup: {
							inline_keyboard: [
								[ { text: "Посмотреть проект", callback_data: `id_${projectId}` } ],
								[ { text: "Узнать информацию у менеджера", callback_data: `quiz_consult:project_id_update=${projectId}` } ],
							]
						},
						parse_mode: "HTML"
					})

					logger.log(`Отправлено уведомление об обновлении проекта ${projectId}`)
				}
			}
		}

		logger.send(`Проект ${projectId} обновлен`)
	})
	.catch(err => {
		logger.sendError(500, 'Ошибка при обновлении проекта', err)
	})
}

methods.delete = async (req, res, logger) => {

	if (!req.query.project_id) {
		logger.send('Не указан обязательный параметр project_id')
	}
	const query = req.query
	const project = await $db.projects.get(Number(query.project_id))

	if (!project) {
		logger.sendError(400, 'Проект с переданным id не найден')
		return
	}

	await $db.projects.delete({ project_id: Number(query.project_id) })
	.then(() => {
		logger.send(`Проект ${query.project_id} удален`)
	})
	.catch(err => {
		logger.sendError(500, 'Ошибка при удалении проекта', err)
	})
}

const projects = async (req, res) => {
	const logger = new Logger(req, res)

	try {
		const token = req.headers.authorization

		if (!token) {
			logger.sendError(400, 'Не указан обязательный параметр "token"')
			return
		}
		else if (token.replace('Bearer', '').trim() !== process.env.API_TOKEN) {
			logger.sendError(401, 'Неправильный токен. Доступ закрыт')
			return
		}

		if (req.method === 'GET') {
			methods.get(req, res, logger)
			return
		}

		if (req.method === 'POST') {
			methods.post(req, res, logger)
			return
		}
		if (req.method === 'PATCH') {
			methods.patch(req, res, logger)
			return
		}
		if (req.method === 'DELETE') {
			methods.delete(req, res, logger)
			return
		}
	} catch(err) {
		logger.sendError(500, 'Ошибка сервера', err)
	}
}

export default projects