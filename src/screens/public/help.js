import { $i18n } from "../../locales/index.js"
import { send } from "../../helpers.js"

const sendHelpPublic = async (ctx) => {

	return send(ctx, $i18n('help'), {
		reply_markup: {
			inline_keyboard: [
				[ { text: $i18n('kb.back'), callback_data: "start" }, ],
			]
		}
	})
}

export default sendHelpPublic