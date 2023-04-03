import { addConsults, getAllConsults } from "./consults.js";
import { addProject, updateProject, getAllProject, getProject, deleteProject } from "./projects.js";
import { getAdminId, getCatalogPdfLink, getSettings } from "./settings.js";
import { rejectTest, resolveTest } from "./test.js";
import { addUser, checkUser, getUser, getUserAll, setLangUser, setSubscriptionUser, updateUser } from "./users.js";
import { addViewed, getAllViewed, updateViewed } from "./viewed.js";

const $db = {
	test: {
		resolve: resolveTest,
		reject: rejectTest,
	},
	viewed: {
		add: addViewed,
		getAll: getAllViewed,
		update: updateViewed,
	},
	users: {
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
	projects: {
		get: getProject,
		getAll: getAllProject,
		add: addProject,
		update: updateProject,
		delete: deleteProject,
	},
	consults: {
		add: addConsults,
		getAll: getAllConsults,
	}
}

export default $db