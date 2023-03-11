import { ObjectId } from "mongodb"
import { sendBookStart, sendReadingList, sendBookLib, sendBookOne } from "./index.js"
import { db, send } from "../../helpers/index.js"

export default bot => {
    // Добавление новой книги
    bot.action("new-book", ctx => {
        ctx.scene.enter("new-book")
    })
    bot.command("new_book", ctx => {
        ctx.scene.enter("new-book")
    })

    // Главный экран модуля "Книги"
    bot.action("book", ctx => {
        sendBookStart(ctx)
    })
    bot.command("book", ctx => {
        sendBookStart(ctx)
    })

    // Библиотека
    bot.action("book-lib", async ctx => {
        sendBookLib(ctx)
    })
    bot.command("book_lib", ctx => {
        sendBookStart(ctx)
    })

    // Книги в процессе чтения
    bot.action("write-list", async ctx => {
        sendReadingList(ctx)
    })
    bot.command("write_list", ctx => {
        sendBookStart(ctx)
    })

    bot.action(/^(book-ID::)/, async ctx => {
        const bookID = ctx.update.callback_query.data.replace("book-ID::", "")

        sendBookOne(ctx, await db.findOne(ctx, "bookLib", ObjectId(bookID)))
    })

    bot.action(/^(book-DELETE::)/, async ctx => {
        const bookID = ctx.update.callback_query.data.replace("book-DELETE::", "")
        const bookData = await db.findOne(ctx, "bookLib", ObjectId(bookID))

        ctx.session.bookData = bookData
        ctx.scene.enter("book-remove")
    })

    bot.action(/^(book-HISTORY::)/, async ctx => {
        const bookID = ctx.update.callback_query.data.replace("book-HISTORY::", "")

        ctx.session.bookData = await db.findOne(ctx, "bookLib", ObjectId(bookID))
        ctx.scene.enter("book-history")
    })

    bot.action(/^(book-CONDITION::)/, async ctx => {
        const bookID = ctx.update.callback_query.data.replace("book-CONDITION::", "")

        ctx.session.bookData = await db.findOne(ctx, "bookLib", ObjectId(bookID))
        ctx.scene.enter("book-condition")
    })
}
