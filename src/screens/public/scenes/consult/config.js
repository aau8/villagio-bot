import createGrid from "../../../../helpers/createGrid.js"
import send from "../../../../helpers/send.js"
import { $i18n } from "../../../../locales/index.js"

export const quests = {
	dubai: $i18n('scenes.qc.quests.dubai'),
	abudabi: $i18n('scenes.qc.quests.abudabi'),
	installment: $i18n('scenes.qc.quests.installment'),
	stages: $i18n('scenes.qc.quests.stages'),
}
export let activeScreen
export const scr = {
	active: '',
	answers: {
		quest: null,
		commun: null,
		phone: null,
		name: null,
	},
	list: {
		"start": async (ctx) => {
			return send(ctx, $i18n('scenes.qc.start.text', { quests: Object.values(quests).map((quest, i) => `${i + 1}. ${quest}`).join('\n') }), {
				reply_markup: {
					inline_keyboard: [
						...createGrid([
							...Object.entries(quests).map((quest, i) => {
								// console.log('quest', quest)
								return { text: i + 1, callback_data: `quest_${quest[0]}` }
							})
						], 5),
						[
							{ text: $i18n('scenes.qc.start.kb.another'), callback_data: `another_quest` },
						],
						[
							{ text: $i18n('kb.menu'), callback_data: `stop:/start` },
						]
					],
				},
			})
		},
		"another_quest": async (ctx) => {
			return send(ctx, $i18n('scenes.qc.another_quest'))
		},
		"commun": async (ctx) => {
			return send(ctx, $i18n('scenes.qc.commun.text'), {
				reply_markup: {
					inline_keyboard: [
						[
							{ text: $i18n('scenes.qc.commun.kb.call'), callback_data: `commun:Звонок` },
							{ text: $i18n('scenes.qc.commun.kb.tg'), callback_data: `commun:Telegram` },
							{ text: $i18n('scenes.qc.commun.kb.whatsapp'), callback_data: `commun:WhatsApp` },
						],
					],
				},
			})
		},
		"phone": async (ctx) => {
			return send(ctx, $i18n('scenes.qc.phone.text'))
		},
		"name": async (ctx) => {
			return send(ctx, $i18n('scenes.qc.name.text'))
		},
		"sender": async (ctx) => {
			return send(ctx, $i18n('scenes.qc.sender.text'))
		},
		"end": async (ctx) => {
			return send(ctx, $i18n('scenes.qc.end.text', scr.answers), {
				reply_markup: {
					inline_keyboard: [
						[
							{ text: $i18n('kb.menu'), callback_data: `stop:/start` },
						],
					],
				},
			})
		},
		"stop": async (ctx) => {
			const answered = 4 - ctx.wizard.cursor + 1

			return send(ctx, $i18n('scenes.qsp.stop.text', { value: answered }), {
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
	}
}

export const goScreen = async (screen, ...args) => {
	scr.active = screen
	return scr.list[screen](...args)
}

export const parseCommand = (ctx, prefix) => ctx.match.input.replace(prefix, '').replace('/', '')
