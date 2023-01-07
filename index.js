// Version
const nodeVersion = require('./package.json').engines.node;
const electronVersion = require('./node_modules/electron/package.json').version;
let electronUserAgent = require('./node_modules/top-user-agents/index.json')[0];

// Env
process.env.ELECTRON_OVERRIDE_DIST_PATH = (/^win/.test(process.platform) ? 'bin/windows/x64/electron/electron-v' + electronVersion + '-win32-x64' : 'bin/linux/x64/electron/electron-v' + electronVersion + '-linux-x64');

// Executable check
if(process.versions.electron) {
	console.log('Running on Electron ' + process.versions.electron + ' + Node ' + process.versions.node);
	if(process.versions.electron !== electronVersion) {
		throw Error('Expected Electron ' + electronVersion + ' instead of Electron ' + process.versions.electron);
	}
	console.log('User Agent set to "' + electronUserAgent + '"');

	// Require
	const fs = require('fs');
	const { app, BrowserWindow } = require('electron');
	const stringify = require('./node_modules/npm/node_modules/json-stringify-nice');

	// Run
	app.whenReady().then(() => {
		const win = new BrowserWindow({
			width: 1920,
			height: 969,
			frame: false,
			show: false,
			webPreferences: {
				nativeWindowOpen: true
			}
		});

		win.loadURL('https://techblog.willshouse.com/2012/01/03/most-common-user-agents/', {userAgent: electronUserAgent});

		// Intentionally using on instead of once
		win.webContents.on('did-finish-load', () => {
			win.webContents.executeJavaScript(`[...document.querySelectorAll('tbody .useragent')].map(e => e.innerText)`).then((result) => {
				if(result.length > 0) {
					// Update User Agent
					if(electronUserAgent !== result[0]) {
						electronUserAgent = result[0];
						console.log('User Agent updated to "' + electronUserAgent + '"');
					}
					// Write User Agents to file
					fs.writeFileSync('./node_modules/top-user-agents/index.json', stringify(result), 'utf-8');
					app.exit();
				}
			}).catch((error) => {
				console.log(error);
				app.exit();
			});
		});
	});
}
else {
	console.log('Running on Node ' + process.versions.node);
	if(process.versions.node !== nodeVersion) {
		throw Error('Expected Node ' + nodeVersion + ' instead of Node ' + process.versions.node);
	}

	// Start Electron
	const electron = require('electron');
	const { spawn } = require('child_process');
	console.log('Starting Electron ' + electronVersion);
	spawn(electron, ['--use_strict', 'index.js'], { stdio: 'inherit', windowsHide: false });
}

// After everything is done (even if we error out)
process.on('exit', () => { // Asynchronous functions do not work beyond this point
	console.log(process.versions.electron ? 'Exiting Electron ' + process.versions.electron + ' + Node ' + process.versions.node : 'Exiting Node ' + process.versions.node);
});
