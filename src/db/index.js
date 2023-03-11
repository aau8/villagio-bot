import { addUsers, getAllUsers } from "./users.js";
import $mongo from "./config.js";

const $db = {
	user: {
		getAll: getAllUsers,
		add: addUsers,
	}
}

export default $db