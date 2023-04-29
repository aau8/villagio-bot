import { config as dotenvConfig } from "dotenv"
import { MongoClient } from "mongodb"

dotenvConfig()

const mongoClient = new MongoClient(process.env.MONGODB_URL)
const $mongo = Object.assign(mongoClient, {
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