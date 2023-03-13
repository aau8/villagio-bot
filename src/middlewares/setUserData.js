import $db from "../db/index.js"
import locale from "../locales/index.js"
import raiseUserData from "../helpers/raiseObjectFrom.js"

const setUserData = async (ctx, next) => {

	// console.log(ctx)
	if (!ctx.$user) {
		let user = await $db.user.get({ tg_id: ctx.from.id })

		if (!user) {
			await $db.user.add(raiseUserData(ctx.from))
			user = ctx.from
		}
		// console.log('user', user)
		ctx.$user = user
		ctx.$locale = locale[user.lang || user.language_code]
	}
	await next()
}

export default setUserData


// import $db from "../db/index.js"
// import raiseUserData from "../helpers/raiseObjectFrom.js"
// import locale from "../locales/index.js"

// const setUserData = async (ctx, next) => {
// 	console.log(ctx)
// 	if (!ctx.$user) {
// 		let user = await $db.user.get({ tg_id: ctx.from.id })

// 		if (!user) {
// 			await $db.user.add(raiseUserData(ctx.from))
// 			user = await $db.user.get({ tg_id: ctx.from.id })
// 		}

// 		console.log(user)
// 		ctx.$user = user
// 		ctx.$locale = locale[user?.lang || user?.language_code]
// 	}
// 	await next()
// }

// export default setUserData