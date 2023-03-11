import sendStartPrivate from "./private/start.js"
import sendStartPublic from "./public/start.js"

const $screen = {
	public: {
		start: sendStartPublic
	},
	private: {
		start: sendStartPrivate
	}
}

export default $screen