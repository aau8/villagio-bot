import send from "../../helpers/send.js"
import { $i18n } from "../../locales/index.js"

const sendSubscribePublic = async (ctx) => {

	send(ctx, $i18n('subscribe'), {
		reply_markup: {
			inline_keyboard: [
				[
					{ text: $i18n('kb.subscr.off'), callback_data: "dd" }
				],
				[
					{ text: $i18n('kb.back'), callback_data: "start" }
				]
			]
		}
	})
}

export default sendSubscribePublic