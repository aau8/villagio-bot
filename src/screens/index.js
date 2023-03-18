import sendHelpPrivate from "./private/help.js"
import sendStartPrivate from "./private/start.js"
import sendCatalogPublic from "./public/catalog.js"
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
		catalog: sendCatalogPublic,
	},
	private: {
		start: sendStartPrivate,
		help: sendHelpPrivate,
	}
}

export default $screen