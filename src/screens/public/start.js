import $db from "../../db/index.js"
import send from "../../helpers/send.js"

const sendStartPublic = async (ctx) => {
	const user = ctx.from
	const userExists = await $db.user.check({ tg_id: user.id })

	if (!userExists) {
		await $db.user.add(raiseUserData(user))
	}

	const text = ctx.$locale.start.text
	send(ctx, text, {
		reply_markup: {
			inline_keyboard: [
				[ { text: ctx.$locale.start.keyboard[0], callback_data: "dd" }, ],
				[ { text: ctx.$locale.start.keyboard[1], callback_data: "dd" }, ],
				[ { text: ctx.$locale.start.keyboard[2], callback_data: "dd" }, ],
				[ { text: ctx.$locale.start.keyboard[3], callback_data: "dd" }, ],
				[ { text: ctx.$locale.start.keyboard[4], callback_data: "change-lang" }, ],
			]
		}
	})
}

export default sendStartPublic