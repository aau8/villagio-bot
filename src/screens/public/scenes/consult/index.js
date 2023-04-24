import { Scenes } from "telegraf"
import { $consult } from "../../../../contexts/ConsultContext.js"
import $screen from "../../../index.js"
import { goScreen, scr } from "./config.js"
import selectQuest from "./selectQuest.js"
import $db from "../../../../db/index.js"
import anotherQuest from "./anotherQuest.js"
import { isPhone, isCommand } from "../../../../helpers/masks.js"
import customName from "../../../../helpers/customName.js"
import { ObjectId } from "mongodb"
import { $user } from "../../../../contexts/UserContext.js"

const scene = new Scenes.WizardScene(
	"consult",
	async ctx => {
		if ($consult.quest) {
			if ($consult.quest.includes('project_id_update')) {
				console.log('project_id_update')
				const project = await $db.projects.get(Number($consult.quest.replace('project_id_update=', '')))
				ctx.scene.session.state.quest = `Изменение информации у проекта ${project.name} - /id_${project.project_id}`
			}
			else if ($consult.quest.includes('project_id')) {
				ctx.scene.session.state.quest = [ Number($consult.quest.replace('project_id=', '')) ]
			}
			else if ($consult.quest.includes('sr')) {
				const result = await $db.selectionResults.get({ _id: ObjectId($consult.quest.replace('sr=', '')) })
				// console.log('result', result)
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
	selectQuest,
	anotherQuest,
	async ctx => {

		if (ctx?.message?.text) {
			await goScreen('stop', ctx)
		}
		else {
			ctx.scene.session.state.commun = ctx.update.callback_query.data.replace('commun:', '')
			const user = await $db.users.get({ tg_id: ctx.from.id })

			if (user.phone) {
				ctx.scene.session.state.phone = user.phone
			}
			if (user.first_name) {
				ctx.scene.session.state.name = user.first_name
			}
			// else {
			// }
			await goScreen('phone', ctx)
			return ctx.wizard.next();
		}
	},
	async ctx => {
		// // console.log('phone', ctx)
		// if (ctx?.update?.callback_query?.data.includes('phone:')) {
		// 	console.log('ok')
		// }
		// else {
		// }
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
			// ctx.scene.session.state.name = phone
			await goScreen('name', ctx)
			return ctx.wizard.next();
		}
	},
	async ctx => {
		const name = ctx.message.text

		if (isCommand(name)) {
			await goScreen('stop', ctx)
		}
		else {
			ctx.scene.session.state.name = customName(name)
			ctx.scene.session.state.timestamp = new Date().toISOString()
			const senderMsg = await goScreen('sender', ctx)

			// TODO: Сделать отправку заявок на сервер
			await $db.test.resolve() // Таймер на 1000ms

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