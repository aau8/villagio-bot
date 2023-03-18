import { ObjectId } from "mongodb"
import $mongo from "./mongo.js"

/**
 * Получить настройки бота из БД
 * @returns object
 */
export const getSettings = async () => {
	try {
		await $mongo.connect()
		return await $mongo
			.db($mongo.dbName)
			.collection($mongo.collection.settings)
			.find({ _id: ObjectId('640c70e25a354e7751ec7de6') }).toArray()
	}
	catch(err) {
		console.log(err)
		throw Error(err)
	}
}

/**
 * Получить id пользователя с правами админа
 * @returns number
 */
export const getAdminId = async () => {
	try {
		const data = await getSettings()
		return data[0].admin_id
	}
	catch(err) {
		console.log(err)
		throw Error(err)
	}
}

/**
 * Получить ссылку на url каталога
 * @returns string
 */
export const getCatalogPdfLink = async () => {
	try {
		const data = await getSettings()
		return data[0].catalog_url
	}
	catch(err) {
		console.log(err)
		throw Error(err)
	}
}