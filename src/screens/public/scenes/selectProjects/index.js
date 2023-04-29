import { isCommand } from "../../../../helpers.js"
import quiz from "./quiz.js"
import $db from "../../../../db/index.js"
import { Scenes } from "telegraf"
import $screen from "../../../index.js"

const scene = new Scenes.WizardScene(
	quiz.name,
	// Старт сцены
	async ctx => {

		/* ========== Переход к следующему шагу ========== */
		await quiz.open("city", ctx)
		return ctx.wizard.next()
	},
	async ctx => {
		/* ========== Обработка предыдущего шага ========== */
		if (ctx?.message?.text) {
			await quiz.open("stop", ctx, 1)
			return
		}

		// Сохранение выбранного города
		ctx.scene.session.state.city = ctx.update.callback_query.data


		/* ========== Переход к следующему шагу ========== */
		await quiz.open("status", ctx)
		return ctx.wizard.next()
	},
	async ctx => {
		/* ========== Обработка предыдущего шага ========== */
		if (ctx?.message?.text) {
			await quiz.open("stop", ctx, 2)
			return
		}

		// Сохранение выбранного статуса
		ctx.scene.session.state.status = ctx.update.callback_query.data


		/* ========== Переход к следующему шагу ========== */
		// Начальное состояние выбранных типов
		ctx.scene.session.state.types = quiz.data.types

		await quiz.open("type", ctx)
		return ctx.wizard.next()
	},
	async ctx => {
		/* ========== Обработка предыдущего шага ========== */
		if (ctx?.message?.text) {
			await quiz.open("stop", ctx, 3)
			return
		}

		if (ctx.update.callback_query.data !== "continue") {
			const typesChecked = ctx.scene.session.state.types.map(type => {
				if (type.callback_data === ctx.update.callback_query.data) {
					return { ...type, state: !type.state }
				}
				return type
			})
			const typesCheckedNum = typesChecked.filter(type => type.state).length

			if (typesCheckedNum !== 0) {
				// Сохранение выбранного статуса
				ctx.scene.session.state.types = typesChecked
				await quiz.open("type", ctx)
			}
			else {
				await ctx.answerCbQuery("Должен быть выбран минимум 1 тип 😊")
			}

			return ctx.wizard.selectStep(ctx.wizard.cursor)
		}

		/* ========== Переход к следующему шагу ========== */
		await quiz.open("price", ctx)
		return ctx.wizard.next()
	},
	async ctx => {
		/* ========== Обработка предыдущего шага ========== */
		if (ctx?.message?.text) {
			await quiz.open("stop", ctx, 4)
			return
		}

		// Сохранение выбранного диапазона цен
		ctx.scene.session.state.price = ctx.update.callback_query.data

		const state = ctx.scene.session.state
		const OFFSET = 50
		const filterOptions = {
			city: state.city,
			status: state.status,
			type: { $in: state.types.filter(type => type.state).map(type => type.callback_data) }
		}

		// Определение цен
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

		// Подбор соответствующих проектов
		const projects = await $db.projects.getAll(filterOptions)
		const { insertedId } = await $db.selectionResults.add({
			projects: projects.map(project => project.project_id),
			city: state.city,
			status: state.status,
			type: state.type,
			price: state.price,
			timestamp: new Date().toISOString(),
		})

		/* ========== Конец сцены ========== */
		if (projects.length === 0) {
			await quiz.open("not_result", ctx)
		}
		else {
			await quiz.open("result", ctx, projects, insertedId)
		}

		return ctx.scene.leave()
	}
)

scene.action('resume', async ctx => {
	await quiz.open(quiz.current, ctx)
})

scene.action(/^stop:/, async ctx => {
	const command = ctx.match.input.replace('stop:', '').replace('/', '')

	if ($screen.public[command]) {
		$screen.public[command](ctx)
	}
	else {
		$screen.public.start(ctx)
	}

	return await ctx.scene.leave();
})

export default scene