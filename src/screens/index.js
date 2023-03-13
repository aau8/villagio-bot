import sendHelpPrivate from "./private/help.js"
import sendStartPrivate from "./private/start.js"
import sendStartPublic from "./public/start.js"
import sendSubscribePublic from "./public/subscribe.js"

const $screen = {
	public: {
		start: sendStartPublic,
		subscribe: sendSubscribePublic,
	},
	private: {
		start: sendStartPrivate,
		help: sendHelpPrivate,
	}
}

export default $screen