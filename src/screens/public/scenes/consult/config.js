import { createGrid, send } from "../../../../helpers.js"
import { $i18n } from "../../../../locales/index.js"
import $db from "../../../../db/index.js"

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
				not_edit_message: true,
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
							{ text: $i18n('scenes.qc.commun.kb.phone'), callback_data: `commun:phone` },
							{ text: $i18n('scenes.qc.commun.kb.telegram'), callback_data: `commun:telegram` },
							{ text: $i18n('scenes.qc.commun.kb.whatsapp'), callback_data: `commun:whatsapp` },
						],
					],
				},
				not_edit_message: true,
			})
		},
		"phone": async (ctx) => {
			const phone = ctx.scene.session.state.phone

			return send(ctx, $i18n('scenes.qc.phone.text'), phone && {
				reply_markup: {
					keyboard: [
						[ { text: phone } ]
					],
					resize_keyboard: true,
					one_time_keyboard: true,
					selective: true,
					inline_keyboard: [ [] ]
				}
			})
		},
		// "phone_check": async (ctx) => {
		// 	return send(ctx, $i18n('scenes.qc.phone_check.text', { phone: ctx.scene.session.state.phone }), {
		// 		reply_markup: {
		// 			keyboard: [
		// 				[ { text: 'Hello' } ]
		// 			],
		// 			resize_keyboard: true,
		// 			one_time_keyboard: true,
		// 			inline_keyboard: []
		// 		}
		// 	})
		// },
		"phone_error": async (ctx) => {
			return send(ctx, $i18n('scenes.qc.phone_error.text'))
		},
		"name": async (ctx) => {
			return send(ctx, $i18n('scenes.qc.name.text'), {
				reply_markup: {
					keyboard: [
						[ { text: ctx.scene.session.state.name } ]
					],
					resize_keyboard: true,
					one_time_keyboard: true,
					selective: true,
					inline_keyboard: [ [] ]
				}
			})
		},
		"sender": async (ctx) => {
			return send(ctx, $i18n('scenes.qc.sender.text'), {
				reply_markup: {
					remove_keyboard: true,
					// keyboard: [
					// 	[ { text: ctx.scene.session.state.name } ]
					// ],
					// resize_keyboard: true,
					// one_time_keyboard: true,
					// selective: true,
					// inline_keyboard: [ [] ]
				}
			})
		},
		"end": async (ctx) => {
			const sessionQuests = ctx.scene.session.state.quest
			const state = ctx.scene.session.state
			let quest

			if (typeof sessionQuests === 'object') {
				const projects = await $db.projects.getAll({ $or: sessionQuests.map(id => ({ project_id: id })) })
				quest = '\n' + projects.map((project, index) => `${index + 1}. ${project.name} - /id_${project.project_id}`).join('\n') + '\n'
			}
			else {
				quest = state.quest
			}

			const msgOptions = {
				commun: $i18n(`scenes.qc.commun.kb.${state.commun}`),
				phone: state.phone,
				name: state.name,
				quest,
			}

			return send(ctx, $i18n('scenes.qc.end.text', msgOptions), {
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
