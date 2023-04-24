import { $user } from "../../contexts/UserContext.js"
import { $i18n } from "../../locales/index.js"
import { send } from "../../helpers.js"

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