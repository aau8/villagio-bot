// import { $user, setUserLang } from "../contexts/UserContext.js"
import $screen from "../screens/index.js"
import $db from "../db/index.js"
// import { updateUserData } from "../middlewares/setUserData.js"

// Изменить язык
const changeLang = async (ctx) => {
	// console.log(ctx.session.user.lang)
	const lang = ctx.session.user.lang === 'ru' ? 'en': 'ru'

	// console.log('lang', lang)
	// Изменить данные языка в бд
	await $db.users.setLang(lang, { tg_id: ctx.from.id })
	ctx.session.user.lang = lang
	// const res = await updateUserData(ctx, "lang", lang)

	// console.log('res', res)
	// console.log(ctx.session.user.lang)
	// console.log(ctx.session.user)

	// Поменять экран
	return $screen.public.start(ctx)
}

export default changeLang