import { $i18n } from "../../locales/index.js"
import { CATALOG_URL } from "../../config.js"
import { send } from "../../helpers.js"

const sendCatalogPdfPublic = async (ctx) => {
	const link = CATALOG_URL

	return send(ctx, $i18n('catalog_pdf'), {
		reply_markup: {
			inline_keyboard: [
				[ { text: $i18n('kb.catalog_pdf_link'), url: link }, ],
				[ { text: $i18n('kb.back'), callback_data: "catalog" }, ],
			]
		}
	})
}

export default sendCatalogPdfPublic