import { Scenes } from "telegraf"
import { db, send } from "../../../helpers/index.js"
import { sendBookOne, sendBookStart } from "../index.js"

export const removeBookScene = new Scenes.BaseScene("book-remove")

// Удаление книги
removeBookScene.enter(ctx => {
    send(
        ctx,
        `Введите название книги \`${ctx.session.bookData.title}\` для подтверждения удаления`,
        {
            reply_markup: {
                inline_keyboard: [[{ text: "Отмена", callback_data: "/undo" }]],
            },
            parse_mode: "Markdown",
        }
    )
})

removeBookScene.on("message", async ctx => {
    if (ctx.message.text.trim() === ctx.session.bookData.title) {
        await db.removeOne(
            ctx,
            "bookLib",
            { _id: ctx.session.bookData._id },
            async () => {
                await send(ctx, `🎉 Книга *${ctx.session.bookData.title}* удалена!`, {
                    parse_mode: "Markdown",
                })

                sendBookStart(ctx)
                ctx.scene.leave()
                // delete ctx.session.bookData
            },
            async err => {
                await send(ctx, "⛔ *Книга НЕ удалена*", {
                    parse_mode: "Markdown",
                })

                sendBookOne(ctx, ctx.session.bookData)
                ctx.scene.leave()
                // delete ctx.session.bookData
            }
        )
    } else {
        ctx.scene.enter("book-remove")
    }
})

removeBookScene.action("/undo", ctx => {
    sendBookOne(ctx, ctx.session.bookData)
    ctx.scene.leave()
})
