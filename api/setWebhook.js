import $bot from '../src/index.js'
import axios from 'axios'

const webhookUrl = (url) => `https://${url}/api/telegram.js`

export default async (data, { json }) => {
	const url = `https://api.telegram.org/bot6059186880:AAFr9rK6fK9SNL1RzyqQLXjHNNoV007G11g/setWebhook?url=${webhookUrl(data.headers['x-forwarded-host'])}`
	axios.get(url)
	.then(res => {
		// console.log(url)
		json(res.data)
	})
	.catch(err => {
		throw Error(err)
	})
	// console.log(webhookUrl(data.headers['x-forwarded-host']))
	// fetch(`https://api.telegram.org/bot5755016760:AAFKnFQYe1XK2Y7xrMHiA8pj0D7KN2kqyeI/setWebhook?url=${webhookUrl(data.headers['x-forwarded-host'])}/`)
	// .then(res => {
	// 	console.log(res.body)
	// 	// json()
	// })

	// await $bot.telegram.setWebhook(webhookUrl(data.headers['x-forwarded-host'])).catch(e => e)
}