import $bot from "../src/index.js"

export default async (data, { json }) => {
	const webhookInfo = await $bot.telegram.getWebhookInfo()
	json(webhookInfo)
}