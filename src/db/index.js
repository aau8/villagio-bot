import { getAdminId, getCatalogUrl, getSettings } from "./settings.js";
import { addUser, checkUser, getUser, getUserAll, setLangUser, updateUser } from "./users.js";

const $db = {
	user: {
		get: getUser,
		getAll: getUserAll,
		add: addUser,
		check: checkUser,
		update: updateUser,
		setLang: setLangUser,
	},
	settings: {
		get: getSettings,
		getAdminId: getAdminId,
		getCatalogUrl: getCatalogUrl,
	}
}

export default $db