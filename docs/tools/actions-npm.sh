#!/bin/bash
# Execution starts in .github/workflows/npm.yml or docs/tools/actions-artifacts.sh
export node_version=$(cat node_version.txt)
rm node_version.txt
export npm_version=$(cat npm_version.txt)
rm npm_version.txt
# Temporarily install ansi-regex@4.1.1 and ansi-regex@3.0.1
if [[ "$OSTYPE" == "msys" ]]; then
  bin/windows/x64/node/node-v$node_version-win-x64/node.exe bin/all/all/npm/npm-$npm_version/npm/bin/npm-cli.js install --no-offline ansi-regex-4.1.1@npm:ansi-regex@4.1.1 ansi-regex-3.0.1@npm:ansi-regex@3.0.1
else
  bin/linux/x64/node/node-v$node_version-linux-x64/bin/node bin/all/all/npm/npm-$npm_version/npm/bin/npm-cli.js install --no-offline ansi-regex-4.1.1@npm:ansi-regex@4.1.1 ansi-regex-3.0.1@npm:ansi-regex@3.0.1
fi
rm -rf .npm/
rm package-lock.json
git checkout -- 'package.json'
# Create a local copy of ansi-regex@4.1.1
mkdir -p bin/all/all/ansi-regex/ansi-regex-4.1.1/node_modules/ansi-regex
mv -T node_modules/ansi-regex-4.1.1 bin/all/all/ansi-regex/ansi-regex-4.1.1/node_modules/ansi-regex
sed -i 's/ansi-regex-4.1.1/ansi-regex/' -- 'bin/all/all/ansi-regex/ansi-regex-4.1.1/node_modules/ansi-regex/package.json'
sed -i 's/npm:ansi-regex@4.1.1/4.1.1/' -- 'bin/all/all/ansi-regex/ansi-regex-4.1.1/node_modules/ansi-regex/package.json'
sed -i 's/    "type": "alias"/    "type": "version"/' -- 'bin/all/all/ansi-regex/ansi-regex-4.1.1/node_modules/ansi-regex/package.json'
sed -i 's/    "fetchSpec": null,/    "fetchSpec": "4.1.1"/' -- 'bin/all/all/ansi-regex/ansi-regex-4.1.1/node_modules/ansi-regex/package.json'
sed -i '/    "subSpec": {/,/    }/d' -- 'bin/all/all/ansi-regex/ansi-regex-4.1.1/node_modules/ansi-regex/package.json'
# Create a local copy of ansi-regex@3.0.1
mkdir -p bin/all/all/ansi-regex/ansi-regex-3.0.1/node_modules/ansi-regex
mv -T node_modules/ansi-regex-3.0.1 bin/all/all/ansi-regex/ansi-regex-3.0.1/node_modules/ansi-regex
sed -i 's/ansi-regex-3.0.1/ansi-regex/' -- 'bin/all/all/ansi-regex/ansi-regex-3.0.1/node_modules/ansi-regex/package.json'
sed -i 's/npm:ansi-regex@3.0.1/3.0.1/' -- 'bin/all/all/ansi-regex/ansi-regex-3.0.1/node_modules/ansi-regex/package.json'
sed -i 's/    "type": "alias"/    "type": "version"/' -- 'bin/all/all/ansi-regex/ansi-regex-3.0.1/node_modules/ansi-regex/package.json'
sed -i 's/    "fetchSpec": null,/    "fetchSpec": "3.0.1"/' -- 'bin/all/all/ansi-regex/ansi-regex-3.0.1/node_modules/ansi-regex/package.json'
sed -i '/    "subSpec": {/,/    }/d' -- 'bin/all/all/ansi-regex/ansi-regex-3.0.1/node_modules/ansi-regex/package.json'
# Clean up Node package dependencies
rm -r node_modules/
# Ignore devDependencies, peerDependencies, and bundleDependencies
sed -i '/"devDependencies": {/,/}/d' -- 'package.json'
sed -i '/"peerDependencies": {/,/}/d' -- 'package.json'
sed -i -z 's|  "bundleDependencies": \[\n    ".*"\n  \]|  "bundleDependencies": \[\]|' -- 'package.json'
# Install
if [[ "$OSTYPE" == "msys" ]]; then
  bin/windows/x64/node/node-v$node_version-win-x64/node.exe bin/all/all/npm/npm-$npm_version/npm/bin/npm-cli.js install --no-offline
else
  bin/linux/x64/node/node-v$node_version-linux-x64/bin/node bin/all/all/npm/npm-$npm_version/npm/bin/npm-cli.js install --no-offline
fi
rm -rf .npm/
git checkout -- 'package.json'
if [[ "$OSTYPE" == "msys" ]]; then
  bin/windows/x64/node/node-v$node_version-win-x64/node.exe node_modules/npm-6/bin/npm-cli.js dedupe
else
  bin/linux/x64/node/node-v$node_version-linux-x64/bin/node node_modules/npm-6/bin/npm-cli.js dedupe
