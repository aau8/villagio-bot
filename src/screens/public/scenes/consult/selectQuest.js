import { parseCommand } from "../../../../helpers.js"
import { goScreen, quests } from "./config.js"
import { Composer } from "telegraf"

const selectQuest = new Composer()

selectQuest.action('another_quest', async ctx => {
	await goScreen('another_quest', ctx)
	return ctx.wizard.next()
})

// Если был выбран заготовленный вопрос, то в сцене пропускается 2 шаг с вводом своего (другого) вопроса, а сразу открывается экран с выбором способа связи.
selectQuest.action(/^quest_/, async ctx => {
	const command = parseCommand(ctx.match.input, 'quest_')

	ctx.scene.session.state.quest = quests[command]
	console.log('commun start')
	await goScreen('commun', ctx)
	console.log('commun end')
	return await ctx.wizard.selectStep(ctx.wizard.cursor + 2)
})

export default selectQuest