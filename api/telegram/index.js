import $bot from '../../src/index.js'

export default async (data, { json }) => {
	const ctx = data.body
	await $bot.handleUpdate(ctx)
	json([])
}