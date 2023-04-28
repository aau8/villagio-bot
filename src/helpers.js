import { ADMINS_ID } from "./config.js"

// Проверить, является ли текущий пользователем админом
export const checkIsAdmin = (id) => {
	return ADMINS_ID.some(adminId => adminId === Number(id))
}

/**
 * Создает сетку с указаным количеством колонок
 * @param {object} arr массив кнопок
 * @param {number} columns количество колонок
 * @returns массив с подмасивами с количеством элементов равным значению columns
 */
export const createGrid = (arr, columns = 1) => {
    const grid = []

    for (let i = 0; i < Math.ceil(arr.length / columns); i++) {
        grid[i] = arr.slice(i * columns, i * columns + columns)
    }

    return grid
}

// Вернуть строку, где каждое слово начинается с большой буквы.
export const capitalize = (value) => {
	return value.toLowerCase().trim().split(' ').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')
}

// Маска. Проверяет строку на наличие слеша в начале строки и наличие только букв, цифр и нижнего подчеркивания
export const isCommand = (str) => !!str.match(/^\/[\w\d_]+/g)

// Маска. Проверяет, является ли переданная строка номером телефона
export const isPhone = (str) => !str.match(/[^\d()+-\s]+/g) && str.length >= 7

/**
 * Функция, определяющая способ отправки сообщения. С заменой предыдущего или без.
 * @param {object} ctx
 * @param {string} text текст, который нужно отправить в сообщении
 * @param {object} extra дополнительный ui (кнопки, тип парсинга...)
 * @see https://github.com/nieopierzony/lolz-telegraf-article/blob/main/src/helpers/send.js
 */
export const send = async (ctx, text, extra = {}) => {
	if (!extra.parse_mode) {
		extra.parse_mode = 'HTML'
	}

    try {
		if (ctx.updateType === 'callback_query') {
			await ctx.answerCbQuery()
		}

		if (ctx.updateType === "message" || extra.not_edit_message) {
            return await ctx.reply(text, extra)
        } else if (ctx.updateType === "callback_query") {
            return await ctx.editMessageText(text, extra)
        }
    } catch (err) {
		// ctx.reply(text, extra)
        throw new Error(err)
    }
}

/**
 * Собирает объект с данными пользователя
 * @param {object} from - данные пользователя
 * @returns обработанный объект с измененными и дополненными данными, часть из которых указана по умолчанию
 */
export const parseUserData = (from) => {
	const id = from.id
	delete from.id

	return {
		tg_id: id,
		start_date: new Date().toISOString(),
		phone: null,
		...from,
		lang: from.language_code || null,
		subscription: true,
	}
}

// Удалить у строки префикс и слэш
export const parseCommand = (str, prefix) => str.replace(prefix, '').replace('/', '')
