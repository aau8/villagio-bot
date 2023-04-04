import { ADMINS_ID } from "../config.js"

const checkIsAdmin = (id) => {
	return ADMINS_ID.some(adminId => adminId === Number(id))
}

export default checkIsAdmin