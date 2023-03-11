import $db from "../db/index.js"

const checkIsAdmin = async (id) => {
	const adminId = await $db.settings.getAdminId()
	return adminId === id
}

export default checkIsAdmin