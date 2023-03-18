import { Telegraf } from "telegraf"
import * as dotenv from "dotenv"
import $mongo from "./db/mongo.js"
dotenv.config()

const $bot = new Telegraf(process.env.TG_BOT_TOKEN)

export default $bot