import quiz from "../quiz.js"
import { Composer } from "telegraf"

// Другой вопрос
const anotherQuest = new Composer()

anotherQuest.on('message', async ctx => {
	ctx.scene.session.state.quest = ctx.message.text.trim()

	await quiz.open("commun", ctx)
	return ctx.wizard.next()
})

anotherQuest.on("callback_query", async ctx => {
	if (ctx.update?.callback_query?.data === 'back') {
		await quiz.open("start", ctx)
		return ctx.wizard.selectStep(1)
	}
})

export default anotherQuest