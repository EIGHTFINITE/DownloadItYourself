#!/bin/bash
# Execution starts in .github/workflows/artifacts.yml
export GIT_AUTHOR_DATE="$(git log -1 --format=%aD)"
export GIT_COMMITTER_DATE="$(git log -1 --format=%cD)"

# JRE Linux x64
sed -i '/\/bin\//d' -- '.gitignore'
git checkout refs/tags/artifacts -- "bin/linux/x64/jre/jre-8u201-linux-x64"
rmdir "bin/linux/x64/jre/jre-8u201-linux-x64/jre1.8.0_201/lib/applet"
git submodule -q add -f https://github.com/EIGHTFINITE/void "bin/linux/x64/jre/jre-8u201-linux-x64/jre1.8.0_201/lib/applet"
git add -f ".gitmodules"
git -c user.name="GitHub" -c user.email="noreply@github.com" commit --author="github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>" -m"Add Linux x64 JRE 8u201 release artifacts

The fix for JDK-8155635 in 8u202 causes performance issues, so 8u201 becomes the final BCL release." | sed -n 1p
git checkout -- '.gitignore'
if [[ $(git status --porcelain | tee /dev/stderr | head -c1 | wc -c) -ne 0 || $(git clean -dffx | tee /dev/stderr | head -c1 | wc -c) -ne 0 ]]
  then exit 1
fi

# JRE Windows x64
sed -i '/\/bin\//d' -- '.gitignore'
git checkout refs/tags/artifacts -- "bin/windows/x64/jre/jre-8u201-windows-x64"
rmdir "bin/windows/x64/jre/jre-8u201-windows-x64/jre1.8.0_201/lib/applet"
git submodule -q add -f https://github.com/EIGHTFINITE/void "bin/windows/x64/jre/jre-8u201-windows-x64/jre1.8.0_201/lib/applet"
git add -f ".gitmodules"
git -c user.name="GitHub" -c user.email="noreply@github.com" commit --author="github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>" -m"Add Windows x64 JRE 8u201 release artifacts

The fix for JDK-8155635 in 8u202 causes performance issues, so 8u201 becomes the final BCL release." | sed -n 1p
git checkout -- '.gitignore'
if [[ $(git status --porcelain | tee /dev/stderr | head -c1 | wc -c) -ne 0 || $(git clean -dffx | tee /dev/stderr | head -c1 | wc -c) -ne 0 ]]
  then exit 1
fi

# 7z Windows x64
curl -sSo "7z2201-x64.exe" https://www.7-zip.org/a/7z2201-x64.exe
mkdir -p "bin/windows/x64/7z/7z2201-x64"
7z x -o"bin/windows/x64/7z/7z2201-x64" "7z2201-x64.exe" | grep "ing archive"
rm "7z2201-x64.exe"
rm "bin/windows/x64/7z/7z2201-x64/Uninstall.exe"
sed -i '/\/bin\//d' -- '.gitignore'
git add "bin/windows/x64/7z/7z2201-x64"
git -c user.name="GitHub" -c user.email="noreply@github.com" commit --author="github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>" -m"Add Windows x64 7z 22.01 release artifacts" | sed -n 1p
git checkout -- '.gitignore'
if [[ $(git status --porcelain | tee /dev/stderr | head -c1 | wc -c) -ne 0 || $(git clean -dffx | tee /dev/stderr | head -c1 | wc -c) -ne 0 ]]
  then exit 1
fi

