import { Scenes, session } from "telegraf"
import $screen from "./screens/index.js"
import setUserData from "./middlewares/setUserData.js"
import changeLang from "./actions/changeLang.js"
import $bot from "./bot.js"
import scenes from "./screens/public/scenes/index.js"
import "./locales/index.js"
import { projectPrefix } from "./screens/public/project.js"
import { statisticPrefix } from "./screens/private/statistic.js"
import { setQuest } from "./contexts/ConsultContext.js"
import { catalogPrefix } from "./screens/public/catalog.js"

const stage = new Scenes.Stage([ ...scenes ])

$bot.use(session())
$bot.use(stage.middleware())
$bot.use(setUserData)

//////////////////////////////
//////////  Публичный доступ
//////////////////////////////

// Главный экран (публичный)
$bot.command(/^start[:]?/, $screen.public.start)
$bot.action(/^start[:]?/, $screen.public.start)

// Помощь
$bot.command("help", $screen.public.help)

// Изменить язык
$bot.command("change_lang", changeLang)
$bot.action("change_lang", changeLang)

// Управление подпиской
$bot.command("subscribe", $screen.public.subscribe)
$bot.action("subscribe", $screen.public.subscribe)

// Включить/отключить подписку
$bot.action('subscribe_change', $screen.public.change_subscribe)

// Каталог
$bot.command("catalog", $screen.public.catalog)
$bot.action("catalog", $screen.public.catalog)

// Каталог (категории)
$bot.command(new RegExp(`^${catalogPrefix}`), $screen.public.catalog_cat)
$bot.action(new RegExp(`^${catalogPrefix}`), $screen.public.catalog_cat)

// Каталог (pdf-документ)
$bot.command("catalog_pdf", $screen.public.catalog_pdf)
$bot.action("catalog_pdf", $screen.public.catalog_pdf)

// Получить проект
$bot.command(new RegExp(`^${projectPrefix}`), $screen.public.project)
$bot.action(new RegExp(`^${projectPrefix}`), $screen.public.project)

// Квиз "Подобрать проект"
$bot.command('quiz_select_project', ctx => {
	ctx.scene.enter('quiz_select_project')
})
$bot.action('quiz_select_project', ctx => {
	ctx.scene.enter('quiz_select_project')
})

// Квиз "Получить консультацию"
$bot.command('consult', ctx => {
	// setQuest(ctx)
	ctx.scene.enter('consult')
})
$bot.action(/^consult:/, ctx => {
	setQuest(ctx.match.input.replace(ctx.match[0], ''))
	ctx.scene.enter('consult')
})

//////////////////////////////
//////////  Приватный доступ (Админ. панель)
//////////////////////////////

// Главный экран (приватный)
$bot.command("admin", $screen.private.start)
$bot.action("admin", $screen.private.start)

// Справка
$bot.command("admin_help", $screen.private.help)
$bot.action("admin_help", $screen.private.help)

// Статистика
$bot.command("statistic", $screen.private.statistic)
$bot.action("statistic", $screen.private.statistic)

// Получить статистику по категории
$bot.command(new RegExp(`^${statisticPrefix}`), $screen.private.statistic_cat)
$bot.action(new RegExp(`^${statisticPrefix}`), $screen.private.statistic_cat)

// Получить csv-файл по категории
$bot.command(new RegExp(`^csv_`), $screen.private.statistic_csv)
$bot.action(new RegExp(`^csv_`), $screen.private.statistic_csv)

export default $bot