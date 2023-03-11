import { ObjectId } from "mongodb"
import { Scenes } from "telegraf"
import { db, send } from "../../../helpers/index.js"
import { sendBookOne, sendBookStart } from "../index.js"

export const createBookWizard = new Scenes.WizardScene(
    "new-book",
    ctx => {
        send(ctx, "Введите: *Название книги*", {
            parse_mode: "Markdown",
        })

        ctx.wizard.state.bookData = {
            tg_user: ctx.from.id,
            title: null,
            author: null,
            pages: 0,
            pages_read: 0,
            condition: "schedule",
            date: {
                create: Date.now(),
                complete: null,
            },
            time_read: null,
        }

        return ctx.wizard.next()
    },

    ctx => {
        if (ctx.update.callback_query) return
        ctx.wizard.state.bookData.title = ctx.message.text
        send(ctx, "Введите: *Автор*", {
            parse_mode: "Markdown",
        })

        return ctx.wizard.next()
    },

    ctx => {
        if (ctx.update.callback_query) return
        ctx.wizard.state.bookData.author = ctx.message.text
        send(ctx, "Введите: *Кол-во страниц*", {
            parse_mode: "Markdown",
        })

        return ctx.wizard.next()
    },

    ctx => {
        if (ctx.update.callback_query) return
        const pages = parseInt(ctx.message.text)
        if (ctx.message.text != pages) {
            send(ctx, "Введите целое число")
            return
        }

        ctx.wizard.state.bookData.pages = pages
        send(ctx, "Введите: *Кол-во прочитанных страниц*", {
            parse_mode: "Markdown",
        })

        return ctx.wizard.next()
    },

    async ctx => {
        if (ctx.update.callback_query) return
        const pagesRead = Math.trunc(parseInt(ctx.message.text))
        if (ctx.message.text != pagesRead) {
            send(ctx, "Введите целое число")
            return
        }

        ctx.wizard.state.bookData.pages_read = pagesRead
        const insertBook = await db.insertOne(ctx, "bookLib", ctx.wizard.state.bookData)

        sendBookOne(ctx, await db.findOne(ctx, "bookLib", ObjectId(insertBook.insertedId)))

        return ctx.scene.leave()
    }
)

createBookWizard.command("/undo", ctx => {
    ctx.scene.leave()
    // delete ctx.session.bookData
    sendBookStart(ctx)
})
