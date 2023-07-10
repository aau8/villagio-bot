import { $i18n } from "../../locales/index.js"
import { send } from "../../helpers.js"

const sendStartPublic = async (ctx) => {
	const action = ctx?.update?.callback_query?.data

	return await send(ctx, $i18n(ctx, 'start'), {
		reply_markup: {
			inline_keyboard: [
				[ { text: $i18n(ctx, 'kb.project_selection'), callback_data: "quiz_select_projects" }, ],
				[ { text: $i18n(ctx, 'kb.catalog'), callback_data: "catalog" }, ],
				[ { text: $i18n(ctx, 'kb.consult'), callback_data: "quiz_consult" }, ],
				// [ { text: $i18n(ctx, 'kb.change_lng'), callback_data: "change_lang" }, ],
				[ { text: $i18n(ctx, 'kb.manage_subscr'), callback_data: "subscribe" }, ],
			]
		},
		not_edit_message: action?.includes('not_edit_message') || false
	})
}

export default sendStartPublic