import send from "../../helpers/send.js"
import { $i18n } from "../../locales/index.js"

const sendHelpPublic = async (ctx) => {
	send(ctx, $i18n('help'), {
		reply_markup: {
			inline_keyboard: [
				[ { text: $i18n('kb.back'), callback_data: "start" }, ],
			]
		}
	})
}

export default sendHelpPublic