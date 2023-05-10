import { $i18n } from "../../locales/index.js"
import { send } from "../../helpers.js"

const sendSubscribePublic = async (ctx) => {
	const state = ctx.session.user.subscription ? 'on' : 'off'

	return send(ctx, $i18n(ctx, 'subscribe.text'), {
		reply_markup: {
			inline_keyboard: [
				[
					{ text: $i18n(ctx, `subscribe.kb.${state}`), callback_data: `subscribe_change` }
				],
				[
					{ text: $i18n(ctx, 'kb.back'), callback_data: "start" }
				]
			]
		}
	})
}

export default sendSubscribePublic