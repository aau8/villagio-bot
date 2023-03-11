import { Scenes } from "telegraf"
import { db, send } from "../../../helpers/index.js"
import { sendBookOne, sendBookCondition } from "../index.js"

export const conditionBookScene = new Scenes.BaseScene("book-condition")

// Изменение состояния книги
conditionBookScene.enter(ctx => {
    sendBookCondition(ctx)
})

conditionBookScene.action("undo", ctx => {
    sendBookOne(ctx, ctx.session.bookData)
    ctx.scene.leave()
    // delete ctx.session.bookData
})
conditionBookScene.action(/^(CONDITION::)/, async ctx => {
    const condition = ctx.update.callback_query.data.replace("CONDITION::", "")

    await db.updateOne(
        ctx,
        "bookLib",
        { _id: ctx.session.bookData._id },
        { $set: { condition } },
        () => {
            console.log(
                `Состояние книги "${ctx.session.bookData.title}"(${ctx.session.bookData._id}) изменено на ${condition}`
            )
        },
        err => {
            console.log(`Состояние не изменено!!!`)
        }
    )

    ctx.session.bookData.condition = condition
    sendBookOne(ctx, ctx.session.bookData)
    ctx.scene.leave()
    // delete ctx.session.bookData
})
