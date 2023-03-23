import $db from "../../db/index.js"
import createGrid from "../../helpers/createGrid.js"
import send from "../../helpers/send.js"
import { $i18n } from "../../locales/index.js"
import { projectPrefix } from "./project.js"

export const catalogPrefix = 'catalog_'
const sendCatalogPublic = async (ctx) => {

	await send(ctx, $i18n('catalog.text'), {
		reply_markup: {
			inline_keyboard: [
				...createGrid([
					{ text: $i18n('catalog.kb.aparts'), callback_data: `${catalogPrefix}aparts` },
					{ text: $i18n('catalog.kb.townhouses'), callback_data: `${catalogPrefix}townhouses` },
					{ text: $i18n('catalog.kb.villas'), callback_data: `${catalogPrefix}villas` },
				], 2),
				[ { text: $i18n('kb.catalog_pdf'), callback_data: "catalog_pdf" }, ],
				[ { text: $i18n('kb.back'), callback_data: "start" }, ],
			]
		}
	})
}

export default sendCatalogPublic