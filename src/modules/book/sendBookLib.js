import { db, createGrid, send } from "../../helpers/index.js"

/**
 * Библиотека (список всех книг)
 */
export default async ctx => {
    let bookElems = await db.find(ctx, "bookLib", { tg_user: ctx.update.callback_query.from.id })

    if (bookElems.length === 0) {
        send(ctx, "У вас нет ни одной книги", {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Добавить первую книгу", callback_data: "new-book" }],
                    [{ text: "« Обратно", callback_data: "book" }],
                ],
            },
            parse_mode: "Markdown",
        })
    } else {
        bookElems = bookElems.reverse().map(e => {
            return { text: e.title, callback_data: `book-ID::${e._id}` }
        })

        send(ctx, "Библиотека", {
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
