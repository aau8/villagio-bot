import { $user, setUserLang } from "../contexts/UserContext.js"
import $db from "../db/index.js"
import $screen from "../screens/index.js"

// Изменить язык
const changeLang = async (ctx) => {
	const lang = $user.lang === 'ru' ? 'en': 'ru'

	// Изменить данные языка в бд
	$db.user.setLang(lang, { tg_id: $user.tg_id })
	setUserLang(lang)

	// Поменять экран, передав обновленный контекст
	$screen.public.start(ctx)
}

export default changeLang