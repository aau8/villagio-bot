import { createGrid, send } from "../../helpers.js"
import { $i18n } from "../../locales/index.js"

export const catalogPrefix = 'catalog:'
const sendCatalogPublic = async (ctx) => {
	const action = ctx?.update?.callback_query?.data

	return send(ctx, $i18n(ctx, 'catalog.text'), {
		reply_markup: {
			inline_keyboard: [
				...createGrid([
					{ text: $i18n(ctx, 'catalog.kb.aparts'), callback_data: `${catalogPrefix}aparts` },
					{ text: $i18n(ctx, 'catalog.kb.townhouses'), callback_data: `${catalogPrefix}townhouses` },
					{ text: $i18n(ctx, 'catalog.kb.villas'), callback_data: `${catalogPrefix}villas` },
				], 2),
				[ { text: $i18n(ctx, 'kb.catalog_pdf'), callback_data: "catalog_pdf" }, ],
				[ { text: $i18n(ctx, 'kb.back'), callback_data: "start" }, ],
			]
		},
		not_edit_message: action?.includes('not_edit_message') || false,
	})
}

export default sendCatalogPublic