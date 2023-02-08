#!/bin/bash
# Execution starts in .github/workflows/npm.yml or docs/tools/actions-artifacts.sh
export node_version=$(cat node_version.txt)
rm node_version.txt
# Ignore devDependencies, peerDependencies, and bundleDependencies
sed -i '/"devDependencies": {/,/}/d' -- 'package.json'
sed -i '/"peerDependencies": {/,/}/d' -- 'package.json'
sed -i -z 's|  "bundleDependencies": \[\n    ".*"\n  \]|  "bundleDependencies": \[\]|' -- 'package.json'
# Install
if [[ "$OSTYPE" == "msys" ]]; then
  bin/windows/x64/node/node-v$node_version-win-x64/node.exe bin/windows/x64/node/node-v$node_version-win-x64/node_modules/npm/bin/npm-cli.js install --no-offline
else
  bin/linux/x64/node/node-v$node_version-linux-x64/bin/node bin/linux/x64/node/node-v$node_version-linux-x64/lib/node_modules/npm/bin/npm-cli.js install --no-offline
fi
rm -rf .npm/
rm node_modules/.package-lock.json
git checkout -- 'package.json'
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
# better-npm-audit changes
sed -i "/  All good!');/d" -- node_modules/better-npm-audit/src/handlers/handleFinish.js
sed -i "s/'npm audit'/'npm --no-offline --loglevel=error audit'/" -- node_modules/better-npm-audit/src/handlers/handleInput.js
sed -i '/header: {/,/},/d' -- node_modules/better-npm-audit/src/utils/print.js
# Remove unnecessary files
find node_modules/ -mindepth 2 -type d \( -name '.github' -o -name 'changelogs' -o -name 'docs' -o -name 'example' -o -name 'examples' -o -name 'jsdoc-toolkit' -o -name 'man' -o -name 'scripts' -o -name 'tap-snapshots' -o -name 'test' -o -name 'tests' -o -name 'typings' \) | xargs rm -rf
find node_modules/ -mindepth 2 -type f \( -name '*.d.ts' -o -name '*.d.ts.map' -o -name '*.js.map' -o -name '.editorconfig' -o -name '.eslintignore' -o -name '.eslintrc' -o -name '.eslintrc.json' -o -name '.eslintrc.yml' -o -name '.gitattributes' -o -name '.gitmodules' -o -name '.licensee.json' -o -name '.mailmap' -o -name '.npmignore' -o -name '.nycrc' -o -name '.project' -o -name '.runkit_example.js' -o -name '.travis.yml' -o -name 'configure' -o -name 'CONTRIBUTING.md' -o -name 'Jenkinsfile' -o -name 'make.bat' -o -name 'Makefile' -o -name 'yarn.lock' \) -exec bash -c 'rm "$1"; rmdir --ignore-fail-on-non-empty $(dirname "$1")' bash '{}' ';'
# Remove non-deterministic information
find node_modules/ -mindepth 2 -type f -name 'package.json' -exec sed -i '/"_where": "/d' -- '{}' ';'
find node_modules/ -mindepth 2 -type f -name 'package.json' -exec sed -i '/"man": \[/,/\],/d' -- '{}' ';'
# Execution continues in .github/workflows/npm.yml or docs/tools/actions-artifacts.sh ...
