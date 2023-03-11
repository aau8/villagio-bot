import $db from "../db/index.js"
import locale from "../locales/index.js"
import $screen from "../screens/index.js"

const changeLang = async (ctx) => {
	const lang = ctx.$user.lang === 'ru' ? 'en': 'ru'

	await $db.user.setLang(lang, { tg_id: ctx.$user.tg_id })
	ctx.$user.lang = lang
	ctx.$locale = locale[lang]
	$screen.public.start(ctx)
}

export default changeLang