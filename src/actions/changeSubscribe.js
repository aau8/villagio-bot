import { $user, setUserSubscr } from "../contexts/UserContext.js"
import sendSubscribePublic from "../screens/public/subscribe.js"
import $db from "../db/index.js"

const changeSubscribe = async (ctx) => {
	const condition = !$user.subscription

	await $db.users.setSubscr(condition, { tg_id: $user.tg_id })
	setUserSubscr(condition)

	return sendSubscribePublic(ctx)
}

export default changeSubscribe