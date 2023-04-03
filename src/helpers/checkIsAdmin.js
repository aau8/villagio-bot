import { ADMINS_ID } from "../config.js"
import $db from "../db/index.js"

const checkIsAdmin = (id) => {
	return ADMINS_ID.some(adminId => adminId === Number(id))
}

export default checkIsAdmin