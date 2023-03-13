import $db from "../db/index.js"
import locale from "../locales/index.js"
import $screen from "../screens/index.js"

// Экшн для изменения языка
const changeLang = async (ctx) => {
	const lang = ctx.$user.lang === 'ru' ? 'en': 'ru'

	// Изменить данные языка в бд
	await $db.user.setLang(lang, { tg_id: ctx.$user.tg_id })
	ctx.$user.lang = lang
	ctx.$locale = locale[lang]

	// Поменять экран, передав обновленный контекст
	$screen.public.start(ctx)
}

export default changeLang