import $db from "../../db/index.js"
import { $i18n } from "../../locales/index.js"

export const projectPrefix = 'project_'

const sendProjectPublic = async (ctx) => {
	const commandText = ctx.match ? ctx.match.input : ctx.message.text
	const projectId = commandText.replace(projectPrefix, '').replace('/', '')
	let data = (await $db.project.get({ project_id: parseInt(projectId) }))[0]

	const type = data.type[0].toUpperCase() + data.type.slice(1)
	const name = data.name
	const description = data.description
	const link = data.url
	const img = data.images[0]
	const text = `
${type} "${name}"\n
--------------------------------------------
${description}
--------------------------------------------\n
<a href="${link}">Ссылка на сайт</a>
`

	return ctx.sendPhoto(img, {
		caption: text,
		reply_markup: {
			inline_keyboard: [
				[ { text: $i18n('kb.consult'), callback_data: "consult" }, ],
				[ { text: $i18n('kb.catalog'), callback_data: "catalog" }, ],
				[ { text: $i18n('kb.menu'), callback_data: "start" }, ],
			]
		},
		parse_mode: 'HTML',
		not_edit_message: true,
	})
}

export default sendProjectPublic