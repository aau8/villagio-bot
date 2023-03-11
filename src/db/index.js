import { getAdminId, getCatalogUrl, getSettings } from "./settings.js";
import { addUser, checkUser, getUser, getUserAll } from "./users.js";

const $db = {
	user: {
		get: getUser,
		getAll: getUserAll,
		add: addUser,
		check: checkUser,
	},
	settings: {
		get: getSettings,
		getAdminId: getAdminId,
		getCatalogUrl: getCatalogUrl,
	}
}

export default $db