#!/bin/bash
# Execution starts in .github/workflows/artifacts.yml
export GIT_AUTHOR_DATE="$(git log -1 --format=%aD)"
export GIT_COMMITTER_DATE="$(git log -1 --format=%cD)"

# 7z Windows x64
p7zip_version=$(cat downloadlist.json | python -c "import sys, json; print(json.load(sys.stdin)['config']['p7zip-version'])")
curl -sSLo "7z$p7zip_version-x64.exe" https://www.7-zip.org/a/7z$p7zip_version-x64.exe
mkdir -p "bin/windows/x64/7z/7z$p7zip_version-x64"
7z x -o"bin/windows/x64/7z/7z$p7zip_version-x64" "7z$p7zip_version-x64.exe" | grep "ing archive"
rm "7z$p7zip_version-x64.exe"
rm "bin/windows/x64/7z/7z$p7zip_version-x64/Uninstall.exe"
sed -i '/\/bin\//d' -- '.gitignore'
git add "bin/windows/x64/7z/7z$p7zip_version-x64"
git -c user.name="GitHub" -c user.email="noreply@github.com" commit --author="github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>" -m"Add Windows x64 7z $p7zip_version release artifacts" | sed -n 1p
git checkout -- '.gitignore'
if [[ $(git status --porcelain | tee /dev/stderr | head -c1 | wc -c) -ne 0 || $(git clean -dffx | tee /dev/stderr | head -c1 | wc -c) -ne 0 ]]
  then exit 1
fi

# uBlock Origin
ublock_origin_version=$(cat downloadlist.json | python -c "import sys, json; print(json.load(sys.stdin)['config']['ublock-origin-version'])")
curl -sSLo "uBlock0_$ublock_origin_version.chromium.zip" --header "Authorization: token $GITHUB_TOKEN" https://github.com/gorhill/uBlock/releases/download/$ublock_origin_version/uBlock0_$ublock_origin_version.chromium.zip
mkdir -p "extensions"
7z x -o"extensions" "uBlock0_$ublock_origin_version.chromium.zip" | grep "ing archive"
rm "uBlock0_$ublock_origin_version.chromium.zip"
sed -i '/\/extensions\//d' -- '.gitignore'
git add "extensions/uBlock0.chromium"
git -c user.name="GitHub" -c user.email="noreply@github.com" commit --author="github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>" -m"Add uBlock Origin $ublock_origin_version release artifacts" | sed -n 1p
git checkout -- '.gitignore'
if [[ $(git status --porcelain | tee /dev/stderr | head -c1 | wc -c) -ne 0 || $(git clean -dffx | tee /dev/stderr | head -c1 | wc -c) -ne 0 ]]
  then exit 1
fi

