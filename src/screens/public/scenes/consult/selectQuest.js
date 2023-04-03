import { Composer } from "telegraf"
import { goScreen, parseCommand, quests } from "./config.js"

const selectQuest = new Composer()

selectQuest.action('another_quest', async ctx => {
	console.log('another_quest')
	await goScreen('another_quest', ctx)
	return ctx.wizard.next()
})

selectQuest.action(/^quest_/, async ctx => {
	const command = parseCommand(ctx, 'quest_')

	ctx.scene.session.state.quest = quests[command]
	await goScreen('commun', ctx)
	return ctx.wizard.selectStep(ctx.wizard.cursor + 2)
})

export default selectQuest