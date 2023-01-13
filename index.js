#!/usr/bin/env node
'use strict'

// Require
const electronVersion = require('./package.json').devDependencies.electron
const fs = require('./node_modules/npm/node_modules/graceful-fs')

// Function
function writeReadme() {
	function generateReadme(t) {
		function traverseDependencies(d,p) {
			// Require
			const isString = require('./node_modules/lodash.isstring')
			
			let a = []
			Object.keys(d).forEach((k) => {
				// Name
				d[k].name = k
				
				// Path
				d[k].path = (isString(p) ? p + '/node_modules/' + k : 'node_modules/' + k)
				
				// Location
				d[k].location = d[k].path.replaceAll('node_modules/','')
				
				// Package
				const pkg = require('./' + d[k].path + '/package.json')
				
				// Version
				d[k].version = pkg.version
				
				// License
				if(!pkg.license) {
					d[k].license = ''
				}
				else if(isString(pkg.license)) {
					d[k].license = pkg.license
				}
				else {
					d[k].license = pkg.license.type
				}
				
				// Author
				if(!pkg.author) {
					d[k].author = ''
				}
				else if(isString(pkg.author)) {
					d[k].author = pkg.author
				}
				else {
					d[k].author = pkg.author.name
				}
				
				// Source Code
				if(!pkg.repository) {
					d[k].source = ''
				}
				else if(isString(pkg.repository)) {
					d[k].source = pkg.repository
				}
				else {
					d[k].source = pkg.repository.url
				}
				if(d[k].source.startsWith('git+')) {
					d[k].source = d[k].source.slice(4)
				}
				if(d[k].source.startsWith('git://')) {
					d[k].source = 'https://' + d[k].source.slice(6)
				}
				else if(d[k].source.startsWith('ssh://git@')) {
					d[k].source = 'https://' + d[k].source.slice(10)
				}
				if(d[k].source.endsWith('.git')) {
					d[k].source = d[k].source.slice(0,-4)
				}
				
				// Description
				if(isString(pkg.description)) {
					d[k].description = pkg.description.replace(/[^ -~]/g,' ').trim().replace(/ +/g,' ').replace(/[Nn]ode\.js|[Nn]ode(?!s)/g,'Node').replace(/\.$/,'') + '.'
					d[k].description = d[k].description[0].toUpperCase() + d[k].description.slice(1)
				}
				else {
					d[k].description = ''
				}
				
				// Required by
				d[k].requiredBy = ''
				for (let i=0; i<pkg._requiredBy.length; i++) {
					if(pkg._requiredBy[i] === '/') {
						pkg._requiredBy.splice(i, 1)
						i--
						continue
					}
					if(i === 0) {
						d[k].requiredBy += 'Required by '
					}
					else {
						d[k].requiredBy += ', '
					}
					d[k].requiredBy += pkg._requiredBy[i].slice(1)
					if(i === pkg._requiredBy.length-1) {
						d[k].requiredBy += '.'
					}
				}
				
				// Add to array
				a.push(d[k])
				
				// Resolve children
				if(d[k].dependencies) {
					const b = traverseDependencies(d[k].dependencies,d[k].path)
					for (let i=0; i<b.length; i++) {
						a.push(b[i])
					}
				}
			})
			return a
		}
		function htmlspecialchars(s) {
			return s.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll("'", '&#039;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
		}
		
		// Readme
		const dependencies = traverseDependencies(require('./package-lock.json').dependencies)
		let html = '<h2>Node dependencies</h2>\n'
		html += '<table>\n'
		html += '<tr>\n'
		html += '<th>Icon</th>\n'
		html += '<th>Name</th>\n'
		html += '<th>Author</th>\n'
		html += '<th>License</th>\n'
		html += '<th>Source&nbsp;Code</th>\n'
		html += '<th>Distribution</th>\n'
		html += '<th>Description</th>\n'
		html += '<th>Version</th>\n'
		html += '</tr>\n'
		for (let i=0; i<dependencies.length; i++) {
			const d = dependencies[i]
			if(t === 'md' && (d.location.startsWith('npm/') || d.location.startsWith('npm-6/'))) {
				continue
			}
			const escName = htmlspecialchars(d.name)
			const escLocation = htmlspecialchars(d.location)
			const escAuthor = htmlspecialchars(d.author)
			const escLicense = htmlspecialchars(d.license)
			const escSource = htmlspecialchars(d.source)
			const escDescription = htmlspecialchars(d.description)
			const escRequiredBy = htmlspecialchars(d.requiredBy)
			const escVersion = htmlspecialchars(d.version)
			html += '<tr>\n'
			html += '<td align="center"><a href="https://www.npmjs.com/package/' + escName +'" title="' + escName +'"><img src="https://raw.githubusercontent.com/npm/logos/master/npm%20logo/classic/npm-2009.svg" width="31" alt="' + escName +'" title="' + escName +'"></a></td>\n'
			html += '<td><a href="https://www.npmjs.com/package/' + escName +'" title="' + escName +'">' + escLocation + '</a></td>\n'
			html += '<td>' + escAuthor + '</td>\n'
			html += '<td>' + escLicense + '</td>\n'
			html += '<td>' + escSource + '</td>\n'
			html += '<td align="center"><a href="##" title="Distribution Allowed"><img src="docs/img/svg/check.svg" width="24" alt="OK" title="Distribution Allowed"></a></td>\n'
			html += '<td>' + (escDescription !== '' ? (escRequiredBy !== '' ? escDescription + '<br>' + escRequiredBy : escDescription) : escRequiredBy) +'</td>\n'
			html += '<td align="center">' + escVersion + '</td>\n'
			html += '</tr>\n'
		}
		return html += '</table>\n'
	}
	fs.writeFileSync('README.html', generateReadme('html'), 'utf-8')
	fs.writeFileSync('README.md', generateReadme('md'), 'utf-8')
}

// Executable check
if(process.versions.electron) {
	// Validate executable
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
	const isArrayLike = require('./node_modules/lodash.isarraylike')
	function isEqualArrayShallow(a, b) {
		if (!isArrayLike(a) || !isArrayLike(b) || a.length !== b.length) {
			return false
		}
		for (let i=0; i<a.length; i++) {
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
						fs.writeFileSync('./node_modules/top-user-agents/index.json', stringify(result), 'utf-8')
						win.close()
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
			writeReadme()
			app.exit()
		})
	})
}
else {
	// Validate executable
	const nodeVersion = require('./package.json').engines.node
	console.log('Running on Node ' + process.versions.node)
	if(process.versions.node !== nodeVersion) {
		throw Error('Expected Node ' + nodeVersion + ' instead of Node ' + process.versions.node)
	}
	
	if(process.argv.slice(2).includes('--readme_only')) {
		writeReadme()
		return
	}

	// Require
	const { spawn } = require('child_process')
	const rimraf = require('./node_modules/npm/node_modules/rimraf')
	const isWindows = /^win/.test(process.platform)
	const electronCliVersion = require('./node_modules/electron/package.json').version
	const winElectronPath = 'bin\\windows\\x64\\electron\\electron-v' + electronVersion + '-win32-x64'

	// Function
	function startElectron() {
		console.log('Starting Electron ' + electronVersion)
		if(electronCliVersion !== electronVersion) {
			console.log('Electron ' + electronVersion + ' is ahead of Electron CLI ' + electronCliVersion + '. This is harmless and will fix itself.')
		}
		process.env.ELECTRON_OVERRIDE_DIST_PATH = (isWindows ? 'bin/windows/x64/electron/electron-v' + electronVersion + '-win32-x64' : 'bin/linux/x64/electron/electron-v' + electronVersion + '-linux-x64')
		const electron = require('electron')
		const child = spawn(electron, ['--use_strict', 'index.js'], { stdio: 'inherit' })
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