fi
rm -rf .npm/
# Remove vulnerable dependencies
rm -r node_modules/npm-6/node_modules/string-width/node_modules/ansi-regex/
rm -r node_modules/npm-6/node_modules/yargs/node_modules/ansi-regex/
# Remove module typing
rm node_modules/cheerio/lib/esm/package.json
rm node_modules/cheerio-select/lib/esm/package.json
rm node_modules/css-select/lib/esm/package.json
rm node_modules/dom-serializer/lib/esm/package.json
rm node_modules/domelementtype/lib/esm/package.json
rm node_modules/domhandler/lib/esm/package.json
rm node_modules/domutils/lib/esm/package.json
rm node_modules/entities/lib/esm/package.json
rm node_modules/htmlparser2/lib/esm/package.json
rm node_modules/nth-check/lib/esm/package.json
rm node_modules/parse5/dist/cjs/package.json
rm node_modules/parse5-htmlparser2-tree-adapter/dist/cjs/package.json
sed -i '/"type": "module"/d' -- 'node_modules/parse5/package.json'
sed -i '/"type": "module"/d' -- 'node_modules/parse5-htmlparser2-tree-adapter/package.json'
# Patch vulnerable dependencies
cp -a bin/all/all/ansi-regex/ansi-regex-3.0.1/node_modules/ansi-regex/ node_modules/npm-6/node_modules/string-width/node_modules/ansi-regex/
cp -a bin/all/all/ansi-regex/ansi-regex-4.1.1/node_modules/ansi-regex/ node_modules/npm-6/node_modules/yargs/node_modules/ansi-regex/
# Set bundled status
sed -i "0,/\"_inBundle\": false/s//\"_inBundle\": true/" node_modules/npm-6/node_modules/string-width/node_modules/ansi-regex/package.json
sed -i "0,/\"_inBundle\": false/s//\"_inBundle\": true/" node_modules/npm-6/node_modules/yargs/node_modules/ansi-regex/package.json
# Set parent dependency
sed -i -z "0,/  \"_requiredBy\": \[\n    \".*\"\n  \]/s//  \"_requiredBy\": \[\n    \"\/npm-6\/string-width\"\n  \]/" node_modules/npm-6/node_modules/string-width/node_modules/ansi-regex/package.json
sed -i -z "0,/  \"_requiredBy\": \[\n    \".*\"\n  \]/s//  \"_requiredBy\": \[\n    \"\/npm-6\/yargs\"\n  \]/" node_modules/npm-6/node_modules/yargs/node_modules/ansi-regex/package.json
# Set current location
sed -i "0,/\"_location\": \".*\"/s//\"_location\": \"\/npm-6\/string-width\/ansi-regex\"/" node_modules/npm-6/node_modules/string-width/node_modules/ansi-regex/package.json
sed -i "0,/\"_location\": \".*\"/s//\"_location\": \"\/npm-6\/yargs\/ansi-regex\"/" node_modules/npm-6/node_modules/yargs/node_modules/ansi-regex/package.json
# better-npm-audit changes
sed -i "/  All good!');/d" -- node_modules/better-npm-audit/src/handlers/handleFinish.js
sed -i "s/'npm audit'/'npm --no-offline --loglevel=error audit'/" -- node_modules/better-npm-audit/src/handlers/handleInput.js
sed -i '/header: {/,/},/d' -- node_modules/better-npm-audit/src/utils/print.js
# Remove unnecessary files
find node_modules/ -mindepth 2 -type d \( -name '.github' -o -name 'changelogs' -o -name 'docs' -o -name 'example' -o -name 'examples' -o -name 'jsdoc-toolkit' -o -name 'man' -o -name 'scripts' -o -name 'tap-snapshots' -o -name 'test' -o -name 'tests' -o -name 'typings' \) | xargs rm -rf
find node_modules/ -mindepth 2 -type f \( -name '*.d.ts' -o -name '*.d.ts.map' -o -name '*.js.map' -o -name '.editorconfig' -o -name '.eslintrc' -o -name '.eslintrc.json' -o -name '.eslintrc.yml' -o -name '.gitattributes' -o -name '.gitmodules' -o -name '.licensee.json' -o -name '.mailmap' -o -name '.npmignore' -o -name '.nycrc' -o -name '.project' -o -name '.travis.yml' -o -name 'AUTHORS' -o -name 'AUTHORS.md' -o -name 'changelog.md' -o -name 'CHANGELOG.md' -o -name 'configure' -o -name 'CONTRIBUTING.md' -o -name 'make.bat' -o -name 'Makefile' -o -name 'yarn.lock' \) -exec bash -c 'rm "$1"; rmdir --ignore-fail-on-non-empty $(dirname "$1")' bash '{}' ';'
# Remove non-deterministic information
find node_modules/ -mindepth 2 -type f -name 'package.json' -exec sed -i '/"_where": "/d' -- '{}' ';'
find node_modules/ -mindepth 2 -type f -name 'package.json' -exec sed -i '/"man": \[/,/\],/d' -- '{}' ';'
# Update package-lock.json
if [[ "$OSTYPE" == "msys" ]]; then
  bin/windows/x64/node/node-v$node_version-win-x64/node.exe node_modules/npm-6/bin/npm-cli.js dedupe
else
  bin/linux/x64/node/node-v$node_version-linux-x64/bin/node node_modules/npm-6/bin/npm-cli.js dedupe
fi
rm -rf .npm/
rm -r bin/all/
git checkout -- 'package.json'
# Execution continues in .github/workflows/npm.yml or docs/tools/actions-artifacts.sh ...
