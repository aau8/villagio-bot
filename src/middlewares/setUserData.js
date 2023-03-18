import $db from "../db/index.js"
// import locale from "../locales/index.js"
import raiseUserData from "../helpers/raiseObjectFrom.js"
import i18next from "i18next"
import $bot from "../bot.js"
import { $user, setUser } from "../contexts/UserContext.js"

const setUserData = async (ctx, next) => {

	if (!ctx.$user) {
		let user = await $db.user.get({ tg_id: ctx.from.id })

		if (!user) {
			$db.user.add(raiseUserData(ctx.from))
			user = ctx.from
		}
		setUser(user)
	}
	await next()
}

export default setUserData