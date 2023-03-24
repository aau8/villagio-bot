import axios from "axios"

export default (data, { json }) => {
	const url = `https://api.telegram.org/bot6059186880:AAFr9rK6fK9SNL1RzyqQLXjHNNoV007G11g/getWebhookInfo`
	axios.get(url)
	.then(res => {
		// console.log(url)
		json(res.data)
	})
	.catch(err => {
		throw Error(err)
	})
}