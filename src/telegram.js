import * as dotenv from 'dotenv'
import $bot from './index.js'
import { error } from 'console'
dotenv.config()

const isDev = process.env.DEV
const VERCEL_URL = process.env.VERCEL_URL

export const useWebhook = async (req, res) => {
	try {
		if (!isDev && !VERCEL_URL) {
			throw new Error('VERCEL_URL is not set.');
		}
		const getWebhookInfo = await $bot.telegram.getWebhookInfo();

		if (getWebhookInfo.url !== VERCEL_URL + '/api') {
			console.log(`deleting webhook`);
			await $bot.telegram.deleteWebhook();
			console.log(`setting webhook to ${VERCEL_URL}/api`);
			await $bot.telegram.setWebhook(`${VERCEL_URL}/api`);
		}

		$bot.command('test', ctx => {
			ctx.sendMessage('is test answer')
		})

		if (req.method === 'POST') {
			await $bot.handleUpdate(req.body, res)
		}
		else {
			res.send('Listening to bot events...')
		}
	} catch(err) {
		console.error(err)
		return err.message
	}
}

const localBot = async () => {
	return new Promise(async (resolve) => {
		console.log('Bot is running')
		$bot.telegram.webhookReply = false
		// const botInfo = await $bot.telegram.getMe()

		await $bot.telegram.deleteWebhook()
		resolve()
	})
}

if (isDev) {
	localBot()
	$bot.launch()
}