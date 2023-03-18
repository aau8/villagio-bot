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

    try {
        if (ctx.updateType === "message") {
            await ctx.reply(text, extra)
        } else if (ctx.updateType === "callback_query") {
            await ctx.answerCbQuery()
            await ctx.editMessageText(text, extra)
        }
    } catch (err) {
        console.error(err)
    }
}

export default send