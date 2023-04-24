// import checkIsAdmin from "../../helpers/checkIsAdmin.js"
// import {stringify} from "csv-stringify"
// import $db from "../../db/index.js"

// export const statisticCsvPrefix = 'statistic_csv_'
// const sendStatCsvPrivate = async (ctx) => {
// 	const user = ctx.from
// 	const isAdmin = checkIsAdmin(user.id)
// 	if (!isAdmin) {
// 		console.log(`Пользователь @${user.username} (${user.id}) пытался воспользоваться админ. панелью`)
// 		return
// 	}

// 	const commandText = (ctx.match ? ctx.match.input : ctx.message.text).replace('csv_', '')
// 	const data = await $db[commandText].getAll()

// 	stringify(data, {
// 		header: true,
// 	}, (err, output) => {
// 		if (err) throw err

// 		return ctx.sendDocument({ source: new Buffer(output), filename: `${commandText}_statistics.csv` })
// 	})
// }

// export default sendStatCsvPrivate