# Node Linux x64
export node_version=$(cat package.json | python -c "import sys, json; print(json.load(sys.stdin)['engines']['node'])")
curl -sSo "node-v$node_version-linux-x64.tar.xz" https://nodejs.org/dist/v$node_version/node-v$node_version-linux-x64.tar.xz
mkdir -p "bin/linux/x64/node"
tar -xJf "node-v$node_version-linux-x64.tar.xz" -C "bin/linux/x64/node"
rm "node-v$node_version-linux-x64.tar.xz"
sed -i '/\/bin\//d' -- '.gitignore'
# Replace bundled npm with npm 6
# Later versions fail to create sane dependency trees
rm -r "bin/linux/x64/node/node-v$node_version-linux-x64/lib/node_modules/npm"
export npm_version=$(curl -sS 'https://registry.npmjs.org/npm' | python -c "import sys, json; print(json.load(sys.stdin)['dist-tags']['latest-6'])")
curl -sSo "npm-$npm_version.tgz" "https://registry.npmjs.org/npm/-/npm-$npm_version.tgz"
mkdir -p "bin/linux/x64/node/node-v$node_version-linux-x64/lib/node_modules/npm"
tar -xzf "npm-$npm_version.tgz" --strip-components=1 -C "bin/linux/x64/node/node-v$node_version-linux-x64/lib/node_modules/npm"
rm "npm-$npm_version.tgz"
find bin/linux/x64/node/node-v$node_version-linux-x64/lib/node_modules/ -mindepth 2 -type d \( -name '.github' -o -name 'docs' -o -name 'example' -o -name 'examples' -o -name 'jsdoc-toolkit' -o -name 'man' -o -name 'tap-snapshots' -o -name 'test' -o -name 'tests' -o -name 'typings' \) | xargs rm -rf
find bin/linux/x64/node/node-v$node_version-linux-x64/lib/node_modules/ -mindepth 2 -type f \( -name '*.d.ts' -o -name '*.d.ts.map' -o -name '*.js.map' -o -name '.editorconfig' -o -name '.eslintignore' -o -name '.eslintrc' -o -name '.eslintrc.json' -o -name '.eslintrc.yml' -o -name '.gitattributes' -o -name '.gitmodules' -o -name '.licensee.json' -o -name '.mailmap' -o -name '.npmignore' -o -name '.nycrc' -o -name '.project' -o -name '.runkit_example.js' -o -name '.travis.yml' -o -name 'configure' -o -name 'Jenkinsfile' -o -name 'make.bat' -o -name 'Makefile' -o -name 'yarn.lock' \) -exec bash -c 'rm "$1"; rmdir --ignore-fail-on-non-empty $(dirname "$1")' bash '{}' ';'
# Commit
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
# Replace bundled npm with npm 6
# Later versions fail to create sane dependency trees
rm -r "bin/windows/x64/node/node-v$node_version-win-x64/node_modules/npm"
curl -sSo "npm-$npm_version.tgz" "https://registry.npmjs.org/npm/-/npm-$npm_version.tgz"
mkdir -p "bin/windows/x64/node/node-v$node_version-win-x64/node_modules/npm"
tar -xzf "npm-$npm_version.tgz" --strip-components=1 -C "bin/windows/x64/node/node-v$node_version-win-x64/node_modules/npm"
rm "npm-$npm_version.tgz"
find bin/windows/x64/node/node-v$node_version-win-x64/node_modules/ -mindepth 2 -type d \( -name '.github' -o -name 'docs' -o -name 'example' -o -name 'examples' -o -name 'jsdoc-toolkit' -o -name 'man' -o -name 'tap-snapshots' -o -name 'test' -o -name 'tests' -o -name 'typings' \) | xargs rm -rf
find bin/windows/x64/node/node-v$node_version-win-x64/node_modules/ -mindepth 2 -type f \( -name '*.d.ts' -o -name '*.d.ts.map' -o -name '*.js.map' -o -name '.editorconfig' -o -name '.eslintignore' -o -name '.eslintrc' -o -name '.eslintrc.json' -o -name '.eslintrc.yml' -o -name '.gitattributes' -o -name '.gitmodules' -o -name '.licensee.json' -o -name '.mailmap' -o -name '.npmignore' -o -name '.nycrc' -o -name '.project' -o -name '.runkit_example.js' -o -name '.travis.yml' -o -name 'configure' -o -name 'Jenkinsfile' -o -name 'make.bat' -o -name 'Makefile' -o -name 'yarn.lock' \) -exec bash -c 'rm "$1"; rmdir --ignore-fail-on-non-empty $(dirname "$1")' bash '{}' ';'
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
# Ignore devDependencies, peerDependencies, and bundleDependencies
sed -i '/"devDependencies": {/,/}/d' -- 'package.json'
sed -i '/"peerDependencies": {/,/}/d' -- 'package.json'
sed -i -z 's|  "bundleDependencies": \[\n    ".*"\n  \]|  "bundleDependencies": \[\]|' -- 'package.json'
# Install
if [[ "$OSTYPE" == "msys" ]]; then
  bin/windows/x64/node/node-v$node_version-win-x64/node.exe bin/windows/x64/node/node-v$node_version-win-x64/node_modules/npm/bin/npm-cli.js install --no-offline "electron@$electron_version"
