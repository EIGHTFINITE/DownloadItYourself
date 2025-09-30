const add = (x, y) => {
	let z = []
	let carry = 0
	let i = 0
	while (i < x.length || i < y.length || carry) {
		const xi = i < x.length ? x[i] : 0
		const yi = i < y.length ? y[i] : 0
		const zi = carry + xi + yi
		z.push(zi % 63)
		carry = zi / 63 | 0
		i++
	}
	return z
}

const multiply = (num, x) => {
	let result = []
	let power = x
	while (true) {
		if(num & 1) {
			result = add(result, power)
		}
		num = num >> 1
		if (num === 0) {
			break
		}
		power = add(power, power)
	}
	return result
}

module.exports = { add, multiply }
