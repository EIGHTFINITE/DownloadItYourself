const nodeVersion = require('../package.json').engines.node
const isString = require('lodash.isstring')
const fs = require('../bin/windows/x64/node/node-v'+nodeVersion+'-win-x64/node_modules/npm/node_modules/graceful-fs')

const writeReadme = (downloadlist) => {
	const generateReadme = (t) => {
		let html = ''

		// Escape HTML
		//
		// https://www.php.net/manual/en/function.htmlspecialchars.php
		const escapeHtml = (s) => {
			return s.replace(/\s+/g,' ').trim().replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll("'", '&#039;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
		}

		// Escape Markdown
		//
		// Note that results cannot safely be concatenated together. Concatenate first then escape the entire string or set the aggressive option.
		//
		// Additionally, results cannot be safely inserted into emphasized text ('*', '_', '~', and '`') without setting the aggressive option.
		//
		// On top of that, '`' cannot be easily escaped inside code blocks.
		// Ensure code blocks are opened with '<code>' and closed with '</code>' instead of using '`' if the input can contain '`'.
		const escapeMd = (s,inHtml,aggressive) => {
			s = s.replace(/\s+/g,' ').trim().replace(/^(\s*)([0-9]+)\./,'$1$2\\.').replace(/^(\s*)([-+#>])/,'$1\\$2')
			if(aggressive || s.split('*').length > 2) {
				s = s.replaceAll('*', '\\*')
			}
			else {
				s = s.replace(/^(\s*)(\*)/,'$1\\$2')
			}
			if(aggressive || s.split('_').length > 2) {
				s = s.replaceAll('_', '\\_')
			}
			if(aggressive || s.split('~').length > 2) {
				s = s.replaceAll('~', '\\~')
			}
			if(aggressive || s.split('`').length > 2) {
				s = s.replaceAll('`', '\\`')
			}
			s = s.replaceAll('|', '\\|').replaceAll('[', '\\[').replaceAll(']', '\\]')
			if(inHtml) {
				s = s.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll("'", '&#039;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
			}
			return s
		}

		// Escape URL
		//
		// https://developer.mozilla.org/en-US/docs/Glossary/Percent-encoding
		//
		// The remaining problematic characters ('"', '<', '>', '\', '^', '`', '{', '|', `}`, and '~') are always escaped as well.
		const escapeUrl = (s,escapeSpace) => {
			s = s.replace(/\s+/g,' ').trim().replaceAll('%', '%25').replaceAll('[', '%5B').replaceAll(']', '%5D').replaceAll('@', '%40').replaceAll('!', '%21').replaceAll('$', '%24').replaceAll("'", '%27').replaceAll('(', '%28').replaceAll(')', '%29').replaceAll('*', '%2A').replaceAll('+', '%2B').replaceAll(',', '%2C').replaceAll(';', '%3B').replaceAll('"', '%22').replaceAll('<', '%3C').replaceAll('>', '%3E').replaceAll('\\', '%5C').replaceAll('^', '%5E').replaceAll('`', '%60').replaceAll('{', '%7B').replaceAll('|', '%7C').replaceAll('}', '%7D').replaceAll('~', '%7E')
			if(!s.startsWith('https://') && !s.startsWith('http://')) {
				s = s.replaceAll(':', '%3A')
			}
			if(escapeSpace) {
				s = s.replaceAll(' ', '%20')
			}
			return s
		}

		const textFromConfig = (textArray, type) => {
			let string = ''
			let nextUrl = []
			let prevWasUrl = false
			let nextIsUrl = false
			let forceNewLine = false
			for (let i=0; i<textArray.length; i++) {
				if(!isString(textArray[i])) {
					throw Error('Unimplemented')
				}
				if(i<(textArray.length-1) && (textArray[i+1].startsWith('https://') || textArray[i+1].startsWith('http://')) && textArray[i] !== textArray[i+1]) {
					nextIsUrl = true
				}
				else {
					nextIsUrl = false
				}
				if((textArray[i].startsWith('https://') || textArray[i].startsWith('http://')) && textArray[i] !== textArray[i-1]) {
					nextUrl.push(textArray[i])
				}
				else if(nextUrl.length > 0) {
					if(nextUrl.length === 1) {
						if(type === 'md') {
							string += '[' + escapeMd(textArray[i]) + '](' + escapeUrl(nextUrl[0], true) + ')'
							if(i>=(textArray.length-1)) {
								string += '\n\n'
							}
						}
						else {
							if(forceNewLine) {
								string += '<p>'
							}
							string += '<a href="' + escapeUrl(nextUrl[0]) + '">' + escapeHtml(textArray[i]) + '</a>'
							if(i>=(textArray.length-1)) {
								string += '</p>\n'
							}
						}
						nextUrl = []
					}
					else {
						if(type === 'md') {
							string += '**' + escapeMd(textArray[i]) + '**'
							for(let j=0; j<nextUrl.length; j++) {
								string += '[[' + (j+1) + ']](' + escapeUrl(nextUrl[j], true) + ')'
							}
							if(i>=(textArray.length-1)) {
								string += '\n\n'
							}
						}
						else {
							if(forceNewLine) {
								string += '<p>'
							}
							string += '<b>' + escapeHtml(textArray[i]) + '</b>'
							for(let j=0; j<nextUrl.length; j++) {
								string += '<a href="' + escapeUrl(nextUrl[j]) + '">[' + (j+1) + ']</a>'
							}
							if(i>=(textArray.length-1)) {
								string += '</p>\n'
							}
						}
						nextUrl = []
					}
					prevWasUrl = true
					forceNewLine = false
				}
				else if(/^#{1,6} /.test(textArray[i])) {
					if(prevWasUrl) {
						throw Error('Unimplemented')
					}
					let hLevel = 0
					for(let j=0; j<textArray[i].length; j++) {
						if(textArray[i][j] !== '#') {
							break;
						}
						hLevel += 1
					}
					if(type === 'md') {
						string += '#'.repeat(hLevel) + ' ' + escapeMd(textArray[i].slice(hLevel+1)) + '\n\n'
					}
					else {
						string += '<h' + hLevel + '>' + escapeHtml(textArray[i].slice(hLevel+1)) + '</h' + hLevel + '>\n'
					}
					forceNewLine = true
				}
				else {
					if(type === 'md') {
						if(prevWasUrl && textArray[i][0] === ' ') {
							string += ' '
						}
						string += escapeMd(textArray[i])
						if(!nextIsUrl) {
							string += '\n\n'
						}
						else if(textArray[i][textArray[i].length-1] === ' ') {
							string += ' '
						}
					}
					else {
						if(!prevWasUrl) {
							string += '<p>'
						}
						else if(textArray[i][0] === ' ') {
							string += ' '
						}
						string += escapeHtml(textArray[i])
						if(!nextIsUrl) {
							string += '</p>\n'
						}
						else if(textArray[i][textArray[i].length-1] === ' ') {
							string += ' '
						}
					}
					prevWasUrl = false
					forceNewLine = false
				}
			}
			return string
		}

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

		// Node dependencies
		const renderDependencies = (modulesPath, moduleName, modulePack, type) => {
			let string = ''
			if(modulePack === 'package.json') {
				const pkg = require(modulesPath + '/' + moduleName + '/' + packLocation)
				// Source
				let depSource = ''
				if(pkg.repository) {
					if(isString(pkg.repository)) {
						depSource = pkg.repository
					}
					else if(isString(pkg.repository.url)) {
						depSource = pkg.repository.url
					}
				}
				if(depSource.startsWith('git+')) {
					depSource = depSource.slice(4)
				}
				if(depSource.startsWith('git://')) {
					depSource = 'https://' + depSource.slice(6)
				}
				else if(depSource.startsWith('ssh://git@')) {
					depSource = 'https://' + depSource.slice(10)
				}
				if(depSource.endsWith('.git')) {
					depSource = depSource.slice(0,-4)
				}
				// Icon
				let depIcon = 'https://raw.githubusercontent.com/npm/logos/master/npm logo/classic/npm-2009.svg'
				if(depSource.startsWith('https://github.com/npm/')) {
					depIcon = 'https://raw.githubusercontent.com/npm/logos/master/npm square/n.svg'
				}
				// Author
				let depAuthor = ''
				if(!pkg.author) {
					if(depSource.startsWith('https://github.com/')) {
						depAuthor = depSource.slice(19)
						depAuthor = depAuthor.substring(0,depAuthor.indexOf('/'))
					}
				}
				else if(isString(pkg.author)) {
					depAuthor = pkg.author
				}
				else if(isString(pkg.author.name)) {
					depAuthor = pkg.author.name
				}
				const depHome = ''
				const depLocation = pkg.name
				const depLicense = ''
				const depDescription = ''
				const depVersion = pkg.name + '@' + pkg.version
				if(type === 'md') {
					string += '| [<img src="' + escapeUrl(depIcon, true) + '" width="31">](' + depHome + ')'
					string += ' | [' + depLocation + '](' + depHome + ')'
					string += ' | ' + depAuthor
					string += ' | ' + depLicense
					string += ' | [Open Source](' + depSource + ')'
					string += ' | &#x2714;&#xFE0F;'
					string += ' | ' + depDescription
					string += ' | `' + depVersion + '` |\n'
				}
				else {
					string += '<tr>\n'
					string += '<td align="center"><a href="' + depHome + '"><img src="' + escapeUrl(depIcon) + '" width="31"></a></td>\n'
					string += '<td><a href="' + depHome + '">' + depLocation + '</a></td>\n'
					string += '<td>' + depAuthor + '</td>\n'
					string += '<td>' + depLicense + '</td>\n'
					string += '<td><a href="' + depSource + '">Open Source</a></td>\n'
					string += '<td align="center">&#x2714;&#xFE0F;</td>\n'
					string += '<td>' + depDescription +'</td>\n'
					string += '<td align="center"><code>' + depVersion + '</code></td>\n'
					string += '</tr>\n'
				}
				if(pkg.dependencies && (type !== 'md' || depLocation !== 'npm')) {
					const depDependencies = Object.keys(pkg.dependencies)
					for(let i=0; i<depDependencies.length; i++) {
						if(depDependencies[i] === '') {
							continue
						}
						console.log(depDependencies[i])
					}
				}
				return string
			}
			else if(modulePack === 'package-lock.json' || modulePack === '.package-lock.json') {
				const depDependencies = Object.keys(require(modulesPath + '/' + packLocation).packages)
				for(let i=0; i<depDependencies.length; i++) {
					if(depDependencies[i] === '') {
						continue
					}
					string += renderDependencies(modulesPath, depDependencies[i].slice(13), 'package.json', type)
				}
				return string
			}
			else {
				throw Error('Unimplemented')
			}
		}
		if(t === 'md') {
			html += '## Node dependencies\n\n'
			html += '| Icon | Name | Author | License | Source&nbsp;Code | Distribution | Description | Version |\n'
			html += '| :---: | --- | --- | --- | --- | :---: | --- | :---: |\n'
			html += renderDependencies('../bin/windows/x64/node/node-v'+nodeVersion+'-win-x64/node_modules', 'corepack', 'package.json', t)
			html += renderDependencies('../bin/windows/x64/node/node-v'+nodeVersion+'-win-x64/node_modules', 'npm', 'package.json', t)
			html += renderDependencies('../node_modules', '', '.package-lock.json', t)
			html += '\n'
		}
		else {
			html += '<h2>Node dependencies</h2>\n'
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
			html += renderDependencies('../bin/windows/x64/node/node-v'+nodeVersion+'-win-x64/node_modules', 'corepack', 'package.json', t)
			html += renderDependencies('../bin/windows/x64/node/node-v'+nodeVersion+'-win-x64/node_modules', 'npm', 'package.json', t)
			html += renderDependencies('../node_modules', '', '.package-lock.json', t)
			html += '</table>\n'
		}
		// Footer
		html += textFromConfig([...downloadlist.config['readme-footer']], t)

		// Write
		return html
	}
	fs.writeFileSync('README.html', generateReadme('html'), 'utf-8')
	fs.writeFileSync('README.md', generateReadme('md'), 'utf-8')
}

module.exports = writeReadme
