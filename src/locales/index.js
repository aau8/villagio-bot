import i18next from "i18next"
import { $user } from "../contexts/UserContext.js"
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

export const $i18n = (value) => i18next.t(value, { lng: $user.lang || $user.language_code })