#!/bin/bash
# Execution starts in .github/workflows/npm.yml or .github/workflows/actions-artifacts.sh
export node_version=$(cat package.json | python -c "import sys, json; print(json.load(sys.stdin)['engines']['node'])")
export npm_version=$(cat bin/linux/x64/node/node-v$node_version-linux-x64/lib/node_modules/npm/package.json | python -c "import sys, json; print(json.load(sys.stdin)['version'])")
# Correct engines
sed -i "0,/\"npm\": \".*\"/s//\"npm\": \"$npm_version\"/" package.json
# Ignore devDependencies and bundleDependencies
sed -i '/"devDependencies": {/,/}/d' -- 'package.json'
sed -i -z 's|  "bundleDependencies": \[\n    ".*"\n  \]|  "bundleDependencies": \[\]|' -- 'package.json'
# Install
cat bin/linux/x64/node/node-v$node_version-linux-x64/bin/node.* > bin/linux/x64/node/node-v$node_version-linux-x64/bin/node
chmod +x bin/linux/x64/node/node-v$node_version-linux-x64/bin/node
bin/linux/x64/node/node-v$node_version-linux-x64/bin/node bin/linux/x64/node/node-v$node_version-linux-x64/lib/node_modules/npm/bin/npm-cli.js install --no-offline
rm bin/linux/x64/node/node-v$node_version-linux-x64/bin/node
rm -rf .npm/
# Dedupe
cat bin/linux/x64/node/node-v$node_version-linux-x64/bin/node.* > bin/linux/x64/node/node-v$node_version-linux-x64/bin/node
chmod +x bin/linux/x64/node/node-v$node_version-linux-x64/bin/node
bin/linux/x64/node/node-v$node_version-linux-x64/bin/node bin/linux/x64/node/node-v$node_version-linux-x64/lib/node_modules/npm/bin/npm-cli.js dedupe
rm bin/linux/x64/node/node-v$node_version-linux-x64/bin/node
rm -rf .npm/
git checkout -- 'package.json'
# Remove unnecessary files
find node_modules/ -mindepth 2 -type d \( -name '.github' -o -name 'benchmark' -o -name 'docs' -o -name 'example' -o -name 'examples' -o -name 'jsdoc-toolkit' -o -name 'man' -o -name 'tap-snapshots' -o -name 'test' -o -name 'tests' -o -name 'typings' \) | xargs rm -rf
find node_modules/ -mindepth 2 -type f \( -name '*.d.ts' -o -name '*.d.ts.map' -o -name '*.js.map' -o -name '.editorconfig' -o -name '.eslintignore' -o -name '.eslintrc' -o -name '.eslintrc.json' -o -name '.eslintrc.yml' -o -name '.gitattributes' -o -name '.gitmodules' -o -name '.licensee.json' -o -name '.mailmap' -o -name '.npmignore' -o -name '.nycrc' -o -name '.project' -o -name '.runkit_example.js' -o -name '.travis.yml' -o -name 'configure' -o -name 'Jenkinsfile' -o -name 'make.bat' -o -name 'Makefile' -o -name 'tsconfig.json' -o -name 'yarn.lock' \) -exec bash -c 'rm "$1"; rmdir --ignore-fail-on-non-empty $(dirname "$1")' bash '{}' ';'
rm -rf 'node_modules/electron-chrome-extensions/dist/types'
# Remove non-deterministic information
find node_modules/ -mindepth 2 -type f -name 'package.json' -exec sed -i '/"_where": "/d' -- '{}' ';'
find node_modules/ -mindepth 2 -type f -name 'package.json' -exec sed -i '/"man": \[/,/\],/d' -- '{}' ';'
# Fail if npm dependencies end up in the top level node_modules
if [[ -d 'node_modules/@npmcli' ]]; then
  echo "Bundled npm dependencies found outside of npm"
  exit 1
fi
# Execution continues in .github/workflows/npm.yml or .github/workflows/actions-artifacts.sh ...
