import { setUser } from "../contexts/UserContext.js"
import { parseUserData } from "../helpers.js"
import $db from "../db/index.js"

const setUserData = async (ctx, next) => {
	if (!ctx.$user) {
		let user = await $db.users.get({ tg_id: ctx.from.id })

		if (!user) {
			await $db.users.add(parseUserData(ctx.from))
			user = ctx.from
		}

		setUser(user)
	}
	await next()
}

export default setUserData