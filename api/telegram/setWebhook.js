import $bot from '../../src/index.js'

const webhookUrl = (url) => `https://${url}/api/telegram/index.js`

export default async (req, res) => {
	const response = await $bot.telegram.setWebhook(webhookUrl(req.headers['x-forwarded-host']))
	res.json(response)
}