else
  bin/linux/x64/node/node-v$node_version-linux-x64/bin/node bin/linux/x64/node/node-v$node_version-linux-x64/lib/node_modules/npm/bin/npm-cli.js install --no-offline "electron@$electron_version"
fi
rm -rf .npm/
# Dedupe
if [[ "$OSTYPE" == "msys" ]]; then
  bin/windows/x64/node/node-v$node_version-win-x64/node.exe bin/windows/x64/node/node-v$node_version-win-x64/node_modules/npm/bin/npm-cli.js dedupe
else
  bin/linux/x64/node/node-v$node_version-linux-x64/bin/node bin/linux/x64/node/node-v$node_version-linux-x64/lib/node_modules/npm/bin/npm-cli.js dedupe
fi
rm -rf .npm/
bin/linux/x64/node/node-v$node_version-linux-x64/bin/node node_modules/electron/install.js
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
export return_commit="$(git log -1 --format=%H)"
git checkout -- '.gitignore'
if [[ $(git status --porcelain | tee /dev/stderr | head -c1 | wc -c) -ne 0 || $(git clean -dffx | tee /dev/stderr | head -c1 | wc -c) -ne 0 ]]
  then exit 1
fi

# Electron Windows x64
export npm_config_platform=win32
# Correct engines
sed -i "0,/\"npm\": \".*\"/s//\"npm\": \"$npm_version\"/" package.json
# Ignore devDependencies, peerDependencies, and bundleDependencies
sed -i '/"devDependencies": {/,/}/d' -- 'package.json'
sed -i '/"peerDependencies": {/,/}/d' -- 'package.json'
sed -i -z 's|  "bundleDependencies": \[\n    ".*"\n  \]|  "bundleDependencies": \[\]|' -- 'package.json'
# Install
if [[ "$OSTYPE" == "msys" ]]; then
  bin/windows/x64/node/node-v$node_version-win-x64/node.exe bin/windows/x64/node/node-v$node_version-win-x64/node_modules/npm/bin/npm-cli.js install --no-offline "electron@$electron_version"
else
  bin/linux/x64/node/node-v$node_version-linux-x64/bin/node bin/linux/x64/node/node-v$node_version-linux-x64/lib/node_modules/npm/bin/npm-cli.js install --no-offline "electron@$electron_version"
fi
rm -rf .npm/
# Dedupe
if [[ "$OSTYPE" == "msys" ]]; then
  bin/windows/x64/node/node-v$node_version-win-x64/node.exe bin/windows/x64/node/node-v$node_version-win-x64/node_modules/npm/bin/npm-cli.js dedupe
else
  bin/linux/x64/node/node-v$node_version-linux-x64/bin/node bin/linux/x64/node/node-v$node_version-linux-x64/lib/node_modules/npm/bin/npm-cli.js dedupe
fi
rm -rf .npm/
export npm_config_target=$(cat node_modules/electron/package.json | python -c "import sys, json; print(json.load(sys.stdin)['version'])")
bin/linux/x64/node/node-v$node_version-linux-x64/bin/node node_modules/electron/install.js
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
bash --noprofile --norc -e -o pipefail docs/tools/actions-npm.sh
sed -i '/\/node_modules\//d' -- '.gitignore'
find node_modules/ -mindepth 2 -maxdepth 3 -type f -name 'package.json' -exec bash -c 'path={}; git add -- "${path:0:-13}"; git -c user.name="GitHub" -c user.email="noreply@github.com" commit --author="github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>" -m"Add ${path:13:-13} release artifacts" | sed -n 1p' ';'
git add -f package-lock.json
# Execution continues in .github/workflows/artifacts.yml ...
