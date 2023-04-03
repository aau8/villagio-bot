import { stringify } from "csv-stringify"
import $bot from "../src/bot.js"
import $db from "../src/db/index.js"
import xlsx from "json-as-xlsx"
import * as XLSX from "xlsx"
import * as dotenv from "dotenv"
import formidable from "formidable"
import { ObjectId } from "mongodb"
import { updateViewed } from "../src/db/viewed.js"
import checkIsAdmin from "../src/helpers/checkIsAdmin.js"
dotenv.config()

const methods = {}

methods.get = async (req, res) => {
	const query = req.query
	const adminId = query.admin_id

	console.log(checkIsAdmin(adminId), adminId)
	if (!checkIsAdmin(adminId)) {
		res.send('У вас нет прав доступа')
		return
	}

	const format = query.format
	const cat = query.cat
	const data = await $db[cat].getAll()
	const date = new Date().toLocaleDateString()
	let parseData = data.map(d => {

		if (cat === 'projects') {
			return {
				"ID проекта": d.project_id,
				"Название": d.name,
				"Описание": d.description,
				"Тип": d.type,
				"Статус": d.status,
				"Город": d.city,
				"Цена (мин)": d.price.min,
				"Цена (макс)": d.price.max,
				"Ссылка": d.url,
				"Ссылки на изображения": d.images?.join(', ') || '',
				"ID интересовавшихся пользователей": d.users?.join(', ') || '',
			}
		} else if (cat === 'users') {
			return {
				"ID Telegram": d.tg_id,
				"Имя": d.first_name,
				"Ник": d.username,
				"Номер телефона": d.phone,
				"Язык в Telegram": d.language_code,
				"Используемый язык": d.lang,
				"Подписка": d.subscription ? 'Включена' : 'Выключена',
				"Начало использования бота": new Date(d.start_date).toLocaleString(),
			}
		} else if (cat === 'consults') {
			return {
				"Вопрос": d.quest,
				"Имя": d.name,
				"Номер телефона": d.phone,
				"Способ связи": d.commun,
				"Дата и время заявки": new Date(d.timestamp).toLocaleString(),
			}
		} else if (cat === 'viewed') {
			return {
				"ID проекта": d.project_id,
				"ID пользователя": d.user,
				"Дата и время просмотра": new Date(d.timestamp).toLocaleString(),
			}
		}
	})

	if (format === 'xlsx') {
		const workSheet = XLSX.utils.json_to_sheet(parseData)
		const workBook = XLSX.utils.book_new()
		XLSX.utils.book_append_sheet(workBook, workSheet, cat)
		const workBody = XLSX.write(workBook, { bookType: "xlsx", type: "buffer" })

		res.setHeader("Content-Disposition", `attachment; filename="statistics_${cat}_(${date}).xlsx"`)
		res.send(workBody)
	}
	else if (format === 'json') {
		res.setHeader("Content-Disposition", `attachment; filename="statistics_${cat}_(${date}).json"`)
		res.setHeader('Content-Type', `text/json`)
		res.send(data)
	}
	else {
		res.send('Неправильный запрос')
	}
}

const statistic = async (req, res) => {
	try {
		if (req.method === 'GET') {
			methods.get(req, res)
			return
		}
	} catch(err) {
		res.status(500).send('Internal Server Error')
		throw err
	}
}

export default statistic