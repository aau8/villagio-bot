import { MongoClient, ObjectId } from "mongodb"
import * as dotenv from "dotenv"

dotenv.config()

const mongoClient = new MongoClient(process.env.MONGODB_URL)
const $mongo = Object.assign(mongoClient, {
    dbName: "villagio",
    collect: {
        settings: "settings",
        users: "users",
    },
})

export default $mongo