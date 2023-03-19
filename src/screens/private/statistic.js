import $db from "../../db/index.js"
import checkIsAdmin from "../../helpers/checkIsAdmin.js"
import createGrid from "../../helpers/createGrid.js"
import send from "../../helpers/send.js"
import { $i18n } from "../../locales/index.js"

export const statisticPrefix = 'statistic_'
const sendStatisticPrivate = async (ctx) => {
	const user = ctx.from
	const isAdmin = await checkIsAdmin(user.id)
	if (!isAdmin) {
		console.log(`Пользователь @${user.username} (${user.id}) пытался воспользоваться админ. панелью`)
		return
	}

	send(ctx, $i18n('private.statistic', { lng: 'ru' }), {
		reply_markup: {
			inline_keyboard: [
				...createGrid([
					{ text: $i18n('private.kb.statistic_users', { lng: 'ru' }), callback_data: `${statisticPrefix}users` },
					{ text: $i18n('private.kb.statistic_applics', { lng: 'ru' }), callback_data: `${statisticPrefix}applics` },
					{ text: $i18n('private.kb.statistic_projects', { lng: 'ru' }), callback_data: `${statisticPrefix}projects` },
				], 2),
				[ { text: $i18n('kb.back', { lng: 'ru' }), callback_data: "admin" }, ],
			]
		}
	})
}

export default sendStatisticPrivate