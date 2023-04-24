import { checkIsAdmin, send } from "../../helpers.js"
import { $i18n } from "../../locales/index.js"

const sendHelpPrivate = async (ctx) => {
	const user = ctx.from
	const isAdmin = checkIsAdmin(user.id)
	if (!isAdmin) {
		console.log(`Пользователь @${user.username} (${user.id}) пытался воспользоваться админ. панелью`)
		return
	}

	const text = 'ℹ Справка об админ. панели\nЗдесь описан основной функционал и команды админки.'
	return send(ctx, text, {
		reply_markup: {
			inline_keyboard: [
				[
					{ text: $i18n('kb.back'), callback_data: "admin" }
				]
			]
		}
	})
}

export default sendHelpPrivate