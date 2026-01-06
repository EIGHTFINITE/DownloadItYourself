#!/bin/bash
export node_version=$(cat package.json | python -c "import sys, json; print(json.load(sys.stdin)['engines']['node'])")
export npm_version=$(cat bin/linux/x64/node/node-v$node_version-linux-x64/lib/node_modules/npm/package.json | python -c "import sys, json; print(json.load(sys.stdin)['version'])")
new_npm_version=$(cat bin/windows/x64/node/node-v$node_version-win-x64/node_modules/npm/package.json | python -c "import sys, json; print(json.load(sys.stdin)['version'])")
# Swap npm versions
# Keeping this swap in actions means we can audit freely on real Windows machines
mv -T "bin/linux/x64/node/node-v$node_version-linux-x64/lib/node_modules/npm" "bin/linux/x64/node/node-v$node_version-linux-x64/lib/node_modules/npm-temp"
mv -T "bin/windows/x64/node/node-v$node_version-win-x64/node_modules/npm" "bin/linux/x64/node/node-v$node_version-linux-x64/lib/node_modules/npm"
mv -T "bin/linux/x64/node/node-v$node_version-linux-x64/lib/node_modules/npm-temp" "bin/windows/x64/node/node-v$node_version-win-x64/node_modules/npm"
cat bin/linux/x64/node/node-v$node_version-linux-x64/bin/node.* > bin/linux/x64/node/node-v$node_version-linux-x64/bin/node
chmod +x bin/linux/x64/node/node-v$node_version-linux-x64/bin/node
# Install
bin/linux/x64/node/node-v$node_version-linux-x64/bin/node bin/windows/x64/node/node-v$node_version-win-x64/node_modules/npm/bin/npm-cli.js install --no-offline "corepack@$corepack_version" "electron@$electron_version" "eslint@$eslint_version" "jquery@$jquery_version" "neostandard@$neostandard_version" "npm@$new_npm_version" "npm-6@npm:npm@$npm_version" "better-npm-audit@$better_npm_audit_version"
rm -rf .npm/
# Audit
sed -i '/cache-max = 0/d' -- '.npmrc'
sed -i '/only = prod/d' -- '.npmrc'
sed -i '/optional = false/d' -- '.npmrc'
sed -i '/production = true/d' -- '.npmrc'
actions_PATH="$PATH"
export PATH="$(pwd)/bin/linux/x64/node/node-v$node_version-linux-x64/bin:$PATH"
bin/linux/x64/node/node-v$node_version-linux-x64/bin/node node_modules/better-npm-audit/index.js audit
export PATH="$actions_PATH"
rm -rf .npm/
rm -r node_modules/
rm package-lock.json
git checkout -- '.npmrc'
better_npm_audit_version=$(cat package.json | python -c "import sys, json; print(json.load(sys.stdin)['devDependencies']['better-npm-audit'])")
corepack_version=$(cat package.json | python -c "import sys, json; print(json.load(sys.stdin)['devDependencies']['corepack'])")
electron_version=$(cat package.json | python -c "import sys, json; print(json.load(sys.stdin)['devDependencies']['electron'])")
eslint_version=$(cat package.json | python -c "import sys, json; print(json.load(sys.stdin)['devDependencies']['eslint'])")
jquery_version=$(cat package.json | python -c "import sys, json; print(json.load(sys.stdin)['optionalDependencies']['jquery'])")
neostandard_version=$(cat package.json | python -c "import sys, json; print(json.load(sys.stdin)['devDependencies']['neostandard'])")
# Ignore dependencies, devDependencies, optionalDependencies, peerDependencies, and bundleDependencies
sed -i '/"dependencies": {/,/}/d' -- 'package.json'
sed -i '/"devDependencies": {/,/}/d' -- 'package.json'
sed -i '/"optionalDependencies": {/,/}/d' -- 'package.json'
sed -i '/"peerDependencies": {/,/}/d' -- 'package.json'
sed -i -z 's|  "bundleDependencies": \[\n    ".*"\n  \]|  "bundleDependencies": \[\]|' -- 'package.json'
# Install
bin/linux/x64/node/node-v$node_version-linux-x64/bin/node bin/windows/x64/node/node-v$node_version-win-x64/node_modules/npm/bin/npm-cli.js install --no-offline "corepack@$corepack_version" "electron@$electron_version" "eslint@$eslint_version" "jquery@$jquery_version" "neostandard@$neostandard_version" "npm@$new_npm_version" "npm-6@npm:npm@$npm_version" "better-npm-audit@$better_npm_audit_version"
rm -rf .npm/
# Dedupe
bin/linux/x64/node/node-v$node_version-linux-x64/bin/node bin/windows/x64/node/node-v$node_version-win-x64/node_modules/npm/bin/npm-cli.js dedupe
rm -rf .npm/
# Audit
sed -i '/cache-max = 0/d' -- '.npmrc'
sed -i '/only = prod/d' -- '.npmrc'
sed -i '/optional = false/d' -- '.npmrc'
sed -i '/production = true/d' -- '.npmrc'
actions_PATH="$PATH"
export PATH="$(pwd)/bin/linux/x64/node/node-v$node_version-linux-x64/bin:$PATH"
bin/linux/x64/node/node-v$node_version-linux-x64/bin/node node_modules/better-npm-audit/index.js audit
export PATH="$actions_PATH"
rm bin/linux/x64/node/node-v$node_version-linux-x64/bin/node
rm -rf .npm/
rm -r node_modules/
rm package-lock.json
git checkout -- '.npmrc' 'package.json'
