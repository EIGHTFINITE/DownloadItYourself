const fs = require('../bin/windows/x64/node/node-v'+require('../package.json').engines.node+'-win-x64/node_modules/npm/node_modules/graceful-fs')

const deleteAll = (directory, callback) => {
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
				fs.rm(directory + '\\' + file.name, { recursive: true }, (err) => {
					i--
					if (err) {
						callback(Error(err.code + ': Failed to delete directory "' + directory + '\\' + file.name + '"'))
						return
					}
					if (i <= 0) {
						callback(null)
					}
				})
			}
			else {
				fs.unlink(directory + '\\' + file.name, (err) => {
					i--
					if (err) {
						callback(Error(err.code + ': Failed to delete file "' + directory + '\\' + file.name + '"'))
						return
					}
					if (i <= 0) {
						callback(null)
					}
				})
			}
		}
	})
}

const deleteFilesStartsWith = (directory, fileStartsWith, callback) => {
	fs.readdir(directory, {withFileTypes: true}, (err, files) => {
		if (err) {
			callback(Error(err.code + ': Failed to read directory "' + directory + '"'))
			return
		}
		files = files.filter(file => !file.isDirectory() && file.name.startsWith(fileStartsWith)).map(file => file.name)
		let i = files.length
		if(i <= 0) {
			callback(null)
			return
		}
		for (const file of files) {
			fs.unlink(directory + '\\' + file, (err) => {
				i--
				if (err) {
					callback(Error(err.code + ': Failed to delete file "' + directory + '\\' + file + '"'))
					return
				}
				if (i <= 0) {
					callback(null)
				}
			})
		}
	})
}

module.exports = { deleteAll, deleteFilesStartsWith }
