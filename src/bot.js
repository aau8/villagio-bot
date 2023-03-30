import { Telegraf } from "telegraf"
import * as dotenv from "dotenv"
import $mongo from "./db/mongo.js"
import $db from "./db/index.js"
dotenv.config()

const $bot = new Telegraf(process.env.TG_BOT_TOKEN, {
	// telegram: {
	// 	webhookReply: true,
	// }
})

export default $bot

// $bot.telegram

// $bot.telegram.deleteMessage

// $db.project.add({
// 	name: "9999999 000000",
// 	description: "111 344",
// 	city: "Абу-Даби",
// 	status: "Готовый",
// 	url: "https://villagio-vip.ru/villages/111/",
// 	images: [
// 		"https://static.villagio-vip.ru/cache-new/800x600/c2/91/c291e836-898d-407f-9ee3-39f09cb263b9.webp.jpg",
// 		"https://static.villagio-vip.ru/cache-new/800x600/a9/6f/a96f0a31-d952-45b9-839a-c71512dd94e3.webp.jpg",
// 	],
// 	price: {
// 		min: 656000,
// 		max: 1656000,
// 	},
// 	type: "вилла",
//  project_id: null
// })

// $db.project.change({ project_id: null }, { $set: { project_id: 414 } })