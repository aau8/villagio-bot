import { $user } from "../contexts/UserContext.js"
import i18next from "i18next"
import EN from "./en.js"
import RU from "./ru.js"

i18next.init({
	lng: 'ru',
	resources: {
		ru: {
			translation: RU
		},
		en: {
			translation: EN
		},
	}
})

export const $i18n = (ctx, value, vars) => i18next.t(value, { lng: ctx.session.user.lang || ctx.from.language_code, ...vars })