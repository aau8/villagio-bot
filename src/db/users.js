import $mongo from "./config.js"

export const getAllUsers = async (options = {}) => {
	try {
		await $mongo.connect()
		return await $mongo
			.db($mongo.dbName)
			.collection($mongo.collect.users)
			.find(options).toArray()
	}
	catch(err) {
		console.log(err)
		throw Error(err)
	}
	finally {
		$mongo.close()
	}
}


export const addUsers = async (users = []) => {
	try {
		if (typeof users !== 'object') throw Error('users must be object')
		if (!users.length) {
			users = [ users ]
		}

		await $mongo.connect()
		return await $mongo
			.db($mongo.dbName)
			.collection($mongo.collect.users)
			.insertMany(users)
	}
	catch(err) {
		console.log(err)
		throw Error(err)
	}
	finally {
		$mongo.close()
	}
}