# Node Linux x64
export node_version=$(cat package.json | python -c "import sys, json; print(json.load(sys.stdin)['engines']['node'])")
corepack_version=$(cat package.json | python -c "import sys, json; print(json.load(sys.stdin)['devDependencies']['corepack'])")
curl -sSo "node-v$node_version-linux-x64.tar.xz" https://nodejs.org/dist/v$node_version/node-v$node_version-linux-x64.tar.xz
mkdir -p "bin/linux/x64/node"
tar -xJf "node-v$node_version-linux-x64.tar.xz" -C "bin/linux/x64/node"
rm "node-v$node_version-linux-x64.tar.xz"
sed -i '/\/bin\//d' -- '.gitignore'
# Replace bundled npm with npm 6
# Later versions fail to create sane dependency trees
export npm_version=$(curl -sS 'https://registry.npmjs.org/npm' | python -c "import sys, json; print(json.load(sys.stdin)['dist-tags']['latest-6'])")
curl -sSo "npm-$npm_version.tgz" "https://registry.npmjs.org/npm/-/npm-$npm_version.tgz"
rm -r "bin/linux/x64/node/node-v$node_version-linux-x64/lib/node_modules/npm"
mkdir "bin/linux/x64/node/node-v$node_version-linux-x64/lib/node_modules/npm"
tar -xzf "npm-$npm_version.tgz" --strip-components=1 -C "bin/linux/x64/node/node-v$node_version-linux-x64/lib/node_modules/npm"
rm "npm-$npm_version.tgz"
# Correct engines
sed -i "0,/\"npm\": \".*\"/s//\"npm\": \"$npm_version\"/" package.json
# Ignore dependencies, devDependencies, peerDependencies, and bundleDependencies
sed -i '/"dependencies": {/,/}/d' -- 'package.json'
sed -i '/"devDependencies": {/,/}/d' -- 'package.json'
sed -i '/"peerDependencies": {/,/}/d' -- 'package.json'
sed -i -z 's|  "bundleDependencies": \[\n    ".*"\n  \]|  "bundleDependencies": \[\]|' -- 'package.json'
# Reinstall to fix dependency tree and update the package.json with the latest information from the registry
bin/linux/x64/node/node-v$node_version-linux-x64/bin/node bin/linux/x64/node/node-v$node_version-linux-x64/lib/node_modules/npm/bin/npm-cli.js install --no-offline "corepack@$corepack_version" "npm@$npm_version"
rm -rf .npm/
# Dedupe
bin/linux/x64/node/node-v$node_version-linux-x64/bin/node bin/linux/x64/node/node-v$node_version-linux-x64/lib/node_modules/npm/bin/npm-cli.js dedupe
rm -rf .npm/
# Remove unnecessary files
bash --noprofile --norc -e -o pipefail .github/workflows/actions-clean-files.sh
# Reset workspace
rm -r "bin/linux/x64/node/node-v$node_version-linux-x64/lib/node_modules"
mv -T "node_modules" "bin/linux/x64/node/node-v$node_version-linux-x64/lib/node_modules"
sed -i "0,/\"name\": \".*\"/s//\"name\": \"node\"/" -- package-lock.json
sed -i "0,/\"version\": \".*\"/s//\"version\": \"$node_version\"/" -- package-lock.json
mv package-lock.json "bin/linux/x64/node/node-v$node_version-linux-x64/lib/package-lock.json"
git checkout -- 'package.json'
# Commit
if [[ $(stat -c%s "bin/linux/x64/node/node-v$node_version-linux-x64/bin/node") -gt 104857600 ]]; then
  split -b 104857600 --numeric-suffixes=1 --suffix-length=3 bin/linux/x64/node/node-v$node_version-linux-x64/bin/node "bin/linux/x64/node/node-v$node_version-linux-x64/bin/node."
  rm bin/linux/x64/node/node-v$node_version-linux-x64/bin/node
fi
git add "bin/linux/x64/node/node-v$node_version-linux-x64"
git -c user.name="GitHub" -c user.email="noreply@github.com" commit --author="github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>" -m"Add Linux x64 Node $node_version release artifacts" | sed -n 1p
git checkout -- '.gitignore'
if [[ $(git status --porcelain | tee /dev/stderr | head -c1 | wc -c) -ne 0 || $(git clean -dffx | tee /dev/stderr | head -c1 | wc -c) -ne 0 ]]
  then exit 1
fi

# Node Windows x64
curl -sSo "node-v$node_version-win-x64.7z" https://nodejs.org/dist/v$node_version/node-v$node_version-win-x64.7z
mkdir -p "bin/windows/x64/node"
7z x -o"bin/windows/x64/node" "node-v$node_version-win-x64.7z" | grep "ing archive"
rm "node-v$node_version-win-x64.7z"
sed -i '/\/bin\//d' -- '.gitignore'
# Replace bundled npm with npm latest
# Install npm latest with npm 6 because later versions fail to create sane dependency trees
rm -r "bin/windows/x64/node/node-v$node_version-win-x64/node_modules/npm"
mkdir "bin/windows/x64/node/node-v$node_version-win-x64/node_modules/npm"
# Correct engines
sed -i "0,/\"npm\": \".*\"/s//\"npm\": \"$npm_version\"/" package.json
# Ignore dependencies, devDependencies, peerDependencies, and bundleDependencies
sed -i '/"dependencies": {/,/}/d' -- 'package.json'
sed -i '/"devDependencies": {/,/}/d' -- 'package.json'
sed -i '/"peerDependencies": {/,/}/d' -- 'package.json'
sed -i -z 's|  "bundleDependencies": \[\n    ".*"\n  \]|  "bundleDependencies": \[\]|' -- 'package.json'
# Reinstall to fix dependency tree and update the package.json with the latest information from the registry
export npm_version=$(curl -sS 'https://registry.npmjs.org/npm' | python -c "import sys, json; print(json.load(sys.stdin)['dist-tags']['latest'])")
cat bin/linux/x64/node/node-v$node_version-linux-x64/bin/node.* > bin/linux/x64/node/node-v$node_version-linux-x64/bin/node
chmod +x bin/linux/x64/node/node-v$node_version-linux-x64/bin/node
bin/linux/x64/node/node-v$node_version-linux-x64/bin/node bin/linux/x64/node/node-v$node_version-linux-x64/lib/node_modules/npm/bin/npm-cli.js install --no-offline "corepack@$corepack_version" "npm@$npm_version"
rm -rf .npm/
# Dedupe
bin/linux/x64/node/node-v$node_version-linux-x64/bin/node bin/linux/x64/node/node-v$node_version-linux-x64/lib/node_modules/npm/bin/npm-cli.js dedupe
rm bin/linux/x64/node/node-v$node_version-linux-x64/bin/node
rm -rf .npm/
# Remove unnecessary files
bash --noprofile --norc -e -o pipefail .github/workflows/actions-clean-files.sh
# Reset workspace
rm -r "bin/windows/x64/node/node-v$node_version-win-x64/node_modules"
mv -T "node_modules" "bin/windows/x64/node/node-v$node_version-win-x64/node_modules"
sed -i "0,/\"name\": \".*\"/s//\"name\": \"node\"/" -- package-lock.json
sed -i "0,/\"version\": \".*\"/s//\"version\": \"$node_version\"/" -- package-lock.json
mv package-lock.json "bin/windows/x64/node/node-v$node_version-win-x64/package-lock.json"
git checkout -- 'package.json'
# Commit
git add "bin/windows/x64/node/node-v$node_version-win-x64"
git -c user.name="GitHub" -c user.email="noreply@github.com" commit --author="github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>" -m"Add Windows x64 Node $node_version release artifacts" | sed -n 1p
git checkout -- '.gitignore'
if [[ $(git status --porcelain | tee /dev/stderr | head -c1 | wc -c) -ne 0 || $(git clean -dffx | tee /dev/stderr | head -c1 | wc -c) -ne 0 ]]
  then exit 1
