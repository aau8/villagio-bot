import $db from "../../db/index.js"
import createGrid from "../../helpers/createGrid.js"
import send from "../../helpers/send.js"
import { $i18n } from "../../locales/index.js"
import { catalogPrefix } from "./catalog.js"
import { projectPrefix } from "./project.js"

const sendCatalogCatPublic = async (ctx) => {
	await send(ctx, $i18n('download'))

	const commandText = ctx.match ? ctx.match.input : ctx.message.text
	const catName = commandText.replace(catalogPrefix, '')
	let catSlug

	switch (catName) {
		case 'villas':
			catSlug = 'вилла'
			break;
		case 'townhouses':
			catSlug = 'таунхаус'
			break;
		case 'aparts':
			catSlug = 'апартаменты'
			break;
	}

	const projects = await $db.projects.getAll({ type: catSlug })

	const typesToString = (type) => type.map((villa, i) => `${i + 1}. ${villa.name} - \/${projectPrefix + villa.project_id}`).join('\n')
	const text = `${$i18n('catalog.text')} (${$i18n(`catalog.kb.${catName}`)})\n\n${typesToString(projects)}`

	return send(ctx, text, {
		reply_markup: {
			inline_keyboard: [
				[ { text: $i18n('kb.back'), callback_data: "catalog" }, ],
			]
		}
	})
}

export default sendCatalogCatPublic