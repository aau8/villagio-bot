import { Scenes } from "telegraf"
import $db from "../../../db/index.js"
import createGrid from "../../../helpers/createGrid.js"
import send from "../../../helpers/send.js"
import { $i18n } from "../../../locales/index.js"
import $screen from "../../index.js"
import { projectPrefix } from "../project.js"

const screen3Checkboxes = {
	"Квартира": true,
	"Таунхаус": false,
	"Вилла": false,
}
const scene = Object.assign( new Scenes.BaseScene('quiz_select_project'), {
	name: 'QSP',
	data: {},
	screens: [
		(ctx) => {
			send(ctx, $i18n('scenes.qsp.1.text'), {
				reply_markup: {
					inline_keyboard: [
						[
							{ text: $i18n('scenes.qsp.1.kb.dubai'), callback_data: `${scene.name}:1:Дубай` },
							{ text: $i18n('scenes.qsp.1.kb.abudabi'), callback_data: `${scene.name}:1:Абу-Даби` },
						],
						// [
						// 	{ text: $i18n('kb.cancel'), callback_data: "/undo" }
						// ]
					],
				},
			})
		},
		(ctx) => {
			send(ctx, $i18n('scenes.qsp.2.text'), {
				reply_markup: {
					inline_keyboard: [
						[
							{ text: $i18n('scenes.qsp.2.kb.ready'), callback_data: `${scene.name}:2:Готовая` },
							{ text: $i18n('scenes.qsp.2.kb.build'), callback_data: `${scene.name}:2:Строящаяся` },
						],
						// [
						// 	{ text: $i18n('kb.cancel'), callback_data: "/undo" }
						// ]
					],
				},
			})
		},
		(ctx) => {
			const checked = [ ...Object.values(screen3Checkboxes) ]
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
						// [
						// 	{ text: $i18n('kb.cancel'), callback_data: "/undo" }
						// ]
					],
				},
			})
		},
		(ctx) => {
			send(ctx, $i18n('scenes.qsp.4.text'), {
				reply_markup: {
					inline_keyboard: [
						[ { text: $i18n('scenes.qsp.4.kb.1'), callback_data: `${scene.name}:4:<500` } ],
						[ { text: $i18n('scenes.qsp.4.kb.2'), callback_data: `${scene.name}:4:500-1000` } ],
						[ { text: $i18n('scenes.qsp.4.kb.3'), callback_data: `${scene.name}:4:1000-3000` } ],
						[ { text: $i18n('scenes.qsp.4.kb.4'), callback_data: `${scene.name}:4:>3000` } ],
						// [ { text: $i18n('kb.cancel'), callback_data: "/undo" } ]
					],
				},
			})
		}
	]
})

const goScreen = (num, ...args) => {
	scene.screens[num - 1](...args)
}

scene.enter(ctx => {
	goScreen(1, ctx)
})

scene.action(new RegExp(`^${scene.name}:1:`), async ctx => {
	const value = ctx.match.input.replace(ctx.match[0], '')

	scene.data.city = value
	goScreen(2, ctx)
})

scene.action(new RegExp(`^${scene.name}:2:`), async ctx => {
	const value = ctx.match.input.replace(ctx.match[0], '')

	scene.data.stage = value
	goScreen(3, ctx)
	// scene.screens[2](ctx, [ ...Object.values(screen3Checkboxes) ])
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
			goScreen(3, ctx)
			// scene.screens[2](ctx, [ ...Object.values(screen3Checkboxes) ])
		}
	}
	else {
		scene.data.type = Object.keys(screen3Checkboxes).join(', ')
		// scene.screens[3](ctx)
		goScreen(4, ctx)
	}
})

scene.action(new RegExp(`^${scene.name}:4:`), async ctx => {
	const value = ctx.match.input.replace(ctx.match[0], '')
	scene.data.price = value

	await send(ctx, $i18n('scenes.qsp.select_options'))

	const projects = await $db.project.get({
		city: scene.data.city
	})

	console.log('projects', projects)

	await send(ctx, $i18n('scenes.qsp.result.text', { value: projects.length }), {
		reply_markup: {
			inline_keyboard: [
				...createGrid([
					...projects.map((project, i) => {
						return { text: i + 1, callback_data: projectPrefix + project.project_id }
					})
				], 5),
				[ { text: $i18n('kb.consult'), callback_data: "consultation" } ],
				[ { text: $i18n('kb.menu'), callback_data: "start" } ],
			],
		},
	})
	ctx.scene.leave()
	// setTimeout(() => {
	// }, 1000)
})

scene.on("message", async ctx => {
	const answered = scene.screens.length - Object.keys(scene.data).length

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