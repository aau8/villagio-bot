/**
 * Удалить все теги, кроме тех, что поддерживает api telegram bot (указаны в регулярке)
 */
const removeUselessTags = (text) => {
	const regexp = /<(?!\/?(b|i|pre|a|tg-spoiler|u|s|cod)\b)[^>]*>/g
	return text.replace(regexp, '').trim()
}

/**
 * Удалить лишние слова
 */
const removeTrashWords = (text) => {
	text = text.replace('&nbsp;', ' ').trim()
	return text
}

/**
 * Обрезать текст до 600 символов
 */
const cutText = (text) => {
	return text.slice(0, 600).trim()
}

const getParseDescr = (data) => {
	if (data?.description?.length > 0) {
		let text = data.description
		const url = data.url

		text = removeUselessTags(text)
		text = removeTrashWords(text)

		if (text.length > 800) {
			text = cutText(text)

			if (url && url.length > 0) {
				text += ` <a href="${url}">Читать дальше...</a>`
			} else {
				text += ' ...'
			}
		}

		return text
	} else {
		return ''
	}

}

export default getParseDescr