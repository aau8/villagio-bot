import { send, db } from "../../helpers/index.js"

export default async ctx => {
    const from = ctx.from

    if (await db.findOne(ctx, "telegramUsers", { telegram_id: ctx.from.id })) {
        console.log(`Пользователь ${ctx.from.id} уже существует!`)
    } else {
        const newUser = await db.insertOne(ctx, "telegramUsers", {
            telegram_id: ctx.from.id,
            is_bot: from.is_bot,
            username: from.username,
            first_name: from.first_name,
            language_code: from.language_code,
        })

        if (newUser) {
            console.log(`Пользователь ${ctx.from.id} добавлен!`)
        }
    }

    send(ctx, "Привет! Пока что я ничего не могу, но в скором времени, это изменится!", {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: "Книги", callback_data: "book" },
                    { text: "Мой сайт", url: "https://ugryumov.com" },
                ],
            ],
        },
    })
}
