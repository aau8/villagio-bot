import { createGrid, send } from "../../../../helpers.js"
import { $i18n } from "../../../../locales/index.js"
import Quiz from "../Quiz.js"

export default new Quiz("quiz_select_projects", {
	answers: 4,
	data: (ctx) => {
		// return {
		// 	types: [
		// 		{ state: true, text: $i18n(ctx, 'scenes.qsp.type.kb.apartment'), callback_data: "апартаменты" },
		// 		{ state: false, text: $i18n(ctx, 'scenes.qsp.type.kb.townhouse'), callback_data: "таунхаус" },
		// 		{ state: false, text: $i18n(ctx, 'scenes.qsp.type.kb.villa'), callback_data: "вилла" },
		// 	]
		// }
	},
	screens: (quiz) => {
		return {
			"city": async (ctx) => {
				return await send(ctx, $i18n(ctx, 'scenes.qsp.city.text'), {
					reply_markup: {
						inline_keyboard: [
							[
								{ text: $i18n(ctx, 'scenes.qsp.city.kb.dubai'), callback_data: `Дубай` },
								{ text: $i18n(ctx, 'scenes.qsp.city.kb.abudabi'), callback_data: `Абу-Даби` },
							],
						],
					},
				})
			},
			"status": async (ctx) => {
				return await send(ctx, $i18n(ctx, 'scenes.qsp.status.text'), {
					reply_markup: {
						inline_keyboard: [
							[
								{ text: $i18n(ctx, 'scenes.qsp.status.kb.ready'), callback_data: `Готовый` },
								{ text: $i18n(ctx, 'scenes.qsp.status.kb.build'), callback_data: `Строится` },
							],
						],
					},
				})
			},
			"type": async (ctx) => {
				return await send(ctx, $i18n(ctx, 'scenes.qsp.type.text'), {
					reply_markup: {
						inline_keyboard: [
							...createGrid(ctx.scene.session.state.types.map(type => {
								return {
									text: `${type.state ? '✅' : '🗆'} ${type.text}`,
									callback_data: type.callback_data,
								}
							}), 3),
							[
								{ text: $i18n(ctx, 'kb.continue'), callback_data: `continue` }
							],
						],
					},
				})
			},
			"price": async (ctx) => {
				return await send(ctx, $i18n(ctx, 'scenes.qsp.price.text'), {
					reply_markup: {
						inline_keyboard: [
							[ { text: $i18n(ctx, 'scenes.qsp.price.kb.1'), callback_data: `<500000` } ],
							[ { text: $i18n(ctx, 'scenes.qsp.price.kb.2'), callback_data: `500000-1000000` } ],
							[ { text: $i18n(ctx, 'scenes.qsp.price.kb.3'), callback_data: `1000000-3000000` } ],
							[ { text: $i18n(ctx, 'scenes.qsp.price.kb.4'), callback_data: `>3000000` } ],
						],
					},
				})
			},
			"result": async (ctx, projects, insertedId) => {
				return await send(ctx, $i18n(ctx, 'scenes.qsp.result.text', { value: projects.length, list: projects.map((project, index) => `${index + 1}. ${project.name} - /id_${project.project_id}`).join('\n') }), {
					reply_markup: {
						inline_keyboard: [
							[ { text: $i18n(ctx, 'kb.consult'), callback_data: `quiz_consult:sr=${insertedId}` } ],
							[ { text: $i18n(ctx, 'kb.menu'), callback_data: "start" } ],
						],
					},
				})
			},
			"not_result": async (ctx) => {
				return await send(ctx, $i18n(ctx, 'scenes.qsp.result.empty'), {
					reply_markup: {
						inline_keyboard: [
							[ { text: $i18n(ctx, 'kb.project_selection'), callback_data: "quiz_select_projects" }, ],
							[ { text: $i18n(ctx, 'kb.consult'), callback_data: "quiz_consult" }, ],
							[ { text: $i18n(ctx, 'kb.menu'), callback_data: "start" } ],
						],
					},
				})
			},
			"stop": async (ctx, questNum) => {
				return await send(ctx, $i18n(ctx, 'scenes.qsp.stop.text', { value: quiz.answers - questNum + 1 }), {
					reply_markup: {
						inline_keyboard: [
							[
								{ text: $i18n(ctx, 'scenes.qsp.stop.kb.yes'), callback_data: `stop:${ctx.message.text}` },
								{ text: $i18n(ctx, 'scenes.qsp.stop.kb.no'), callback_data: "resume" },
							],
						],
					},
				})
			},
		}
	}
})