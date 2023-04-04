import $db from "../../../../db/index.js"
import createGrid from "../../../../helpers/createGrid.js"
import send from "../../../../helpers/send.js"
import { $i18n } from "../../../../locales/index.js"

export const quests = {
	dubai: $i18n('scenes.qc.quests.dubai'),
	abudabi: $i18n('scenes.qc.quests.abudabi'),
	installment: $i18n('scenes.qc.quests.installment'),
	stages: $i18n('scenes.qc.quests.stages'),
}

export const scr = {
	active: null,
	answers: 4,
	list: {
		"start": async (ctx) => {
			return send(ctx, $i18n('scenes.qc.start.text', { quests: Object.values(quests).map((quest, i) => `${i + 1}. ${quest}`).join('\n') }), {
				reply_markup: {
					inline_keyboard: [
						...createGrid([
							...Object.entries(quests).map((quest, i) => {
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
		"phone_error": async (ctx) => {
			return send(ctx, $i18n('scenes.qc.phone_error.text'))
		},
		"name": async (ctx) => {
			return send(ctx, $i18n('scenes.qc.name.text'))
		},
		"sender": async (ctx) => {
			return send(ctx, $i18n('scenes.qc.sender.text'))
		},
		"end": async (ctx) => {
			const sessionQuests = ctx.scene.session.state.quest
			// const sqJSON = JSON.parse(sessionQuests)
			let quest

			console.log(sessionQuests)
			if (typeof sessionQuests === 'object') {
				const projects = await $db.projects.getAll({ $or: sessionQuests.map(id => ({ project_id: id })) })
				quest = '\n' + projects.map((project, index) => `${index + 1}. ${project.name} - /id_${project.project_id}`).join('\n') + '\n'
			}
			else {
				quest = ctx.scene.session.state.quest
			}
			// console.log('sessionQuests', sessionQuests)

			return send(ctx, $i18n('scenes.qc.end.text', { ...ctx.scene.session.state, quest }), {
				reply_markup: {
					inline_keyboard: [
						[
							{ text: $i18n('kb.menu'), callback_data: `start:not_edit_message` },
						],
					],
				},
			})
		},
		"stop": async (ctx) => {
			const answered = 4 - Object.keys(ctx.scene.session.state).length

			return send(ctx, $i18n('scenes.qsp.stop.text', { value: answered }), {
				reply_markup: {
					inline_keyboard: [
						[
							{ text: $i18n('scenes.qsp.stop.kb.yes'), callback_data: `stop:${ctx?.message?.text}` },
							{ text: $i18n('scenes.qsp.stop.kb.no'), callback_data: "resume" },
						],
					],
				},
			})
		}
	}
}

export const goScreen = async (screen, ...args) => {
	if (screen !== 'stop') {
		scr.active = screen
	}
	return scr.list[screen](...args)
}

export const parseCommand = (ctx, prefix) => ctx.match.input.replace(prefix, '').replace('/', '')
