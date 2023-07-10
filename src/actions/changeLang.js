// import { $user, setUserLang } from "../contexts/UserContext.js"
import $screen from "../screens/index.js"
import $db from "../db/index.js"
// import { updateUserData } from "../middlewares/setUserData.js"

// Изменить язык
const changeLang = async (ctx) => {
	const lang = ctx.session.user.lang === 'ru' ? 'en': 'ru'

	// Изменить данные языка в бд
	await $db.users.setLang(lang, { tg_id: ctx.from.id })
	ctx.session.user.lang = lang

	// Поменять экран
	return $screen.public.start(ctx)
}

export default changeLang