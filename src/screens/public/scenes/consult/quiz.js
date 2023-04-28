import { createGrid, send } from "../../../../helpers.js"
import { $i18n } from "../../../../locales/index.js"
import $db from "../../../../db/index.js"
import Quiz from "../Quiz.js"

export default new Quiz("quiz_consult", {
	answers: 4,
	data: {
		quests: {
			dubai: $i18n('scenes.qc.quests.dubai'),
			abudabi: $i18n('scenes.qc.quests.abudabi'),
			installment: $i18n('scenes.qc.quests.installment'),
			stages: $i18n('scenes.qc.quests.stages')
		}
	},
	screens: (quiz) => {
		return {
			"start": async (ctx) => {
				return send(ctx, $i18n('scenes.qc.start.text', { quests: Object.values(quiz.data.quests).map((quest, i) => `${i + 1}. ${quest}`).join('\n') }), {
					reply_markup: {
						inline_keyboard: [
							...createGrid([
								...Object.entries(quiz.data.quests).map((quest, i) => {
									return { text: i + 1, callback_data: `quest:${quest[0]}` }
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
								{ text: $i18n('scenes.qc.commun.kb.phone'), callback_data: `phone` },
								{ text: $i18n('scenes.qc.commun.kb.telegram'), callback_data: `telegram` },
								{ text: $i18n('scenes.qc.commun.kb.whatsapp'), callback_data: `whatsapp` },
							],
						],
					},
					// not_edit_message: true,
				})
			},
			"phone": async (ctx) => {
				const phone = ctx.scene.session.state.phone

				// await ctx.answerCbQuery()
				return send(ctx, $i18n('scenes.qc.phone.text'), phone && {
					reply_markup: {
						// inline_keyboard: [],
						// keyboard: [
						// 	[ { text: phone } ]
						// ],
						// resize_keyboard: true,
						// remove_keyboard: true,
						// selective: true,
						inline_keyboard: [[ { text: phone, callback_data: phone } ]]
					},
				})
			},
			"phone_error": async (ctx) => {
				const phone = ctx.scene.session.state.phone

				return send(ctx, $i18n('scenes.qc.phone_error.text'), phone && {
					reply_markup: {
						// inline_keyboard: [],
						// keyboard: [
						// 	[ { text: phone } ]
						// ],
						// resize_keyboard: true,
						// remove_keyboard: true,
						// selective: true,
						inline_keyboard: [[ { text: phone, callback_data: phone } ]]
					},
				})
			},
			"name": async (ctx) => {
				const name = ctx.scene.session.state.name

				return send(ctx, $i18n('scenes.qc.name.text'), {
					reply_markup: {
						// keyboard: [
						// 	[ { text: ctx.scene.session.state.name } ]
						// ],
						// resize_keyboard: true,
						// // one_time_keyboard: true,
						// remove_keyboard: true,
						// selective: true,
						// inline_keyboard: [ [] ]
						inline_keyboard: [[ { text: name, callback_data: name } ]]
					}
				})
			},
			"sender": async (ctx) => {
				return send(ctx, $i18n('scenes.qc.sender.text'), {
					reply_markup: {
						remove_keyboard: true,
					},
					not_edit_message: true,
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
					not_edit_message: true,
				})
			},
			"stop": async (ctx, questNum) => {
				// console.log("stop", quiz.current, questNum)
				return send(ctx, $i18n('scenes.qsp.stop.text', { value: quiz.answers - questNum + 1 }), {
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
})