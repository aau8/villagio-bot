const customName = (value) => value.toLowerCase().trim().split(' ').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')
export default customName