#!/usr/bin/env node
'use strict';

(function(){

// Require
try {
  var isArray = require('lodash.isarray')
} catch (e) {
  isArray = Array.isArray
}
const nodeVersion = require('./package.json').engines.node
const electronVersion = require('./package.json').devDependencies.electron
const fs = require('./bin/windows/x64/node/node-v'+nodeVersion+'-win-x64/node_modules/npm/node_modules/graceful-fs')

// Function
function writeReadme() {
	function generateReadme(t) {
		function traverseDependencies(d,p) {
			// Require
			const isString = require('./node_modules/lodash.isstring')
			const parse = require('spdx-expression-parse')
			const allowedCharacters = /[^ -~\u00E1\u00E9\u00E5\u00F6\u00FC\u0103\u0144\u0219]/
			
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
				
				// Type, Resolved
				if(d[k].resolved) {
					if(d[k].resolved.startsWith('https://registry.npmjs.org/') || d[k].resolved.startsWith('http://registry.npmjs.org/')) {
						d[k].type = 'npm'
					}
					else {
						d[k].type = 'github'
						if(d[k].resolved.startsWith('github:')) {
							d[k].resolved = d[k].resolved.slice(7)
						}
					}
				}
				else {
					if(d[k].from) {
						d[k].type = 'github'
						d[k].resolved = d[k].version
						if(d[k].resolved.startsWith('github:')) {
							d[k].resolved = d[k].resolved.slice(7)
						}
					}
					else {
						d[k].type = 'npm'
						d[k].resolved = ''
					}
				}
				
				// Resolved corrections
				if(d[k].type === 'github' && d[k].resolved.startsWith('EIGHTFINITE/top-user-agents#')) { // top-user-agents
					d[k].resolved = 'EIGHTFINITE/top-user-agents#main'
				}
				else if(d[k].type === 'github' && d[k].resolved.startsWith('EIGHTFINITE/top-user-agents-1#')) { // top-user-agents-1
					d[k].resolved = 'EIGHTFINITE/top-user-agents-1#main'
				}
				
				// Version
				d[k].version = pkg.name + '@' + pkg.version
				
				// License
				if(!pkg.license) {
					if(pkg.licenses) {
						if(pkg.licenses.length !== 1) {
							throw Error('Unimplemented')
						}
						d[k].license = pkg.licenses[0].type
					}
					else {
						d[k].license = 'All Rights Reserved'
					}
				}
				else if(isString(pkg.license)) {
					d[k].license = pkg.license
				}
				else {
					d[k].license = pkg.license.type
				}
				if(d[k].license === 'Apache 2.0') {
					d[k].license = 'Apache-2.0'
				}
				else if(d[k].license === 'FreeBSD') {
					d[k].license = 'BSD-2-Clause-Views'
				}

				// License corrections
				if(pkg.name === 'npm') { // npm
					d[k].license = 'npm license'
				}
				else if(pkg.name === 'electron-chrome-extensions') { // electron-chrome-extensions
					d[k].license = 'GPL-3.0'
				}
				else if(d[k].version === 'bin-links@1.1.8') { // bin-links
					d[k].license = 'ISC'
				}
				else if(d[k].version === 'cyclist@0.2.2') { // cyclist
					d[k].license = 'MIT'
				}
				else if(d[k].version === 'gentle-fs@2.3.1') { // gentle-fs
					d[k].license = 'npm license'
				}
				else if(d[k].version === 'npm-lifecycle@3.1.5') { // npm-lifecycle
					d[k].license = 'npm license'
				}

				// License HTML
				function parseLicenseHtml(x) {
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
				function parseLicenseMd(x) {
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
				d[k].licenseHtml = parseLicenseHtml(parse(d[k].license, true, true))
				d[k].licenseMd = parseLicenseMd(parse(d[k].license, true, true))
				
				// Source Code
				if(d[k].type === 'github') {
					const uri = new URL('https://github.com/' + d[k].resolved)
					uri.hash = ''
					d[k].source = uri.toString()
				}
				else {
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
				}
				
				// Author
				if(!pkg.author) {
					if(d[k].source.startsWith('https://github.com/')) {
						d[k].author = d[k].source.slice(19)
						d[k].author = d[k].author.substring(0,d[k].author.indexOf('/'))
					}
					else {
						d[k].author = ''
					}
				}
				else if(isString(pkg.author)) {
					d[k].author = pkg.author
				}
				else if(isString(pkg.author.name)) {
					d[k].author = pkg.author.name
				}
				else {
					throw Error('Unimplemented')
				}
				
				// Check for invalid characters
				if(allowedCharacters.test(d[k].author)) {
					console.log(d[k].description)
					throw Error('Invalid characters in author name of ' + d[k].name)
				}
				
				// Author corrections
				if(d[k].name === 'npm-6') {
					d[k].author = 'GitHub Inc.'
				}
				else if(pkg.name === 'postman-request') {
					d[k].author = 'Mikeal Rogers'
				}
				
				// Source Code corrections
				if(d[k].source === 'https://github.com/isaacs/abbrev-js') { // abbrev
					d[k].source = 'https://github.com/npm/abbrev-js'
				}
				else if(d[k].source === 'https://github.com/substack/node-archy') { // archy
					d[k].source = 'https://www.npmjs.com/package/archy?activeTab=code'
				}
				else if(d[k].source === 'https://github.com/mikeal/aws-sign') { // aws-sign2
					d[k].source = 'https://github.com/request/aws-sign'
				}
				else if(d[k].source === 'https://github.com/joyent/node-bcrypt-pbkdf') { // bcrypt-pbkdf
					d[k].source = 'https://github.com/TritonDataCenter/node-bcrypt-pbkdf'
				}
				else if(d[k].source === 'https://github.com/devongovett/brotli.js') { // brotli
					d[k].source = 'https://github.com/foliojs/brotli.js'
				}
				else if(d[k].source === 'https://github.com/mikeal/caseless') { // caseless
					d[k].source = 'https://github.com/request/caseless'
				}
				else if(d[k].source === 'https://github.com/pvorb/node-clone') { // clone
					d[k].source = 'https://github.com/pvorb/clone'
				}
				else if(d[k].source === 'https://github.com/substack/node-concat-map') { // concat-map
					d[k].source = 'https://github.com/ljharb/concat-map'
				}
				else if(d[k].source === 'https://github.com/visionmedia/node-delegates') { // delegates
					d[k].source = 'https://github.com/tj/node-delegates'
				}
				else if(d[k].source === 'https://github.com/quartzjer/ecc-jsbn') { // ecc-jsbn
					d[k].source = 'https://github.com/aduh95/ecc-jsbn'
				}
				else if(d[k].source === 'https://github.com/substack/node-editor') { // editor
					d[k].source = 'https://www.npmjs.com/package/editor?activeTab=code'
				}
				else if(pkg.name === 'electron-chrome-extensions') { // electron-chrome-extensions
					d[k].source = 'https://github.com/samuelmaddock/electron-browser-shell/tree/master/packages/electron-chrome-extensions'
				}
				else if(d[k].source === 'https://github.com/Gozala/events') { // events
					d[k].source = 'https://github.com/browserify/events'
				}
				else if(d[k].source === 'https://github.com/coveo/exponential-backoff') { // exponential-backoff
					d[k].source = 'https://github.com/coveooss/exponential-backoff'
				}
				else if(d[k].source === 'https://github.com/davepacheco/node-extsprintf') { // extsprintf
					d[k].source = 'https://github.com/TritonDataCenter/node-extsprintf'
				}
				else if(d[k].source === 'https://github.com/joyent/node-jsprim') { // jsprim
					d[k].source = 'https://github.com/TritonDataCenter/node-jsprim'
				}
				else if(d[k].source === 'https://github.com/substack/minimist') { // minimist
					d[k].source = 'https://github.com/minimistjs/minimist'
				}
				else if(d[k].source === 'https://github.com/npm/minipass-json-stream') { // minipass-json-stream
					d[k].source = 'https://www.npmjs.com/package/minipass-json-stream?activeTab=code'
				}
				else if(d[k].source === 'https://github.com/substack/node-mkdirp') { // mkdirp
					d[k].source = 'https://github.com/isaacs/node-mkdirp'
				}
				else if(d[k].source === 'https://github.com/mikeal/oauth-sign') { // oauth-sign
					d[k].source = 'https://github.com/request/oauth-sign'
				}
				else if(d[k].source === 'https://github.com/isaacs/path-walker') { // path-scurry
					d[k].source = 'https://github.com/isaacs/path-scurry'
				}
				else if(d[k].source === 'https://github.com/joyent/node-sshpk') { // sshpk
					d[k].source = 'https://github.com/TritonDataCenter/node-sshpk'
				}
				else if(d[k].source === 'https://github.com/substack/text-table') { // text-table
					d[k].source = 'https://www.npmjs.com/package/text-table?activeTab=code'
				}
				else if(d[k].source === 'https://github.com/wildlyinaccurate/relative-date') { // tiny-relative-date
					d[k].source = 'https://github.com/wildlyinaccurate/tiny-relative-date'
				}
				else if(d[k].source === 'https://github.com/substack/typedarray') { // typedarray
					d[k].source = 'https://github.com/es-shims/typedarray'
				}
				else if(d[k].source === 'https://github.com/isaacs/node-which') { // which
					d[k].source = 'https://github.com/npm/node-which'
				}
				else if(d[k].source === 'https://github.com/npm/wrappy') { // wrappy
					d[k].source = 'https://github.com/isaacs/wrappy'
				}
				
				// Home
				if(d[k].type === 'github') {
					d[k].homepage = d[k].source
				}
				else {
					d[k].homepage = 'https://www.npmjs.com/package/' + pkg.name
				}
				
				// Icon
				if(d[k].type === 'github') {
					d[k].icon = 'https://avatars.githubusercontent.com/u/9919'
				}
				else {
					d[k].icon = 'https://raw.githubusercontent.com/npm/logos/master/npm%20logo/classic/npm-2009.svg'
				}
				
				// Description
				if(isString(pkg.description)) {
					d[k].description = pkg.description
					
					// RIGHT SINGLE QUOTATION MARK
					d[k].description = d[k].description.replaceAll('\u2019', "'")
					// LEFT DOUBLE QUOTATION MARK
					d[k].description = d[k].description.replaceAll('\u201C', '"')
					// RIGHT DOUBLE QUOTATION MARK
					d[k].description = d[k].description.replaceAll('\u201D', '"')
					// RIGHTWARDS ARROW
					d[k].description = d[k].description.replaceAll('\u2192', '->')
					
					// Check for invalid characters
					if(allowedCharacters.test(d[k].description)) {
						console.log(d[k].description)
						throw Error('Invalid characters in description of ' + d[k].name)
					}
					
					// Readability & consistency
					d[k].description = d[k].description.replace(/\s+/g,' ').replace(/\!\[[ -~]*?\]\([ -~]+?\)/g,'').replace(/\[([ -~]*?)\]\([ -~]+?\)/g,'$1').trim().replace(/[Nn]ode\.js|[Nn]ode(?!s)/g,'Node').replace(/javascript/ig,'JavaScript').replace(/([^!.?]$)/,'$1.')
					if(d[k].description !== '') {
						d[k].description = d[k].description[0].toUpperCase() + d[k].description.slice(1)
						d[k].description = d[k].description.replace(/^Npm/,'npm')
						d[k].description = d[k].description.replace(/^Htmlparser2/,'htmlparser2')
					}
					if(d[k].description === '.') {
						d[k].description = ''
					}
				}
				else {
					d[k].description = ''
				}
				
				// Required by
				d[k].requiredBy = ''
				if(pkg._requiredBy) {
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

		function htmlspecialchars(s,noTrim) {
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
		function escapeMd(s,inHtml,aggressive,noTrim) {
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
		function escapeUrl(s,inHtml,escapeSpace,noTrim) {
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
		const downloadlist = require('./downloadlist.json')
		const readmeHeader = [...downloadlist.config['readme-header']]
		let html = ''
		html += optimizedArrayToText(readmeHeader,'h1')
		
		function optimizedArrayToText(oa,heading) {
			let s = ''
			for (let i=0, k=false, n=false, l=[]; i<oa.length; i++) {
				if(oa[i].length === 0) {
					throw Error('Unimplemented')
				}
				if(isArray(oa[i])) {
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
		
		// Node dependencies
		const dependencies = traverseDependencies(require('./package-lock.json').dependencies)
		if(t === 'md') {
			html += '\n## Node dependencies\n\n'
			html += '| Icon | Name | Author | License | Source&nbsp;Code | Distribution | Description | Version |\n'
			html += '| :---: | --- | --- | --- | --- | :---: | --- | :---: |\n'
			for (let i=0; i<dependencies.length; i++) {
				const d = dependencies[i]
				if(d.location.startsWith('npm/') || d.location.startsWith('npm-6/')) {
					continue
				}
				const escName = escapeMd(d.name,true)
				const escLocation = escapeMd(d.location,true)
				const escIcon = escapeMd(d.icon,true)
				const escHomepage = escapeUrl(d.homepage,true)
				const escAuthor = escapeMd(d.author,true)
				const escSource = escapeUrl(d.source,true)
				const escDescription = escapeMd(d.description,true)
				const escRequiredBy = escapeMd(d.requiredBy,true)
				const escResolved = escapeMd(d.resolved,true)
				const escVersion = escapeMd(d.version,true)
				html += '| [![](' + escIcon + ')](' + escHomepage + ')'
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
			for (let i=0; i<dependencies.length; i++) {
				const d = dependencies[i]
				const escName = htmlspecialchars(d.name)
				const escLocation = htmlspecialchars(d.location)
				const escIcon = htmlspecialchars(d.icon)
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
		const readmeFooter = [...downloadlist.config['readme-footer']]
		html += optimizedArrayToText(readmeFooter,'h2')
		
		// Write
		return html
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
	const stringify = require('./bin/windows/x64/node/node-v'+nodeVersion+'-win-x64/node_modules/npm/node_modules/json-stringify-nice')
	const userAgents = require('top-user-agents-1')
	const userAgentsAlt = require('top-user-agents')
	let electronUserAgent = userAgents[0]
	console.log('User Agent set to "' + electronUserAgent + '"')
	if(userAgents[1] == userAgentsAlt[0]) {
		electronUserAgent = userAgents[0]
		console.log('Found bleeding edge User Agent "' + electronUserAgent + '"')
		console.log('User Agent updated to "' + electronUserAgent + '"')
	}

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
		
		win.on('close', () => {
			writeReadme()
			app.exit()
		})
		
		win.close()
	})
}
else {
	// Validate executable
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
	const isWindows = /^win/.test(process.platform)
	const electronCliVersion = require('./node_modules/electron/package.json').version
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
	if(isWindows) {
		const rimraf = require('rimraf')
		const isexe = require('./bin/windows/x64/node/node-v'+nodeVersion+'-win-x64/node_modules/npm/node_modules/isexe')
		isexe('bin/windows/x64/electron/electron-v' + electronVersion + '-win32-x64/electron.exe', function (err, isExe) {
			if (!err && isExe) {
				startElectron()
			}
			else {
				console.log('Need to unpack Electron')
				const winElectronPath = 'bin\\windows\\x64\\electron\\electron-v' + electronVersion + '-win32-x64'
				const p7zip = spawn('bin\\windows\\x64\\7z\\7z2501-x64\\7z.exe', ['x', '-tsplit', winElectronPath + '\\electron.exe.001', '-o' + winElectronPath], { stdio: 'inherit' })
				p7zip.on('exit', () => {
					rimraf(winElectronPath + '\\electron.exe.*', fs, () => {
						startElectron()
					})
				})
			}
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

})()
