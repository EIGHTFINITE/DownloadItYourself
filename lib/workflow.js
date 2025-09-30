const isWindows = /^win/.test(process.platform)
const isString = require('lodash.isstring')
const curl = require('./curl.js')
const fs = require('../bin/windows/x64/node/node-v'+require('../package.json').engines.node+'-win-x64/node_modules/npm/node_modules/graceful-fs')

const workflow = async (i, backoff, download, workingDirectory) => {
	const request = await new Promise(async (resolve) => {
		const artifacts = (() => {
			const urlPieces = download.download.split('/')
			return 'https://api.github.com/repos/' + urlPieces[3] + '/' + urlPieces[4] + '/actions/artifacts'
		})()
		console.log('Requesting: ' + artifacts)
		console.log('GitHub prefers we use curl')
		let request = await curl(workingDirectory + (isWindows ? '\\_download\\_temp' : '/_download/_temp'), 'artifacts.json', artifacts, false, null)
		if(Error.isError(request)) {
			resolve(request)
			return
		}
		if(!Array.isArray(request.artifacts)) {
			if(isString(request.message)) {
				console.log('API limit exceeded')
				if(backoff > 37) { // Waiting time would go past the max safe int at this point
					resolve(Error('Exceeded maximum retries'))
					return
				}
				const waitingTime = 2**backoff++
				if(waitingTime >= 1440) {
					let days = waitingTime / 1440 | 0
					let hours = (waitingTime % 1440) / 60 | 0
					let minutes = (waitingTime % 1440) % 60
					console.log('Waiting ' + days + ' day'+ (days === 1 ? '' : 's') +', ' + hours + ' hour'+ (hours === 1 ? '' : 's') +' and ' + minutes + ' minute'+ (minutes === 1 ? '' : 's') +' before trying again')
				}
				else if(waitingTime >= 60) {
					let hours = waitingTime / 60 | 0
					let minutes = waitingTime % 60
					console.log('Waiting ' + hours + ' hour'+ (hours === 1 ? '' : 's') +' and ' + minutes + ' minute'+ (minutes === 1 ? '' : 's') +' before trying again')
				}
				else {
					console.log('Waiting ' + waitingTime + ' minute'+ (waitingTime === 1 ? '' : 's') +' before trying again')
				}
				await new Promise(resolve => setTimeout(resolve, waitingTime*60000))
				resolve({
					i: --i,
					backoff: backoff,
					download: download
				})
				return
			}
			resolve(Error('JSON file has no artifacts'))
			return
		}
		let downloadFile = download.file
		if(isString(downloadFile)) {
			downloadFile = [downloadFile]
		}
		if(Array.isArray(downloadFile)) {
			let j = 0
			for (const file of downloadFile) {
				let firstMatch = null
				for (const artifact of request.artifacts) {
					if(!isString(artifact.name)) {
						continue
					}
					if(isString(file['match-start']) && !artifact.name.startsWith(file['match-start'])) {
						continue
					}
					if(isString(file['match-end']) && !artifact.name.endsWith(file['match-end'])) {
						continue
					}
					firstMatch = artifact
					break
				}
				if(firstMatch === null) {
					resolve(Error('No JSON file artifact matches'
					+ (isString(file['match-start']) ? ' starts with "' + file['match-start'] + '"' : '')
					+ (isString(file['match-end']) ? ' ends with "' + file['match-end'] + '"' : '')))
					return
				}
				const secondRequest = await new Promise(async (resolve) => {
					const tempFilename = firstMatch.name + '.zip'
					const tempFileDirectory = workingDirectory + (isWindows ? '\\_download\\_temp\\_' : '/_download/_temp/_') + download.id + '_' + j
					console.log('Creating: "' + tempFileDirectory + '"')
					fs.mkdirSync(tempFileDirectory)
					console.log('Downloading:', firstMatch['archive_download_url'], 'as "' + tempFilename + '"')
					console.log('GitHub prefers we use curl')
					let downloadRequest = await curl(tempFileDirectory, tempFilename, firstMatch['archive_download_url'], true, 'Authorization: token ' + require('./config.js'))
					if(downloadRequest) {
						resolve(downloadRequest)
						return
					}
					// Save new version to downloadlist
					if(Array.isArray(downloadFile)) {
						if(!download.version) {
							download.version = []
						}
						else if(!Array.isArray(download.version)) {
							resolve(Error('Unimplemented'))
							return
						}
						download.version[j] = tempFilename
					}
					else {
						resolve(Error('Unimplemented'))
						return
					}
					// Process and move to _download
					if(Array.isArray(downloadFile)) {
						if(!Array.isArray(download.unpack) || !Array.isArray(download.unpack[j])) {
							resolve(Error('Unimplemented'))
							return
						}
					}
					else if(!Array.isArray(download.unpack)) {
						resolve(Error('Unimplemented'))
						return
					}
					const endPath = workingDirectory + (isWindows ? '\\_download\\' : '/_download/') + download.id + '_' + j
					const processFile = await require('./processFile.js')(tempFilename, tempFileDirectory, endPath, download.unpack[j])
					if(processFile) {
						resolve(processFile)
						return
					}
					resolve(null)
					return
				})
				if(secondRequest) {
					resolve(secondRequest)
					return
				}
				j++
			}
		}
		else {
			resolve(Error('Unimplemented'))
			return
		}
		resolve({
			i: i,
			backoff: backoff,
			download: download
		})
		return
	})
	return request
}

module.exports = workflow
