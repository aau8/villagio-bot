import { send, db, createGrid } from "../../helpers/index.js"

/**
 * Список книг в процессе чтения (в состоянии "read")
 */
export default async ctx => {
    let bookElems = await db.find(ctx, "bookLib", { tg_user: ctx.from.id, condition: "read" })

    if (bookElems.length === 0) {
        send(ctx, `У вас пока нет книг в процессе чтения`, {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: "Новая книга", callback_data: "new-book" },
                        { text: "Библиотека", callback_data: "book-lib" },
                    ],
                    [{ text: "« Обратно", callback_data: "book" }],
                ],
            },
            parse_mode: "Markdown",
        })
    } else {
        bookElems = bookElems.reverse().map(e => {
            return { text: e.title, callback_data: `book-ID::${e._id}` }
        })

        send(ctx, `Книги в процессе чтения`, {
            reply_markup: {
                inline_keyboard: [
                    ...createGrid(bookElems, 2),
                    [{ text: "« Обратно", callback_data: "book" }],
                ],
            },
            parse_mode: "Markdown",
        })
    }
}
