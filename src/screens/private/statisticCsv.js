import checkIsAdmin from "../../helpers/checkIsAdmin.js"
import send from "../../helpers/send.js"
import { $i18n } from "../../locales/index.js"
import { parse } from "json2csv"
import {stringify} from "csv-stringify"
import $db from "../../db/index.js"
import fs from "fs"
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import $bot from "../../bot.js"

const __dirname = dirname(fileURLToPath(import.meta.url));

export const statisticCsvPrefix = 'statistic_csv_'
const sendStatCsvPrivate = async (ctx) => {
	const user = ctx.from
	const isAdmin = await checkIsAdmin(user.id)
	if (!isAdmin) {
		console.log(`Пользователь @${user.username} (${user.id}) пытался воспользоваться админ. панелью`)
		return
	}

	const commandText = (ctx.match ? ctx.match.input : ctx.message.text).replace('csv_', '')
	// const projects
	console.log(commandText)
	const data = await $db[commandText].getAll()
	// const parseData = parse(data)
	// console.log(csv)
	// $db.project.get()
	// console.log(__dirname)
	// fs.openSync('./files/file.csv', 'w', err => {
	// 	if (err) throw err
	// 	console.log('file created')
	// })

	// fs.writeFile
	// var data = [
	// 	{ ani: "Doge", desc: "Goodest Boy" },
	// 	{ ani: "Cate", desc: "Evil" },
	// 	{ ani: "Birb", desc: "Happy Wings" }
	//   ];


	console.log('ok')
	stringify(data, {
		header: true,
		// columns: {
		// 	_id: 'ID записи',
		// 	td_id: "Telegram ID пользователя",
		// 	start_date: "Дата первого запуска бота",
		// 	is_bot: "Это бот",
		// 	first_name: "Имя",
		// 	last_name: "Фамилия",
		// 	username: "Никнейм",
		// 	language_code: "Язык профиля",
		// 	lang: "Используемый язык",
		// 	phone: "Номер телефона",
		// 	subscription: "Подписка",
		// 	viewed_realty: "Просмотренные объекты"
		// },
	}, (err, output) => {
		if (err) throw err
		console.log(output)

		fs.writeFile(`./files/${commandText}.csv`, output, { encoding: 'utf-8' }, err => {
			if (err) throw err

			return ctx.sendDocument({ source: fs.readFileSync(`./files/${commandText}.csv`), filename: `${commandText}_statistics.csv` })
		})
	})

	// $bot.telegram.sendDocument(chat.id, { so })

	// return send(ctx, "Здесь будет csv-файл", {
	// 	reply_markup: {
	// 		inline_keyboard: [
	// 			[ { text: $i18n('private.statistic', { lng: 'ru' }), callback_data: "statistic" }, ],
	// 		]
	// 	}
	// })
}

export default sendStatCsvPrivate