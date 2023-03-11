import { ObjectId } from "mongodb"
import { Scenes } from "telegraf"
import { db, send } from "../../../helpers/index.js"
import { sendBookOne } from "../index.js"

export const historyBookScene = new Scenes.BaseScene("book-history")

// Добавление прогреса книги
historyBookScene.enter(ctx => {
    send(ctx, "Укажите кол-во прочитанных страниц.", {
        reply_markup: {
            inline_keyboard: [[{ text: "Отмена", callback_data: "/undo" }]],
        },
    })
})

historyBookScene.on("message", async ctx => {
    const pages = parseInt(ctx.message.text)

    if (ctx.message.text == pages) {
        ctx.session.bookData.pages_read = ctx.session.bookData.pages_read + pages

        await db.updateOne(
            ctx,
            "bookLib",
            { _id: ObjectId(ctx.session.bookData._id) },
            { $set: { pages_read: ctx.session.bookData.pages_read } }
        )

        await db.insertOne(ctx, "bookHistory", {
            telegram_user_id: ctx.from.id,
            book_id: ctx.session.bookData._id.toString(),
            pages: pages,
            date: Date.now(),
        })

        sendBookOne(ctx, ctx.session.bookData)
        ctx.scene.leave()
        // delete ctx.session.bookData
    } else {
        send(ctx, "Укажите целое число!")
    }
})

historyBookScene.action("/undo", ctx => {
    sendBookOne(ctx, ctx.session.bookData)
    ctx.scene.leave()
})
