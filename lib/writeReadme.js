const nodeVersion = require('../package.json').engines.node
const isString = require('lodash.isstring')
const fs = require('../bin/windows/x64/node/node-v'+nodeVersion+'-win-x64/node_modules/npm/node_modules/graceful-fs')

const writeReadme = (downloadlist) => {
	const generateReadme = (t) => {
		const textFromConfig = (textArray, type) => {
			let string = ''
			let nextUrl = []
			for (let i=0; i<textArray.length; i++) {
				if(!isString(textArray[i])) {
					throw Error('Unimplemented')
				}
				if(textArray[i].startsWith('https://')) {
					nextUrl.push(textArray[i])
				}
				else if(nextUrl.length > 0) {
					if(nextUrl.length === 1) {
						if(type === 'md') {
							string += '[' + textArray[i] + '](' + nextUrl[0] + ')\n\n'
						}
						else {
							string += '<p><a href="' + nextUrl[0] + '">' + textArray[i] + '</a></p>\n'
						}
						nextUrl = []
					}
					else {
						if(type === 'md') {
							string += '**' + textArray[i] + '**'
							for(let j=0; j<nextUrl.length; j++) {
								string += '[[' + (j+1) + ']](' + nextUrl[j] + ')'
							}
							string += '\n\n'
						}
						else {
							string += '<p><b>' + textArray[i] + '</b>'
							for(let j=0; j<nextUrl.length; j++) {
								string += '<a href="' + nextUrl[j] + '">[' + (j+1) + ']</a>'
							}
							string += '</p>\n'
						}
						nextUrl = []
					}
				}
				else if(textArray[i].startsWith('# ')) {
					if(type === 'md') {
						string += '# ' + textArray[i].slice(2) + '\n\n'
					}
					else {
						string += '<h1>' + textArray[i].slice(2) + '</h1>\n'
					}
				}
				else if(textArray[i].startsWith('## ')) {
					if(type === 'md') {
						string += '## ' + textArray[i].slice(3) + '\n\n'
					}
					else {
						string += '<h2>' + textArray[i].slice(3) + '</h2>\n'
					}
				}
				else {
					if(type === 'md') {
						string += textArray[i] + '\n\n'
					}
					else {
						string += '<p>' + textArray[i] + '</p>\n'
					}
				}
			}
			return string
		}

		let html = ''

		// Header
		html += textFromConfig([...downloadlist.config['readme-header']], t)

		// Binaries
		const readableVersion = (version) => {
			return version.slice(0, -2) + '.' + version.slice(-2)
		}
		const p7zipVersion = readableVersion(require('../downloadlist.json').config['p7zip-version'])
		const portableGitVersion = require('../downloadlist.json').config['portable-git-short']
		const electronVersion = require('../package.json').devDependencies.electron
		const nodeVersion = require('../package.json').engines.node
		if(t === 'md') {
			html += '## Binaries\n\n'
			html += '| Icon | Name | Author | License | Source&nbsp;Code | Distribution | Description | Version |\n'
			html += '| :---: | --- | --- | --- | --- | :---: | --- | :---: |\n'
			html += '| [<img src="https://raw.githubusercontent.com/ip7z/7zip/main/CPP/7zip/UI/FileManager/7zipLogo.ico" width="31">](https://www.7-zip.org/)'
			html += ' | [7-Zip](https://www.7-zip.org/)'
			html += ' | Igor Pavlov'
			html += ' | [7-Zip license](docs/legal/7-Zip%20license.txt)'
			html += ' | [Open Source](https://github.com/ip7z/7zip)'
			html += ' | &#x2714;&#xFE0F;'
			html += ' | 7-Zip is a file archiver with a high compression ratio.'
			html += ' | ' + p7zipVersion + ' |\n'
			html += '| [<img src="https://avatars.githubusercontent.com/u/4571183" width="31">](https://gitforwindows.org/)'
			html += ' | [Git for Windows](https://gitforwindows.org/)'
			html += ' | Linus Torvalds'
			html += ' | [git license](docs/legal/git%20license.txt)'
			html += ' | [Open Source](https://github.com/git-for-windows/git)'
			html += ' | &#x2714;&#xFE0F;'
			html += ' | A fork of Git containing Windows-specific patches.'
			html += ' | ' + portableGitVersion + ' |\n'
			html += '| [<img src="https://www.electronjs.org/assets/img/logo.svg" width="31">](https://www.electronjs.org/)'
			html += ' | [Electron](https://www.electronjs.org/)'
			html += ' | Electron contributors, GitHub Inc.'
			html += ' | [MIT](docs/legal/MIT.txt)'
			html += ' | [Open Source](https://github.com/electron/electron)'
			html += ' | &#x2714;&#xFE0F;'
			html += ' | Build cross-platform desktop apps with JavaScript, HTML, and CSS.'
			html += ' | ' + electronVersion + ' |\n'
			html += '| [<img src="https://nodejs.org/static/logos/nodejsHex.svg" width="31">](https://nodejs.org/en)'
			html += ' | [Node](https://nodejs.org/en)'
			html += ' | Node contributors, Joyent Inc.'
			html += ' | [Node license](docs/legal/Node%20license.txt)'
			html += ' | [Open Source](https://github.com/nodejs/node)'
			html += ' | &#x2714;&#xFE0F;'
			html += ' | Node is an open-source, cross-platform JavaScript runtime environment.'
			html += ' | ' + nodeVersion + ' |\n\n'
		}
		else {
			html += '<h2>Binaries</h2>\n'
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
			html += '<tr>\n'
			html += '<td align="center"><a href="https://www.7-zip.org/"><img src="https://raw.githubusercontent.com/ip7z/7zip/main/CPP/7zip/UI/FileManager/7zipLogo.ico" width="31"></a></td>\n'
			html += '<td><a href="https://www.7-zip.org/">7-Zip</a></td>\n'
			html += '<td>Igor Pavlov</td>\n'
			html += '<td><a href="docs/legal/7-Zip%20license.txt">7-Zip license</a></td>\n'
			html += '<td><a href="https://github.com/ip7z/7zip">Open Source</a></td>\n'
			html += '<td align="center">&#x2714;&#xFE0F;</td>\n'
			html += '<td>7-Zip is a file archiver with a high compression ratio.</td>\n'
			html += '<td align="center">' + p7zipVersion + '</td>\n'
			html += '</tr>\n'
			html += '<tr>\n'
			html += '<td align="center"><a href="https://gitforwindows.org/"><img src="https://avatars.githubusercontent.com/u/4571183" width="31"></a></td>\n'
			html += '<td><a href="https://gitforwindows.org/">Git for Windows</a></td>\n'
			html += '<td>Linus Torvalds</td>\n'
			html += '<td><a href="docs/legal/git%20license.txt">git license</a></td>\n'
			html += '<td><a href="https://github.com/git-for-windows/git">Open Source</a></td>\n'
			html += '<td align="center">&#x2714;&#xFE0F;</td>\n'
			html += '<td>A fork of Git containing Windows-specific patches.</td>\n'
			html += '<td align="center">' + portableGitVersion + '</td>\n'
			html += '</tr>\n'
			html += '<tr>\n'
			html += '<td align="center"><a href="https://www.electronjs.org/"><img src="https://www.electronjs.org/assets/img/logo.svg" width="31"></a></td>\n'
			html += '<td><a href="https://www.electronjs.org/">Electron</a></td>\n'
			html += '<td>Electron contributors, GitHub Inc.</td>\n'
			html += '<td><a href="docs/legal/MIT.txt">MIT</a></td>\n'
			html += '<td><a href="https://github.com/electron/electron">Open Source</a></td>\n'
			html += '<td align="center">&#x2714;&#xFE0F;</td>\n'
			html += '<td>Build cross-platform desktop apps with JavaScript, HTML, and CSS.</td>\n'
			html += '<td align="center">' + electronVersion + '</td>\n'
			html += '</tr>\n'
			html += '<tr>\n'
			html += '<td align="center"><a href="https://nodejs.org/en"><img src="https://nodejs.org/static/logos/nodejsHex.svg" width="31"></a></td>\n'
			html += '<td><a href="https://nodejs.org/en">Node</a></td>\n'
			html += '<td>Node contributors, Joyent Inc.</td>\n'
			html += '<td><a href="docs/legal/Node%20license.txt">Node license</a></td>\n'
			html += '<td><a href="https://github.com/nodejs/node">Open Source</a></td>\n'
			html += '<td align="center">&#x2714;&#xFE0F;</td>\n'
			html += '<td>Node is an open-source, cross-platform JavaScript runtime environment.</td>\n'
			html += '<td align="center">' + nodeVersion + '</td>\n'
			html += '</tr>\n'
			html += '</table>\n'
		}

		// Browser extensions
		const ublockOriginVersion = require('../downloadlist.json').config['ublock-origin-version']
		if(t === 'md') {
			html += '## Browser extensions\n\n'
			html += '| Icon | Name | Author | License | Source&nbsp;Code | Distribution | Description | Version |\n'
			html += '| :---: | --- | --- | --- | --- | :---: | --- | :---: |\n'
			html += '| [<img src="https://raw.githubusercontent.com/gorhill/uBlock/master/src/img/ublock.svg" width="31">](https://ublockorigin.com/)'
			html += ' | [uBlock Origin](https://ublockorigin.com/)'
			html += ' | Raymond Hill (gorhill)'
			html += ' | [GPL-3.0](docs/legal/GPL-3.0.txt)'
			html += ' | [Open Source](https://github.com/gorhill/uBlock)'
			html += ' | &#x2714;&#xFE0F;'
			html += ' | Finally, an efficient blocker. Easy on CPU and memory.'
			html += ' | ' + ublockOriginVersion + ' |\n\n'
		}
		else {
			html += '<h2>Browser extensions</h2>\n'
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
			html += '<tr>\n'
			html += '<td align="center"><a href="https://ublockorigin.com/"><img src="https://raw.githubusercontent.com/gorhill/uBlock/master/src/img/ublock.svg" width="31"></a></td>\n'
			html += '<td><a href="https://ublockorigin.com/">uBlock Origin</a></td>\n'
			html += '<td>Raymond Hill (gorhill)</td>\n'
			html += '<td><a href="docs/legal/GPL-3.0.txt">GPL-3.0</a></td>\n'
			html += '<td><a href="https://github.com/gorhill/uBlock">Open Source</a></td>\n'
			html += '<td align="center">&#x2714;&#xFE0F;</td>\n'
			html += '<td>Finally, an efficient blocker. Easy on CPU and memory.</td>\n'
			html += '<td align="center">' + ublockOriginVersion + '</td>\n'
			html += '</tr>\n'
			html += '</table>\n'
		}

		// Footer
		html += textFromConfig([...downloadlist.config['readme-footer']])

		// Write
		return html
	}
	fs.writeFileSync('README.html', generateReadme('html'), 'utf-8')
	fs.writeFileSync('README.md', generateReadme('md'), 'utf-8')
}

module.exports = writeReadme
