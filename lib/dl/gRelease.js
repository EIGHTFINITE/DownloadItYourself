const isWindows = /^win/.test(process.platform)
const isString = require('lodash.isstring')
const curl = require('../curl.js')
const fs = require('../../bin/windows/x64/node/node-v'+require('../../package.json').engines.node+'-win-x64/node_modules/npm/node_modules/graceful-fs')

const workflow = async (i, backoff, download, workingDirectory) => {
	const request = await new Promise(async (resolve) => {
		const releases = (() => {
			const urlPieces = download.download.split('/')
			return 'https://api.github.com/repos/' + urlPieces[3] + '/' + urlPieces[4] + '/releases'
		})()
		console.log('Requesting: ' + releases)
		console.log('GitHub prefers we use curl')
		let request = await curl(workingDirectory + (isWindows ? '\\_download\\_temp' : '/_download/_temp'), 'releases.json', releases, false, null)
		if(Error.isError(request)) {
			resolve(request)
			return
		}
		if(!Array.isArray(request)) {
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
			resolve(Error('JSON file has no releases'))
			return
		}
		let downloadFile = download.file
		if(!Array.isArray(downloadFile)) {
			downloadFile = [downloadFile]
		}
		let j = 0
		for (const file of downloadFile) {
			let firstMatch = null
			for (const release of request) {
				for (const asset of release.assets) {
					if(isString(file)) {
						resolve(Error('Unimplemented'))
						return
					}
					if(!isString(asset.name)) {
						continue
					}
					if(isString(file['match-start']) && !asset.name.startsWith(file['match-start'])) {
						continue
					}
					if(isString(file['match-end']) && !asset.name.endsWith(file['match-end'])) {
						continue
					}
					firstMatch = asset
					break
				}
			}
			if(firstMatch === null) {
				resolve(Error('No JSON file release matches'
				+ (isString(file['match-start']) ? ' starts with "' + file['match-start'] + '"' : '')
				+ (isString(file['match-end']) ? ' ends with "' + file['match-end'] + '"' : '')))
				return
			}
			const secondRequest = await new Promise(async (resolve) => {
				const tempFilename = firstMatch.name
				const tempFileDirectory = workingDirectory + (isWindows ? '\\_download\\_temp\\' : '/_download/_temp/') + download.id + '_' + j
				console.log('Creating: "' + tempFileDirectory + '"')
				fs.mkdirSync(tempFileDirectory)
				console.log('Downloading:', firstMatch['browser_download_url'], 'as "' + tempFilename + '"')
				console.log('GitHub prefers we use curl')
				let downloadRequest = await curl(tempFileDirectory, tempFilename, firstMatch['browser_download_url'], true, null)
				if(downloadRequest) {
					resolve(downloadRequest)
					return
				}
				// Save new version to downloadlist
				if(Array.isArray(download.file)) {
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
					download.version = tempFilename
				}
				// Process and move to _download
				let downloadUnpack = null
				if(Array.isArray(download.file)) {
					if(!Array.isArray(download.unpack) || !Array.isArray(download.unpack[j])) {
						resolve(Error('Unimplemented'))
						return
					}
					downloadUnpack = download.unpack[j]
				}
				else {
					if(!Array.isArray(download.unpack)) {
						resolve(Error('Unimplemented'))
						return
					}
					downloadUnpack = download.unpack
				}
				const endPath = workingDirectory + (isWindows ? '\\_download\\' : '/_download/') + download.id + '_' + j
				const processFile = await require('../processFile.js')(tempFilename, tempFileDirectory, endPath, downloadUnpack)
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
