import send from "../../helpers/send.js"

const sendSubscribePublic = async (ctx) => {

	send(ctx, ctx.$locale.subscribe.text, {
		reply_markup: {
			inline_keyboard: [
				[
					{ text: ctx.$locale.subscribe.keyboard[0], callback_data: "dd" }
				],
				[
					{ text: ctx.$locale.key_back, callback_data: "start" }
				]
			]
		}
	})
}

export default sendSubscribePublic