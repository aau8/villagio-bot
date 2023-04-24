import { Telegraf } from "telegraf"
import * as dotenv from "dotenv"
dotenv.config()

const $bot = new Telegraf(process.env.TG_BOT_TOKEN)

// $bot.telegram.sendMessage('fds', 'fds', {
// 	reply_markup: {
// 		inline_keyboard: [
// 			Markup.inlineKeyboard()
// 		]
// 	}
// })

export default $bot