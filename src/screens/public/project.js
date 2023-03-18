import $bot from "../../bot.js"
import $db from "../../db/index.js"
import send from "../../helpers/send.js"
import { $i18n } from "../../locales/index.js"

export const projectPrefix = 'project'
export const projectExecutor = async (ctx) => {
	const projectId = ctx.match.input.replace(ctx.match[0], '')
	const data = await $db.project.get({ project_id: parseInt(projectId) })

	sendProjectPublic(ctx, data[0])
}

const sendProjectPublic = async (ctx, data) => {
	console.log(data.type)
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

	ctx.sendPhoto(img, {
		caption: text,
		reply_markup: {
			inline_keyboard: [
				[ { text: $i18n('kb.consult'), callback_data: "consultation" }, ],
				[ { text: $i18n('kb.catalog'), callback_data: "catalog" }, ],
				[ { text: $i18n('kb.menu'), callback_data: "start" }, ],
			]
		},
		parse_mode: 'HTML',
		edit_message: false,
	})
}

export default sendProjectPublic