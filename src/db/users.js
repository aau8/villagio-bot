import $mongo from "./mongo.js"

/**
 * Получить всех пользователей по указанному фильтру
 * @param {object} options - опции фильтра, по которым нужно искать пользователей
 * @returns object
 */
export const getUserAll = async (options = {}) => {
	try {
		if (typeof options !== 'object') throw Error('users must be object')
		await $mongo.connect()
		return await $mongo
			.db($mongo.dbName)
			.collection($mongo.collection.users)
			.find(options).toArray()
	}
	catch(err) {
		throw new Error(err)
	}
}

/**
 * Обновить пользователя
 * @param {object} searchOptions - опции записей, которые нужно обновить
 * @param {object} updateOptions - что нужно обновить
 * @returns
 */
export const updateUser = async (searchOptions = {}, updateOptions = {}) => {
	try {
		if (typeof updateOptions !== 'object') throw Error('updateOptions must be object')
		if (typeof searchOptions !== 'object') throw Error('searchOptions must be object')
		await $mongo.connect()
		return await $mongo
			.db($mongo.dbName)
			.collection($mongo.collection.users)
			.updateOne(searchOptions, { $set: updateOptions })
	}
	catch(err) {
		throw new Error(err)
	}
}

/**
 * Получить одного пользователя
 * @param {object} options опции фильтра
 * @returns
 */
export const getUser = async (options = {}) => {
	try {
		await $mongo.connect()
		return await $mongo
			.db($mongo.dbName)
			.collection($mongo.collection.users)
			.findOne(options)
	}
	catch(err) {
		throw new Error(err)
	}
}

/**
 * Добавить пользователя
 * @param {array} user - добавить пользователя
 * @returns object - была ли создана запись (true/false) и ObjectId записи
 */
export const addUser = async (user = {}) => {
	try {
		if (typeof user !== 'object') throw Error('users must be object')
		await $mongo.connect()
		return await $mongo
			.db($mongo.dbName)
			.collection($mongo.collection.users)
			.insertOne(user)
	}
	catch(err) {
		throw new Error(err)
	}
}

/**
 * Проверить, существует ли пользователь
 * @param {object} options - данные пользователя, по которым нужно найти запись
 * @returns boolean
 */
export const checkUser = async (options = {}) => {
	try {
		if (typeof options !== 'object') throw Error('users must be object')
		const user = await getUser(options)
		return !!user
	}
	catch(err) {
		throw new Error(err)
	}
}

/**
 * Изменить язык пользователя
 * @param {string} lang - язык пользователя
 * @param {object} options - данные пользователя, по которым нужно найти запись
 * @returns boolean
 */
export const setLangUser = async (lang, options = {}) => {
	try {
		return updateUser(options, { lang: lang })
	}
	catch(err) {
		throw new Error(err)
	}
}

/**
 * Изменить подписку
 * @param {string} subscribeOn - Подписка включена
 * @param {object} options - данные пользователя, по которым нужно найти запись
 * @returns boolean
 */
export const setSubscriptionUser = async (subscribeOn, options = {}) => {
	try {
		return updateUser(options, { subscription: subscribeOn })
	}
	catch(err) {
		throw new Error(err)
	}
}