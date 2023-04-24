import changeSubscribe from "../actions/changeSubscribe.js"
import sendStatCatPrivate from "./private/statisticCat.js"
import sendStatisticPrivate from "./private/statistic.js"
import sendCatalogCatPublic from "./public/catalogCat.js"
import sendCatalogPdfPublic from "./public/catalogPdf.js"
import sendSubscribePublic from "./public/subscribe.js"
import sendCatalogPublic from "./public/catalog.js"
import sendProjectPublic from "./public/project.js"
import changeLang from "../actions/changeLang.js"
import sendStartPrivate from "./private/start.js"
import sendHelpPrivate from "./private/help.js"
import sendStartPublic from "./public/start.js"
import sendHelpPublic from "./public/help.js"

const $screen = {
	public: {
		start: sendStartPublic,
		help: sendHelpPublic,
		subscribe: sendSubscribePublic,
		project: sendProjectPublic,
		catalog: sendCatalogPublic,
		catalog_cat: sendCatalogCatPublic,
		catalog_pdf: sendCatalogPdfPublic,
		change_lang: changeLang,
		change_subscribe: changeSubscribe,
	},
	private: {
		start: sendStartPrivate,
		help: sendHelpPrivate,
		statistic: sendStatisticPrivate,
		statistic_cat: sendStatCatPrivate,
	}
}

export default $screen