const isWindows = /^win/.test(process.platform)
const { deleteAll } = require('./deleteFiles.js')
const fs = require('../bin/windows/x64/node/node-v'+require('../package.json').engines.node+'-win-x64/node_modules/npm/node_modules/graceful-fs')

const setUpDownloadDir = async () => {
	const request = await new Promise((resolve) => {
		// Create the _download directory if it does not exist
		fs.stat('_download', (err, stat) => {
			if (err) {
				if (err.code === 'ENOENT') {
					fs.mkdirSync('_download')
				}
				else {
					resolve(err)
					return
				}
			}
			else if(!stat.isDirectory()) {
				fs.unlinkSync('_download')
				fs.mkdirSync('_download')
			}
			// Create the _temp directory if it does not exist
			fs.stat((isWindows ? '_download\\_temp' : '_download/_temp'), (err, stat) => {
				if (err) {
					if (err.code === 'ENOENT') {
						fs.mkdirSync(isWindows ? '_download\\_temp' : '_download/_temp')
					}
					else {
						resolve(err)
						return
					}
				}
				else if(!stat.isDirectory()) {
					fs.unlinkSync(isWindows ? '_download\\_temp' : '_download/_temp')
					fs.mkdirSync(isWindows ? '_download\\_temp' : '_download/_temp')
				}
				// Clean up _temp
				deleteAll((isWindows ? '_download\\_temp' : '_download/_temp'), (err) => {
					if (err) {
						resolve(err)
						return
					}
					resolve(null)
					return
				})
			})
		})
	})
	return request
}

module.exports = setUpDownloadDir
