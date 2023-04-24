import { Telegraf } from "telegraf"
import * as dotenv from "dotenv"
dotenv.config()

const $bot = new Telegraf(process.env.TG_BOT_TOKEN)

// $bot.telegram.sendMessage(3232, 'fds', {
// 	reply_markup: {
// 		keyboard: [
// 			{ text: 'hello' }
// 		]
// 	}
// })
export default $bot