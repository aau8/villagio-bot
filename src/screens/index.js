import changeLang from "../actions/changeLang.js"
import sendHelpPrivate from "./private/help.js"
import sendStartPrivate from "./private/start.js"
import sendStatisticPrivate from "./private/statistic.js"
import sendStatCatPrivate from "./private/statisticCat.js"
import sendStatCsvPrivate from "./private/statisticCsv.js"
import sendCatalogPublic from "./public/catalog.js"
import sendCatalogPdfPublic from "./public/catalogPdf.js"
import sendHelpPublic from "./public/help.js"
import sendProjectPublic from "./public/project.js"
import sendStartPublic from "./public/start.js"
import sendSubscribePublic from "./public/subscribe.js"

const $screen = {
	public: {
		start: sendStartPublic,
		help: sendHelpPublic,
		subscribe: sendSubscribePublic,
		project: sendProjectPublic,
		catalog: sendCatalogPublic,
		catalog_pdf: sendCatalogPdfPublic,
		change_lang: changeLang,
	},
	private: {
		start: sendStartPrivate,
		help: sendHelpPrivate,
		statistic: sendStatisticPrivate,
		statistic_cat: sendStatCatPrivate,
		statistic_csv: sendStatCsvPrivate,
	}
}

export default $screen