#!/bin/bash
# Execution starts in .github/workflows/artifacts.yml
export GIT_AUTHOR_DATE="$(git log -1 --format=%aD)"
export GIT_COMMITTER_DATE="$(git log -1 --format=%cD)"

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

# 7z Windows x64
wget -nv -O "7z2200-x64.exe" https://www.7-zip.org/a/7z2200-x64.exe
mkdir -p "bin/windows/x64/7z/7z2200-x64"
7z x -o"bin/windows/x64/7z/7z2200-x64" "7z2200-x64.exe" | grep "ing archive"
rm "7z2200-x64.exe"
rm "bin/windows/x64/7z/7z2200-x64/Uninstall.exe"
sed -i '/\/bin\//d' -- '.gitignore'
git add "bin/windows/x64/7z/7z2200-x64"
git -c user.name="GitHub" -c user.email="noreply@github.com" commit --author="github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>" -m"Add Windows x64 7z 19.00 release artifacts" | sed -n 1p
git checkout -- '.gitignore'
if [[ $(git status --porcelain | tee /dev/stderr | head -c1 | wc -c) -ne 0 || $(git clean -dffx | tee /dev/stderr | head -c1 | wc -c) -ne 0 ]]
  then exit 1
fi

# Node Windows x64
export node_version=$(cat package.json | python -c "import sys, json; print(json.load(sys.stdin)['engines']['node'])")
wget -nv -O "node-v$node_version-win-x64.7z" https://nodejs.org/dist/v$node_version/node-v$node_version-win-x64.7z
mkdir -p "bin/windows/x64/node"
7z x -o"bin/windows/x64/node" "node-v$node_version-win-x64.7z" | grep "ing archive"
rm -r "bin/windows/x64/node/node-v$node_version-win-x64/node_modules"
rm "node-v$node_version-win-x64.7z"
sed -i '/\/bin\//d' -- '.gitignore'
git add "bin/windows/x64/node"
git -c user.name="GitHub" -c user.email="noreply@github.com" commit --author="github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>" -m"Add Windows x64 Node $node_version release artifacts" | sed -n 1p
git checkout -- '.gitignore'
if [[ $(git status --porcelain | tee /dev/stderr | head -c1 | wc -c) -ne 0 || $(git clean -dffx | tee /dev/stderr | head -c1 | wc -c) -ne 0 ]]
  then exit 1
fi

# Node Linux x64
wget -nv -O "node-v$node_version-linux-x64.tar.xz" https://nodejs.org/dist/v$node_version/node-v$node_version-linux-x64.tar.xz
mkdir -p "bin/linux/x64/node"
tar -xJf "node-v$node_version-linux-x64.tar.xz" -C "bin/linux/x64/node"
rm -r "bin/linux/x64/node/node-v$node_version-linux-x64/lib"
rm "node-v$node_version-linux-x64.tar.xz"
sed -i '/\/bin\//d' -- '.gitignore'
git add "bin/linux/x64/node"
git -c user.name="GitHub" -c user.email="noreply@github.com" commit --author="github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>" -m"Add Linux x64 Node $node_version release artifacts" | sed -n 1p
git checkout -- '.gitignore'
if [[ $(git status --porcelain | tee /dev/stderr | head -c1 | wc -c) -ne 0 || $(git clean -dffx | tee /dev/stderr | head -c1 | wc -c) -ne 0 ]]
  then exit 1
fi

# Electron Windows x64
export force_no_cache=true
export npm_config_platform=win32
export npm_config_arch=x64
export npm_version=$(curl -sS 'https://registry.npmjs.org/npm' | python -c "import sys, json; print(json.load(sys.stdin)['dist-tags']['latest-6'])")
wget -nv -O "npm-$npm_version.tgz" "https://registry.npmjs.org/npm/-/npm-$npm_version.tgz"
mkdir -p "bin/all/all/npm/npm-$npm_version/npm"
tar -xzf "npm-$npm_version.tgz" --strip-components=1 -C "bin/all/all/npm/npm-$npm_version/npm"
rm "npm-$npm_version.tgz"
sed -i "0,/\"npm\": \".*\"/s//\"npm\": \"$(cat bin/all/all/npm/npm-$npm_version/npm/package.json | python -c "import sys, json; print(json.load(sys.stdin)['version'])")\"/" package.json
bin/linux/x64/node/node-v$node_version-linux-x64/bin/node bin/all/all/npm/npm-$npm_version/npm/bin/npm-cli.js install --no-offline electron@$(cat package.json | python -c "import sys, json; print(json.load(sys.stdin)['devDependencies']['electron'])")
rm -rf .npm/
export npm_config_target=$(cat node_modules/electron/package.json | python -c "import sys, json; print(json.load(sys.stdin)['version'])")
bin/linux/x64/node/node-v$node_version-linux-x64/bin/node bin/all/all/npm/npm-$npm_version/npm/bin/npm-cli.js dedupe
rm -rf .npm/
rm -r node_modules/@types/
bin/linux/x64/node/node-v$node_version-linux-x64/bin/node bin/all/all/npm/npm-$npm_version/npm/bin/npm-cli.js dedupe
rm -rf .npm/
bin/linux/x64/node/node-v$node_version-linux-x64/bin/node node_modules/electron/install.js
mkdir -p "bin/windows/x64/electron/electron-v$npm_config_target-win32-x64"
mv -T node_modules/electron/dist "bin/windows/x64/electron/electron-v$npm_config_target-win32-x64"
rm -r bin/all/
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

