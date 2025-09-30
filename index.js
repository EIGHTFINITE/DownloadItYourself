#!/usr/bin/env node
'use strict';

const workingDirectory = __dirname
const isWindows = /^win/.test(process.platform)
const nodeVersion = require('./package.json').engines.node
const npmVersion = require('./bin/windows/x64/node/node-v'+nodeVersion+'-win-x64/node_modules/npm/package.json').version
const electronVersion = require('./package.json').devDependencies.electron
const downloadlist = require('./downloadlist.json')
const writeReadme = require('./lib/writeReadme.js')
const stringify = require('./bin/windows/x64/node/node-v'+nodeVersion+'-win-x64/node_modules/npm/node_modules/json-stringify-nice')
const fs = require('./bin/windows/x64/node/node-v'+nodeVersion+'-win-x64/node_modules/npm/node_modules/graceful-fs')

// Executable check
if(process.versions.electron) {
	// Validate executable
	console.log('Running on Electron ' + process.versions.electron + ' + Node ' + process.versions.node + ' + Chrome ' + process.versions.chrome)
	if(process.versions.electron !== electronVersion) {
		throw Error('Expected Electron ' + electronVersion + ' instead of Electron ' + process.versions.electron)
	}

	// Require
	const { app, BrowserWindow } = require('electron')
	const isInt = require('lodash.isinteger')
	let electronUserAgent = require('./node_modules/top-user-agents-1/index.json')
	console.log('User Agent set to "' + electronUserAgent[0] + '"')
	if(electronUserAgent[1] === require('./node_modules/top-user-agents/desktop.json')[0]) {
		electronUserAgent = electronUserAgent[1]
		console.log('Found bleeding edge User Agent "' + electronUserAgent + '"')
		console.log('User Agent set to "' + electronUserAgent + '"')
	}
	else {
		electronUserAgent = electronUserAgent[0]
	}

	// Run
	app.whenReady().then(() => {
		app.userAgentFallback = electronUserAgent;

		const win = new BrowserWindow({
			width: 1920,
			height: 953,
			frame: false,
			show: false,
			webPreferences: {
				devTools: false,
				backgroundThrottling: false,
				additionalArguments: ['--js-flags=--jitless']
			}
		})

		// Disallow access to microphone, camera, location, clipboard, screen recording and so on
		// Still allows images and JavaScript since they're not part of this system
		win.webContents.session.setPermissionRequestHandler((webContents, permission, callback) => {
			console.log('Denied access to "' + permission + '" permission requested by site')
			return callback(false)
		})

		// Start processing the downloads
		const downloadFiles = async () => {
			// Set up the _download directory
			const setUpDownloadDir = await require('./lib/setUpDownloadDir.js')()
			if(setUpDownloadDir) {
				throw setUpDownloadDir
			}

			// Loop over the downloads
			for (let i = 0, backoff = 0; i < downloadlist.downloads.length; i++) {
				const download = downloadlist.downloads[i]
				download.id = download.name.replace(/[^a-zA-Z0-9]/g, ' ').trim().replace(/ +/g, ' ').replaceAll(' ', '_').toLowerCase()
				console.log('Downloading: ' + download.name)
				console.log('Navigating to: ' + download.download)
				// GitHub
				if(download.download.startsWith('https://github.com/')) {
					// GitHub Workflows
					if(/^https:\/\/github\.com\/[a-zA-Z0-9._-]+\/[a-zA-Z0-9._-]+\/actions\/workflows\/.*\.yml$/.test(download.download)) {
						const workflow = await require('./lib/workflow.js')(i, backoff, download, workingDirectory)
						if(Error.isError(workflow)) {
							throw workflow
						}
						else if(typeof workflow === 'object' && isInt(workflow.i) && isInt(workflow.backoff) && typeof workflow.download === 'object' && !Array.isArray(workflow.download)) {
							downloadlist.downloads[i] = workflow.download
							i = workflow.i
							backoff = workflow.backoff
						}
						else {
							throw Error('Unimplemented')
						}
					}
					else {
						throw Error('Unimplemented')
					}
				}
				else {
					throw Error('Unimplemented')
				}
			}
			win.close()
		}
		downloadFiles()

		win.on('close', () => {
			app.exit()
		})
	})

	// Shutdown
	app.on('quit', () => {
		// Write Readme
		writeReadme(downloadlist)
		console.log('Exiting Electron ' + process.versions.electron + ' + Node ' + process.versions.node + ' + Chrome ' + process.versions.chrome)
	})
	
	process.on('unhandledRejection', (err) => {
		console.error('UnhandledPromiseRejectionWarning:', err)
		process.exit(1)
	})
}
else {
	// Validate executable
	console.log('Running on Node ' + process.versions.node + ' + npm ' + npmVersion)
	if(process.versions.node !== nodeVersion) {
		throw Error('Expected Node ' + nodeVersion + ' instead of Node ' + process.versions.node)
	}

	// Write Readme
	if(process.argv.slice(2).includes('--readme_only')) {
		writeReadme(downloadlist)
		return
	}

	// Function
	const startElectron = () => {
		console.log('Starting Electron ' + electronVersion)
		process.env.ELECTRON_OVERRIDE_DIST_PATH = (isWindows ? 'bin/windows/x64/electron/electron-v' + electronVersion + '-win32-x64' : 'bin/linux/x64/electron/electron-v' + electronVersion + '-linux-x64')
		const electron = require('electron')
		const { spawn } = require('child_process')
		spawn(electron, ['--use_strict', 'index.js'], { stdio: 'inherit' })
	}

	// Unpack Electron
	if(isWindows) {
		const { deleteFilesStartsWith } = require('./lib/deleteFiles.js')
		fs.stat('bin\\windows\\x64\\electron\\electron-v' + electronVersion + '-win32-x64\\electron.exe', (err, stat) => {
			const winElectronPath = 'bin\\windows\\x64\\electron\\electron-v' + electronVersion + '-win32-x64'
			if (err) {
				if (err.code !== 'ENOENT') {
					throw err;
				}
				console.log('Need to unpack Electron')
				const p7zipUnpack = require('./lib/p7zipUnpack.js')
				p7zipUnpack(winElectronPath + '\\electron.exe.001', winElectronPath, '-tsplit', (err) => {
					if (err) {
						throw err;
					}
					deleteFilesStartsWith(winElectronPath, 'electron.exe.', (err) => {
						if (err) {
							throw err;
						}
						startElectron()
					})
				})
				return
			}
			else if(!stat.isFile()) {
				fs.rmSync(endPath, { recursive: true })
			}
			deleteFilesStartsWith(winElectronPath, 'electron.exe.', (err) => {
				if (err) {
					throw err;
				}
				startElectron()
			})
		})
	}
	else {
		startElectron()
	}

	// Shutdown
	process.on('exit', () => {
		console.log('Exiting Node ' + process.versions.node + ' + npm ' + npmVersion)
	})
}
