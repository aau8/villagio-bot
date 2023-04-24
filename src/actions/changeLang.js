import { $user, setUserLang } from "../contexts/UserContext.js"
import $screen from "../screens/index.js"
import $db from "../db/index.js"

// Изменить язык
const changeLang = async (ctx) => {
	const lang = $user.lang === 'ru' ? 'en': 'ru'

	// Изменить данные языка в бд
	await $db.users.setLang(lang, { tg_id: $user.tg_id })
	setUserLang(lang)

	// Поменять экран
	return $screen.public.start(ctx)
}

export default changeLang