import $bot from "../../src/index.js"

export default async (req, res) => {
	const webhookInfo = await $bot.telegram.getWebhookInfo()
	res.json(webhookInfo)
}