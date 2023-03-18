import sendHelpPrivate from "./private/help.js"
import sendStartPrivate from "./private/start.js"
import sendHelpPublic from "./public/help.js"
import sendProjectPublic from "./public/project.js"
import sendStartPublic from "./public/start.js"
import sendSubscribePublic from "./public/subscribe.js"

const $screen = {
	public: {
		start: sendStartPublic,
		help: sendHelpPublic,
		subscribe: sendSubscribePublic,
		project: sendProjectPublic,
	},
	private: {
		start: sendStartPrivate,
		help: sendHelpPrivate,
	}
}

export default $screen