import { statisticPrefix } from "./screens/private/statistic.js"
import { catalogPrefix } from "./screens/public/catalog.js"
import { projectPrefix } from "./screens/public/project.js"
import setUserData from "./middlewares/setUserData.js"
import scenes from "./screens/public/scenes/index.js"
import changeLang from "./actions/changeLang.js"
import { Scenes, Telegraf, session } from "telegraf"
import $screen from "./screens/index.js"
import $bot from "./bot.js"
import "./locales/index.js"

const stage = new Scenes.Stage([ ...scenes ])

$bot.use(session())
$bot.use(stage.middleware())
$bot.use(setUserData)
$bot.use(Telegraf.log())


//////////////////////////////
//////////  Публичный доступ
//////////////////////////////

// Главный экран (публичный)
$bot.command(/^start[:]?/, $screen.public.start)
$bot.action(/^start[:]?/, async ctx => {
	await ctx.answerCbQuery()
	$screen.public.start(ctx)
})

// Помощь
$bot.command("help", $screen.public.help)

// Изменить язык
// $bot.command("change_lang", changeLang)
// $bot.action("change_lang", async ctx => {
// 	changeLang(ctx)
// })

// Управление подпиской
$bot.command("subscribe", $screen.public.subscribe)
$bot.action("subscribe", async ctx => {
	// await ctx.answerCbQuery()
	$screen.public.subscribe(ctx)
})

// Включить/отключить подписку
$bot.action('subscribe_change', async ctx => {
	// await ctx.answerCbQuery()
	$screen.public.change_subscribe(ctx)
})

// Каталог
$bot.command("catalog", $screen.public.catalog)
$bot.action("catalog", async ctx => {
	await ctx.answerCbQuery()
	$screen.public.catalog(ctx)
})

// Каталог (категории)
$bot.command(new RegExp(`^${catalogPrefix}`), $screen.public.catalog_cat)
$bot.action(new RegExp(`^${catalogPrefix}`), async ctx => {
	// await ctx.answerCbQuery()
	$screen.public.catalog_cat(ctx)
})

// Каталог (pdf-документ)
$bot.command("catalog_pdf", $screen.public.catalog_pdf)
$bot.action("catalog_pdf", async ctx => {
	// await ctx.answerCbQuery()
	$screen.public.catalog_pdf(ctx)
})

// Получить проект
$bot.command(new RegExp(`^${projectPrefix}`), $screen.public.project)
$bot.action(new RegExp(`^${projectPrefix}`), async ctx => {
	// await ctx.answerCbQuery()
	$screen.public.project(ctx)
})

// Квиз "Подобрать проект"
$bot.command('quiz_select_project', ctx => {
	ctx.scene.enter('quiz_select_project')
})
$bot.action('quiz_select_project', async ctx => {
	// await ctx.answerCbQuery()
	ctx.scene.enter('quiz_select_project')
})

// Квиз "Получить консультацию"
$bot.command('consult', ctx => {
	ctx.scene.enter('consult')
})
$bot.action(/^consult[:]?/, async ctx => {
	// await ctx.answerCbQuery()
	ctx.scene.enter('consult', { quest: ctx.match.input.replace(ctx.match[0], '') })
})

//////////////////////////////
//////////  Приватный доступ (Админ. панель)
//////////////////////////////

// Главный экран (приватный)
$bot.command("admin", $screen.private.start)
$bot.action("admin", async ctx => {
	// await ctx.answerCbQuery()
	$screen.private.start(ctx)
})

// Справка
$bot.command("admin_help", $screen.private.help)
$bot.action("admin_help", async ctx => {
	// await ctx.answerCbQuery()
	$screen.private.help(ctx)
})

// Статистика
$bot.command("statistic", $screen.private.statistic)
$bot.action("statistic", async ctx => {
	// await ctx.answerCbQuery()
	$screen.private.statistic(ctx)
})

// Получить статистику по категории
$bot.command(new RegExp(`^${statisticPrefix}`), $screen.private.statistic_cat)
$bot.action(new RegExp(`^${statisticPrefix}`), $screen.private.statistic_cat)

export default $bot