import $db from "../../db/index.js"
import checkIsAdmin from "../../helpers/checkIsAdmin.js"
import send from "../../helpers/send.js"

const sendStartPrivate = async (ctx) => {
	const user = ctx.from
	const isAdmin = await checkIsAdmin(user.id)
	if (!isAdmin) {
		console.log(`Пользователь @${user.username} (${user.id}) пытался воспользоваться админ. панелью`)
		return
	}

	const text = `⚙ Административная панель`
	send(ctx, text, {
		reply_markup: {
			inline_keyboard: [
				[
					{ text: "📈 Статистика", callback_data: "dd" },
					{ text: "ℹ Справка", callback_data: "help" },
				],
				[
					{ text: "✘ Выйти", callback_data: "start" },
				]
			]
		}
	})
}

export default sendStartPrivate