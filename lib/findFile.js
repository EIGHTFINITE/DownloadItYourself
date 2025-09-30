const fs = require('../bin/windows/x64/node/node-v'+require('../package.json').engines.node+'-win-x64/node_modules/npm/node_modules/graceful-fs')

const findDirectory = (directory, callback) => {
	fs.readdir(directory, {withFileTypes: true}, (err, files) => {
		if (err) {
			callback(Error(err.code + ': Failed to read directory "' + directory + '"'))
			return
		}
		let i = files.length
		if(i <= 0) {
			callback(null)
			return
		}
		for (const file of files) {
			if(file.isDirectory()) {
				callback(file.name)
				return
			}
		}
		callback(null)
	})
}

const findFileEndsWith = (directory, fileEndsWith, callback) => {
	fs.readdir(directory, {withFileTypes: true}, (err, files) => {
		if (err) {
			callback(Error(err.code + ': Failed to read directory "' + directory + '"'))
			return
		}
		let i = files.length
		if(i <= 0) {
			callback(null)
			return
		}
		for (const file of files) {
			if(!file.isDirectory() && file.name.endsWith(fileEndsWith)) {
				callback(file.name)
				return
			}
		}
		callback(null)
	})
}

module.exports = { findDirectory, findFileEndsWith }
