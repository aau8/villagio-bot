import { $i18n } from "../../locales/index.js"
import { catalogPrefix } from "./catalog.js"
import { projectPrefix } from "./project.js"
import $db from "../../db/index.js"

const sendCatalogCatPublic = async (ctx) => {
	const commandText = ctx.match ? ctx.match.input : ctx.message.text
	const catName = commandText.replace(catalogPrefix, '')
	let catSlug

	switch (catName) {
		case 'villas':
			catSlug = /(Дом)|(Вилла)/
			break;
		case 'townhouses':
			catSlug = /(Таунхаус)/
			break;
		case 'aparts':
			catSlug = /(Апартаменты)|(Квартира)/
			break;
	}

	const projects = await $db.projects.getAll({ type: catSlug })
	const typesToString = (type) => type.map((villa, i) => `${i + 1}. ${villa.name} - \/${projectPrefix + villa.project_id}`).join('\n')
	const text = `${$i18n(ctx, 'catalog.text')} (${$i18n(ctx, `catalog.kb.${catName}`)})\n\n${typesToString(projects)}`

	await ctx.answerCbQuery()
	await ctx.editMessageText(text, {
		reply_markup: {
			inline_keyboard: [
				[ { text: $i18n(ctx, 'kb.back'), callback_data: "catalog" }, ],
			]
		}
	})
}

export default sendCatalogCatPublic