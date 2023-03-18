import { Scenes } from "telegraf"
import send from "../../../helpers/send.js"
import { $i18n } from "../../../locales/index.js"
import sendStartPublic from "../start.js"

const scene = Object.assign( new Scenes.BaseScene('quiz_select_project'), {
	name: 'QSP',
	data: [],
})

scene.enter(ctx => {
	send(ctx, $i18n('scenes.qsp.1.text'), {
		reply_markup: {
			inline_keyboard: [
				[
					{ text: $i18n('scenes.qsp.1.kb.dubai'), callback_data: `${scene.name}:1:Дубай` },
					{ text: $i18n('scenes.qsp.1.kb.abudabi'), callback_data: `${scene.name}:1:Абу-Даби` },
				],
				[
					{ text: $i18n('kb.cancel'), callback_data: "/undo" }
				]
			],
		},
	})
})

scene.action(new RegExp(`^${scene.name}:1:`), async ctx => {
	const input = ctx.match.input
	const match = ctx.match[0]
	scene.data.push(input.replace(match, ''))

	send(ctx, $i18n('scenes.qsp.2.text'), {
		reply_markup: {
			inline_keyboard: [
				[
					{ text: $i18n('scenes.qsp.2.kb.ready'), callback_data: `${scene.name}:2:Готовая` },
					{ text: $i18n('scenes.qsp.2.kb.build'), callback_data: `${scene.name}:2:Строящаяся` },
				],
				[
					{ text: $i18n('kb.cancel'), callback_data: "/undo" }
				]
			],
		},
	})
})

scene.action(new RegExp(`^${scene.name}:2:`), async ctx => {
	const input = ctx.match.input
	const match = ctx.match[0]
	scene.data.push(input.replace(match, ''))

	send(ctx, $i18n('scenes.qsp.3.text'), {
		reply_markup: {
			inline_keyboard: [
				[
					{ text: `✅ ${$i18n('scenes.qsp.3.kb.apartment')}`, callback_data: `${scene.name}:3:Квартира` },
					{ text: `⛔ ${$i18n('scenes.qsp.3.kb.townhouse')}`, callback_data: `${scene.name}:3:Таунхаус` },
					{ text: `⛔ ${$i18n('scenes.qsp.3.kb.villa')}`, callback_data: `${scene.name}:3:Вилла` },
				],
				[
					{ text: $i18n('kb.continue'), callback_data: "/continue" }
				],
				[
					{ text: $i18n('kb.cancel'), callback_data: "/undo" }
				]
			],
		},
	})
})

scene.action(new RegExp(`^${scene.name}:3:`), async ctx => {
	const input = ctx.match.input
	const match = ctx.match[0]
	scene.data.push(input.replace(match, ''))
	// scene.screens['3'](ctx)
})

// level(3, (ctx) => {
// 	// scene.screens['4'](ctx)
// })

// level(4, (ctx) => {
// 	send(ctx, 'Подбираю варианты...')
// 	console.log(scene.data)
// })

// scene.action(new RegExp(`^${scene.name}:1:`), async ctx => {
// 	const input = ctx.match.input
// 	const match = ctx.match[0]
// 	scene.data.push(input.replace(match, ''))
// 	scene.screens['2'](ctx)
// })

// scene.action(new RegExp(`^${scene.name}:2:`), async ctx => {
// 	const input = ctx.match.input
// 	const match = ctx.match[0]
// 	scene.data.push(input.replace(match, ''))
// 	send(ctx, 'Подбираю варианты...')
// 	console.log(scene.data)
// })

scene.on("message", async ctx => {
	send(ctx, $i18n('kb.back'))
})

scene.action('/undo', async ctx => {
	ctx.scene.leave()
	sendStartPublic(ctx)
})

export default scene