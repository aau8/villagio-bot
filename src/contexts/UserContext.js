export let $user = {
	tg_id: null,
	start_date: null,
	is_bot: null,
	first_name: null,
	username: null,
	language_code: null,
	phone: null,
	lang: null,
	subscription: null,
	viewed_realty: null
}
export const setUser = (data) => $user = data
export const setUserLang = (lang) => $user = { ...$user, lang: lang }
export const setUserSubscr = (subscrOn) => $user = { ...$user, subscription: subscrOn }