import $mongo from "./mongo.js"

export const addViewed = async (userId, projectId) => {
	try {
		await $mongo.connect()
		return await $mongo
			.db($mongo.dbName)
			.collection($mongo.collection.viewed)
			.insertOne({
				user: userId,
				project_id: projectId,
				timestamp: new Date().toISOString(),
			})
	}
	catch(err) {
		throw new Error(err)
	}
}

export const getAllViewed = async (options) => {
	try {
		await $mongo.connect()
		return await $mongo
			.db($mongo.dbName)
			.collection($mongo.collection.viewed)
			.find(options).toArray()
	}
	catch(err) {
		throw new Error(err)
	}
}

export const updateViewed = async (userId, projectId) => {
	try {
		await $mongo.connect()
		return await $mongo
			.db($mongo.dbName)
			.collection($mongo.collection.viewed)
			.updateMany({}, { $rename: { project: 'project_id' } })
	}
	catch(err) {
		throw new Error(err)
	}
}