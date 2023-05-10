class Quiz {
	constructor(name, options) {
		this.name = name
		this.current = null
		// this.data = options.data()
		this.answers = options.answers
		this.screens = options.screens(this)
	}

	async open(screen, ...args) {
		if (screen !== "stop") {
			this.current = screen
		}

		return await this.screens[screen](...args)
	}
}

export default Quiz