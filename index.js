(function() {

// Version
var nodeVersion = require('./package.json').engines.node;
var electronVersion = require('./node_modules/electron/package.json').version;

// Env
process.env.ELECTRON_OVERRIDE_DIST_PATH = (/^win/.test(process.platform) ? 'bin/windows/x64/electron/electron-v' + electronVersion + '-win32-x64' : 'bin/linux/x64/electron/electron-v' + electronVersion + '-linux-x64');

// Executable check
if(!process.versions.electron) {
	console.log('Running on Node ' + process.versions.node);
	if(process.versions.node !== nodeVersion) {
		throw Error('Expected Node ' + nodeVersion + ' instead of Node ' + process.versions.node);
	}

	// Start Electron
	const electron = require('electron');
	const { spawn } = require('child_process');
	console.log('Starting Electron ' + electronVersion);
	const child = spawn(electron, ['--use_strict', 'index.js'], { stdio: 'inherit', windowsHide: false });
}
else {
	console.log('Running on Electron ' + process.versions.electron);
	if(process.versions.electron !== electronVersion) {
		throw Error('Expected Electron ' + electronVersion + ' instead of Electron ' + process.versions.electron);
	}

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

		win.loadURL('https://techblog.willshouse.com/2012/01/03/most-common-user-agents/', { userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'});

		// Intentionally using on instead of once
		win.webContents.on('did-finish-load', () => {
			win.webContents.executeJavaScript(`[...document.querySelectorAll('tbody .useragent')].map(e => e.innerText)`).then((result) => {
				console.log(result);
				if(result.length > 0) {
					fs.writeFileSync('./index.json', stringify(result), 'utf-8');
					app.exit();
				}
			}).catch((error) => {
				console.log(error);
			});
		});
	});
}

// After everything is done (even if we error out)
process.on('exit', () => { // Asynchronous functions do not work beyond this point
	console.log(process.versions.electron ? 'Exiting Electron ' + process.versions.electron : 'Exiting Node ' + process.versions.node);
});

})();
