import $db from "../../db/index.js"
import send from "../../helpers/send.js"

const sendStartPublic = async (ctx) => {
	const user = ctx.from
	const userExists = await $db.user.check({ tg_id: user.id })

	if (!userExists) {
		await $db.user.add(raiseUserData(user))
	}

	const text = `
Здравствуйте! Я бот по подбору недвижимости в ОАЭ. У меня Вы можете:
1. Самостоятельно подобрать объект по Вашим параметрам
2. Скачать каталог лучших предложений на рынке ОАЭ
3. Получить консультацию эксперта по подбору недвижимости
	`

	send(ctx, text, {
		reply_markup: {
			inline_keyboard: [
				[ { text: "🤖 Подобрать объект", callback_data: "dd" }, ],
				[ { text: "🏠 Каталог объектов", callback_data: "dd" }, ],
				[ { text: "☎ Получить консультацию", callback_data: "dd" }, ],
				[ { text: "📣 Управление подпиской ", callback_data: "dd" }, ],
				[ { text: "🇬🇧 Change the language", callback_data: "dd" }, ],
			]
		}
	})
}

export default sendStartPublic