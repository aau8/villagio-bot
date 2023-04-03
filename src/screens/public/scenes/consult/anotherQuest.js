import { Composer } from "telegraf"
import { goScreen } from "./config.js"

// Другой вопрос
const anotherQuest = new Composer()

anotherQuest.on('message', async ctx => {
	ctx.scene.session.state.quest = ctx.message.text.trim()

	await goScreen('commun', ctx)
	return ctx.wizard.next()
})

export default anotherQuest