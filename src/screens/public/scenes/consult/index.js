import { Composer, Scenes } from "telegraf"
import { $consult } from "../../../../contexts/ConsultContext.js"
import $screen from "../../../index.js"
import { goScreen, scr } from "./config.js"
import selectQuest from "./selectQuest.js"
// import { projectPrefix } from "../../project.js"

// let anotherQuestNow = false
// let phoneNow = false
// let nameNow = false
// const quests = {
// 	dubai: $i18n('scenes.qc.quests.dubai'),
// 	abudabi: $i18n('scenes.qc.quests.abudabi'),
// 	installment: $i18n('scenes.qc.quests.installment'),
// 	stages: $i18n('scenes.qc.quests.stages'),
// }
// const screens = {
// 	"start": async (ctx) => {
// 		return send(ctx, $i18n('scenes.qc.start.text', { quests: Object.values(quests).map((quest, i) => `${i + 1}. ${quest}`).join('\n') }), {
// 			reply_markup: {
// 				inline_keyboard: [
// 					...createGrid([
// 						...Object.entries(quests).map((quest, i) => {
// 							// console.log('quest', quest)
// 							return { text: i + 1, callback_data: `quest_${quest[0]}` }
// 						})
// 					], 5),
// 					[
// 						{ text: $i18n('scenes.qc.start.kb.another'), callback_data: `another_quest` },
// 					],
// 					[
// 						{ text: $i18n('kb.menu'), callback_data: `stop:/start` },
// 					]
// 				],
// 			},
// 		})
// 	},
// 	"another_quest": async (ctx) => {
// 		return send(ctx, $i18n('scenes.qc.another_quest'))
// 	},
// 	"commun": async (ctx) => {
// 		return send(ctx, $i18n('scenes.qc.commun.text'), {
// 			reply_markup: {
// 				inline_keyboard: [
// 					[
// 						{ text: $i18n('scenes.qc.commun.kb.tg'), callback_data: `${scene.name}:commun:telegram` },
// 						{ text: $i18n('scenes.qc.commun.kb.call'), callback_data: `${scene.name}:commun:call` },
// 					],
// 				],
// 			},
// 		})
// 	},
// 	"phone": async (ctx) => {
// 		return send(ctx, $i18n('scenes.qc.phone.text'))
// 	},
// 	"name": async (ctx) => {
// 		return send(ctx, $i18n('scenes.qc.name.text'))
// 	},
// 	"sender": async (ctx) => {
// 		return send(ctx, $i18n('scenes.qc.sender.text'))
// 	},
// 	"end": async (ctx) => {
// 		return send(ctx, $i18n('scenes.qc.end.text'), {
// 			reply_markup: {
// 				inline_keyboard: [
// 					[
// 						{ text: $i18n('kb.menu'), callback_data: `/start` },
// 					],
// 				],
// 			},
// 		})
// 	},
// 	"stop": async (ctx) => {
// 		const answered = 4 - ctx.wizard.cursor + 1

// 		return send(ctx, $i18n('scenes.qsp.stop.text', { value: answered }), {
// 			reply_markup: {
// 				inline_keyboard: [
// 					[
// 						{ text: $i18n('scenes.qsp.stop.kb.yes'), callback_data: `stop:${ctx.message.text}` },
// 						{ text: $i18n('scenes.qsp.stop.kb.no'), callback_data: "resume" },
// 					],
// 				],
// 			},
// 		})
// 	}
// }

// const answerOne = new Composer()
const anotherQuest = new Composer()

const isStop = (ctx) => ctx.message.text.includes('stop:')
const stop = async (ctx) => ctx.scene.leave();
// const command = ctx.match.input.replace('stop:', '').replace('/', '')

// answerOne.action('another_quest', async ctx => {
// 	// console.log('ctx', ctx)
// 	// await send(ctx, $i18n('scenes.qc.another_quest'))
// 	await goScreen('another_quest', ctx)
// 	return ctx.wizard.next()
// })

// answerOne.action(/^quest_/, async ctx => {
// 	const command = parseCommand(ctx, 'quest_')

// 	await goScreen('commun', ctx)
// 	return ctx.wizard.selectStep(ctx.wizard.cursor + 2)
// })

// answerOne.action(/^stop:/, async ctx => {
// 	const command = ctx.match.input.replace('stop:', '').replace('/', '')

// 	if ($screen.public[command]) {
// 		$screen.public[command](ctx)
// 	}
// 	else {
// 		$screen.public.start(ctx)
// 	}

// 	return await ctx.scene.leave();
// })


anotherQuest.on('message', async ctx => {
	scr.answers.quest = ctx.message.text
	await goScreen('commun', ctx)
	return ctx.wizard.next()
})

// let sceneList = [
// 	async ctx => {
// 		console.log('consult start')
// 		await goScreen('start', ctx)
// 		return ctx.wizard.next();
// 	},
// 	selectQuest,
// 	anotherQuest,
// 	async ctx => {
// 		await goScreen('phone', ctx)
// 		return ctx.wizard.next();
// 	},
// 	async ctx => {
// 		await goScreen('name', ctx)
// 		return ctx.wizard.next();
// 	},
// 	async ctx => {
// 		const senderMsg = await goScreen('sender', ctx)

// 		setTimeout(async () => {
// 			ctx.deleteMessage(senderMsg.message_id)

// 			await goScreen("end", ctx)
// 		}, 1000)
// 	},
// ]


const scene = new Scenes.WizardScene(
	"consult",
	async ctx => {
		if ($consult.quest) {
			const quest = JSON.parse($consult.quest)
			// console.log(quest, typeof quest)
			// console.log($consult.quest, typeof $consult.quest)
			// console.log(Object.is($consult.quest))
			if (typeof quest === 'object') {
				scr.answers.quest = quest.join(', ')
			}
			else {
				scr.answers.quest = $consult.quest
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
		scr.answers.commun = ctx.update.callback_query.data.replace('commun:', '')
		// console.log(answer)

		await goScreen('phone', ctx)
		return ctx.wizard.next();
	},
	async ctx => {
		scr.answers.phone = ctx.message.text
		await goScreen('name', ctx)
		return ctx.wizard.next();
	},
	async ctx => {
		scr.answers.name = ctx.message.text
		const senderMsg = await goScreen('sender', ctx)

		setTimeout(async () => {
			ctx.deleteMessage(senderMsg.message_id)

			console.log(scr.answers)
			await goScreen("end", ctx)
		}, 1000)
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