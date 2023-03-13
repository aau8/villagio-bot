import $db from "../db/index.js"

const checkIsAdmin = async (id) => {
	const adminIdArr = await $db.settings.getAdminId()
	return adminIdArr.some(adminId => adminId === id)
}

export default checkIsAdmin