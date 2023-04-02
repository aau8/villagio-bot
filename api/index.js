import { useWebhook } from "../src/telegram";

export default async function handle(req, res) {
	try {
		await useWebhook(req, res);
	} catch (e) {
		res.statusCode = 500;
		res.setHeader("Content-Type", "text/html");
		res.end("<h1>Server Error</h1><p>Sorry, there was a problem</p>");
		console.error(e.message);
	}
}
