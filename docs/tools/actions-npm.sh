#!/bin/bash
# Execution starts in .github/workflows/npm.yml or docs/tools/actions-artifacts.sh
export node_version=$(cat package.json | python -c "import sys, json; print(json.load(sys.stdin)['engines']['node'])")
export npm_version=$(cat bin/linux/x64/node/node-v$node_version-linux-x64/lib/node_modules/npm/package.json | python -c "import sys, json; print(json.load(sys.stdin)['version'])")
# Correct engines
sed -i "0,/\"npm\": \".*\"/s//\"npm\": \"$npm_version\"/" package.json
# Ignore devDependencies and bundleDependencies
sed -i '/"devDependencies": {/,/}/d' -- 'package.json'
sed -i -z 's|  "bundleDependencies": \[\n    ".*"\n  \]|  "bundleDependencies": \[\]|' -- 'package.json'
# Install
if [[ "$OSTYPE" == "msys" ]]; then
  bin/windows/x64/node/node-v$node_version-win-x64/node.exe bin/windows/x64/node/node-v$node_version-win-x64/node_modules/npm/bin/npm-cli.js install --no-offline
else
  bin/linux/x64/node/node-v$node_version-linux-x64/bin/node bin/linux/x64/node/node-v$node_version-linux-x64/lib/node_modules/npm/bin/npm-cli.js install --no-offline
fi
rm -rf .npm/
# Dedupe
if [[ "$OSTYPE" == "msys" ]]; then
  bin/windows/x64/node/node-v$node_version-win-x64/node.exe bin/windows/x64/node/node-v$node_version-win-x64/node_modules/npm/bin/npm-cli.js dedupe
else
  bin/linux/x64/node/node-v$node_version-linux-x64/bin/node bin/linux/x64/node/node-v$node_version-linux-x64/lib/node_modules/npm/bin/npm-cli.js dedupe
fi
rm -rf .npm/
git checkout -- 'package.json'
# better-npm-audit changes
sed -i "/  All good!');/d" -- node_modules/better-npm-audit/src/handlers/handleFinish.js
sed -i "s/'npm audit'/'npm --no-offline audit'/" -- node_modules/better-npm-audit/src/handlers/handleInput.js
sed -i '/header: {/,/},/d' -- node_modules/better-npm-audit/src/utils/print.js
# Remove unnecessary files
find node_modules/ -mindepth 2 -type d \( -name '.github' -o -name 'docs' -o -name 'example' -o -name 'examples' -o -name 'jsdoc-toolkit' -o -name 'man' -o -name 'tap-snapshots' -o -name 'test' -o -name 'tests' -o -name 'typings' \) | xargs rm -rf
find node_modules/ -mindepth 2 -type f \( -name '*.d.ts' -o -name '*.d.ts.map' -o -name '*.js.map' -o -name '.editorconfig' -o -name '.eslintignore' -o -name '.eslintrc' -o -name '.eslintrc.json' -o -name '.eslintrc.yml' -o -name '.gitattributes' -o -name '.gitmodules' -o -name '.licensee.json' -o -name '.mailmap' -o -name '.npmignore' -o -name '.nycrc' -o -name '.project' -o -name '.runkit_example.js' -o -name '.travis.yml' -o -name 'configure' -o -name 'Jenkinsfile' -o -name 'make.bat' -o -name 'Makefile' -o -name 'yarn.lock' \) -exec bash -c 'rm "$1"; rmdir --ignore-fail-on-non-empty $(dirname "$1")' bash '{}' ';'
# Remove non-deterministic information
find node_modules/ -mindepth 2 -type f -name 'package.json' -exec sed -i '/"_where": "/d' -- '{}' ';'
find node_modules/ -mindepth 2 -type f -name 'package.json' -exec sed -i '/"man": \[/,/\],/d' -- '{}' ';'
# Execution continues in .github/workflows/npm.yml or docs/tools/actions-artifacts.sh ...
