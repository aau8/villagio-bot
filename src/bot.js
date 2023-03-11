import { Telegraf, Scenes, session } from "telegraf"
import * as dotenv from "dotenv"
// import { db, send } from "./helpers/index.js"
import fs from 'fs'
import { getAllUsers } from "./db/users.js"
import $mongo from "./db/config.js"
import $db from "./db/index.js"
import raiseObjectFrom from "./helpers/raiseObjectFrom.js"
// import $mongo from "./db/config.js"


// import { sendStart } from "./modules/general/index.js"

// Импорт модуля "Book"
// import bookScenes from "./modules/book/scenes/index.js"
// import bookHandlers from "./modules/book/handlers.js"

dotenv.config()

const bot = new Telegraf(process.env.TG_BOT_TOKEN)
bot.context.mongo = $mongo



// const stage = new Scenes.Stage([...bookScenes])

// bot.use(session())
// bot.use(stage.middleware())

//////////////////////////////
//////////  Обработчики
//////////////////////////////

// Модуль "Book"
// bookHandlers(bot)


// Главный экран
// bot.command("start", sendStart)
// bot.action("start", sendStart)



bot.command("start", ctx => {
	ctx.reply('Hello')

	const from = raiseObjectFrom(ctx.update.message.from)

	console.log(from)

	// console.log(ctx)

	// $db.user.add({ ...from,  })
	// .then(res => {

	// 	$db.user.getAll()
	// 	.then(data => {
	// 		console.log(data)
	// 	})
	// })

})

bot.launch()

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"))
process.once("SIGTERM", () => bot.stop("SIGTERM"))
