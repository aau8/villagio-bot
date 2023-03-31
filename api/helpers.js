import * as dotenv from 'dotenv'
dotenv.config()

export const isAuth = (req) => {
	const token = req.headers.authorization
	return token && token === process.env.API_TOKEN
}