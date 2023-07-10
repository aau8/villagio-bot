import { $i18n } from "../../../locales/index.js"
import { send } from "../../../helpers.js"
import $db from "../../../db/index.js"
import $screen from "../../index.js"
import { Scenes } from "telegraf"

const screen3Checkboxes = {
	"апартаменты": true,
	"таунхаус": false,
	"вилла": false,
}
const scene = Object.assign( new Scenes.BaseScene('quiz_select_projects'), {
	name: 'QSP',
	data: {},
	screens: [
		async (ctx) => {
			return await send(ctx, $i18n(ctx, 'scenes.qsp.city.text'), {
				reply_markup: {
					inline_keyboard: [
						[
							{ text: $i18n(ctx, 'scenes.qsp.city.kb.dubai'), callback_data: `${scene.name}:city:Дубай` },
							{ text: $i18n(ctx, 'scenes.qsp.city.kb.abudabi'), callback_data: `${scene.name}:city:Абу-Даби` },
							{ text: $i18n(ctx, 'scenes.qsp.city.kb.raselhajma'), callback_data: `${scene.name}:city:Рас-Эль-Хайма` },
							{ text: $i18n(ctx, 'scenes.qsp.city.kb.oae'), callback_data: `${scene.name}:city:ОАЭ` },
						],
					],
				},
			})
		},
		async (ctx) => {
			return await send(ctx, $i18n(ctx, 'scenes.qsp.status.text'), {
				reply_markup: {
					inline_keyboard: [
						[
							{ text: $i18n(ctx, 'scenes.qsp.status.kb.ready'), callback_data: `${scene.name}:status:Готовый` },
							{ text: $i18n(ctx, 'scenes.qsp.status.kb.build'), callback_data: `${scene.name}:status:Строится` },
						],
					],
				},
			})
		},
		async (ctx) => {
			const checked = [ ...Object.values(screen3Checkboxes) ]
			return await send(ctx, $i18n(ctx, 'scenes.qsp.type.text'), {
				reply_markup: {
					inline_keyboard: [
						[
							{ text: `${checked[0] ? '✅' : '🗆'} ${$i18n(ctx, 'scenes.qsp.type.kb.apartment')}`, callback_data: `${scene.name}:type:апартаменты` },
							{ text: `${checked[1] ? '✅' : '🗆'} ${$i18n(ctx, 'scenes.qsp.type.kb.townhouse')}`, callback_data: `${scene.name}:type:таунхаус` },
							{ text: `${checked[2] ? '✅' : '🗆'} ${$i18n(ctx, 'scenes.qsp.type.kb.villa')}`, callback_data: `${scene.name}:type:вилла` },
						],
						[
							{ text: $i18n(ctx, 'kb.continue'), callback_data: `${scene.name}:type:continue` }
						],
					],
				},
			})
		},
		async (ctx) => {
			return await send(ctx, $i18n(ctx, 'scenes.qsp.price.text'), {
				reply_markup: {
					inline_keyboard: [
						[ { text: $i18n(ctx, 'scenes.qsp.price.kb.1'), callback_data: `${scene.name}:price:<500000` } ],
						[ { text: $i18n(ctx, 'scenes.qsp.price.kb.2'), callback_data: `${scene.name}:price:500000-1000000` } ],
						[ { text: $i18n(ctx, 'scenes.qsp.price.kb.3'), callback_data: `${scene.name}:price:1000000-3000000` } ],
						[ { text: $i18n(ctx, 'scenes.qsp.price.kb.4'), callback_data: `${scene.name}:price:>3000000` } ],
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

scene.action(new RegExp(`^${scene.name}:city:`), async ctx => {
	const value = ctx.match.input.replace(ctx.match[0], '')

	ctx.scene.session.state.city = value
	goScreen(2, ctx)
})

scene.action(new RegExp(`^${scene.name}:status:`), async ctx => {
	const value = ctx.match.input.replace(ctx.match[0], '')

	ctx.scene.session.state.status = value
	goScreen(3, ctx)
})

scene.action(new RegExp(`^${scene.name}:type:`), async ctx => {
	const value = ctx.match.input.replace(ctx.match[0], '')

	// Если пользователь нажал на чекбокс, то его состояние поменяется, только если это не последний активный чекбокс
	if (value !== 'continue') {
		screen3Checkboxes[value] = !screen3Checkboxes[value]

		if (!Object.values(screen3Checkboxes).some(checked => checked)) {
			screen3Checkboxes[value] = !screen3Checkboxes[value]
		}
		else {
			goScreen(3, ctx)
		}
	}
	else {
		ctx.scene.session.state.type = Object.entries(screen3Checkboxes).filter((type) => type[1]).map((type) => type[0].toLowerCase())
		goScreen(4, ctx)
	}
})

scene.action(new RegExp(`^${scene.name}:price:`), async ctx => {
	const value = ctx.match.input.replace(ctx.match[0], '')
	ctx.scene.session.state.price = value
	const state = ctx.scene.session.state
	const OFFSET = 50
	const filterOptions = {
		city: state.city,
		status: state.status,
		type: { $in: state.type }
	}

	if (state.price.startsWith('<')) {
		const price = Number(state.price.replace('<', ''))
		filterOptions["price.min"] = { $lte: price + (price / 100 * OFFSET) }
	} else if (state.price.startsWith('>')) {
		const price = Number(state.price.replace('>', ''))
		filterOptions["price.max"] = { $gte: price + (price / 100 * OFFSET) }
	} else if (state.price.includes('-')) {
		const priceParse = state.price.split('-').map(Number)

		filterOptions.$or = [
			{
				"price.min": {
					$gte: priceParse[0] + (priceParse[0] / 100 * OFFSET),
					$lte: priceParse[1] + (priceParse[1] / 100 * OFFSET),
				},
			},
			{
				"price.max": {
					$gte: priceParse[0] + (priceParse[0] / 100 * OFFSET),
					$lte: priceParse[1] + (priceParse[1] / 100 * OFFSET),
				},
			},
		]
	}

	const projects = await $db.projects.getAll(filterOptions)
	const { insertedId } = await $db.selectionResults.add({
		projects: projects.map(project => project.project_id),
		city: state.city,
		status: state.status,
		type: state.type,
		price: state.price,
		timestamp: new Date().toISOString(),
	})

	if (projects.length === 0) {
		await send(ctx, $i18n(ctx, 'scenes.qsp.result.empty'), {
			reply_markup: {
				inline_keyboard: [
					[ { text: $i18n(ctx, 'kb.project_selection'), callback_data: "quiz_select_projects" }, ],
					[ { text: $i18n(ctx, 'kb.consult'), callback_data: "consult" }, ],
					[ { text: $i18n(ctx, 'kb.menu'), callback_data: "start" } ],
				],
			},
		})
	}
	else {
		await send(ctx, $i18n(ctx, 'scenes.qsp.result.text', { value: projects.length, list: projects.map((project, index) => `${index + 1}. ${project.name} - /id_${project.project_id}`).join('\n') }), {
			reply_markup: {
				inline_keyboard: [
					[ { text: $i18n(ctx, 'kb.consult'), callback_data: `consult:sr=${insertedId}` } ],
					[ { text: $i18n(ctx, 'kb.menu'), callback_data: "start" } ],
				],
			},
		})
	}

	ctx.scene.leave()
})

scene.on("message", async ctx => {
	const answered = scene.screens.length - Object.keys(scene.data).length

	await send(ctx, $i18n(ctx, 'scenes.qsp.stop.text', { value: answered }), {
		reply_markup: {
			inline_keyboard: [
			[
				{ text: $i18n(ctx, 'scenes.qsp.stop.kb.yes'), callback_data: `stop:${ctx.message.text}` },
				{ text: $i18n(ctx, 'scenes.qsp.stop.kb.no'), callback_data: "resume" },
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