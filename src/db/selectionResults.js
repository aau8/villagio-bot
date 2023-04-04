import $mongo from "./mongo.js"

export const addSelectionResults = async ({ projects, city, status, type, price, timestamp }) => {
	try {
		await $mongo.connect()
		return await $mongo
			.db($mongo.dbName)
			.collection($mongo.collection.selectionResults)
			.insertOne({
				projects,
				city,
				status,
				type,
				price,
				timestamp,
			})
	}
	catch(err) {
		console.log(err)
		throw Error(err)
	}
}

export const getAllSelectionResults = async (options) => {
	try {
		await $mongo.connect()
		return await $mongo
			.db($mongo.dbName)
			.collection($mongo.collection.selectionResults)
			.find(options).toArray()
	}
	catch(err) {
		console.log(err)
		throw Error(err)
	}
}

export const getSelectionResults = async (options) => {
	try {
		await $mongo.connect()
		return await $mongo
			.db($mongo.dbName)
			.collection($mongo.collection.selectionResults)
			.findOne(options)
	}
	catch(err) {
		console.log(err)
		throw Error(err)
	}
}