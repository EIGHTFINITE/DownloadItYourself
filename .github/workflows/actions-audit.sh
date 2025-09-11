#!/bin/bash
export node_version=$(cat package.json | python -c "import sys, json; print(json.load(sys.stdin)['engines']['node'])")
rm -r "bin/linux/x64/node/node-v$node_version-linux-x64/lib/node_modules/npm"
cp -aR "node_modules/npm" "bin/linux/x64/node/node-v$node_version-linux-x64/lib/node_modules"
sed -i '/cache-max = 0/d' -- '.npmrc'
sed -i '/only = prod/d' -- '.npmrc'
sed -i '/optional = false/d' -- '.npmrc'
sed -i '/production = true/d' -- '.npmrc'
export actions_PATH="$PATH"
export PATH="$(pwd)/bin/linux/x64/node/node-v$node_version-linux-x64/bin:$PATH"
bin/linux/x64/node/node-v$node_version-linux-x64/bin/node node_modules/better-npm-audit/index.js audit
export PATH="$actions_PATH"
rm -rf .npm/
git checkout -- '.npmrc'
export better_npm_audit_version=$(cat package.json | python -c "import sys, json; print(json.load(sys.stdin)['dependencies']['better-npm-audit'])")
export electron_version=$(cat package.json | python -c "import sys, json; print(json.load(sys.stdin)['devDependencies']['electron'])")
export lodash_isarray_version=$(cat package.json | python -c "import sys, json; print(json.load(sys.stdin)['optionalDependencies']['lodash.isarray'])")
# devDependencies and optionalDependencies
rm -r node_modules/
rm package-lock.json
# Ignore dependencies, devDependencies, optionalDependencies, peerDependencies, and bundleDependencies
sed -i '/"dependencies": {/,/}/d' -- 'package.json'
sed -i '/"devDependencies": {/,/}/d' -- 'package.json'
sed -i '/"optionalDependencies": {/,/}/d' -- 'package.json'
sed -i '/"peerDependencies": {/,/}/d' -- 'package.json'
sed -i -z 's|  "bundleDependencies": \[\n    ".*"\n  \]|  "bundleDependencies": \[\]|' -- 'package.json'
# Install
bin/linux/x64/node/node-v$node_version-linux-x64/bin/node bin/windows/x64/node/node-v$node_version-win-x64/node_modules/npm/bin/npm-cli.js install --no-offline "electron@$electron_version" "lodash.isarray@$lodash_isarray_version" "better-npm-audit@$better_npm_audit_version"
rm -rf .npm/
# Dedupe
bin/linux/x64/node/node-v$node_version-linux-x64/bin/node bin/windows/x64/node/node-v$node_version-win-x64/node_modules/npm/bin/npm-cli.js dedupe
rm -rf .npm/
# Audit
sed -i '/cache-max = 0/d' -- '.npmrc'
sed -i '/only = prod/d' -- '.npmrc'
sed -i '/optional = false/d' -- '.npmrc'
sed -i '/production = true/d' -- '.npmrc'
export actions_PATH="$PATH"
export PATH="$(pwd)/bin/linux/x64/node/node-v$node_version-linux-x64/bin:$PATH"
bin/linux/x64/node/node-v$node_version-linux-x64/bin/node node_modules/better-npm-audit/index.js audit
export PATH="$actions_PATH"
rm -rf .npm/
git checkout -- '.npmrc' 'package.json'
