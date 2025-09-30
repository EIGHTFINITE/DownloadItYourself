const filename = (file) => {
	file = new URL(file)
	file.hash = ''
	file = file.toString().split('/')
	return file[file.length-1]
}

module.exports = filename
