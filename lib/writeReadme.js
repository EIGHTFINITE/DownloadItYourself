const nodeVersion = require('../package.json').engines.node
const isString = require('lodash.isstring')
const fs = require('../bin/windows/x64/node/node-v'+nodeVersion+'-win-x64/node_modules/npm/node_modules/graceful-fs')

const writeReadme = (downloadlist) => {
	const generateReadme = (t) => {
		const traverseDependencies = (d, p, c) => {
			// Require
			const parse = require('spdx-expression-parse')
			const allowedCharacters = /[^ -~\u00E1\u00E9\u00E5\u00F6\u00FC\u0103\u0144\u0219]/
			
			let a = []
			for (const key of Object.keys(d)) {
				// Name
				d[key].name = key
				
				// Path
				d[key].path = (isString(p) ? p + '/node_modules/' + key : 'node_modules/' + key)
				
				// Location
				if(c > 0) {
					d[key].location = d[key].path.slice(c+1).replaceAll('node_modules/','')
				}
				else {
					d[key].location = d[key].path.replaceAll('node_modules/','')
				}
				
				// Package
				const pkg = require('../' + d[key].path + '/package.json')
				
				// Type, Resolved
				if(d[key].resolved) {
					if(d[key].resolved.startsWith('https://registry.npmjs.org/') || d[key].resolved.startsWith('http://registry.npmjs.org/')) {
						d[key].type = 'npm'
					}
					else {
						d[key].type = 'github'
						if(d[key].resolved.startsWith('github:')) {
							d[key].resolved = d[key].resolved.slice(7)
						}
					}
				}
				else {
					if(d[key].from) {
						d[key].type = 'github'
						d[key].resolved = d[key].version
						if(d[key].resolved.startsWith('github:')) {
							d[key].resolved = d[key].resolved.slice(7)
						}
					}
					else {
						d[key].type = 'npm'
						d[key].resolved = ''
					}
				}
				
				// Resolved corrections
				if(d[key].type === 'github' && d[key].resolved.startsWith('EIGHTFINITE/top-user-agents#')) { // top-user-agents
					d[key].resolved = 'EIGHTFINITE/top-user-agents#main'
				}
				else if(d[key].type === 'github' && d[key].resolved.startsWith('EIGHTFINITE/top-user-agents-1#')) { // top-user-agents-1
					d[key].resolved = 'EIGHTFINITE/top-user-agents-1#main'
				}
				
				// Version
				d[key].version = pkg.name + '@' + pkg.version
				
				// Version corrections
				if(d[key].type === 'github' && d[key].resolved.startsWith('EIGHTFINITE/top-user-agents#')) { // top-user-agents
					d[key].version = 'top-user-agents@' + pkg.version.substring(0, pkg.version.lastIndexOf('.')) + '.x'
				}
				
				// License
				if(!pkg.license) {
					if(pkg.licenses) {
						if(pkg.licenses.length !== 1) {
							throw Error('Unimplemented')
						}
						d[key].license = pkg.licenses[0].type
					}
					else {
						d[key].license = 'All Rights Reserved'
					}
				}
				else if(isString(pkg.license)) {
					d[key].license = pkg.license
				}
				else {
					d[key].license = pkg.license.type
				}

				// License corrections
				if(d[key].license === 'Apache 2.0') {
					d[key].license = 'Apache-2.0'
				}
				if(pkg.name === 'bin-links' && d[key].license === 'Artistic-2.0') { // bin-links
					d[key].license = 'ISC'
				}
				else if(pkg.name === 'cyclist' && d[key].license === 'All Rights Reserved') { // cyclist
					d[key].license = 'MIT'
				}
				else if(pkg.name === 'electron-chrome-extensions' && d[key].license === 'SEE LICENSE IN LICENSE.md') { // electron-chrome-extensions
					d[key].license = 'GPL-3.0'
				}
				else if(pkg.name === 'gentle-fs' && d[key].license === 'Artistic-2.0') { // gentle-fs
					d[key].license = 'npm license'
				}
				else if(pkg.name === 'npm' && d[key].license === 'Artistic-2.0') { // npm
					d[key].license = 'npm license'
				}
				else if(pkg.name === 'npm-lifecycle' && d[key].license === 'Artistic-2.0') { // npm-lifecycle
					d[key].license = 'npm license'
				}

				// License HTML
				const parseLicenseHtml = (x) => {
					let lHtml = ''
					if(x.license) {
						lHtml += '<a href="docs/legal/' + escapeUrl(x.license,true) + '.txt">' + htmlspecialchars(x.license) + '</a>'
					}
					else {
						lHtml += parseLicenseHtml(x.left)
						lHtml += ' ' + htmlspecialchars(x.conjunction) + ' '
						lHtml += parseLicenseHtml(x.right)
					}
					return lHtml
				}
				const parseLicenseMd = (x) => {
					let lMd = ''
					if(x.license) {
						lMd += '[' + escapeMd(x.license,true) + '](docs/legal/' + escapeUrl(x.license,true,true) + '.txt)'
					}
					else {
						lMd += parseLicenseMd(x.left)
						lMd += ' ' + escapeMd(x.conjunction,true) + ' '
						lMd += parseLicenseMd(x.right)
					}
					return lMd
				}
				d[key].licenseHtml = parseLicenseHtml(parse(d[key].license, true, true))
				d[key].licenseMd = parseLicenseMd(parse(d[key].license, true, true))
				
				// Source Code
				if(d[key].type === 'github') {
					const uri = new URL('https://github.com/' + d[key].resolved)
					uri.hash = ''
					d[key].source = uri.toString()
				}
				else {
					if(!pkg.repository) {
						d[key].source = ''
					}
					else if(isString(pkg.repository)) {
						d[key].source = pkg.repository
					}
					else {
						d[key].source = pkg.repository.url
					}
					if(d[key].source.startsWith('git+')) {
						d[key].source = d[key].source.slice(4)
					}
					if(d[key].source.startsWith('git://')) {
						d[key].source = 'https://' + d[key].source.slice(6)
					}
					else if(d[key].source.startsWith('ssh://git@')) {
						d[key].source = 'https://' + d[key].source.slice(10)
					}
					if(d[key].source.endsWith('.git')) {
						d[key].source = d[key].source.slice(0,-4)
					}
				}
				
				// Author
				if(!pkg.author) {
					if(d[key].source.startsWith('https://github.com/')) {
						d[key].author = d[key].source.slice(19)
						d[key].author = d[key].author.substring(0,d[key].author.indexOf('/'))
					}
					else {
						d[key].author = ''
					}
				}
				else if(isString(pkg.author)) {
					d[key].author = pkg.author
				}
				else if(isString(pkg.author.name)) {
					d[key].author = pkg.author.name
				}
				else {
					throw Error('Unimplemented')
				}
				
				// Check for invalid characters
				if(allowedCharacters.test(d[key].author)) {
					throw Error('Invalid characters in author name of ' + d[key].name)
				}
				
				// Author corrections
				if(d[key].author === 'bdehamer@github.com') {
					d[key].author = 'Brian DeHamer'
				}
				else if(d[key].name === 'corepack' && d[key].author === 'nodejs') {
					d[key].author = 'Corepack contributors'
				}
				else if(d[key].name === 'npm' && d[key].author === 'Isaac Z. Schlueter') {
					d[key].author = 'GitHub Inc.'
				}
				else if(pkg.name === 'postman-request' && d[key].author === 'EIGHTFINITE') {
					d[key].author = 'Mikeal Rogers'
				}
				else if(pkg.name === 'top-user-agents' && d[key].author === 'microlink.io') {
					d[key].author = 'Kiko Beats'
				}
				
				// Source Code corrections
				if(d[key].source === 'https://github.com/isaacs/abbrev-js') { // abbrev
					d[key].source = 'https://github.com/npm/abbrev-js'
				}
				else if(d[key].source === 'https://github.com/substack/node-archy') { // archy
					d[key].source = 'https://www.npmjs.com/package/archy?activeTab=code'
				}
				else if(d[key].source === 'https://github.com/mikeal/aws-sign') { // aws-sign2
					d[key].source = 'https://github.com/request/aws-sign'
				}
				else if(d[key].source === 'https://github.com/joyent/node-bcrypt-pbkdf') { // bcrypt-pbkdf
					d[key].source = 'https://github.com/TritonDataCenter/node-bcrypt-pbkdf'
				}
				else if(d[key].source === 'https://github.com/devongovett/brotli.js') { // brotli
					d[key].source = 'https://github.com/foliojs/brotli.js'
				}
				else if(d[key].source === 'https://github.com/mikeal/caseless') { // caseless
					d[key].source = 'https://github.com/request/caseless'
				}
				else if(d[key].source === 'https://github.com/pvorb/node-clone') { // clone
					d[key].source = 'https://github.com/pvorb/clone'
				}
				else if(d[key].source === 'https://github.com/substack/node-concat-map') { // concat-map
					d[key].source = 'https://github.com/ljharb/concat-map'
				}
				else if(d[key].source === 'https://github.com/visionmedia/node-delegates') { // delegates
					d[key].source = 'https://github.com/tj/node-delegates'
				}
				else if(d[key].source === 'https://github.com/quartzjer/ecc-jsbn') { // ecc-jsbn
					d[key].source = 'https://github.com/aduh95/ecc-jsbn'
				}
				else if(d[key].source === 'https://github.com/substack/node-editor') { // editor
					d[key].source = 'https://www.npmjs.com/package/editor?activeTab=code'
				}
				else if(pkg.name === 'electron-chrome-extensions' && d[key].source === 'https://github.com/samuelmaddock/electron-browser-shell') { // electron-chrome-extensions
					d[key].source = 'https://github.com/samuelmaddock/electron-browser-shell/tree/master/packages/electron-chrome-extensions'
				}
				else if(d[key].source === 'https://github.com/Gozala/events') { // events
					d[key].source = 'https://github.com/browserify/events'
				}
				else if(d[key].source === 'https://github.com/coveo/exponential-backoff') { // exponential-backoff
					d[key].source = 'https://github.com/coveooss/exponential-backoff'
				}
				else if(d[key].source === 'https://github.com/davepacheco/node-extsprintf') { // extsprintf
					d[key].source = 'https://github.com/TritonDataCenter/node-extsprintf'
				}
				else if(d[key].source === 'https://github.com/joyent/node-jsprim') { // jsprim
					d[key].source = 'https://github.com/TritonDataCenter/node-jsprim'
				}
				else if(d[key].source === 'https://github.com/substack/minimist') { // minimist
					d[key].source = 'https://github.com/minimistjs/minimist'
				}
				else if(d[key].source === 'https://github.com/npm/minipass-json-stream') { // minipass-json-stream
					d[key].source = 'https://www.npmjs.com/package/minipass-json-stream?activeTab=code'
				}
				else if(d[key].source === 'https://github.com/substack/node-mkdirp') { // mkdirp
					d[key].source = 'https://github.com/isaacs/node-mkdirp'
				}
				else if(d[key].source === 'https://github.com/mikeal/oauth-sign') { // oauth-sign
					d[key].source = 'https://github.com/request/oauth-sign'
				}
				else if(d[key].source === 'https://github.com/isaacs/path-walker') { // path-scurry
					d[key].source = 'https://github.com/isaacs/path-scurry'
				}
				else if(d[key].source === 'https://github.com/joyent/node-sshpk') { // sshpk
					d[key].source = 'https://github.com/TritonDataCenter/node-sshpk'
				}
				else if(d[key].source === 'https://github.com/substack/text-table') { // text-table
					d[key].source = 'https://www.npmjs.com/package/text-table?activeTab=code'
				}
				else if(d[key].source === 'https://github.com/wildlyinaccurate/relative-date') { // tiny-relative-date
					d[key].source = 'https://github.com/wildlyinaccurate/tiny-relative-date'
				}
				else if(d[key].source === 'https://github.com/substack/typedarray') { // typedarray
					d[key].source = 'https://github.com/es-shims/typedarray'
				}
				else if(d[key].source === 'https://github.com/isaacs/node-which') { // which
					d[key].source = 'https://github.com/npm/node-which'
				}
				else if(d[key].source === 'https://github.com/npm/wrappy') { // wrappy
					d[key].source = 'https://github.com/isaacs/wrappy'
				}
				
				// Home
				if(d[key].type === 'github') {
					d[key].homepage = d[key].source
				}
				else {
					d[key].homepage = 'https://www.npmjs.com/package/' + pkg.name
				}
				
				// Icon
				if(d[key].type === 'github') {
					d[key].icon = 'https://avatars.githubusercontent.com/u/9919'
				}
				else if(d[key].source.startsWith('https://github.com/npm/')) {
					d[key].icon = 'https://raw.githubusercontent.com/npm/logos/master/npm square/n.svg'
				}
				else {
					d[key].icon = 'https://raw.githubusercontent.com/npm/logos/master/npm logo/classic/npm-2009.svg'
				}
				
				// Description
				if(isString(pkg.description)) {
					d[key].description = pkg.description
					
					// RIGHT SINGLE QUOTATION MARK
					d[key].description = d[key].description.replaceAll('\u2019', "'")
					// LEFT DOUBLE QUOTATION MARK
					d[key].description = d[key].description.replaceAll('\u201C', '"')
					// RIGHT DOUBLE QUOTATION MARK
					d[key].description = d[key].description.replaceAll('\u201D', '"')
					// RIGHTWARDS ARROW
					d[key].description = d[key].description.replaceAll('\u2192', '->')
					
					// Check for invalid characters
					if(allowedCharacters.test(d[key].description)) {
						throw Error('Invalid characters in description of ' + d[key].name)
					}
					
					// Readability & consistency
					d[key].description = d[key].description.replace(/\s+/g,' ').replace(/\!\[[ -~]*?\]\([ -~]+?\)/g,'').replace(/\[([ -~]*?)\]\([ -~]+?\)/g,'$1').trim().replace(/[Nn]ode\.js|[Nn]ode(?!s)/g,'Node').replace(/javascript/ig,'JavaScript').replace(/([^!.?]$)/,'$1.')
					if(d[key].description !== '') {
						d[key].description = d[key].description[0].toUpperCase() + d[key].description.slice(1)
						d[key].description = d[key].description.replace(/^Npm/,'npm')
						d[key].description = d[key].description.replace(/^Htmlparser2/,'htmlparser2')
					}
					if(d[key].description === '.') {
						d[key].description = ''
					}
				}
				else {
					d[key].description = ''
				}

				// Description corrections
				if(pkg.name === 'corepack' && d[key].description === '') { // corepack
					d[key].description = 'Zero-runtime-dependency package acting as bridge between Node projects and their package managers.'
				}

				// Required by
				d[key].requiredBy = ''
				if(pkg._requiredBy) {
					for (let i=0; i<pkg._requiredBy.length; i++) {
						if(pkg._requiredBy[i] === '/' || pkg._requiredBy[i] === '#USER') {
							pkg._requiredBy.splice(i, 1)
							i--
							continue
						}
						if(i === 0) {
							d[key].requiredBy += 'Required by '
						}
						else {
							d[key].requiredBy += ', '
						}
						d[key].requiredBy += pkg._requiredBy[i].slice(1)
						if(i === pkg._requiredBy.length-1) {
							d[key].requiredBy += '.'
						}
					}
				}
				
				// Add to array
				a.push(d[key])
				
				// Resolve children
				if(d[key].dependencies) {
					const b = traverseDependencies(d[key].dependencies, d[key].path, c)
					for (let i=0; i<b.length; i++) {
						a.push(b[i])
					}
				}
			}
			return a
		}

		const htmlspecialchars = (s,noTrim) => {
			if(noTrim) {
				s = s.replace(/\s/g,' ')
			}
			else {
				s = s.replace(/\s+/g,' ').trim()
			}
			return s.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll("'", '&#039;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
		}

		// Escape Markdown
		//
		// Note that results cannot safely be concatenated together. Concatenate first then escape the entire string or set the aggressive option.
		//
		// Additionally, results cannot be safely inserted into emphasized text ('*', '_', '~', and '`') without setting the aggressive option.
		//
		// On top of that, '`' cannot be easily escaped inside code blocks.
		// Ensure code blocks are opened with '<code>' and closed with '</code>' instead of using '`' if the input can contain '`'.
		const escapeMd = (s,inHtml,aggressive,noTrim) => {
			if(noTrim) {
				s = s.replace(/\s/g,' ')
			}
			else {
				s = s.replace(/\s+/g,' ').trim()
			}
			s = s.replace(/^(\s*)([0-9]+)\./,'$1$2\\.').replace(/^(\s*)([-+#>])/,'$1\\$2')
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
				s = htmlspecialchars(s)
			}
			return s
		}

		// https://developer.mozilla.org/en-US/docs/Glossary/Percent-encoding
		const escapeUrl = (s,inHtml,escapeSpace,noTrim) => {
			if(noTrim) {
				s = s.replace(/\s/g,' ')
			}
			else {
				s = s.replace(/\s+/g,' ').trim()
			}
			s = s.replaceAll('%', '%25').replaceAll('[', '%5B').replaceAll(']', '%5D').replaceAll('!', '%21').replaceAll('$', '%24').replaceAll("'", '%27').replaceAll('(', '%28').replaceAll(')', '%29').replaceAll('*', '%2A').replaceAll('+', '%2B').replaceAll(',', '%2C').replaceAll(';', '%3B')
			if(!s.startsWith('https://') && !s.startsWith('http://')) {
				s = s.replaceAll(':', '%3A').replaceAll('@', '%40')
			}
			if(escapeSpace) {
				s = s.replaceAll(' ', '%20')
			}
			if(inHtml) {
				s = htmlspecialchars(s)
			}
			return s
		}

		// Header
		const optimizedArrayToText = (oa,heading) => {
			let s = ''
			for (let i=0, k=false, n=false, l=[]; i<oa.length; i++) {
				if(oa[i].length === 0) {
					throw Error('Unimplemented')
				}
				if(Array.isArray(oa[i])) {
					if(l.length > 0) {
						throw Error('Unimplemented')
					}
					l=oa[i]
					oa.splice(i--, 1)
					if(oa.length === 0) {
						throw Error('Unimplemented')
					}
				}
				else if(oa[i].replace(/\s+/g,' ').trim() === '') {
					throw Error('Unimplemented')
				}
				else if(oa[i] === '<br>') {
					if(i === 0 || l.length > 0) {
						throw Error('Unimplemented')
					}
					oa.splice(i--, 1)
					if(oa.length === 0) {
						continue // Nothing left to write
					}
					else if(t === 'md') {
						s += '\n\n'
					}
					else if(k) {
						s += '</p>\n<p>'
					}
					else {
						s += '</' + heading + '>\n<p>'
						k = true
					}
				}
				else {
					if(i === 0) {
						if(t === 'md') {
							if(heading === 'h1') {
								s += '# '
							}
							else if(heading === 'h2') {
								s += '## '
							}
							else if(heading === 'h3') {
								s += '### '
							}
							else if(heading === 'h4') {
								s += '#### '
							}
							else if(heading === 'h5') {
								s += '##### '
							}
							else if(heading === 'h6') {
								s += '###### '
							}
						}
						else {
							s += '<' + heading + '>'
						}
					}
					if(l.length === 1) {
						if(i+1 === oa.length) {
							if(t === 'md') {
								s += '[' + escapeMd(oa[i],true) + '](' + escapeUrl(l[0],true) + ')\n\n'
							}
							else if(k) {
								s += '<a href="' + escapeUrl(l[0],true) + '">' + htmlspecialchars(oa[i]) + '</a></p>\n'
							}
							else {
								s += '<a href="' + escapeUrl(l[0],true) + '">' + htmlspecialchars(oa[i]) + '</a></' + heading + '>\n'
							}
						}
						else {
							if(t === 'md') {
								s += '[' + escapeMd(oa[i],true) + '](' + escapeUrl(l[0],true) + ')'
							}
							else {
								s += '<a href="' + escapeUrl(l[0],true) + '">' + htmlspecialchars(oa[i]) + '</a>'
							}
						}
						l = []
					}
					else if(l.length > 1) {
						if(i+1 === oa.length) {
							if(t === 'md') {
								s += '**' + escapeMd(oa[i],true) + '**\n\n'
							}
							else if(k) {
								s += '<b>' + htmlspecialchars(oa[i]) + '</b></p>\n'
							}
							else {
								s += '<b>' + htmlspecialchars(oa[i]) + '</b></' + heading + '>\n'
							}
						}
						else {
							if(t === 'md') {
								s += '**' + escapeMd(oa[i],true) + '**'
							}
							else {
								s += '<b>' + htmlspecialchars(oa[i]) + '</b>'
							}
						}
						for (let j=0; j<l.length; j++) {
							if(t === 'md') {
								s += '[[' + (j+1) + ']](' + escapeUrl(l[j],true) + ')'
							}
							else {
								s += '<a href="' + escapeUrl(l[j],true) + '">[' + (j+1) + ']</a>'
							}
						}
						l = []
					}
					else {
						if(n) {
							throw Error('Unimplemented')
						}
						const dummyString = oa[i].replace(/\s+/g,' ')
						if(dummyString[0] === ' ') {
							s += ' '
						}
						if(i+1 === oa.length) {
							if(t === 'md') {
								s += escapeMd(oa[i],true) + '\n\n'
							}
							else if(k) {
								s += htmlspecialchars(oa[i]) + '</p>\n'
							}
							else {
								s += htmlspecialchars(oa[i]) + '</' + heading + '>\n'
							}
						}
						else {
							if(t === 'md') {
								s += escapeMd(oa[i],true)
							}
							else {
								s += htmlspecialchars(oa[i])
							}
							if(dummyString.slice(-1) === ' ') {
								s += ' '
							}
						}
						n = true
						continue
					}
				}
				n = false
			}
			return s
		}
		let html = ''
		html += optimizedArrayToText([...downloadlist.config['readme-header']],'h1')

		// Binaries
		const readableVersion = (version) => {
			return version.slice(0, -2) + '.' + version.slice(-2)
		}
		const p7zipVersion = readableVersion(require('../downloadlist.json').config['p7zip-version'])
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
			html += ' | Node contributors, Joyent Inc., others'
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
			html += '<td>Node contributors, Joyent Inc., others</td>\n'
			html += '<td><a href="docs/legal/Node%20license.txt">Node license</a></td>\n'
			html += '<td><a href="https://github.com/nodejs/node">Open Source</a></td>\n'
			html += '<td align="center">&#x2714;&#xFE0F;</td>\n'
			html += '<td>Node is an open-source, cross-platform JavaScript runtime environment.</td>\n'
			html += '<td align="center">' + nodeVersion + '</td>\n'
			html += '</tr>\n'
			html += '</table>\n'
		}

		// Browser extensions
		const ublockOriginVersion = require('../extensions/uBlock0.chromium/manifest.json').version
		if(t === 'md') {
			html += '## Browser extensions\n\n'
			html += '| Icon | Name | Author | License | Source&nbsp;Code | Distribution | Description | Version |\n'
			html += '| :---: | --- | --- | --- | --- | :---: | --- | :---: |\n'
			html += '| [<img src="https://raw.githubusercontent.com/gorhill/uBlock/master/src/img/ublock.svg" width="31">](https://github.com/gorhill/uBlock)'
			html += ' | [uBlock Origin](https://github.com/gorhill/uBlock)'
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
			html += '<td align="center"><a href="https://github.com/gorhill/uBlock"><img src="https://raw.githubusercontent.com/gorhill/uBlock/master/src/img/ublock.svg" width="31"></a></td>\n'
			html += '<td><a href="https://github.com/gorhill/uBlock">uBlock Origin</a></td>\n'
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
		const nodePackageLockWindowsPath = 'bin/windows/x64/node/node-v'+nodeVersion+'-win-x64';
		const nodePackageLockLinuxPath = 'bin/linux/x64/node/node-v'+nodeVersion+'-linux-x64/lib';
		const dependencies = [
			...traverseDependencies(require('../'+nodePackageLockWindowsPath+'/package-lock.json').dependencies, nodePackageLockWindowsPath, nodePackageLockWindowsPath.length),
			...traverseDependencies(require('../'+nodePackageLockLinuxPath+'/package-lock.json').dependencies, nodePackageLockLinuxPath, nodePackageLockLinuxPath.length),
			...traverseDependencies(require('../package-lock.json').dependencies, null, 0)
		]
		// Start writing dependencies
		if(t === 'md') {
			html += '## Node dependencies\n\n'
			html += '| Icon | Name | Author | License | Source&nbsp;Code | Distribution | Description | Version |\n'
			html += '| :---: | --- | --- | --- | --- | :---: | --- | :---: |\n'
			let seenCorepack = false
			let seenNpm = 0
			for (let i=0; i<dependencies.length; i++) {
				const d = dependencies[i]
				// Only write the first corepack
				if(d.location === 'corepack') {
					if(seenCorepack) {
						continue
					}
					else {
						seenCorepack = true
					}
				}
				// The second npm is listed as npm-6 in devDependencies
				if(seenNpm > 1) {
					if(d.location.startsWith('npm/')) {
						d.location = d.location.replace('npm/', 'npm-6/')
					}
				}
				if(d.location === 'npm') {
					if(seenNpm > 0) {
						d.location = 'npm-6'
					}
					seenNpm++
				}
				// Skip dependencies that we know are fine to distribute thanks to npm
				if(d.location.startsWith('npm/') || d.location.startsWith('npm-6/')) {
					continue
				}
				const escLocation = escapeMd(d.location,true)
				const escIcon = escapeUrl(d.icon,true,true)
				const escHomepage = escapeUrl(d.homepage,true)
				const escAuthor = escapeMd(d.author,true)
				const escSource = escapeUrl(d.source,true)
				const escDescription = escapeMd(d.description,true)
				const escRequiredBy = escapeMd(d.requiredBy,true)
				const escResolved = escapeMd(d.resolved,true)
				const escVersion = escapeMd(d.version,true)
				html += '| [<img src="' + escIcon + '" width="31">](' + escHomepage + ')'
				html += ' | [' + escLocation + '](' + escHomepage + ')'
				html += ' | ' + escAuthor
				html += ' | ' + d.licenseMd
				html += ' | [Open Source](' + escSource + ')'
				html += ' | &#x2714;&#xFE0F;'
				html += ' | ' + (escDescription !== '' ? (escRequiredBy !== '' ? escDescription + '<br>' + escRequiredBy : escDescription) : escRequiredBy)
				html += ' | ' + (d.type === 'github' ? '`' + escResolved + '`<br>(based on `' + escVersion + '`)' : '`' + escVersion + '`') + ' |\n'
			}
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
			let seenCorepack = false
			let seenNpm = 0
			for (let i=0; i<dependencies.length; i++) {
				const d = dependencies[i]
				// Only write the first corepack
				if(d.location === 'corepack') {
					if(seenCorepack) {
						continue
					}
					else {
						seenCorepack = true
					}
				}
				// The second npm is listed as npm-6 in devDependencies
				if(seenNpm > 1) {
					if(d.location.startsWith('npm/')) {
						d.location = d.location.replace('npm/', 'npm-6/')
					}
				}
				if(d.location === 'npm') {
					if(seenNpm > 0) {
						d.location = 'npm-6'
					}
					seenNpm++
				}
				const escLocation = htmlspecialchars(d.location)
				const escIcon = escapeUrl(d.icon,true,true)
				const escHomepage = escapeUrl(d.homepage,true)
				const escAuthor = htmlspecialchars(d.author)
				const escSource = escapeUrl(d.source,true)
				const escDescription = htmlspecialchars(d.description)
				const escRequiredBy = htmlspecialchars(d.requiredBy)
				const escResolved = htmlspecialchars(d.resolved)
				const escVersion = htmlspecialchars(d.version)
				html += '<tr>\n'
				html += '<td align="center"><a href="' + escHomepage + '"><img src="' + escIcon + '" width="31"></a></td>\n'
				html += '<td><a href="' + escHomepage + '">' + escLocation + '</a></td>\n'
				html += '<td>' + escAuthor + '</td>\n'
				html += '<td>' + d.licenseHtml + '</td>\n'
				html += '<td><a href="' + escSource + '">Open Source</a></td>\n'
				html += '<td align="center">&#x2714;&#xFE0F;</td>\n'
				html += '<td>' + (escDescription !== '' ? (escRequiredBy !== '' ? escDescription + '<br>' + escRequiredBy : escDescription) : escRequiredBy) +'</td>\n'
				html += '<td align="center">' + (d.type === 'github' ? '<code>' + escResolved + '</code><br>(based on <code>' + escVersion + '</code>)' : '<code>' + escVersion + '</code>') + '</td>\n'
				html += '</tr>\n'
			}
			html += '</table>\n'
		}
		
		// Footer
		html += optimizedArrayToText([...downloadlist.config['readme-footer']],'h2')
		
		// Write
		return html
	}
	fs.writeFileSync('README.html', generateReadme('html'), 'utf-8')
	fs.writeFileSync('README.md', generateReadme('md'), 'utf-8')
}

module.exports = writeReadme
