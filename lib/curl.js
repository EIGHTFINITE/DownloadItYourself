const isWindows = /^win/.test(process.platform)
const { spawnSync } = require('child_process')
const fs = require('../bin/windows/x64/node/node-v'+require('../package.json').engines.node+'-win-x64/node_modules/npm/node_modules/graceful-fs')

const curl = async (directory, file, url, follow, type) => {
	const request = await new Promise((resolve) => {
		const tempFileLocation = directory + (isWindows ? '\\' : '/') + file
		const { status } = spawnSync(isWindows ? 'curl.exe' : 'curl', (type === null ? [(follow ? '-#Lo' : '-#o') + tempFileLocation, url] : [(follow ? '-#Lo' : '-#o') + tempFileLocation, '--header', type, url]), { stdio: 'inherit' })
		if(status !== 0) {
			resolve(Error('curl exit code: ' + status))
			return
		}
		fs.open(tempFileLocation, 'r', (err, fd) => {
			if (err) {
				resolve(err)
				return
			}
			const buffer = Buffer.alloc(4)
			fs.read(fd, buffer, 0, 4, 0, (err, num)  => {
				if (err) {
					resolve(err)
					return
				}
				const firstBytes = buffer.toString('utf8', 0, num)
				if(firstBytes.slice(0,4) === 'PK\x03\x04') { // zip
					resolve(null)
					return
				}
				else if(firstBytes.slice(0,1) === '{') { // json
					fs.readFile(tempFileLocation, 'utf8', (err, data) => {
						if (err) {
							resolve(err)
							return
						}
						fs.unlink(tempFileLocation, (err) => {
							if (err) {
								resolve(err)
								return
							}
							try {
								resolve(JSON.parse(data))
								return
							}
							catch (err) {
								resolve(err)
								return
							}
						})
					})
				}
				else {
					resolve(Error('Unimplemented'))
					return
				}
			})
		})
	})
	return request
}

module.exports = curl
