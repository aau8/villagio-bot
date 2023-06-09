import { capitalize, isCommand, isPhone } from "../../../../helpers.js"
import { CONSULT_APPLIC_URL } from "../../../../config.js"
import anotherQuest from "./composers/anotherQuest.js"
import quiz from "./quiz.js"
import selectQuest from "./composers/selectQuest.js"
import $db from "../../../../db/index.js"
import $screen from "../../../index.js"
import { ObjectId } from "mongodb"
import { Scenes } from "telegraf"
import axios from "axios"
import { config as dotenvConfig } from "dotenv"

dotenvConfig()

const isDev = process.env.DEV

const scene = new Scenes.WizardScene(
	quiz.name,
	// Старт сцены
	async ctx => {
		const questDefault = ctx.scene.session.state.quest

		/**
		 * Если в начальном состоянии уже есть вопрос, то будет выполнена проверка на категорию вопроса, после чего будет составлен вопрос в правильном формате.
		 * После чего, будет открыт экран с выбором способа связи.
		 */
		if (questDefault) {
			if (questDefault.includes('project_id_update')) {
				const project = await $db.projects.get(Number(questDefault.replace('project_id_update=', '')))
				ctx.scene.session.state.quest = `Изменение информации у проекта ${project.name} - /id_${project.project_id}`
			}
			else if (questDefault.includes('project_id')) {
				ctx.scene.session.state.quest = [ Number(questDefault.replace('project_id=', '')) ]
			}
			else if (questDefault.includes('sr')) {
				const result = await $db.selectionResults.get({ _id: ObjectId(questDefault.replace('sr=', '')) })
				ctx.scene.session.state.quest = result.projects
			}

			await quiz.open("commun", ctx)
			return ctx.wizard.selectStep(3)
		}
		else {
			await quiz.open("start", ctx)
			return ctx.wizard.next();
		}
	},
	// Выбор вопроса
	selectQuest,
	// Ввод своего (другого) вопроса
	anotherQuest,
	// Ввод номера телефона
	async ctx => {
		// Если было отправлено текстовое сообщение, будет отправлен экран с вопросом о продолжении прохождения квиза.
		if (ctx?.message?.text) {
			await quiz.open("stop", ctx, 2)
			return
		}

		if (ctx.update.callback_query.data === 'back') {
			ctx.scene.session.state = {}
			await quiz.open("start", ctx)
			return ctx.wizard.selectStep(1)
		}

		ctx.scene.session.state.commun = ctx.update.callback_query.data

		const user = await $db.users.get({ tg_id: ctx.from.id })

		if (user.phone) {
			ctx.scene.session.state.phone = user.phone
		}
		if (user.first_name) {
			ctx.scene.session.state.name = `${user.first_name} ${user.last_name || ''}`.trim()
		}

		await quiz.open("phone", ctx)
		return ctx.wizard.next();
	},
	// Ввод имени
	async ctx => {
		if (ctx.update?.callback_query?.data === 'back') {
			await quiz.open("commun", ctx)
			return ctx.wizard.back()
		}

		let phone
		if (ctx.updateType === 'callback_query') {
			phone = ctx.callbackQuery.data
		}
		else if (ctx.updateType === 'message') {
			phone = ctx.message.text
		}

		if (isCommand(phone)) {
			await quiz.open("stop", ctx, 3)
		}
		else if (!isPhone(phone)) {
			await quiz.open("phone_error", ctx)
		}
		else {
			await $db.users.update({ tg_id: ctx.from.id }, { phone })
			ctx.scene.session.state.phone = phone

			await quiz.open("name", ctx)
			return ctx.wizard.next();
		}
	},
	// Отправка заявки
	async ctx => {
		if (ctx.update?.callback_query?.data === 'back') {
			// ctx.scene.session.state = {}
			await quiz.open("phone", ctx)
			return ctx.wizard.back()
		}

		let name
		if (ctx.updateType === 'callback_query') {
			name = ctx.callbackQuery.data
		}
		else if (ctx.updateType === 'message') {
			name = ctx.message.text
		}

		if (isCommand(name)) {
			await quiz.open("stop", ctx, 4)
		}
		else {
			ctx.scene.session.state.name = capitalize(name)
			ctx.scene.session.state.timestamp = new Date().toISOString()

			const state = ctx.scene.session.state


			if (!isDev) {
				await axios.post(
					CONSULT_APPLIC_URL,
					{
						name: "Обратный звонок (Bot Telegram)",
						key: "modal",
						content: "Форма обратного звонка",
						fields: [
							{
								"type": "contacts",
								"key": "name",
								"name": "Имя",
								"value": state.name
							},
							{
								"type": "contacts",
								"key": "phone",
								"name": "Телефон",
								"value": state.phone
							},
							{
								"type": "contacts",
								"key": `cm_${state.commun}`,
								"name": "Способ связи",
								"value": state.commun === "phone" ? "телефон" : state.commun
							}
						]
					},
					{
						headers: {
							"X-Villagio-Forms-Client-Key": "682492df-f6ec-41ea-8b98-d7028a4a07c5"
						}
					}
				)
			}

			console.log('Заявка отправлена!')


			await $db.consults.add(ctx.scene.session.state)
			await quiz.open("end", ctx)
			await ctx.scene.leave()
		}
	},
)

scene.action('resume', async ctx => {
	await quiz.open(quiz.current, ctx)
})

scene.action(/^stop:/, async ctx => {
	const command = ctx.match.input.replace('stop:', '').replace('/', '')

	if ($screen.public[command]) {
		$screen.public[command](ctx)
	}
	else {
		$screen.public.start(ctx)
	}

	return await ctx.scene.leave();
})

export default scene