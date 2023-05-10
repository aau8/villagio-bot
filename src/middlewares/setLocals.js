// import { $user } from "../contexts/UserContext.js"
import i18next from "i18next"
import EN from "../locales/en.js"
import RU from "../locales/ru.js"

const setLocals = async (ctx, next) => {

	if (!ctx.$i18n) {
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

	}

	await next()
}


export const $i18n = (value, vars) => i18next.t(value, { lng: $user.lang || $user.language_code, ...vars })