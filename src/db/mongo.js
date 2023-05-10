import { config as dotenvConfig } from "dotenv"
import { MongoClient } from "mongodb"

dotenvConfig()
const MONGODB_URL = process.env.MONGODB_URL
const mongoClient = new MongoClient(MONGODB_URL)
const $mongo = Object.assign(mongoClient, {
	url: MONGODB_URL,
    dbName: "villagio",
    collection: {
        users: "users",
		projects: "projects",
		consults: "consults",
		viewed: "viewed",
		selectionResults: "selection_results",
    },
})

export default $mongo