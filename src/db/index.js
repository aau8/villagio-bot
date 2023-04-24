import { addUser, checkUser, getUser, getUserAll, setLangUser, setSubscriptionUser, updateUser } from "./users.js";
import { addSelectionResults, getAllSelectionResults, getSelectionResults } from "./selectionResults.js";
import { addProject, updateProject, getAllProject, getProject, deleteProject } from "./projects.js";
import { addViewed, getAllViewed, updateViewed } from "./viewed.js";
import { addConsults, getAllConsults } from "./consults.js";
import { rejectTest, resolveTest } from "./test.js";

const $db = {
	test: {
		resolve: resolveTest,
		reject: rejectTest,
	},
	selectionResults: {
		add: addSelectionResults,
		getAll: getAllSelectionResults,
		get: getSelectionResults,
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