import sendSubscribePublic from "../screens/public/subscribe.js"
import $db from "../db/index.js"

const changeSubscribe = async (ctx) => {
	const state = !ctx.session.user.subscription

	await $db.users.setSubscr(state, { tg_id: ctx.from.id })
	ctx.session.user.subscription = state

	return sendSubscribePublic(ctx)
}

export default changeSubscribe