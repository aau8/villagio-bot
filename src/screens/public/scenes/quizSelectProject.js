import { Scenes } from "telegraf"
import createGrid from "../../../helpers/createGrid.js"
import send from "../../../helpers/send.js"
import { $i18n } from "../../../locales/index.js"
import sendStartPublic from "../start.js"

const scene = Object.assign( new Scenes.BaseScene('quiz_select_project'), {
	name: 'QSP',
	data: {},
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
	const value = ctx.match.input.replace(ctx.match[0], '')
	scene.data.city = value

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

const sendScreen3 = (ctx, checked) => {
	send(ctx, $i18n('scenes.qsp.3.text'), {
		reply_markup: {
			inline_keyboard: [
				[
					{ text: `${checked[0] ? '✅' : '⛔'} ${$i18n('scenes.qsp.3.kb.apartment')}`, callback_data: `${scene.name}:3:Квартира` },
					{ text: `${checked[1] ? '✅' : '⛔'} ${$i18n('scenes.qsp.3.kb.townhouse')}`, callback_data: `${scene.name}:3:Таунхаус` },
					{ text: `${checked[2] ? '✅' : '⛔'} ${$i18n('scenes.qsp.3.kb.villa')}`, callback_data: `${scene.name}:3:Вилла` },
				],
				[
					{ text: $i18n('kb.continue'), callback_data: `${scene.name}:3:continue` }
				],
				[
					{ text: $i18n('kb.cancel'), callback_data: "/undo" }
				]
			],
		},
	})
}
const screen3Checkboxes = {
	"Квартира": true,
	"Таунхаус": true,
	"Вилла": false,
}

scene.action(new RegExp(`^${scene.name}:2:`), async ctx => {
	const value = ctx.match.input.replace(ctx.match[0], '')
	scene.data.stage = value

	sendScreen3(ctx, [ ...Object.values(screen3Checkboxes) ])
})

scene.action(new RegExp(`^${scene.name}:3:`), async ctx => {
	const value = ctx.match.input.replace(ctx.match[0], '')

	// Если пользователь нажал на чекбокс, то его состояние поменяется, только если это не последний активный чекбокс
	if (value !== 'continue') {
		screen3Checkboxes[value] = !screen3Checkboxes[value]

		if (!Object.values(screen3Checkboxes).some(checked => checked)) {
			screen3Checkboxes[value] = !screen3Checkboxes[value]
		}
		else {
			sendScreen3(ctx, [ ...Object.values(screen3Checkboxes) ])
		}
	}
	else {
		scene.data.type = Object.keys(screen3Checkboxes).join(', ')
		send(ctx, $i18n('scenes.qsp.4.text'), {
			reply_markup: {
				inline_keyboard: [
					[ { text: $i18n('scenes.qsp.4.kb.1'), callback_data: `${scene.name}:4:<500` } ],
					[ { text: $i18n('scenes.qsp.4.kb.2'), callback_data: `${scene.name}:4:500-1000` } ],
					[ { text: $i18n('scenes.qsp.4.kb.3'), callback_data: `${scene.name}:4:1000-3000` } ],
					[ { text: $i18n('scenes.qsp.4.kb.4'), callback_data: `${scene.name}:4:>3000` } ],
					[ { text: $i18n('kb.cancel'), callback_data: "/undo" } ]
				],
			},
		})
	}
})

scene.action(new RegExp(`^${scene.name}:4:`), async ctx => {
	const value = ctx.match.input.replace(ctx.match[0], '')
	scene.data.price = value

	send(ctx, $i18n('scenes.qsp.selection'))
	console.log(scene.data)

	setTimeout(() => {

		send(ctx, $i18n('scenes.qsp.result.text'), {
			reply_markup: {
				inline_keyboard: [
					...createGrid([
						{ text: '1', callback_data: `PROJECT:1` },
						{ text: '2', callback_data: `PROJECT:2` },
						{ text: '3', callback_data: `PROJECT:3` },
						{ text: '4', callback_data: `PROJECT:4` },
						{ text: '5', callback_data: `PROJECT:4` },
					], 5),
					[ { text: $i18n('scenes.qsp.result.kb.consult'), callback_data: "consultation" } ],
					[ { text: $i18n('kb.menu'), callback_data: "start" } ],
				],
			},
		})
		ctx.scene.leave()
	}, 1000)
})

scene.on("message", async ctx => {
	send(ctx, $i18n('kb.back'))
})

scene.action('/undo', async ctx => {
	ctx.scene.leave()
	sendStartPublic(ctx)
})

export default scene