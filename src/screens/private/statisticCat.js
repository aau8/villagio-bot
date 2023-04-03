import checkIsAdmin from "../../helpers/checkIsAdmin.js"
import send from "../../helpers/send.js"
import { $i18n } from "../../locales/index.js"
import * as dotenv from 'dotenv'
dotenv.config()

const API_URL = (process.env.VERCEL_URL || 'http://site.com') + '/api'
const sendStatCatPrivate = async (ctx) => {
	const user = ctx.from
	const isAdmin = await checkIsAdmin(user.id)
	if (!isAdmin) {
		console.log(`Пользователь @${user.username} (${user.id}) пытался воспользоваться админ. панелью`)
		return
	}
	const commandText = ctx.match ? ctx.match.input : ctx.message.text
	const command = commandText.replace('statistic_', '')

	return send(ctx, $i18n(`private.${commandText}`, { lng: 'ru' }), {
		reply_markup: {
			inline_keyboard: [
				[
					{ text: $i18n('private.kb.download_json', { lng: 'ru' }), url: `${API_URL}/stats?cat=${command}&format=json&admin_id=${user.id}` },
					{ text: $i18n('private.kb.download_xlsx', { lng: 'ru' }), url: `${API_URL}/stats?cat=${command}&format=xlsx&admin_id=${user.id}` },
				],
				[ { text: $i18n('kb.back', { lng: 'ru' }), callback_data: "statistic" }, ],
			]
		}
	})
}

export default sendStatCatPrivate