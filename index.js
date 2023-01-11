#!/usr/bin/env node
'use strict'

// Require
const nodeVersion = require('./package.json').engines.node
const electronVersion = require('./package.json').devDependencies.electron
const electronCliVersion = require('./node_modules/electron/package.json').version
const fs = require('./node_modules/npm/node_modules/graceful-fs')
const rimraf = require('./node_modules/npm/node_modules/rimraf')

// Executable check
if(process.versions.electron) {
	console.log('Running on Electron ' + process.versions.electron + ' + Node ' + process.versions.node)
	if(process.versions.electron !== electronVersion) {
		throw Error('Expected Electron ' + electronVersion + ' instead of Electron ' + process.versions.electron)
	}

	// Require
	const { app, BrowserWindow } = require('electron')
	const stringify = require('./node_modules/npm/node_modules/json-stringify-nice')
	const userAgents = require('top-user-agents')
	let electronUserAgent = userAgents[0]
	console.log('User Agent set to "' + electronUserAgent + '"')

	// Function
	function isArrayLike(a) {
		return (Array.isArray(a) || (a !== null && typeof a === "object" && typeof a.length === "number" && (a.length === 0 || (a.length > 0 && (a.length - 1) in a))))
	}
	function isEqualArrayShallow(a, b) {
		if (!isArrayLike(a) || !isArrayLike(b) || a.length !== b.length) {
			return false
		}
		let i=0
		for (; i<a.length; i++) {
			if (a[i] !== b[i]) {
				return false
			}
		}
		return true
	}

	// Run
	app.whenReady().then(() => {
		const win = new BrowserWindow({
			width: 1920,
			height: 969,
			frame: false,
			show: false,
			webPreferences: {
				backgroundThrottling: false
			}
		})

		win.loadURL('https://techblog.willshouse.com/2012/01/03/most-common-user-agents/', {userAgent: electronUserAgent})

		// Intentionally using on instead of once
		win.webContents.on('did-finish-load', () => {
			win.webContents.executeJavaScript(`[...document.querySelectorAll('tbody .useragent')].map(e => e.innerText)`).then((result) => {
				if(result.length > 0) {
					// Update User Agent
					if(electronUserAgent !== result[0]) {
						electronUserAgent = result[0]
						console.log('User Agent updated to "' + electronUserAgent + '"')
					}
					// Write User Agents to file
					if(!isEqualArrayShallow(userAgents, result)) {
						fs.writeFile('./node_modules/top-user-agents/index.json', stringify(result), 'utf-8', () => {
							win.close()
						})
					}
					else {
						win.close()
					}
				}
			}).catch((error) => {
				console.error(error)
				win.close()
			})
		})
		
		win.on('close', () => {
			app.exit()
		})
	})
}
else {
	console.log('Running on Node ' + process.versions.node)
	if(process.versions.node !== nodeVersion) {
		throw Error('Expected Node ' + nodeVersion + ' instead of Node ' + process.versions.node)
	}

	// Require
	const { spawn } = require('child_process')
	const isWindows = /^win/.test(process.platform)
	const winElectronPath = 'bin\\windows\\x64\\electron\\electron-v' + electronVersion + '-win32-x64'

	// Function
	function startElectron() {
		console.log('Starting Electron ' + electronVersion)
		if(electronCliVersion !== electronVersion) {
			console.log('Electron CLI ' + electronCliVersion + ' is behind Electron ' + electronVersion + '. This is harmless and will fix itself within 24-hours.')
		}
		process.env.ELECTRON_OVERRIDE_DIST_PATH = (isWindows ? 'bin/windows/x64/electron/electron-v' + electronVersion + '-win32-x64' : 'bin/linux/x64/electron/electron-v' + electronVersion + '-linux-x64')
		const electron = require('electron')
		spawn(electron, ['--use_strict', 'index.js'], { stdio: 'inherit' })
	}

	// Unpack Electron
	if(isWindows && !fs.existsSync(winElectronPath + '\\electron.exe')) {
		const p7zip = spawn('bin\\windows\\x64\\7z\\7z2201-x64\\7z.exe', ['x', '-tsplit', winElectronPath + '\\electron.exe.001', '-o' + winElectronPath])
		p7zip.on('exit', () => {
			rimraf(winElectronPath + '\\electron.exe.*', fs, () => {
				startElectron()
			})
		})
	}
	else {
		startElectron()
	}
}

// Shutdown
process.on('exit', () => {
	console.log(process.versions.electron ? 'Exiting Electron ' + process.versions.electron + ' + Node ' + process.versions.node : 'Exiting Node ' + process.versions.node)
})
