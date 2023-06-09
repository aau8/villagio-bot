import { createGrid, send, checkIsAdmin } from "../../helpers.js"
import { $i18n } from "../../locales/index.js"

export const statisticPrefix = 'statistic_'
const sendStatisticPrivate = async (ctx) => {
	const user = ctx.from
	const isAdmin = checkIsAdmin(user.id)
	if (!isAdmin) {
		console.log(`Пользователь @${user.username} (${user.id}) пытался воспользоваться админ. панелью`)
		return
	}

	return send(ctx, $i18n(ctx, 'private.statistic', { lng: 'ru' }), {
		reply_markup: {
			inline_keyboard: [
				...createGrid([
					{ text: $i18n(ctx, 'private.kb.statistic_users', { lng: 'ru' }), callback_data: `${statisticPrefix}users` },
					{ text: $i18n(ctx, 'private.kb.statistic_projects', { lng: 'ru' }), callback_data: `${statisticPrefix}projects` },
					{ text: $i18n(ctx, 'private.kb.statistic_consults', { lng: 'ru' }), callback_data: `${statisticPrefix}consults` },
					{ text: $i18n(ctx, 'private.kb.statistic_viewed', { lng: 'ru' }), callback_data: `${statisticPrefix}viewed` },
				], 2),
				[ { text: $i18n(ctx, 'kb.back', { lng: 'ru' }), callback_data: "admin" }, ],
			]
		}
	})
}

export default sendStatisticPrivate