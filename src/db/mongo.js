import { MongoClient } from "mongodb"
import * as dotenv from "dotenv"

dotenv.config()

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