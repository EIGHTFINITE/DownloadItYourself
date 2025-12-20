#!/usr/bin/env node
'use strict';

require('events').EventEmitter.defaultMaxListeners = 11
const workingDirectory = __dirname
const isWindows = /^win/.test(process.platform)
const nodeVersion = require('./package.json').engines.node
const npmVersion = require('./bin/windows/x64/node/node-v'+nodeVersion+'-win-x64/node_modules/npm/package.json').version
const electronVersion = require('./package.json').devDependencies.electron
const downloadlist = require('./downloadlist.json')
const writeReadme = require('./lib/writeReadme.js')
const stringify = require('./bin/windows/x64/node/node-v'+nodeVersion+'-win-x64/node_modules/npm/node_modules/json-stringify-nice')
const fs = require('./bin/windows/x64/node/node-v'+nodeVersion+'-win-x64/node_modules/npm/node_modules/graceful-fs')
try {
	fs.unlinkSync('.userData')
}
catch(err) {
	if (err.code !== 'ENOENT') {
		throw err
	}
}

// Executable check
if(process.versions.electron) {
	// Validate executable
	console.log('Running on Electron ' + process.versions.electron + ' + Node ' + process.versions.node + ' + Chrome ' + process.versions.chrome)
	if(process.versions.electron !== electronVersion) {
		console.error('Expected Electron ' + electronVersion + ' instead of Electron ' + process.versions.electron)
		process.exit(1)
		return
	}

	// Require
	const { app, session, BrowserWindow } = require('electron')
	const { ElectronChromeExtensions } = require('electron-chrome-extensions')
	const isInt = require('lodash.isinteger')
	const isString = require('lodash.isstring')
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

	// Clean up browser storage
	const userData = app.getPath('userData')
	let userDataDir = null
	try {
		userDataDir = fs.readdirSync(userData, {withFileTypes: true})
	}
	catch(err) {
		if (err.code !== 'ENOENT') {
			throw err
		}
	}
	if(userDataDir !== null && userDataDir.length > 0) {
		console.log('Cleaning "' + userData + '"')
		for (let i = 0; i < userDataDir.length; i++) {
			if(userDataDir[i].isDirectory()) {
				try {
					fs.rmSync(userData + (isWindows ? '\\' : '/') + userDataDir[i].name, { recursive: true })
				}
				catch(err) {
					if (err.code !== 'ENOENT') {
						throw err
					}
				}
			}
			else {
				try {
					fs.unlinkSync(userData + (isWindows ? '\\' : '/') + userDataDir[i].name)
				}
				catch(err) {
					if (err.code !== 'ENOENT') {
						throw err
					}
				}
			}
		}
	}
	// Confirm browser storage is clean
	userDataDir = null
	try {
		userDataDir = fs.readdirSync(userData)
	}
	catch(err) {
		if (err.code !== 'ENOENT') {
			throw err
		}
	}
	if(userDataDir !== null && userDataDir.length > 0) {
		fs.writeFileSync('.userData', userData, 'utf-8')
		console.error('Expected "' + userData + '" to be empty')
		console.error('Directory will now be cleaned, run the application again after')
		process.exit(1)
		return
	}

	// Run
	app.whenReady().then(async () => {
		app.userAgentFallback = electronUserAgent;

		const browserSession = session.defaultSession
		const extensions = new ElectronChromeExtensions({
			license: 'GPL-3.0',
			session: browserSession
		})
		const browserWindow = new BrowserWindow({
			width: 1920,
			height: 969,
			frame: false,
			show: false,
			webPreferences: {
				session: browserSession, // Use same session given to Extensions class
				sandbox: true, // Required for extension preload scripts
				contextIsolation: true, // Recommended for loading remote content
				devTools: false,
				backgroundThrottling: false,
				additionalArguments: ['--js-flags="--jitless"']
			},
		})

		const allExtensions = browserSession.extensions.getAllExtensions()
		if(!Array.isArray(allExtensions) || allExtensions.length !== 0) {
			console.error('Expected no extensions to be installed')
			process.exit(1)
			return
		}

		// Enable extensions
		extensions.addTab(browserWindow.webContents, browserWindow)
		console.log('Loading uBlock Origin ' + require('./extensions/uBlock0.chromium/manifest.json').version)
		const extension = await browserSession.extensions.loadExtension(workingDirectory + (isWindows ? '\\extensions\\uBlock0.chromium' : '/extensions/uBlock0.chromium'));
		if (extension) {
			if (extension.manifest.manifest_version === 3) {
				if(extension.manifest.background?.service_worker) {
					await browserSession.serviceWorkers.startWorkerForScope('chrome-extension://' + extension.id).catch(() => {
						console.error('Failed to start worker for extension')
						process.exit(1)
						return
					})
				}
				console.log('Successfully loaded MV3 extension uBlock Origin')
			}
			else if(extension.manifest.manifest_version === 2) {
				console.log('Successfully loaded MV2 extension uBlock Origin')
			}
			else {
				console.error('Unrecognized extension manifest')
				process.exit(1)
				return
			}
		}
		else {
			console.error('Extension failed to load')
			process.exit(1)
			return
		}

		// Disallow new windows
		browserWindow.webContents.setWindowOpenHandler(({ url }) => {
			console.log('Blocked "' + url + '" because it would\'ve created a new window')
			return { action: 'deny' }
		})

		// Disallow access to microphone, camera, location, clipboard, screen recording and so on
		// Still allows images and JavaScript since they're not part of this system
		browserSession.setPermissionRequestHandler((webContents, permission, callback, details) => {
			if(permission === 'media') {
				let mediaTypes = []
				if(Array.isArray(details.mediaTypes)) {
					mediaTypes = details.mediaTypes.filter((val) => {
						return isString(val)
					})
				}
				console.log('Denied access to "media" (' + (mediaTypes.length > 0 ? mediaTypes.join(', ') : 'unknown') + ') permission requested by ' + (isString(details.requestingUrl) ? '"' + details.requestingUrl + '"' : 'site'))
			}
			else {
				console.log('Denied access to "' + permission + '" permission requested by ' + (isString(details.requestingUrl) ? '"' + details.requestingUrl + '"' : 'site'))
			}
			return callback(false)
		})
		browserSession.setPermissionCheckHandler((webContents, permission, requestingOrigin, details) => {
			if(isString(details.embeddingOrigin) && details.embeddingOrigin.startsWith('chrome-extension://' + extension.id + '/')) {
				if(permission === 'media') {
					console.log('Allowed access to "media" (' + (isString(details.mediaType) ? details.mediaType : 'unknown') + ') permission requested by uBlock Origin')
				}
				else {
					console.log('Allowed access to "' + permission + '" permission requested by uBlock Origin')
				}
				return true
			}
			if(!isString(details.mediaType) || details.embeddingOrigin !== 'https://www.example.com/') {
				if(permission === 'media') {
					console.log('Denied access to "media" (' + (isString(details.mediaType) ? details.mediaType : 'unknown') + ') permission requested by ' + (isString(details.embeddingOrigin) ? '"' + details.embeddingOrigin + '"' : 'site'))
				}
				else {
					console.log('Denied access to "' + permission + '" permission requested by ' + (isString(details.embeddingOrigin) ? '"' + details.embeddingOrigin + '"' : 'site'))
				}
			}
			return false
		})

		console.log('Initializing web browser')
		await browserWindow.loadURL('about:blank')
		console.log('Starting uBlock Origin')
		// One real web request is needed for uBlock Origin to load its filter lists
		// Unfortunately this is the only real site that's reserved, functional, and without trackers
		await browserWindow.loadURL('https://www.example.com/')

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
		// Clean up browser storage
		fs.writeFileSync('.userData', userData, 'utf-8')
		// Exit message
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
		// Clean up browser storage
		let userData = null
		try {
			userData = fs.readFileSync('.userData')
		}
		catch(err) {
			if (err.code !== 'ENOENT') {
				throw err
			}
		}
		if(userData !== null) {
			fs.unlinkSync('.userData')
			let stat = null
			try {
				stat = fs.statSync(userData)
			}
			catch(err) {
				if (err.code !== 'ENOENT') {
					throw err
				}
			}
			if(stat !== null) {
				console.log('Cleaning "' + userData + '"')
				if(stat.isDirectory()) {
					fs.rmSync(userData, { recursive: true })
				}
				else {
					fs.unlinkSync(userData)
				}
			}
		}
		// Exit message
		console.log('Exiting Node ' + process.versions.node + ' + npm ' + npmVersion)
	})
}
