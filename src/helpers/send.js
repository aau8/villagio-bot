/**
 * @param {object} ctx
 * @param {string} text текст, который нужно отправить в сообщении
 * @param {object} extra дополнительный ui (кнопки, тип парсинга...)
 * @see https://github.com/nieopierzony/lolz-telegraf-article/blob/main/src/helpers/send.js
 */
const send = async (ctx, text, extra = {}) => {
	if (!extra.parse_mode) {
		extra.parse_mode = 'HTML'
	}
	// if (!extra.edit_message) {
	// 	extra.edit_message = false
	// }

	// console.log(ctx.updateType)

    try {
        if (ctx.updateType === "message" || extra.not_edit_message) {
			// console.log('reply')
            return await ctx.reply(text, extra)
        } else if (ctx.updateType === "callback_query") {
			// console.log('edit')
            await ctx.answerCbQuery()
            return await ctx.editMessageText(text, extra)
        }
    } catch (err) {
		// if (err.response.error_code === 400) {
		// }
		ctx.reply(text, extra)
        console.error(err)
    }
}

export default send