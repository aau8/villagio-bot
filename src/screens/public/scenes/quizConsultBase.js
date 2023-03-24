import { Markup, Scenes } from "telegraf"
// import { removeKeyboard } from "telegraf/typings/markup.js"
// import { keyboard } from "telegraf/typings/markup.js"
import { $consult } from "../../../contexts/ConsultContext.js"
import $db from "../../../db/index.js"
import createGrid from "../../../helpers/createGrid.js"
import send from "../../../helpers/send.js"
import { $i18n } from "../../../locales/index.js"
import $screen from "../../index.js"
import { projectPrefix } from "../project.js"

let anotherQuestNow = false
let phoneNow = false
let nameNow = false
const quests = {
	dubai: $i18n('scenes.qc.quests.dubai'),
	abudabi: $i18n('scenes.qc.quests.abudabi'),
	installment: $i18n('scenes.qc.quests.installment'),
	stages: $i18n('scenes.qc.quests.stages'),
}
const scene = Object.assign( new Scenes.BaseScene('consult'), {
	name: 'QC',
	data: {},
	screens: {
		"start": (ctx) => {
			send(ctx, $i18n('scenes.qc.start.text', { quests: Object.values(quests).map((quest, i) => `${i + 1}. ${quest}`).join('\n') }), {
				reply_markup: {
					inline_keyboard: [
						...createGrid([
							...Object.entries(quests).map((quest, i) => {
								return { text: i + 1, callback_data: `${scene.name}:start:${quest[0]}` }
							})
						], 5),
						[
							{ text: $i18n('scenes.qc.start.kb.another'), callback_data: `${scene.name}:another_quest` },
						],
						[
							{ text: $i18n('kb.menu'), callback_data: `stop:/start` },
						]
					],
				},
			})
		},
		"another_quest": (ctx) => {
			send(ctx, $i18n('scenes.qc.another_quest'))
		},
		"commun": (ctx) => {
			send(ctx, $i18n('scenes.qc.commun.text'), {
				reply_markup: {
					inline_keyboard: [
						[
							{ text: $i18n('scenes.qc.commun.kb.tg'), callback_data: `${scene.name}:commun:telegram` },
							{ text: $i18n('scenes.qc.commun.kb.call'), callback_data: `${scene.name}:commun:call` },
						],
					],
				},
			})
		},
		"phone": (ctx) => {
			send(ctx, $i18n('scenes.qc.phone.text'))
			// ctx.reply($i18n('scenes.qc.phone.text'), {
			// 	reply_markup: {
			// 		keyboard: [
			// 			[ { text: $i18n('scenes.qc.phone.kb.share') + 'fdd', request_contact: true } ]
			// 			// [
			// 			// 	{ text: $i18n('scenes.qc.phone.kb.share'), request_contact: true },
			// 			// ],
			// 		],
			// 	},
			// })

			// console.log(ctx.update.callback_query.message)
			// ctx.deleteMessage(ctx.update.callback_query.message)

			// ctx.reply($i18n('scenes.qc.phone.text'),
			// 	Markup.keyboard([
			// 		[ { text: $i18n('scenes.qc.phone.kb.share') + '111', request_contact: true } ]
			// 	])
			// 	.resize()

			// )

			// removeKeyboard()

			// Markup.keyboard([
			// 	[ { text: 'Hello' } ]
			// ])
		},
		"name": (ctx) => {
			send(ctx, $i18n('scenes.qc.name.text'))
		},
		"sender": async (ctx) => {
			return send(ctx, $i18n('scenes.qc.sender.text'))
		},
		"end": async (ctx) => {
			return send(ctx, $i18n('scenes.qc.end.text'), {
				reply_markup: {
					inline_keyboard: [
						[
							{ text: $i18n('kb.menu'), callback_data: `stop:/start` },
						],
					],
				},
			})
		},
	}
})

const goScreen = async (screen, ...args) => {
	return scene.screens[screen](...args)
}

scene.enter(ctx => {
	goScreen("start", ctx)
})

scene.action(new RegExp(`^${scene.name}:another_quest`), async ctx => {
	// Устанавливаем флаг, который говорит, что сейчас будет отправлен другой вопрос
	anotherQuestNow = true
	goScreen("another_quest", ctx)
})

// Ответ на вопрос "Укажите ваш вопрос"
scene.action(new RegExp(`^${scene.name}:start:`), async ctx => {
	const value = ctx.match.input.replace(ctx.match[0], '')

	scene.data.quest = $i18n(`scenes.qc.quests.${value}`, { lng: 'ru' })
	goScreen("commun", ctx)
})

// Ответ на вопрос "Выберите способ связи"
scene.action(new RegExp(`^${scene.name}:commun:`), async ctx => {
	const value = ctx.match.input.replace(ctx.match[0], '')

	scene.data.commun = value
	phoneNow = true
	goScreen("phone", ctx)
})

scene.on("message", async ctx => {

	// Если флаг указан, значит текущее сообщение, это "Другой вопрос"
	if (anotherQuestNow) {
		scene.data.quest = ctx.message.text
		anotherQuestNow = false
		goScreen("commun", ctx)
	}
	else if (phoneNow) {
		scene.data.phone = ctx.message.text
		phoneNow = false
		nameNow = true
		goScreen("name", ctx)

		// console.log(scene.data)
	}
	else if (nameNow) {
		scene.data.name = ctx.message.text
		nameNow = false

		// await goScreen("sender", ctx)
		// await scene.screens['sender'](ctx)
		const senderMsg = await goScreen('sender', ctx)

		setTimeout(async () => {
			console.log(senderMsg)
			ctx.deleteMessage(senderMsg.message_id)

			await goScreen("end", ctx)
		}, 1000)
		// console.log(scene.data)
	}
	else {
		const answered = Object.keys(scene.screens).length - Object.keys(scene.data).length

		send(ctx, $i18n('scenes.qsp.stop.text', { value: answered }), {
			reply_markup: {
				inline_keyboard: [
				[
					{ text: $i18n('scenes.qsp.stop.kb.yes'), callback_data: `stop:${ctx.message.text}` },
					{ text: $i18n('scenes.qsp.stop.kb.no'), callback_data: "resume" },
				],
				],
			},
		})
	}
})

scene.action('resume', ctx => {
	const questNum = Object.keys(scene.data).length + 1

	goScreen(questNum, ctx)
})

scene.action(/^stop:/, ctx => {
	const command = ctx.match.input.replace('stop:', '').replace('/', '')
	ctx.scene.leave()

	// Если среди комманд для отображения экранов есть та, которую отправил пользователь, то тогда будет открыт соответствующий экран
	if ($screen.public[command]) {
		$screen.public[command](ctx)
	}
	else {
		$screen.public.start(ctx)
	}
})

scene.action('/undo', async ctx => {
	ctx.scene.leave()
	$screen.public.start(ctx)
})

export default scene