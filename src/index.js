import { Scenes, session } from "telegraf"
import * as dotenv from "dotenv"
import $screen from "./screens/index.js"
import setUserData from "./middlewares/setUserData.js"
import changeLang from "./actions/changeLang.js"
import $bot from "./bot.js"
import scenes from "./screens/public/scenes/index.js"
import "./locales/index.js"
import $db from "./db/index.js"
import { projectPrefix } from "./screens/public/project.js"

// dotenv.config()

const stage = new Scenes.Stage([ ...scenes ])

$bot.use(session())
$bot.use(stage.middleware())
$bot.use(setUserData)

//////////////////////////////
//////////  Публичный доступ
//////////////////////////////

// Главный экран (публичный)
$bot.command("main", $screen.public.start)
$bot.command("start", $screen.public.start)
$bot.action("start", $screen.public.start)

// Помощь
$bot.command("help", $screen.public.help)

// Изменить язык
$bot.command("change-lang", changeLang)
$bot.action("change-lang", changeLang)

// Управление подпиской
$bot.command("subscribe", $screen.public.subscribe)
$bot.action("subscribe", $screen.public.subscribe)

// Получить проект
// $bot.command(new RegExp(`^${projectPrefix}_`), projectExecutor)
$bot.action(new RegExp(`^${projectPrefix}:`), $screen.public.project)


//////////////////////////////
//////////  Приватный доступ (Админ. панель)
//////////////////////////////

// Главный экран (приватный)
$bot.command("admin", $screen.private.start)
$bot.action("admin", $screen.private.start)

// Справка
$bot.command("admin_help", $screen.private.help)
$bot.action("help", $screen.private.help)

$bot.command('quiz_select_project', ctx => {
	ctx.scene.enter('quiz_select_project')
})
$bot.action('quiz_select_project', ctx => {
	ctx.scene.enter('quiz_select_project')
})

$bot.launch()

// Enable graceful stop
process.once("SIGINT", () => $bot.stop("SIGINT"))
process.once("SIGTERM", () => $bot.stop("SIGTERM"))
