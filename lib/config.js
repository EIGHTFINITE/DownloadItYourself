const chars = require('./chars.js')
const { add, multiply } = require('./helpers.js')
const config = [...Object.values(require('../downloadlist.json').config).find(() => true)].map((n) => chars.indexOf(n)).reverse()
let outArray = []
let power = [1]
for (let i = 0; i < 37; i++) {
	outArray = add(outArray, multiply(config[i], power))
	power = multiply(95, power)
}
let out = ''
for (let i = 39; i >= 0; i--) {
	out += chars[outArray[i]]
}
module.exports = out
