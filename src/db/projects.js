import $mongo from "./mongo.js"

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

export const getProject = async (options) => {
	try {
		await $mongo.connect()
		return await $mongo
			.db($mongo.dbName)
			.collection($mongo.collection.projects)
			.find(options).toArray()
	}
	catch(err) {
		console.log(err)
		throw Error(err)
	}
}

export const changeProject = async (options, set) => {
	try {
		await $mongo.connect()
		return await $mongo
			.db($mongo.dbName)
			.collection($mongo.collection.projects)
			.updateMany(options, set)
	}
	catch(err) {
		console.log(err)
		throw Error(err)
	}
}






// $db.project.add({
// 	name: "9999999 000000",
// 	description: "111 344",
// 	city: "Абу-Даби",
// 	status: "Готовый",
// 	url: "https://villagio-vip.ru/villages/111/",
// 	images: [
// 		"https://static.villagio-vip.ru/cache-new/800x600/c2/91/c291e836-898d-407f-9ee3-39f09cb263b9.webp.jpg",
// 		"https://static.villagio-vip.ru/cache-new/800x600/a9/6f/a96f0a31-d952-45b9-839a-c71512dd94e3.webp.jpg",
// 	],
// 	price: {
// 		min: 656000,
// 		max: 1656000,
// 	},
// 	type: "таунхаус",
//  project_id: null
// })