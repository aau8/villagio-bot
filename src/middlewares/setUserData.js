import { setUser } from "../contexts/UserContext.js"
import { parseUserData } from "../helpers.js"
import $db from "../db/index.js"

export const updateUserData = async (ctx, key, value) => {
	ctx.session.user[key] = value
	console.log(`Пользователь ${ctx.from.id} изменил ${key} на ${value}`)

	return await $db.users.update({ td_id: ctx.from.id }, { [key]: value })
}

const checkUserData = async (ctx, key, value) => {
	if (ctx.session.user[key] !== value) {
		return await updateUserData(ctx, key, value)
	}
}

export const addUserData = async (ctx) => {
	let user = await $db.users.get({ tg_id: ctx.from.id })

	if (!user) {
		const userData = parseUserData(ctx.from)

		await $db.users.add(userData)
		user = userData
	}

	ctx.session.user = user
}

const setUserData = async (ctx, next) => {
	let user = await $db.users.get({ tg_id: ctx.from.id })
	console.log('user', user)

	if (!user) {
		const userData = parseUserData(ctx.from)

		await $db.users.add(userData)
		user = userData
	}
	else {
		// const from = ctx.from
		// delete from.id

		console.log('ctx.from', ctx.from)
		const res = await $db.users.update({ tg_id: ctx.from.id }, ctx.from)

		console.log(res)
	}

	ctx.session.user = user

	// if (ctx.session.user) {
	// 	await checkUserData(ctx, "first_name", ctx.from.first_name)
	// 	await checkUserData(ctx, "last_name", ctx.from.last_name)
	// 	await checkUserData(ctx, "username", ctx.from.username)
	// 	console.log('checkUserData')
	// }
	// else {
	// 	await addUserData(ctx)
	// 	// setUser(user)
	// 	console.log('addUserData')
	// }

	await next()
}

export default setUserData