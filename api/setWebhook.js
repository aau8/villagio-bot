import $bot from '../src/index.js'

const webhookUrl = (url) => `https://${url}/api/telegram.js`

export default async (data, { json }) => {
	const response = await $bot.telegram.setWebhook(webhookUrl(data.headers['x-forwarded-host']))
	json(response)
}