fi

# Electron Linux x64
export force_no_cache=true
export npm_config_platform=linux
export npm_config_arch=x64
export electron_version=$(cat package.json | python -c "import sys, json; print(json.load(sys.stdin)['devDependencies']['electron'])")
# Correct engines
sed -i "0,/\"npm\": \".*\"/s//\"npm\": \"$npm_version\"/" package.json
# Ignore dependencies, devDependencies, peerDependencies, and bundleDependencies
sed -i '/"dependencies": {/,/}/d' -- 'package.json'
sed -i '/"devDependencies": {/,/}/d' -- 'package.json'
sed -i '/"peerDependencies": {/,/}/d' -- 'package.json'
sed -i -z 's|  "bundleDependencies": \[\n    ".*"\n  \]|  "bundleDependencies": \[\]|' -- 'package.json'
# Install
cat bin/linux/x64/node/node-v$node_version-linux-x64/bin/node.* > bin/linux/x64/node/node-v$node_version-linux-x64/bin/node
chmod +x bin/linux/x64/node/node-v$node_version-linux-x64/bin/node
bin/linux/x64/node/node-v$node_version-linux-x64/bin/node bin/linux/x64/node/node-v$node_version-linux-x64/lib/node_modules/npm/bin/npm-cli.js install --no-offline "electron@$electron_version"
rm -rf .npm/
# Dedupe
bin/linux/x64/node/node-v$node_version-linux-x64/bin/node bin/linux/x64/node/node-v$node_version-linux-x64/lib/node_modules/npm/bin/npm-cli.js dedupe
rm -rf .npm/
export npm_config_target=$(cat node_modules/electron/package.json | python -c "import sys, json; print(json.load(sys.stdin)['version'])")
bin/linux/x64/node/node-v$node_version-linux-x64/bin/node "node_modules/electron/install.js"
rm bin/linux/x64/node/node-v$node_version-linux-x64/bin/node
mkdir -p "bin/linux/x64/electron/electron-v$npm_config_target-linux-x64"
mv -T node_modules/electron/dist "bin/linux/x64/electron/electron-v$npm_config_target-linux-x64"
rm -r node_modules/
rm package-lock.json
git checkout -- 'package.json'
if [[ $(stat -c%s "bin/linux/x64/electron/electron-v$npm_config_target-linux-x64/electron") -gt 104857600 ]]; then
  split -b 104857600 --numeric-suffixes=1 --suffix-length=3 "bin/linux/x64/electron/electron-v$npm_config_target-linux-x64/electron" "bin/linux/x64/electron/electron-v$npm_config_target-linux-x64/electron."
  rm "bin/linux/x64/electron/electron-v$npm_config_target-linux-x64/electron"
