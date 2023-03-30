import { Composer } from "telegraf"
import { $i18n } from "../../../../locales/index.js"
import { goScreen, parseCommand, quests, scr } from "./config.js"

const selectQuest = new Composer()

selectQuest.action('another_quest', async ctx => {
	console.log('another_quest')
	await goScreen('another_quest', ctx)
	return ctx.wizard.next()
})

selectQuest.action(/^quest_/, async ctx => {
	const command = parseCommand(ctx, 'quest_')

	scr.answers.quest = quests[command]
	await goScreen('commun', ctx)
	return ctx.wizard.selectStep(ctx.wizard.cursor + 2)
})

export default selectQuest