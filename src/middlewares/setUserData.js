import $db from "../db/index.js"
import raiseUserData from "../helpers/raiseObjectFrom.js"
import { setUser } from "../contexts/UserContext.js"

const setUserData = async (ctx, next) => {
	if (!ctx.$user) {
		let user = await $db.users.get({ tg_id: ctx.from.id })

		if (!user) {
			await $db.users.add(raiseUserData(ctx.from))
			user = ctx.from
		}

		setUser(user)
	}
	await next()
}

export default setUserData