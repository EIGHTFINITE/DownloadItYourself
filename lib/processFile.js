const isWindows = /^win/.test(process.platform)
const p7zipUnpack = require('./p7zipUnpack.js')
const { findDirectory, findFileEndsWith } = require('./findFile.js')
const { spawnSync } = require('child_process')
const fs = require('../bin/windows/x64/node/node-v'+require('../package.json').engines.node+'-win-x64/node_modules/npm/node_modules/graceful-fs')

const processFile = async (initialFile, initialDirectory, endPath, methods) => {
	const request = await new Promise(async (resolve) => {
		if(Array.isArray(methods)) {
			let i = 0
			for(const method of methods) {
				const unpack = await new Promise((resolve) => {
					if(method === 'zip' || method === '7z' || method === 'rar') {
						if(i === 0) {
							p7zipUnpack(initialDirectory + (isWindows ? '\\' : '/') + initialFile, initialDirectory, null, (err) => {
								if (err) {
									resolve(err)
									return
								}
								resolve(null)
								return
							})
						}
						else {
							const endsWith = '.' + method
							findFileEndsWith(initialDirectory, endsWith, (foundFile) => {
								if (Error.isError(foundFile)) {
									resolve(foundFile)
									return
								}
								if (foundFile === null) {
									resolve(Error('No file matches ends with "' + endsWith + '"'))
									return
								}
								p7zipUnpack(initialDirectory + (isWindows ? '\\' : '/') + foundFile, initialDirectory, null, (err) => {
									if (err) {
										resolve(err)
										return
									}
									resolve(null)
									return
								})
							})
						}
					}
					else if(method === 'all') {
						if(i === 0) {
							resolve(Error('Unimplemented'))
							return
						}
						fs.stat(endPath, (err, stat) => {
							if (err) {
								if (err.code !== 'ENOENT') {
									resolve(err)
									return
								}
							}
							else if(stat.isDirectory()) {
								fs.rmSync(endPath, { recursive: true })
							}
							else {
								fs.unlinkSync(endPath)
							}
							console.log('Moving "' + initialDirectory + '" to "' + endPath + '"')
							if(isWindows) {
								const { stdout, stderr, status } = spawnSync('cmd', ['/c', 'move', initialDirectory, endPath])
								const stdOutString = stdout.toString().trim()
								const stdErrString = stderr.toString().trim()
								if(stdOutString.length) {
									console.log(stdOutString)
								}
								if(stdOutString.length) {
									console.error(stdErrString)
								}
								if(status !== 0) {
									resolve(Error('move exit code: ' + status))
									return
								}
							}
							else {
								const { status } = spawnSync('mv', ['-T', initialDirectory, endPath], { stdio: 'inherit' })
								if(status !== 0) {
									resolve(Error('mv exit code: ' + status))
									return
								}
							}
							resolve(null)
							return
						})
					}
					else if(method === 'one') {
						if(i === 0) {
							resolve(Error('Unimplemented'))
							return
						}
						findDirectory(initialDirectory, (foundFile) => {
							if (Error.isError(foundFile)) {
								resolve(foundFile)
								return
							}
							if (foundFile === null) {
								resolve(Error('No directory matches'))
								return
							}
							fs.stat(endPath, (err, stat) => {
								if (err) {
									if (err.code !== 'ENOENT') {
										resolve(err)
										return
									}
								}
								else if(stat.isDirectory()) {
									fs.rmSync(endPath, { recursive: true })
								}
								else {
									fs.unlinkSync(endPath)
								}
								if(isWindows) {
									console.log('Moving "' + initialDirectory + '\\' + foundFile + '" to "' + endPath + '"')
									const { stdout, stderr, status } = spawnSync('cmd', ['/c', 'move', initialDirectory + '\\' + foundFile, endPath])
									const stdOutString = stdout.toString().trim()
									const stdErrString = stderr.toString().trim()
									if(stdOutString.length) {
										console.log(stdOutString)
									}
									if(stdOutString.length) {
										console.error(stdErrString)
									}
									if(status !== 0) {
										resolve(Error('move exit code: ' + status))
										return
									}
								}
								else {
									console.log('Moving "' + initialDirectory + '/' + foundFile + '" to "' + endPath + '"')
									const { status } = spawnSync('mv', ['-T', initialDirectory + '/' + foundFile, endPath], { stdio: 'inherit' })
									if(status !== 0) {
										resolve(Error('mv exit code: ' + status))
										return
									}
								}
								fs.rmdir(initialDirectory, (err) => {
									if (err) {
										resolve(Error(err.code + ': Failed to delete directory "' + initialDirectory + '"'))
										return
									}
									resolve(null)
									return
								})
							})
						})
					}
					else {
						resolve(Error('Unimplemented'))
						return
					}
				})
				if(Error.isError(unpack)) {
					resolve(unpack)
					return
				}
				i++
			}
			resolve(null)
			return
		}
		else {
			resolve(Error('Unimplemented'))
			return
		}
	})
	return request
}

module.exports = processFile
