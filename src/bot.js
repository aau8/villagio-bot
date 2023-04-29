import { Telegraf } from "telegraf"
import { config as dotenvConfig } from "dotenv"

dotenvConfig()

const $bot = new Telegraf(process.env.TG_BOT_TOKEN)

export default $bot