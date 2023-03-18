import $mongo from "./mongo"


/**
 * Добавить проект
 * @param {array} data - данные проекта
 * @returns object - была ли создана запись (true/false) и ObjectId записи
 */
export const addProject = async (data = {}) => {
	try {
		await $mongo.connect()
		return await $mongo
			.db($mongo.dbName)
			.collection($mongo.collection.projects)
			.insertOne(data)
	}
	catch(err) {
		console.log(err)
		throw Error(err)
	}
}