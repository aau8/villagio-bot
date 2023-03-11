import { send, createGrid } from "../../helpers/index.js"

/**
 * Отправить состояние книги
 */
export default async ctx => {
    const condition = {
        complete: "Прочитал",
        defer: "Отложил",
        trash: "Выкинул",
        read: "Читаю",
        schedule: "Запланировал",
    }
    let condWithoutCurrent = Object.assign({}, condition)

    delete condWithoutCurrent[ctx.session.bookData.condition]

    condWithoutCurrent = Object.entries(condWithoutCurrent).map(e => {
        return {
            text: e[1],
            callback_data: `CONDITION::${e[0]}`,
        }
    })

    send(
        ctx,
        `Текущее состояние "*${ctx.session.bookData.title}*" - ${
            condition[ctx.session.bookData.condition]
        }\nИзменить на:`,
        {
            reply_markup: {
                inline_keyboard: [
                    ...createGrid(condWithoutCurrent, 2),
                    [{ text: "Отмена", callback_data: "undo" }],
                ],
            },
            parse_mode: "Markdown",
        }
    )
}
