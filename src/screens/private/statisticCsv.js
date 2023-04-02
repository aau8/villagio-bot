import checkIsAdmin from "../../helpers/checkIsAdmin.js"
import {stringify} from "csv-stringify"
import $db from "../../db/index.js"
import fs from "fs"

export const statisticCsvPrefix = 'statistic_csv_'
const sendStatCsvPrivate = async (ctx) => {
	const user = ctx.from
	const isAdmin = await checkIsAdmin(user.id)
	if (!isAdmin) {
		console.log(`Пользователь @${user.username} (${user.id}) пытался воспользоваться админ. панелью`)
		return
	}

	const commandText = (ctx.match ? ctx.match.input : ctx.message.text).replace('csv_', '')
	const data = await $db[commandText].getAll()

	stringify(data, {
		header: true,
	}, (err, output) => {
		if (err) throw err
		console.log(output)

		fs.writeFile(`./files/${commandText}.csv`, output, { encoding: 'utf-8' }, err => {
			if (err) throw err

			return ctx.sendDocument({ source: fs.readFileSync(`./files/${commandText}.csv`), filename: `${commandText}_statistics.csv` })
		})
	})
}

export default sendStatCsvPrivate