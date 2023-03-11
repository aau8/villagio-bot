import { send } from "../../helpers/index.js"

/**
 * Отправить книгу
 */
export default (ctx, bookData) => {
    send(
        ctx,
        `📘 Книга "${bookData.title}"
*Автор*: ${bookData.author}
*Кол-во страниц*: ${bookData.pages}
*Кол-во прочитанных страниц*: ${bookData.pages_read}
*Состояние*: ${bookData.condition}`,
        {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: "Редактировать", callback_data: `book-EDIT::${bookData._id}` },
                        {
                            text: "Добавить прогресс",
                            callback_data: `book-HISTORY::${bookData._id}`,
                        },
                    ],
                    [
                        {
                            text: "Изменить состояние",
                            callback_data: `book-CONDITION::${bookData._id}`,
                        },
                        { text: "Удалить", callback_data: `book-DELETE::${bookData._id}` },
                    ],
                    [{ text: "« Обратно", callback_data: "book" }],
                ],
            },
            parse_mode: "Markdown",
        }
    )
}
