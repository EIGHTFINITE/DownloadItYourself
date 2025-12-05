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
	const { ElectronChromeExtensions } = require('electron-chrome-extensions')
	const isInt = require('lodash.isinteger')
	let electronUserAgent = require('./node_modules/top-user-agents-1/index.json')
	console.log('User Agent set to "' + electronUserAgent[0] + '"')
	if(electronUserAgent[1] === require('./node_modules/top-user-agents/desktop.json')[0]) {
		electronUserAgent = electronUserAgent[1]
		console.log('Found newer User Agent "' + electronUserAgent + '"')
		console.log('User Agent set to "' + electronUserAgent + '"')
	}
	else {
		electronUserAgent = electronUserAgent[0]
	}

	// Run
	app.whenReady().then(() => {
		app.userAgentFallback = electronUserAgent;

		const extensions = new ElectronChromeExtensions({license: 'GPL-3.0'})
		const browserWindow = new BrowserWindow({
			width: 1920,
			height: 969,
			frame: false,
			show: false,
			webPreferences: {
				sandbox: true, // Required for extension preload scripts
				contextIsolation: true, // Recommended for loading remote content
				devTools: false,
				backgroundThrottling: false,
				additionalArguments: ['--js-flags="--jitless"']
			},
		})

		// Adds the active tab of the browser
		extensions.addTab(browserWindow.webContents, browserWindow)

		// Disallow access to microphone, camera, location, clipboard, screen recording and so on
		// Still allows images and JavaScript since they're not part of this system
		browserWindow.webContents.session.setPermissionRequestHandler((webContents, permission, callback) => {
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
				let response = Error('Response was never set')
				// GitHub
				if(download.download.startsWith('https://github.com/')) {
					// GitHub Releases
					if(/^https:\/\/github\.com\/[a-zA-Z0-9._-]+\/[a-zA-Z0-9._-]+\/releases$/.test(download.download)) {
						response = await require('./lib/dl/gRelease.js')(i, backoff, download, workingDirectory)
					}
					// GitHub Workflows
					else if(/^https:\/\/github\.com\/[a-zA-Z0-9._-]+\/[a-zA-Z0-9._-]+\/actions\/workflows\/.*\.yml$/.test(download.download)) {
						response = await require('./lib/dl/gWorkflow.js')(i, backoff, download, workingDirectory)
					}
					else {
						console.error('Unrecognized GitHub url:', download.download)
						process.exit(1)
						return
					}
				}
				else {
					console.error('Unrecognized domain name:', download.download)
					process.exit(1)
					return
				}
				// Handle response
				if(Error.isError(response)) {
					console.error(response)
					process.exit(1)
					return
				}
				else if(typeof response === 'object' && isInt(response.i) && isInt(response.backoff) && typeof response.download === 'object' && !Array.isArray(response.download)) {
					downloadlist.downloads[i] = response.download
					i = response.i
					backoff = response.backoff
				}
				else {
					console.error('Unexpected Response:', response)
					process.exit(1)
					return
				}
			}
			browserWindow.close()
		}
		downloadFiles()

		browserWindow.on('close', () => {
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
