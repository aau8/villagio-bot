import $bot from '../src/index.js'

export default async (data, { json }) => {
	// console.log(data.body)

	const ctx = data.body
	await $bot.handleUpdate(ctx)

	// console.log('response', response)
	// console.log(["root POST", ctx]);

	json([])

	// $bot.telegram.getUpdates(data.body)
	// $bot.start(ctx => {
	// 	ctx.sendMessage('hello')
	// })

	// $bot.handleUpdate(data.body)

	// await bot.telegram.sendMessage(data.body.message.chat.id, 'Hello')
	// .then(res => {
	// 	console.log(res)
	// })
	// .catch(err => {
	// 	throw Error(err)
	// })
	// .finally(console.log)

	// $bot.handleUpdate()
	// console.log(webhookUrl(data.headers['x-forwarded-host']))
	// json(await $bot.telegram.setWebhook(webhookUrl(data.headers['x-forwarded-host'])).catch(e => e))
}