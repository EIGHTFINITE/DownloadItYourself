#!/bin/bash
# Execution starts in .github/workflows/npm.yml or .github/workflows/actions-artifacts.sh
node_version=$(cat package.json | python -c "import sys, json; print(json.load(sys.stdin)['engines']['node'])")
npm_version=$(cat bin/linux/x64/node/node-v$node_version-linux-x64/lib/node_modules/npm/package.json | python -c "import sys, json; print(json.load(sys.stdin)['version'])")
# Correct engines
sed -i "0,/\"npm\": \".*\"/s//\"npm\": \"$npm_version\"/" package.json
# Ignore devDependencies and bundleDependencies
sed -i '/"devDependencies": {/,/}/d' -- 'package.json'
sed -i -z 's|  "bundleDependencies": \[\n    ".*"\n  \]|  "bundleDependencies": \[\]|' -- 'package.json'
# Install
cat bin/linux/x64/node/node-v$node_version-linux-x64/bin/node.* > bin/linux/x64/node/node-v$node_version-linux-x64/bin/node
chmod +x bin/linux/x64/node/node-v$node_version-linux-x64/bin/node
bin/linux/x64/node/node-v$node_version-linux-x64/bin/node bin/linux/x64/node/node-v$node_version-linux-x64/lib/node_modules/npm/bin/npm-cli.js install --no-offline
rm -rf .npm/
# Dedupe
bin/linux/x64/node/node-v$node_version-linux-x64/bin/node bin/linux/x64/node/node-v$node_version-linux-x64/lib/node_modules/npm/bin/npm-cli.js dedupe
rm bin/linux/x64/node/node-v$node_version-linux-x64/bin/node
rm -rf .npm/
git checkout -- 'package.json'
# Remove unnecessary files
bash --noprofile --norc -e -o pipefail .github/workflows/actions-clean-files.sh
# Fail if npm dependencies end up in the top level node_modules
if [[ -d 'node_modules/@npmcli' ]]; then
  echo "Bundled npm dependencies found outside of npm"
  exit 1
fi
# Execution continues in .github/workflows/npm.yml or .github/workflows/actions-artifacts.sh ...
