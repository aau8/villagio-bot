import { $i18n } from "../../locales/index.js"
import $db from "../../db/index.js"

export const projectPrefix = 'id_'
const sendProjectPublic = async (ctx) => {
	const commandText = ctx.match ? ctx.match.input : ctx.message.text
	const projectId = Number(commandText.replace(projectPrefix, '').replace('/', ''))
	await $db.viewed.add(ctx.from.id, projectId)

	let data = await $db.projects.get(projectId)
	const type = data.type[0].toUpperCase() + data.type.slice(1)
	const text = `${type} "${data.name}"\n${data.description}`
	const users = data.users || []
	const addedCurrentUser = users?.some(user => user === ctx.from.id)

	if (!addedCurrentUser) {
		await $db.projects.update({ project_id: projectId }, { users: [ ...users, ctx.from.id ] })
	}

	return ctx.sendPhoto(data.images[0], {
		caption: text,
		reply_markup: {
			inline_keyboard: [
				[ { text: $i18n(ctx, 'kb.more'), callback_data: `quiz_consult:project_id=${projectId}` }, ],
				[ { text: $i18n(ctx, 'kb.catalog'), callback_data: "catalog" }, ],
				[ { text: $i18n(ctx, 'kb.menu'), callback_data: "start:not_edit_message" }, ],
			]
		},
		parse_mode: 'HTML',
		not_edit_message: true,
	})
}

export default sendProjectPublic