import { send } from "../../helpers/index.js"

/**
 * Стартовый экран раздела "Книги"
 */
export default ctx => {
    send(ctx, `Раздел "*Книги*"`, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: "Новая книга", callback_data: "new-book" },
                    { text: "Список чтения", callback_data: "write-list" },
                ],
                [{ text: "Библиотека", callback_data: "book-lib" }],
                [{ text: "« Обратно", callback_data: "start" }],
            ],
        },
        parse_mode: "Markdown",
    })
}
