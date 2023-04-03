import $db from "../../db/index.js"
import send from "../../helpers/send.js"
import { $i18n } from "../../locales/index.js"

const sendCatalogPdfPublic = async (ctx) => {
	const link = await $db.settings.getCatalogPdfLink()

	console.log('pdf')
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