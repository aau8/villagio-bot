// /**
//  * Возвращает все найденные записи
//  * @param {object} ctx
//  * @param {string} collectionName название колекции в БД, в которой надо искать записи
//  * @param {object} data данные, по которым нужно искать записи
//  * @returns вернет объект с данными найденных записей
//  */
// export const find = async (ctx, collectionName, data) => {
//     try {
//         await ctx.mongoClient.connect()
//         const db = ctx.mongoClient.db(ctx.mongo.dbName)
//         const collection = db.collection(ctx.mongo.collection[collectionName])
//         const result = await collection.find(data).toArray()

//         return result
//     } catch (err) {
//         throw Error(err)
//     } finally {
//         ctx.mongoClient.close()
//     }
// }

// /**
//  * Возвращает 1 найденую запись
//  * @param {object} ctx
//  * @param {string} collectionName название колекции в БД, в которой надо искать запись
//  * @param {object} data данные, по которым нужно искать запись
//  * @returns вернет объект с данными записи или null
//  */
// export const findOne = async (ctx, collectionName, data) => {
//     try {
//         await ctx.mongoClient.connect()
//         const db = ctx.mongoClient.db(ctx.mongo.dbName)
//         const collection = db.collection(ctx.mongo.collection[collectionName])
//         const result = await collection.findOne(data)

//         return result
//     } catch (err) {
//         throw Error(err)
//     } finally {
//         ctx.mongoClient.close()
//     }
// }

// /**
//  * Добавить 1 новую запись в БД
//  * @param {object} ctx
//  * @param {string} collectionName название колекции в БД
//  * @param {object} data данные новой записи
//  * @returns если запись была добавлена, вернет объект с ObjectId добавленной записи, если нет, то false
//  */
// export const insertOne = async (ctx, collectionName, data) => {
//     try {
//         await ctx.mongoClient.connect()
//         const db = ctx.mongoClient.db(ctx.mongo.dbName)
//         const collection = db.collection(ctx.mongo.collection[collectionName])
//         const result = await collection.insertOne(data)

//         return result
//     } catch (err) {
//         console.log(err)
//         return false
//     } finally {
//         ctx.mongoClient.close()
//     }
// }

// /**
//  * Удаляет 1 запись в БД
//  * @param {object} ctx
//  * @param {string} collectionName название колекции в БД
//  * @param {object} data данные записи
//  * @returns если запись была удалена, выполнится callback() и вернется результат удаления, если нет, то false
//  */
// export const removeOne = async (ctx, collectionName, data, callback, err) => {
//     try {
//         await ctx.mongoClient.connect()
//         const db = ctx.mongoClient.db(ctx.mongo.dbName)
//         const collection = db.collection(ctx.mongo.collection[collectionName])
//         const result = await collection.findOneAndDelete(data)

//         if (result) {
//             if (callback) callback()
//             return result
//         }
//         return result
//     } catch (errorText) {
//         if (err) {
//             err(errorText)
//         } else {
//             console.log(errorText)
//             return false
//         }
//     } finally {
//         ctx.mongoClient.close()
//     }
// }

// /**
//  * Обновляет 1 запись в БД
//  * @param {object} ctx
//  * @param {string} collectionName название колекции в БД
//  * @param {object} data данные записи
//  * @returns если запись была обновлена, выполнится callback() и вернется результат удаления, если нет, то false
//  */
// export const updateOne = async (ctx, collectionName, filter, update, callback, err) => {
//     try {
//         await ctx.mongoClient.connect()

//         const db = ctx.mongoClient.db(ctx.mongo.dbName)
//         const collection = db.collection(ctx.mongo.collection[collectionName])
//         const result = await collection.updateOne(filter, update)

//         if (result) {
//             if (callback) callback()
//             return result
//         }
//     } catch (errorText) {
//         if (err) {
//             err(errorText)
//         } else {
//             console.log(errorText)
//             return false
//         }
//     } finally {
//         await ctx.mongoClient.close()
//     }
// }

// // /**
// //  * Добавить несколько новых записей в БД
// //  * @param {object} ctx
// //  * @param {string} collectionName название колекции в БД
// //  * @param {object} data данные новых записей
// //  * @returns если пользователь был добавлен, вернет объект с ObjectId добавленного пользователя, если нет, то false
// //  */
// // export const insert = async (ctx, collectionName, data) => {
// //     try {
// //         await ctx.mongoClient.connect()
// //         const db = ctx.mongoClient.db(ctx.mongo.dbName)
// //         const collection = db.collection(collectionName)
// //         const result = await collection.insertOne(data)

// //         return result
// //     } catch (err) {
// //         console.log(err)
// //         return false
// //     } finally {
// //         ctx.mongoClient.close()
// //     }
// // }

// export default {
//     find,
//     findOne,
//     insertOne,
//     removeOne,
//     updateOne,
// }
