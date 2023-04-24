import { capitalize, isCommand, isPhone } from "../../../../helpers.js"
import { CONSULT_APPLIC_URL } from "../../../../config.js"
import anotherQuest from "./anotherQuest.js"
import { goScreen, scr } from "./config.js"
import selectQuest from "./selectQuest.js"
import $db from "../../../../db/index.js"
import $screen from "../../../index.js"
import { ObjectId } from "mongodb"
import { Scenes } from "telegraf"
import axios from "axios"

const scene = new Scenes.WizardScene(
	"consult",
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

			await goScreen('commun', ctx)
			return ctx.wizard.selectStep(3)
		}
		else {
			await goScreen('start', ctx)
			return ctx.wizard.next();
		}
	},
	// Выбор вопроса
	selectQuest,
	// Ввод своего (другого) вопроса
	anotherQuest,
	// Ввод номера телефона
	async ctx => {
		console.log('phone step start')
		// Если было отправлено текстовое сообщение, будет отправлен экран с вопросом о продолжении прохождения квиза.
		if (ctx?.message?.text) {
			await goScreen('stop', ctx)
			return
		}

		ctx.scene.session.state.commun = ctx.update.callback_query.data.replace('commun:', '')

		console.log('users get start')
		const user = await $db.users.get({ tg_id: ctx.from.id })
		console.log('users get end')

		if (user.phone) {
			ctx.scene.session.state.phone = user.phone
		}
		if (user.first_name) {
			ctx.scene.session.state.name = `${user.first_name} ${user.last_name || ''}`.trim()
		}

		console.log('phone start')
		await goScreen('phone', ctx)
		console.log('phone end')
		return ctx.wizard.next();
	},
	// Ввод имени
	async ctx => {
		const phone = ctx.message.text

		if (isCommand(phone)) {
			await goScreen('stop', ctx)
		}
		else if (!isPhone(phone)) {
			await goScreen('phone_error', ctx)
		}
		else {
			await $db.users.update({ tg_id: ctx.from.id }, { phone })
			ctx.scene.session.state.phone = phone

			await goScreen('name', ctx)
			return ctx.wizard.next();
		}
	},
	// Отправка заявки
	async ctx => {
		const name = ctx.message.text

		if (isCommand(name)) {
			await goScreen('stop', ctx)
		}
		else {
			ctx.scene.session.state.name = capitalize(name)
			ctx.scene.session.state.timestamp = new Date().toISOString()
			const senderMsg = await goScreen('sender', ctx)
			const state = ctx.scene.session.state

			console.log('Заявка отправлена!')
			// console.log('state', ctx.scene.session.state)
			// console.log('data', {
			// 	name: "Обратный звонок (Bot Telegram)",
			// 	key: "modal",
			// 	content: "Форма обратного звонка",
			// 	fields: [
			// 		{
			// 			"type": "contacts",
			// 			"key": "name",
			// 			"name": "Имя",
			// 			"value": state.name
			// 		},
			// 		{
			// 			"type": "contacts",
			// 			"key": "phone",
			// 			"name": "Телефон",
			// 			"value": state.phone
			// 		},
			// 		{
			// 			"type": "contacts",
			// 			"key": `cm_${state.commun}`,
			// 			"name": "Способ связи",
			// 			"value": state.commun === "phone" ? "телефон" : state.commun
			// 		}
			// 	]
			// })

			// await axios.post(
			// 	CONSULT_APPLIC_URL,
			// 	{
			// 		name: "Обратный звонок (Bot Telegram)",
			// 		key: "modal",
			// 		content: "Форма обратного звонка",
			// 		fields: [
			// 			{
			// 				"type": "contacts",
			// 				"key": "name",
			// 				"name": "Имя",
			// 				"value": state.name
			// 			},
			// 			{
			// 				"type": "contacts",
			// 				"key": "phone",
			// 				"name": "Телефон",
			// 				"value": state.phone
			// 			},
			// 			{
			// 				"type": "contacts",
			// 				"key": `cm_${state.commun}`,
			// 				"name": "Способ связи",
			// 				"value": state.commun === "phone" ? "телефон" : state.commun
			// 			}
			// 		]
			// 	},
			// 	{
			// 		headers: {
			// 			"X-Villagio-Forms-Client-Key": "682492df-f6ec-41ea-8b98-d7028a4a07c5"
			// 		}
			// 	}
			// )

			await $db.consults.add(ctx.scene.session.state)
			await goScreen("end", ctx)
			await ctx.deleteMessage(senderMsg.message_id)
			await ctx.scene.leave()
		}
	},
)

scene.action('resume', async ctx => {
	goScreen(scr.active, ctx)
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