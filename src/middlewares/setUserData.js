import $db from "../db/index.js"
import locale from "../locales/index.js"

const setUserData = async (ctx, next) => {
	if (!ctx.$user) {
		const user = await $db.user.get({ tg_id: ctx.from.id })
		ctx.$user = user
		ctx.$locale = locale[user.lang]
	}
	await next()
}

export default setUserData