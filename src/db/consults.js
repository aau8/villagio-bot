import $mongo from "./mongo.js"

/**
 * Добавить заявку на консультацию
 * @param {array} data - данные заявки
 * @returns object - была ли создана запись (true/false) и ObjectId записи
 */
export const addConsult = async (data = {}) => {
	try {
		await $mongo.connect()
		return await $mongo
			.db($mongo.dbName)
			.collection($mongo.collection.consults)
			.insertOne(data)
	}
	catch(err) {
		console.log(err)
		throw Error(err)
	}
}