import send from "../../helpers/send.js"

const sendHelpPrivate = async (ctx) => {
	const text = 'ℹ Справка об админ. панели\nЗдесь описан основной функционал и команды админки.'
	send(ctx, text, {
		reply_markup: {
			inline_keyboard: [
				[
					{ text: "Обратно", callback_data: "admin" }
				]
			]
		}
	})
}

export default sendHelpPrivate