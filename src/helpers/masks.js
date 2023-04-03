export const isCommand = (value) => !!value.match(/^\/[\w\d_]+/g)
export const isPhone = (value) => !value.match(/[^\d()+-\s]+/g) && value.length >= 7
export const isWord = (value) => !value.match(/[^\w\.]/g)