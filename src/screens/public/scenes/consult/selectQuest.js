import { Composer } from "telegraf"
import { goScreen, parseCommand } from "./config.js"

const selectQuest = new Composer()

selectQuest.action('another_quest', async ctx => {
	await goScreen('another_quest', ctx)
	return ctx.wizard.next()
})

selectQuest.action(/^quest_/, async ctx => {
	const command = parseCommand(ctx, 'quest_')

	await goScreen('commun', ctx)
	return ctx.wizard.selectStep(ctx.wizard.cursor + 2)
})

export default selectQuest