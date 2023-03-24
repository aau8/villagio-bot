import checkIsAdmin from "../../helpers/checkIsAdmin.js"
import send from "../../helpers/send.js"
import { $i18n } from "../../locales/index.js"

const sendStatCatPrivate = async (ctx) => {
	const user = ctx.from
	const isAdmin = await checkIsAdmin(user.id)
	if (!isAdmin) {
		console.log(`Пользователь @${user.username} (${user.id}) пытался воспользоваться админ. панелью`)
		return
	}
	const commandText = ctx.match ? ctx.match.input : ctx.message.text

	return send(ctx, $i18n(`private.${commandText}`, { lng: 'ru' }), {
		reply_markup: {
			inline_keyboard: [
				[ { text: $i18n('private.kb.download_csv', { lng: 'ru' }), callback_data: "csv" }, ],
				[ { text: $i18n('kb.back', { lng: 'ru' }), callback_data: "statistic" }, ],
			]
		}
	})
}

export default sendStatCatPrivate