fi
if [[ $(stat -c%s "bin/linux/x64/electron/electron-v$npm_config_target-linux-x64/libvk_swiftshader.so") -gt 104857600 ]]; then
  split -b 104857600 --numeric-suffixes=1 --suffix-length=3 "bin/linux/x64/electron/electron-v$npm_config_target-linux-x64/libvk_swiftshader.so" "bin/linux/x64/electron/electron-v$npm_config_target-linux-x64/libvk_swiftshader.so."
  rm "bin/linux/x64/electron/electron-v$npm_config_target-linux-x64/libvk_swiftshader.so"
fi
sed -i '/\/bin\//d' -- '.gitignore'
git add "bin/linux/x64/electron"
git -c user.name="GitHub" -c user.email="noreply@github.com" commit --author="github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>" -m"Add Linux x64 Electron $npm_config_target release artifacts" | sed -n 1p
git checkout -- '.gitignore'
if [[ $(git status --porcelain | tee /dev/stderr | head -c1 | wc -c) -ne 0 || $(git clean -dffx | tee /dev/stderr | head -c1 | wc -c) -ne 0 ]]
  then exit 1
fi

# Electron Windows x64
export npm_config_platform=win32
# Correct engines
sed -i "0,/\"npm\": \".*\"/s//\"npm\": \"$npm_version\"/" package.json
# Ignore dependencies, devDependencies, peerDependencies, and bundleDependencies
sed -i '/"dependencies": {/,/}/d' -- 'package.json'
sed -i '/"devDependencies": {/,/}/d' -- 'package.json'
sed -i '/"peerDependencies": {/,/}/d' -- 'package.json'
sed -i -z 's|  "bundleDependencies": \[\n    ".*"\n  \]|  "bundleDependencies": \[\]|' -- 'package.json'
# Install
cat bin/linux/x64/node/node-v$node_version-linux-x64/bin/node.* > bin/linux/x64/node/node-v$node_version-linux-x64/bin/node
chmod +x bin/linux/x64/node/node-v$node_version-linux-x64/bin/node
bin/linux/x64/node/node-v$node_version-linux-x64/bin/node bin/linux/x64/node/node-v$node_version-linux-x64/lib/node_modules/npm/bin/npm-cli.js install --no-offline "electron@$electron_version"
rm -rf .npm/
# Dedupe
bin/linux/x64/node/node-v$node_version-linux-x64/bin/node bin/linux/x64/node/node-v$node_version-linux-x64/lib/node_modules/npm/bin/npm-cli.js dedupe
rm -rf .npm/
bin/linux/x64/node/node-v$node_version-linux-x64/bin/node "node_modules/electron/install.js"
rm bin/linux/x64/node/node-v$node_version-linux-x64/bin/node
mkdir -p "bin/windows/x64/electron/electron-v$npm_config_target-win32-x64"
mv -T node_modules/electron/dist "bin/windows/x64/electron/electron-v$npm_config_target-win32-x64"
rm -r node_modules/
rm package-lock.json
git checkout -- 'package.json'
if [[ $(stat -c%s "bin/windows/x64/electron/electron-v$npm_config_target-win32-x64/electron.exe") -gt 104857600 ]]; then
  split -b 104857600 --numeric-suffixes=1 --suffix-length=3 "bin/windows/x64/electron/electron-v$npm_config_target-win32-x64/electron.exe" "bin/windows/x64/electron/electron-v$npm_config_target-win32-x64/electron.exe."
  rm "bin/windows/x64/electron/electron-v$npm_config_target-win32-x64/electron.exe"
fi
sed -i '/\/bin\//d' -- '.gitignore'
git add "bin/windows/x64/electron"
git -c user.name="GitHub" -c user.email="noreply@github.com" commit --author="github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>" -m"Add Windows x64 Electron $npm_config_target release artifacts" | sed -n 1p
git checkout -- '.gitignore'
if [[ $(git status --porcelain | tee /dev/stderr | head -c1 | wc -c) -ne 0 || $(git clean -dffx | tee /dev/stderr | head -c1 | wc -c) -ne 0 ]]
  then exit 1
fi

# Node modules
bash --noprofile --norc -e -o pipefail .github/workflows/actions-npm.sh
sed -i '/\/node_modules\//d' -- '.gitignore'
find node_modules/ -mindepth 2 -maxdepth 3 -type f -name 'package.json' -exec bash -c 'path={}; git add -- "${path:0:-13}"; git -c user.name="GitHub" -c user.email="noreply@github.com" commit --author="github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>" -m"Add ${path:13:-13} release artifacts" | sed -n 1p' ';'
git add -f package-lock.json
# Execution continues in .github/workflows/artifacts.yml ...
