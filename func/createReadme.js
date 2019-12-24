(function() {

// Libraries
var is = require('@sindresorhus/is');
var fs = require("fs-extra");
var execSync = require('child_process').execSync;

// Functions
var nthIndex = require("../func/nthIndex.js");

function colorText(filetype, txt) {
	if(filetype === "html")
		return txt;

	// Colored text replacements for GitHub Flavored Markdown
	if(txt.includes('<font color="red">Disabled by default.</font>'))
		txt = txt.replace('<font color="red">Disabled by default.</font>', '<a href="##"><img src="docs/img/text/red/$disabled.svg" alt="Disabled"></a> <a href="##"><img src="docs/img/text/red/by.svg" alt="by"></a> <a href="##"><img src="docs/img/text/red/default..svg" alt="default."></a>');
	if(txt.includes('<font color=\"red\">A paid Minecraft account is required to play Minecraft.</font>'))
		txt = txt.replace('<font color="red">A paid Minecraft account is required to play Minecraft.</font>', '<a href="##"><img src="docs/img/text/red/$a.svg" alt="A"></a> <a href="##"><img src="docs/img/text/red/paid.svg" alt="paid"></a> <a href="##"><img src="docs/img/text/red/$minecraft.svg" alt="Minecraft"></a> <a href="##"><img src="docs/img/text/red/account.svg" alt="account"></a> <a href="##"><img src="docs/img/text/red/is.svg" alt="is"></a> <a href="##"><img src="docs/img/text/red/required.svg" alt="required"></a> <a href="##"><img src="docs/img/text/red/to.svg" alt="to"></a> <a href="##"><img src="docs/img/text/red/play.svg" alt="play"></a> <a href="##"><img src="docs/img/text/red/$minecraft..svg" alt="Minecraft."></a>');

	return txt;
}

function abbrText(filetype, txt) {
	if(filetype === "html")
		return txt;

	// Dotted underline text replacements for GitHub Flavored Markdown
	if(txt.includes('<th><abbr title="Whether we are allowed to include these files in the releases or whether the user has to download them themselves.">Distribution</abbr></th>'))
		// Force a minimum width using em & en spaces to work around GitHub not having a minimum width on their table cells
		txt = txt.replace('<th><abbr title="Whether we are allowed to include these files in the releases or whether the user has to download them themselves.">Distribution</abbr></th>', '<th>&emsp;&emsp;&emsp;&emsp;&emsp;&ensp;<br><a href="##" title="Whether we are allowed to include these files in the releases or whether the user has to download them themselves."><img src="docs/img/text/th/abbr/$distribution.svg" alt="Distribution" title="Whether we are allowed to include these files in the releases or whether the user has to download them themselves."></a><br>&emsp;&emsp;&emsp;&emsp;&emsp;&ensp;</th>');
	if(txt.includes('<th><abbr title="Whoever originally licensed the work, or the current owner of the IP. Usually a single person or entity.">Author</abbr></th>'))
		txt = txt.replace('<th><abbr title="Whoever originally licensed the work, or the current owner of the IP. Usually a single person or entity.">Author</abbr></th>', '<th>&emsp;&emsp;&emsp;&ensp;<br><a href="##" title="Whoever originally licensed the work, or the current owner of the IP. Usually a single person or entity."><img src="docs/img/text/th/abbr/$author.svg" alt="Author" title="Whoever originally licensed the work, or the current owner of the IP. Usually a single person or entity."></a><br>&emsp;&emsp;&emsp;&ensp;</th>');

	return txt;
}

function allAuthors(author) {
	if(is.string(author.name) && is.string(author.url))
		return '<a href="' + author.url + '" title="' + author.name + '">' + author.name + '</a>';
	else if(is.nonEmptyArray(author)) {
		var authorString = '';
		for (var i = 0; i < author.length; i++) {
			authorString += ', <a href="' + author[i].url + '" title="' + author[i].name + '">' + author[i].name + '</a>';
		}
		return authorString.substring(2);
	}
	throw new Error("Unimplemented");
}

function multiplePermissionSources(sources, current) {
	if(is.string(sources))
		return '<a href="' + sources + '" title="“' + current.name + '” permissions quote"><img src="docs/img/icon/source.svg" height="24" alt="(source)" title="“' + current.name + '” permissions quote"></a>';
	var permissionString = '';
	for (var i = 0; i < sources.length; i++) {
		permissionString += '<a href="' + sources[i] + '" title="“' + current.name + '” permissions quote"><img src="docs/img/icon/source.svg" height="24" alt="(source)" title="“' + current.name + '” permissions quote"></a>';
	}
	return permissionString;
}

function licenseDedicationTitle(license) {
	if(license === "All Rights Reserved")
		return 'is All Rights Reserved';
	if(license === "Public Domain")
		return 'is dedicated to the Public Domain';
	if(license === "Free Content")
		return 'is Free Content';
	return 'license';
}

function latestFile(current) {
	if(current.name === 'Java SE Runtime Environment 8')
		return '<code>jre-8u201-linux-x64.tar.gz</code>, <code>jre-8u201-windows-i586.exe</code>, <code>jre-8u201-windows-x64.exe</code>';
	if(is.undefined(current.file))
		return '';
	if(current.file.endsWith(".pack.xz"))
		return '<code>' + current.file.slice(0,-8) + '</code>';
	if(current.file === 'forge-1.7.10-10.13.4.1614-1.7.10-universal.jar')
		return '<code>forge-1.7.10-10.13.4.1614-1.7.10-universal.jar</code>, <code>FTBServer-1.7.10-1614.jar</code>';
	if(current.file === 'BattleTowers-1.7.10.zip')
		return '<code>BattleTowers-1.7.10.jar</code>';
	if(current.file === 'JointBlock1710-0_6_2_please_extract_.zip')
		return '<code>JBRobotModel1710-0.6.0.jar</code>, <code>JointBlock1710-0.6.2.jar</code>';
	if(current.file === 'Starminer1710-0.9.9_please_extract_.zip')
		return '<code>Starminer1710-0.9.9.jar</code>';
	return '<code>' + current.file + '</code>';
}

module.exports = function(filetype) {
	var readme = '';
	var current;

	// Document start
	if(filetype === "html")
		readme += '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="renderer" content="webkit"><meta name="viewport" content="width=device-width, initial-scale=1"><title>README</title></head><body>\r\n';

	// Prepend description
	readme += global.config["description-prepend"];

	// Create three tables. One for each category
	for (var i = 0; i < 3; i++) {
		// Heading
		if(i === 2)
			readme += '\r\n<h2>Java Libraries</h2>';
		else if(i === 0)
			readme += '\r\n<h2>Binaries</h2>';
		else
			readme += '\r\n<h2>Mods</h2>';

		// Table start
		if(filetype === "html")
			readme += '\r\n<table data-sortable>';
		else
			readme += '\r\n<table>';

		// Table header start
		readme += '\r\n<thead><tr>';
		// Table header items
		readme += '\r\n<th>Icon</th>';
		readme += '\r\n<th>Name</th>';
		readme += '\r\n<th>Type</th>';
		readme += '\r\n' + abbrText(filetype, '<th><abbr title="Whoever originally licensed the work, or the current owner of the IP. Usually a single person or entity.">Author</abbr></th>');
		readme += '\r\n<th>License</th>';
		readme += '\r\n<th>Source Code</th>';
		readme += '\r\n' + abbrText(filetype, '<th><abbr title="Whether we are allowed to include these files in the releases or whether the user has to download them themselves.">Distribution</abbr></th>');
		readme += '\r\n<th>Description</th>';
		readme += '\r\n<th>Latest Release</th>';
		// Table header end
		readme += '\r\n</tr></thead>';

		// Table body start
		readme += '\r\n<tbody>';
		// Table items
		for (var k = 0; k < global.downloads.length; k++) {
			current = global.downloads[k];
			// Only write items that match types with what table we're creating
			if((i === 0 && (current.type.includes("executable") || current.type === 'binary' )) || (i === 1 && current.type !== 'library' && !(current.type.includes("executable") || current.type === 'binary' )) || (i === 2 && current.type === 'library')) {
				// Row start
				readme += '\r\n<tr>';

				// Icon
				readme += '\r\n<td align="center"><a href="' + (current["description-url-override"] ? current["description-url-override"] : current.url) + '" title="' + current.name + '"><img src="docs/img/logo/' + (current.img ? current.img : 'default.svg') + '" width="62" alt="' + current.name + '" title="' + current.name + '"></a></td>';

				// Name
				readme += '\r\n<td><a href="' + (current["description-url-override"] ? current["description-url-override"] : current.url) + '" title="' + current.name + '">' + current.name + '</a>' + (current["description-url-override"] && current.url ? ' <a href="' + current.url + '" title="“' + current.name + '” download"><img src="docs/img/icon/download.svg" height="24" alt="(download)" title="“' + current.name + '” download"></a>' : '') + '</td>';

				// Type
				readme += '\r\n<td>' + current.type.replace(/\w*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1)}) + '</td>';

				// Author
				readme += '\r\n<td>' + (current.author ? allAuthors(current.author) : '') + '</td>';

				// License
				readme += '\r\n<td>' + (current.license ? '<a href="docs/legal/' + current.license.txt + '.txt" title="“' + current.name + '” ' + licenseDedicationTitle(current.license.txt) + '">' + current.license.txt + '</a>' + (current.license.source ? '<a href="' + current.license.source + '" title="“' + current.name + '” license information"><img src="docs/img/icon/source.svg" height="24" alt="(source)" title="“' + current.name + '” license information"></a>' : '') : '');

				// EULA
				readme += '\r\n' + (current.eula ? ', <a href="docs/legal/' + current.eula.txt + '.txt" title="“' + current.name + '” EULA">' + current.eula.txt + '</a>' + (current.eula.source ? '<a href="' + current.eula.source + '" title="“' + current.name + '” EULA information"><img src="docs/img/icon/source.svg" height="24" alt="(source)" title="“' + current.name + '” EULA information"></a>' : '') : '')

				// Permission
				readme += '\r\n' + (current.permission ? ', <a href="docs/img/permissions/' + current.permission.img + '" title="“' + current.name + '” granted permissions">Permissions</a>' + multiplePermissionSources(current.permission.source, current) : '') + '</td>';

				// Source Code
				readme += '\r\n<td>' + (current.code ? (current.code.url ? '<a href="' + current.code.url + '" title="“' + current.name + '” source code">' + current.code.title + '</a>' : current.code.title) : '') + '</td>';

				// Distribution
				if(filetype === "html")
					readme += '\r\n<td align="center">' + (current.distribution === "allowed" ? '<img src="docs/img/icon/check.svg" height="24" alt="OK" title="Distribution Allowed">' : '<img src="docs/img/icon/cross.svg" height="24" alt="No" title="No Distribution Allowed">') + '</td>';
				else
					readme += '\r\n<td align="center">' + (current.distribution === "allowed" ? '<a href="##" title="Distribution Allowed"><img src="docs/img/icon/check.svg" height="24" alt="OK" title="Distribution Allowed"></a>' : '<a href="##" title="No Distribution Allowed"><img src="docs/img/icon/cross.svg" height="24" alt="No" title="No Distribution Allowed"></a>') + '</td>';

				// Description
				readme += '\r\n<td>' + (current.description ? colorText(filetype, current.description) : '') + '</td>';

				// File
				readme += '\r\n<td align="center">' + latestFile(current) + '</td>';

				// Row end
				readme += '\r\n</tr>';
			}
		}
		// Table body end
		readme += '\r\n</tbody>';
		// Table end
		readme += '\r\n</table>';
	}

	// List Node modules from node_modules
	files = execSync(/^win/.test(process.platform) ? 'dir package.json /A:-D /B /S' : 'find . -type f -name package.json', {cwd: '../node_modules'}).toString().replace(/\r/g,'').split('\n');
	files.pop();
	if(files.length > 0) {
		// Heading
		readme += '\r\n<h2>Node Modules</h2>';

		// Table start
		if(filetype === "html")
			readme += '\r\n<table data-sortable>';
		else
			readme += '\r\n<table>';

		// Table header start
		readme += '\r\n<thead><tr>';
		// Table header items
		readme += '\r\n<th>Icon</th>';
		readme += '\r\n<th>Name</th>';
		readme += '\r\n<th>Type</th>';
		readme += '\r\n' + abbrText(filetype, '<th><abbr title="Whoever originally licensed the work, or the current owner of the IP. Usually a single person or entity.">Author</abbr></th>');
		readme += '\r\n<th>License</th>';
		readme += '\r\n<th>Source Code</th>';
		readme += '\r\n' + abbrText(filetype, '<th><abbr title="Whether we are allowed to include these files in the releases or whether the user has to download them themselves.">Distribution</abbr></th>');
		readme += '\r\n<th>Description</th>';
		readme += '\r\n<th>Latest Release</th>';
		// Table header end
		readme += '\r\n</tr></thead>';

		// Table body start
		readme += '\r\n<tbody>';

		var packageData;
		files.forEach(function(file) {
			packageData = JSON.parse(fs.readFileSync(file, "utf8"));

			// Correct repository urls
			if(packageData.repository.url.startsWith('git+'))
				packageData.repository.url = packageData.repository.url.slice(4);
			if(packageData.repository.url.startsWith('git://'))
				packageData.repository.url = 'https://' + packageData.repository.url.slice(6);
			else if(packageData.repository.url.startsWith('ssh://git@'))
				packageData.repository.url = 'https://' + packageData.repository.url.slice(10);
			if(packageData.repository.url.endsWith('.git'))
				packageData.repository.url = packageData.repository.url.slice(0,-4);

			// Substitute author with GitHub profile
			if(!packageData.author)
				packageData.author = {};
			if(!packageData.author.name)
				packageData.author.name = packageData.repository.url.substring(packageData.repository.url.lastIndexOf('/'), nthIndex(packageData.repository.url, '/', (packageData.repository.url.match(/\//g)||[]).length-1)+1);

			// Author URL
			if(!packageData.author.url || !packageData.author.url.startsWith('https://github.com/'))
				packageData.author.url = packageData.repository.url.slice(0,-(packageData.repository.url.substring(packageData.repository.url.lastIndexOf('/')).length));
			
			// Hardcoded repository urls
			if(packageData.repository.url === 'https://github.com/cheeriojs/dom-renderer')
				packageData.repository.url = 'https://github.com/cheeriojs/dom-serializer';
			else if(packageData.repository.url === 'https://github.com/fb55/DomHandler')
				packageData.repository.url = 'https://github.com/fb55/domhandler';
			else if(packageData.repository.url === 'https://github.com/FB55/domutils')
				packageData.repository.url = 'https://github.com/fb55/domutils';
			else if(packageData.repository.url === 'https://github.com/mcavage/node-assert-plus')
				packageData.repository.url = 'https://github.com/joyent/node-assert-plus';
			else if(packageData.repository.url === 'https://github.com/mikeal/aws-sign')
				packageData.repository.url = 'https://github.com/request/aws-sign';
			else if(packageData.repository.url === 'https://github.com/mikeal/caseless')
				packageData.repository.url = 'https://github.com/request/caseless';
			else if(packageData.repository.url === 'https://github.com/quartzjer/ecc-jsbn')
				packageData.repository.url = 'https://github.com/aduh95/ecc-jsbn';
			else if(packageData.repository.url === 'https://github.com/davepacheco/node-extsprintf')
				packageData.repository.url = 'https://github.com/joyent/node-extsprintf';

			// Author URL corrections
			if(packageData.author.url === 'https://github.com/FB55')
				packageData.author.url = 'https://github.com/fb55';
			// Author name corrections
			if(packageData.author.name === 'Felix Boehm')
				packageData.author.name = 'Felix Böhm';
			else if(packageData.author.name === 'davepacheco')
				packageData.author.name = 'David Pacheco';
			// Full corrections
			else if(packageData.repository.url === 'https://github.com/electron/get') {
				packageData.author.url = 'https://github.com/MarshallOfSound';
			}
			else if(packageData.repository.url === 'https://github.com/DefinitelyTyped/DefinitelyTyped') {
				packageData.author.name = 'DefinitelyTyped contributors'
				packageData.author.url = 'https://github.com/DefinitelyTyped/DefinitelyTyped/graphs/contributors';
			}
			else if(packageData.repository.url === 'https://github.com/joyent/node-asn1') {
				packageData.author.name = 'Mark Cavage'
				packageData.author.url = 'https://github.com/mcavage';
			}
			else if(packageData.repository.url === 'https://github.com/joyent/node-assert-plus') {
				packageData.author = [{
					name: 'Joyent',
					url: 'https://github.com/joyent'
				},{
					name: 'assert-plus authors',
					url: 'https://github.com/joyent/node-assert-plus/blob/master/AUTHORS'
				}];
			}
			else if(packageData.repository.url === 'https://github.com/dchest/tweetnacl-js') {
				packageData.author.name = 'tweetnacl contributors'
				packageData.author.url = 'https://github.com/dchest/tweetnacl-js/graphs/contributors';
			}

			// Hardcoded homepages
			packageData.homepage = 'https://www.npmjs.com/package/' + packageData.name;

			// Hardcoded licenses
			if(!packageData.license && packageData.repository.url === 'https://github.com/fb55/domutils')
				packageData.license = 'BSD-2-Clause';
			if(!packageData.license && packageData.repository.url === 'https://github.com/kriszyp/json-schema')
				packageData.license = 'AFL-2.1 OR BSD-3-Clause';

			packageData.name = packageData._location.substr(1);
			if(packageData.description.substring(packageData.description.length-1) !== '.')
				packageData.description += '.';
			packageData.description = packageData.description[0].toUpperCase() + packageData.description.slice(1).replace(/[Nn]ode\.js|[Nn]ode(?!s)/g,'Node');
			if(packageData._requiredBy[0] !== '/') {
				packageData.description += '<br>Required by ' + (function(){
					var requirements = '';
					for (var i = 0; i < packageData._requiredBy.length; i++) {
						requirements += packageData._requiredBy[i].slice(1).substr(0, packageData._requiredBy[i].slice(1).indexOf('/') === -1 ? packageData._requiredBy[i].slice(1).length : packageData._requiredBy[i].slice(1).indexOf('/')) + ', ';
					}
					return requirements.slice(0,-2);
				})() + '.';
			}
			// Row start
			readme += '\r\n<tr>';

			// Icon
			readme += '\r\n<td align="center"><a href="' + packageData.homepage + '" title="' + packageData.name + '"><img src="docs/img/logo/';
			if(packageData.repository.url.startsWith('https://github.com/electron'))
				readme += 'electron.svg';
			else if(packageData.repository.url.startsWith('https://github.com/joyent'))
				readme += 'joyent.png';
			else if(packageData.repository.url.startsWith('https://github.com/request'))
				readme += 'request.png';
			else if(packageData.repository.url.startsWith('https://github.com/cheeriojs'))
				readme += 'cheerio.png';
			else if(fs.existsSync('../docs/img/logo/' + packageData.name + '.svg'))
				readme += packageData.name + '.svg';
			else if(fs.existsSync('../docs/img/logo/' + packageData.name + '.png'))
				readme += packageData.name + '.png';
			else
				readme += 'npm.svg';
			readme += '" width="62" alt="' + packageData.name + '" title="' + packageData.name + '"></a></td>';

			// Name
			readme += '\r\n<td><a href="' + packageData.homepage + '" title="' + packageData.name + '">' + packageData.name + '</a></td>';

			// Type
			readme += '\r\n<td>Module</td>';

			// Author
			readme += '\r\n<td>' + allAuthors(packageData.author) + '</td>';

			// License
			readme += '\r\n<td>' + (packageData.license ? packageData.license : '') + '</td>';

			// Source Code
			readme += '\r\n<td><a href="' + packageData.repository.url + '" title="“' + packageData.name + '” source code">Open Source</a></td>';

			// Distribution
			if(filetype === "html")
				readme += '\r\n<td align="center"><img src="docs/img/icon/check.svg" height="24" alt="OK" title="Distribution Allowed"></td>';
			else
				readme += '\r\n<td align="center"><a href="##" title="Distribution Allowed"><img src="docs/img/icon/check.svg" height="24" alt="OK" title="Distribution Allowed"></a></td>';

			// Description
			readme += '\r\n<td>' + packageData.description + '</td>';

			// File
			readme += '\r\n<td align="center"><code>' + packageData._id + '</code></td>';

			// Row end
			readme += '\r\n</tr>';
		});

		// Table body end
		readme += '\r\n</tbody>';
		// Table end
		readme += '\r\n</table>';
	}

	// Append description
	readme += '\r\n' + global.config["description-append"];

	// CSS
	if(filetype === "html")
		readme += '\r\n<style>*{box-sizing:border-box}html{background-color:#fff;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"}h1{border-bottom:1px solid #eaecef}h2{border-bottom:1px solid #eaecef}a{color:#0366d6;text-decoration:none}a:hover{text-decoration:underline}a:active,a:hover{outline-width:0}img{max-width:100%;box-sizing:content-box;background-color:#fff;border-style:none}img[align="right"]{padding-left:20px}table img{background-color:transparent}table{width:100%;overflow:auto;word-wrap:break-word;border-spacing:0;border-collapse:collapse}table tr{background-color:#fff;border-top:1px solid #c6cbd1}table tr:nth-child(2n){background-color:#f6f8fa}table th,table td{padding:6px 13px;border:1px solid #dfe2e5}a[disabled],a[href="##"]{cursor:text;outline-width:0}a[href="##"][title]{cursor:default}hr{height:0.25em;padding:0;margin:24px 0;background-color:#e1e4e8;border:0}code{padding:0;padding-top:0.2em;padding-bottom:0.2em;margin:0;font-size:85%;background-color:rgba(27,31,35,0.05);border-radius:3px}code::before,code::after{letter-spacing:-0.2em;content:"\\00a0"}td[align="center"]{text-align:center}table[data-sortable]{border-collapse:collapse;border-spacing:0}table[data-sortable] th{vertical-align:bottom;font-weight:bold}table[data-sortable] th:not([data-sortable="false"]){-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;-o-user-select:none;user-select:none;-webkit-tap-highlight-color:rgba(0,0,0,0);-webkit-touch-callout:none;cursor:pointer}table[data-sortable] th:after{content:"";visibility:hidden;display:inline-block;vertical-align:inherit;height:0;width:0;border-width:5px;border-style:solid;border-color:transparent;margin-right:1px;margin-left:10px;float:right}table[data-sortable] th[data-sorted="true"]:after{visibility:visible}table[data-sortable] th[data-sorted-direction="descending"]:after{border-top-color:inherit;margin-top:8px}table[data-sortable] th[data-sorted-direction="ascending"]:after{border-bottom-color:inherit;margin-top:3px}</style>'

	// JS
	if(filetype === "html")
		readme += '\r\n<script>/*! sortable.js 0.8.0 */(function(){var a,b,c,d,e,f,g;a="table[data-sortable]",d=/^-?[Â£$Â¤]?[\d,.]+%?$/,g=/^\s+|\s+$/g,c=["click"],f="ontouchstart"in document.documentElement,f&&c.push("touchstart"),b=function(a,b,c){return null!=a.addEventListener?a.addEventListener(b,c,!1):a.attachEvent("on"+b,c)},e={init:function(b){var c,d,f,g,h;for(null==b&&(b={}),null==b.selector&&(b.selector=a),d=document.querySelectorAll(b.selector),h=[],f=0,g=d.length;g>f;f++)c=d[f],h.push(e.initTable(c));return h},initTable:function(a){var b,c,d,f,g,h;if(1===(null!=(h=a.tHead)?h.rows.length:void 0)&&"true"!==a.getAttribute("data-sortable-initialized")){for(a.setAttribute("data-sortable-initialized","true"),d=a.querySelectorAll("th"),b=f=0,g=d.length;g>f;b=++f)c=d[b],"false"!==c.getAttribute("data-sortable")&&e.setupClickableTH(a,c,b);return a}},setupClickableTH:function(a,d,f){var g,h,i,j,k,l;for(i=e.getColumnType(a,f),h=function(b){var c,g,h,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D;if(b.handled===!0)return!1;for(b.handled=!0,m="true"===this.getAttribute("data-sorted"),n=this.getAttribute("data-sorted-direction"),h=m?"ascending"===n?"descending":"ascending":i.defaultSortDirection,p=this.parentNode.querySelectorAll("th"),s=0,w=p.length;w>s;s++)d=p[s],d.setAttribute("data-sorted","false"),d.removeAttribute("data-sorted-direction");if(this.setAttribute("data-sorted","true"),this.setAttribute("data-sorted-direction",h),o=a.tBodies[0],l=[],m){for(D=o.rows,v=0,z=D.length;z>v;v++)g=D[v],l.push(g);for(l.reverse(),B=0,A=l.length;A>B;B++)k=l[B],o.appendChild(k)}else{for(r=null!=i.compare?i.compare:function(a,b){return b-a},c=function(a,b){return a[0]===b[0]?a[2]-b[2]:i.reverse?r(b[0],a[0]):r(a[0],b[0])},C=o.rows,j=t=0,x=C.length;x>t;j=++t)k=C[j],q=e.getNodeValue(k.cells[f]),null!=i.comparator&&(q=i.comparator(q)),l.push([q,k,j]);for(l.sort(c),u=0,y=l.length;y>u;u++)k=l[u],o.appendChild(k[1])}return"function"==typeof window.CustomEvent&&"function"==typeof a.dispatchEvent?a.dispatchEvent(new CustomEvent("Sortable.sorted",{bubbles:!0})):void 0},l=[],j=0,k=c.length;k>j;j++)g=c[j],l.push(b(d,g,h));return l},getColumnType:function(a,b){var c,d,f,g,h,i,j,k,l,m,n;if(d=null!=(l=a.querySelectorAll("th")[b])?l.getAttribute("data-sortable-type"):void 0,null!=d)return e.typesObject[d];for(m=a.tBodies[0].rows,h=0,j=m.length;j>h;h++)for(c=m[h],f=e.getNodeValue(c.cells[b]),n=e.types,i=0,k=n.length;k>i;i++)if(g=n[i],g.match(f))return g;return e.typesObject.alpha},getNodeValue:function(a){var b;return a?(b=a.getAttribute("data-value"),null!==b?b:"undefined"!=typeof a.innerText?a.innerText.replace(g,""):a.textContent.replace(g,"")):""},setupTypes:function(a){var b,c,d,f;for(e.types=a,e.typesObject={},f=[],c=0,d=a.length;d>c;c++)b=a[c],f.push(e.typesObject[b.name]=b);return f}},e.setupTypes([{name:"numeric",defaultSortDirection:"descending",match:function(a){return a.match(d)},comparator:function(a){return parseFloat(a.replace(/[^0-9.-]/g,""),10)||0}},{name:"date",defaultSortDirection:"ascending",reverse:!0,match:function(a){return!isNaN(Date.parse(a))},comparator:function(a){return Date.parse(a)||0}},{name:"alpha",defaultSortDirection:"ascending",match:function(){return!0},compare:function(a,b){return a.localeCompare(b)}}]),setTimeout(e.init,0),"function"==typeof define&&define.amd?define(function(){return e}):"undefined"!=typeof exports?module.exports=e:window.Sortable=e}).call(this);</script>';

	// Document end
	if(filetype === "html")
		readme += '\r\n</body></html>';

	// Write readme
	return readme;
}

})();
