let i = 65, j = 97, k = 48, l = 95, m = 32, n = 58, o = 91, p = 123
const chars = [
	...Array.from(Array(26), () => String.fromCharCode(i++)),
	...Array.from(Array(26), () => String.fromCharCode(j++)),
	...Array.from(Array(10), () => String.fromCharCode(k++)),
	...Array.from(Array(2), () => String.fromCharCode(l++)),
	...Array.from(Array(16), () => String.fromCharCode(m++)),
	...Array.from(Array(7), () => String.fromCharCode(n++)),
	...Array.from(Array(4), () => String.fromCharCode(o++)),
	...Array.from(Array(4), () => String.fromCharCode(p++))
]

module.exports = chars
