import $db from "../../db/index.js"
import { $i18n } from "../../locales/index.js"

export const projectPrefix = 'id_'

const sendProjectPublic = async (ctx) => {
	const commandText = ctx.match ? ctx.match.input : ctx.message.text
	const projectId = commandText.replace(projectPrefix, '').replace('/', '')
	let data = await $db.projects.get(parseInt(projectId))
	console.log(data)
	const type = data.type[0].toUpperCase() + data.type.slice(1)
	const name = data.name
	const description = data.description
	// const link = data.url
	const img = data.images[0]
	const text = `
${type} "${name}"\n
${description}
`

	return ctx.sendPhoto(img, {
		caption: text,
		reply_markup: {
			inline_keyboard: [
				[ { text: $i18n('kb.more'), callback_data: `consult:[${projectId}]` }, ],
				[ { text: $i18n('kb.catalog'), callback_data: "catalog" }, ],
				[ { text: $i18n('kb.menu'), callback_data: "start" }, ],
			]
		},
		parse_mode: 'HTML',
		not_edit_message: true,
	})
}

export default sendProjectPublic