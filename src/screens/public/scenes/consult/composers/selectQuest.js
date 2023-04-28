import { parseCommand } from "../../../../../helpers.js"
import quiz from "../quiz.js"
import { Composer } from "telegraf"

const selectQuest = new Composer()

selectQuest.action('another_quest', async ctx => {
	await quiz.open("another_quest", ctx)
	return ctx.wizard.next()
})

// Если был выбран заготовленный вопрос, то в сцене пропускается 2 шаг с вводом своего (другого) вопроса, а сразу открывается экран с выбором способа связи.
selectQuest.action(/^quest:/, async ctx => {
	const command = parseCommand(ctx.update.callback_query.data, 'quest:')

	ctx.scene.session.state.quest = quiz.data.quests[command]
	// await ctx.answerCbQuery()
	await quiz.open("commun", ctx)
	return await ctx.wizard.selectStep(ctx.wizard.cursor + 2)
})

export default selectQuest