# Electron Linux x64
export npm_config_platform=linux
wget -nv -O "npm-$npm_version.tgz" "https://registry.npmjs.org/npm/-/npm-$npm_version.tgz"
mkdir -p "bin/all/all/npm/npm-$npm_version/npm"
tar -xzf "npm-$npm_version.tgz" --strip-components=1 -C "bin/all/all/npm/npm-$npm_version/npm"
rm "npm-$npm_version.tgz"
sed -i "0,/\"npm\": \".*\"/s//\"npm\": \"$(cat bin/all/all/npm/npm-$npm_version/npm/package.json | python -c "import sys, json; print(json.load(sys.stdin)['version'])")\"/" package.json
bin/linux/x64/node/node-v$node_version-linux-x64/bin/node bin/all/all/npm/npm-$npm_version/npm/bin/npm-cli.js install --no-offline electron@$(cat package.json | python -c "import sys, json; print(json.load(sys.stdin)['devDependencies']['electron'])")
rm -rf .npm/
bin/linux/x64/node/node-v$node_version-linux-x64/bin/node bin/all/all/npm/npm-$npm_version/npm/bin/npm-cli.js dedupe
rm -rf .npm/
rm -r node_modules/@types/
bin/linux/x64/node/node-v$node_version-linux-x64/bin/node bin/all/all/npm/npm-$npm_version/npm/bin/npm-cli.js dedupe
rm -rf .npm/
bin/linux/x64/node/node-v$node_version-linux-x64/bin/node node_modules/electron/install.js
mkdir -p "bin/linux/x64/electron/electron-v$npm_config_target-linux-x64"
mv -T node_modules/electron/dist "bin/linux/x64/electron/electron-v$npm_config_target-linux-x64"
rm -r bin/all/
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

# Node modules
wget -nv -O "npm-$npm_version.tgz" "https://registry.npmjs.org/npm/-/npm-$npm_version.tgz"
mkdir -p "bin/all/all/npm/npm-$npm_version/npm"
tar -xzf "npm-$npm_version.tgz" --strip-components=1 -C "bin/all/all/npm/npm-$npm_version/npm"
rm "npm-$npm_version.tgz"
sed -i "0,/\"npm\": \".*\"/s//\"npm\": \"$(cat bin/all/all/npm/npm-$npm_version/npm/package.json | python -c "import sys, json; print(json.load(sys.stdin)['version'])")\"/" package.json
echo -n "$node_version" > node_version.txt
echo -n "$npm_version" > npm_version.txt
bash --noprofile --norc -e -o pipefail docs/tools/actions-npm.sh
sed -i '/\/node_modules\//d' -- '.gitignore'
find node_modules/ -mindepth 2 -maxdepth 3 -type f -name 'package.json' -exec bash -c 'path={}; git add -- "${path:0:-13}"; git -c user.name="GitHub" -c user.email="noreply@github.com" commit --author="github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>" -m"Add ${path:13:-13} release artifacts" | sed -n 1p' ';'
git add -f package-lock.json
git -c user.name="GitHub" -c user.email="noreply@github.com" commit --author="github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>" -m"package-lock.json" | sed -n 1p
export merge_commit="$(git log -1 --format=%H)"
git checkout -- '.gitignore'
if [[ $(git status --porcelain | tee /dev/stderr | head -c1 | wc -c) -ne 0 || $(git clean -dffx | tee /dev/stderr | head -c1 | wc -c) -ne 0 ]]
  then exit 1
fi
git reset --hard $return_commit
git clean -dffx
git -c user.name="GitHub" -c user.email="noreply@github.com" merge --no-ff --no-edit $merge_commit~ | sed -n 1p
if [[ "$(git log -1 --format=%H)" == "$return_commit" ]]; then
  exit 1
fi
git checkout $merge_commit -- 'package-lock.json'
# Execution continues in .github/workflows/artifacts.yml ...
