import send from "../../helpers/send.js"
import { $i18n } from "../../locales/index.js"

const sendStartPublic = async (ctx) => {
	const action = ctx?.update?.callback_query?.data

	return send(ctx, $i18n('start'), {
		reply_markup: {
			inline_keyboard: [
				[ { text: $i18n('kb.project_selection'), callback_data: "quiz_select_project" }, ],
				[ { text: $i18n('kb.catalog'), callback_data: "catalog" }, ],
				[ { text: $i18n('kb.consult'), callback_data: "consult:" }, ],
				[ { text: $i18n('kb.change_lng'), callback_data: "change_lang" }, ],
				[ { text: $i18n('kb.manage_subscr'), callback_data: "subscribe" }, ],
			]
		},
		not_edit_message: action?.includes('not_edit_message') || false
	})
}

export default sendStartPublic