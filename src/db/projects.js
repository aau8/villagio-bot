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
		throw new Error(err)
	}
}

export const getAllProject = async (options) => {
	try {
		await $mongo.connect()
		return await $mongo
			.db($mongo.dbName)
			.collection($mongo.collection.projects)
			.find(options).toArray()
	}
	catch(err) {
		throw new Error(err)
	}
}

export const getProject = async (projectId) => {
	try {
		await $mongo.connect()
		return await $mongo
			.db($mongo.dbName)
			.collection($mongo.collection.projects)
			.findOne({ project_id: projectId })
	}
	catch(err) {
		throw new Error(err)
	}
}

export const updateProject = async (options, set) => {
	try {
		await $mongo.connect()
		return await $mongo
			.db($mongo.dbName)
			.collection($mongo.collection.projects)
			.updateMany(options, { $set: set })
	}
	catch(err) {
		throw new Error(err)
	}
}

export const deleteProject = async (options) => {
	try {
		await $mongo.connect()
		return await $mongo
			.db($mongo.dbName)
			.collection($mongo.collection.projects)
			.deleteOne(options)
	}
	catch(err) {
		throw new Error(err)
	}
}