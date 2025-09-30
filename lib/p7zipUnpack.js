const { spawnSync } = require('child_process')
const fs = require('../bin/windows/x64/node/node-v'+require('../package.json').engines.node+'-win-x64/node_modules/npm/node_modules/graceful-fs')

const p7zipUnpack = (file, out, type, callback) => {
	const { status } = spawnSync('bin\\windows\\x64\\7z\\7z' + require('../downloadlist.json').config['p7zip-version'] + '-x64\\7z.exe', (type === null ? ['x', '-ba', '-aoa', '-o' + out, file] : ['x', '-ba', '-aoa', '-o' + out, type, file]), { stdio: 'inherit' })
	if(status !== 0) {
		callback(Error('7z exit code: ' + status))
		return
	}
	fs.unlink(file, (err) => {
		if (err) {
			callback(err)
			return
		}
		callback(null)
	})
}

module.exports = p7zipUnpack
