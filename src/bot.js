import { Telegraf, Scenes, session } from "telegraf"
import * as dotenv from "dotenv"
import $mongo from "./db/config.js"
import $screen from "./screens/index.js"
import $db from "./db/index.js"
import setUserData from "./middlewares/setUserData.js"
import changeLang from "./actions/changeLang.js"
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

bot.use(setUserData)

// Главный экран (публичный)
bot.command("start", $screen.public.start)
bot.action("start", $screen.public.start)

// Главный экран (приватный)
bot.command("admin", $screen.private.start)
bot.action("admin", $screen.private.start)

// Изменить язык
bot.action("change-lang", changeLang)


bot.launch()

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"))
process.once("SIGTERM", () => bot.stop("SIGTERM"))
