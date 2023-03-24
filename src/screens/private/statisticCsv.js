import checkIsAdmin from "../../helpers/checkIsAdmin.js"
import send from "../../helpers/send.js"
import { $i18n } from "../../locales/index.js"

export const statisticCsvPrefix = 'statistic_csv_'
const sendStatCsvPrivate = async (ctx) => {
	const user = ctx.from
	const isAdmin = await checkIsAdmin(user.id)
	if (!isAdmin) {
		console.log(`Пользователь @${user.username} (${user.id}) пытался воспользоваться админ. панелью`)
		return
	}

	send(ctx, "Здесь будет csv-файл", {
		reply_markup: {
			inline_keyboard: [
				[ { text: $i18n('private.statistic', { lng: 'ru' }), callback_data: "statistic" }, ],
			]
		}
	})
}

export default sendStatCsvPrivate