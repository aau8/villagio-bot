import quiz from "../quiz.js"
import { Composer } from "telegraf"

// Другой вопрос
const anotherQuest = new Composer()

anotherQuest.on('message', async ctx => {
	ctx.scene.session.state.quest = ctx.message.text.trim()

	await quiz.open("commun", ctx)
	return ctx.wizard.next()
})

export default anotherQuest