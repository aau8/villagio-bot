import { addProject, getProject } from "./projects.js";
import { getAdminId, getCatalogPdfLink, getSettings } from "./settings.js";
import { addUser, checkUser, getUser, getUserAll, setLangUser, setSubscriptionUser, updateUser } from "./users.js";

const $db = {
	user: {
		get: getUser,
		getAll: getUserAll,
		add: addUser,
		check: checkUser,
		update: updateUser,
		setLang: setLangUser,
		setSubscr: setSubscriptionUser,
	},
	settings: {
		get: getSettings,
		getAdminId: getAdminId,
		getCatalogPdfLink: getCatalogPdfLink,
	},
	project: {
		get: getProject,
		add: addProject,
	},
}

export default $db