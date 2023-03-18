import { MongoClient } from "mongodb"
import * as dotenv from "dotenv"

dotenv.config()

const mongoClient = new MongoClient(process.env.MONGODB_URL)
const $mongo = Object.assign(mongoClient, {
    dbName: "villagio",
    collection: {
        settings: "settings",
        users: "users",
		projects: "projects",
    },
})

export default $mongo