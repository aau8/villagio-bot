import { $i18n } from "../../locales/index.js"
import { send } from "../../helpers.js"

const sendHelpPublic = async (ctx) => {

	return send(ctx, $i18n(ctx, 'help'), {
		reply_markup: {
			inline_keyboard: [
				[ { text: $i18n(ctx, 'kb.back'), callback_data: "start" }, ],
			]
		}
	})
}

export default sendHelpPublic