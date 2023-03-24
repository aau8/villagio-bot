import $bot from "../../bot.js"
import { $user, setUserSubscr } from "../../contexts/UserContext.js"
import $db from "../../db/index.js"
import send from "../../helpers/send.js"
import { $i18n } from "../../locales/index.js"

const sendSubscribePublic = async (ctx) => {
	const action = $user.subscription ? 'on' : 'off'

	return send(ctx, $i18n('subscribe.text'), {
		reply_markup: {
			inline_keyboard: [
				[
					{ text: $i18n(`subscribe.kb.${action}`), callback_data: `subscribe_change` }
				],
				[
					{ text: $i18n('kb.back'), callback_data: "start" }
				]
			]
		}
	})
}

export default sendSubscribePublic