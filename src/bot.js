import { Telegraf, Scenes, session } from "telegraf"
import * as dotenv from "dotenv"
// import { db, send } from "./helpers/index.js"
import fs from 'fs'
import { getUserAll } from "./db/users.js"
import $mongo from "./db/config.js"
import $db from "./db/index.js"
import raiseUserData from "./helpers/raiseObjectFrom.js"
import { getSettings } from "./db/settings.js"
import $screen from "./screens/index.js"
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



// Главный экран (публичный)
bot.command("start", $screen.public.start)
bot.action("start", $screen.public.start)

// Главный экран (приватный)
bot.command("admin", $screen.private.start)
bot.action("admin", $screen.private.start)



bot.launch()

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"))
process.once("SIGTERM", () => bot.stop("SIGTERM"))
