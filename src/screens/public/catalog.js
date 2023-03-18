import $db from "../../db/index.js"
import send from "../../helpers/send.js"
import { $i18n } from "../../locales/index.js"
import { projectPrefix } from "./project.js"

const sendCatalogPublic = async (ctx) => {
	const projects = await $db.project.get()
	const types = {
		aparts: [],
		townhouses: [],
		villas: [],
	}

	for (const project of projects) {
		const projectType = project.type.toLowerCase()

		switch (projectType) {
			case 'вилла':
				types.villas.push(project)
				break;
			case 'таунхаус':
				types.townhouses.push(project)
				break;
			case 'апартаменты':
				types.aparts.push(project)
				break;

		}
	}

	const typesToString = (type) => type.map((villa, i) => `${i + 1}. ${villa.name} - \/${projectPrefix + villa.project_id}`).join('\n')

	send(ctx, $i18n('catalog', {
		aparts: typesToString(types.aparts),
		townhouses: typesToString(types.townhouses),
		villas: typesToString(types.villas),
	}), {
		reply_markup: {
			inline_keyboard: [
				[ { text: $i18n('kb.doc_pdf'), callback_data: "catalog_pdf" }, ],
				[ { text: $i18n('kb.back'), callback_data: "start" }, ],
			]
		}
	})
}

export default sendCatalogPublic