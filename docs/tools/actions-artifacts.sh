#!/bin/bash
# Execution starts in .github/workflows/artifacts.yml
export GIT_AUTHOR_DATE="$(git log -1 --format=%aD)"
export GIT_COMMITTER_DATE="$(git log -1 --format=%cD)"

# JRE Windows x86
sed -i '/\/bin\//d' -- '.gitignore'
git checkout refs/tags/artifacts -- "bin/windows/x86/jre/jre-8u201-windows-i586"
rmdir "bin/windows/x86/jre/jre-8u201-windows-i586/jre1.8.0_201/lib/applet"
git submodule add -f https://github.com/EIGHTFINITE/void "bin/windows/x86/jre/jre-8u201-windows-i586/jre1.8.0_201/lib/applet"
git add -f ".gitmodules"
git -c user.name="GitHub" -c user.email="noreply@github.com" commit --author="github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>" -m"Add Windows x86 JRE 8u201 release artifacts

The fix for JDK-8155635 in 8u202 causes performance issues, so 8u201 becomes the final BCL release." | sed -n 1p
git checkout -- '.gitignore'
if [[ $(git status --porcelain | tee /dev/stderr | head -c1 | wc -c) -ne 0 || $(git clean -dffx | tee /dev/stderr | head -c1 | wc -c) -ne 0 ]]
  then exit 1
fi

# JRE Windows x64
sed -i '/\/bin\//d' -- '.gitignore'
git checkout refs/tags/artifacts -- "bin/windows/x64/jre/jre-8u201-windows-x64"
rmdir "bin/windows/x64/jre/jre-8u201-windows-x64/jre1.8.0_201/lib/applet"
git submodule add -f https://github.com/EIGHTFINITE/void "bin/windows/x64/jre/jre-8u201-windows-x64/jre1.8.0_201/lib/applet"
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
git submodule add -f https://github.com/EIGHTFINITE/void "bin/linux/x64/jre/jre-8u201-linux-x64/jre1.8.0_201/lib/applet"
git add -f ".gitmodules"
git -c user.name="GitHub" -c user.email="noreply@github.com" commit --author="github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>" -m"Add Linux x64 JRE 8u201 release artifacts

The fix for JDK-8155635 in 8u202 causes performance issues, so 8u201 becomes the final BCL release." | sed -n 1p
git checkout -- '.gitignore'
if [[ $(git status --porcelain | tee /dev/stderr | head -c1 | wc -c) -ne 0 || $(git clean -dffx | tee /dev/stderr | head -c1 | wc -c) -ne 0 ]]
  then exit 1
fi

# 7z Windows x86
wget -nv -O "7z1900.exe" https://www.7-zip.org/a/7z1900.exe
mkdir -p "bin/windows/x86/7z/7z1900"
7z x -o"bin/windows/x86/7z/7z1900" "7z1900.exe" | grep "ing archive"
rm "7z1900.exe"
rm "bin/windows/x86/7z/7z1900/Uninstall.exe"
sed -i '/\/bin\//d' -- '.gitignore'
git add "bin/windows/x86/7z/7z1900"
git -c user.name="GitHub" -c user.email="noreply@github.com" commit --author="github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>" -m"Add Windows x86 7z 19.00 release artifacts" | sed -n 1p
git checkout -- '.gitignore'
if [[ $(git status --porcelain | tee /dev/stderr | head -c1 | wc -c) -ne 0 || $(git clean -dffx | tee /dev/stderr | head -c1 | wc -c) -ne 0 ]]
  then exit 1
fi

# 7z Windows x64
wget -nv -O "7z1900-x64.exe" https://www.7-zip.org/a/7z1900-x64.exe
mkdir -p "bin/windows/x64/7z/7z1900-x64"
7z x -o"bin/windows/x64/7z/7z1900-x64" "7z1900-x64.exe" | grep "ing archive"
rm "7z1900-x64.exe"
rm "bin/windows/x64/7z/7z1900-x64/Uninstall.exe"
sed -i '/\/bin\//d' -- '.gitignore'
git add "bin/windows/x64/7z/7z1900-x64"
git -c user.name="GitHub" -c user.email="noreply@github.com" commit --author="github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>" -m"Add Windows x64 7z 19.00 release artifacts" | sed -n 1p
git checkout -- '.gitignore'
if [[ $(git status --porcelain | tee /dev/stderr | head -c1 | wc -c) -ne 0 || $(git clean -dffx | tee /dev/stderr | head -c1 | wc -c) -ne 0 ]]
  then exit 1
fi

# Node Windows x86
wget -nv -O "node-v12.10.0-win-x86.zip" https://nodejs.org/dist/v12.10.0/node-v12.10.0-win-x86.zip
mkdir -p "bin/windows/x86/node"
7z x -o"bin/windows/x86/node" "node-v12.10.0-win-x86.zip" | grep "ing archive"
rm -r 'bin/windows/x86/node/node-v12.10.0-win-x86/node_modules'
rm 'bin/windows/x86/node/node-v12.10.0-win-x86/npm'
rm 'bin/windows/x86/node/node-v12.10.0-win-x86/npm.cmd'
rm 'bin/windows/x86/node/node-v12.10.0-win-x86/npx'
rm 'bin/windows/x86/node/node-v12.10.0-win-x86/npx.cmd'
rm "node-v12.10.0-win-x86.zip"
sed -i '/\/bin\//d' -- '.gitignore'
git add "bin/windows/x86/node"
git -c user.name="GitHub" -c user.email="noreply@github.com" commit --author="github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>" -m"Add Windows x86 Node 12.10.0 release artifacts" | sed -n 1p
git checkout -- '.gitignore'
if [[ $(git status --porcelain | tee /dev/stderr | head -c1 | wc -c) -ne 0 || $(git clean -dffx | tee /dev/stderr | head -c1 | wc -c) -ne 0 ]]
  then exit 1
fi

# Node Windows x64
wget -nv -O "node-v12.10.0-win-x64.zip" https://nodejs.org/dist/v12.10.0/node-v12.10.0-win-x64.zip
mkdir -p "bin/windows/x64/node"
7z x -o"bin/windows/x64/node" "node-v12.10.0-win-x64.zip" | grep "ing archive"
rm -r 'bin/windows/x64/node/node-v12.10.0-win-x64/node_modules'
rm 'bin/windows/x64/node/node-v12.10.0-win-x64/npm'
rm 'bin/windows/x64/node/node-v12.10.0-win-x64/npm.cmd'
rm 'bin/windows/x64/node/node-v12.10.0-win-x64/npx'
rm 'bin/windows/x64/node/node-v12.10.0-win-x64/npx.cmd'
rm "node-v12.10.0-win-x64.zip"
sed -i '/\/bin\//d' -- '.gitignore'
git add "bin/windows/x64/node"
git -c user.name="GitHub" -c user.email="noreply@github.com" commit --author="github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>" -m"Add Windows x64 Node 12.10.0 release artifacts" | sed -n 1p
git checkout -- '.gitignore'
if [[ $(git status --porcelain | tee /dev/stderr | head -c1 | wc -c) -ne 0 || $(git clean -dffx | tee /dev/stderr | head -c1 | wc -c) -ne 0 ]]
  then exit 1
fi

# Node Linux x64
wget -nv -O "node-v12.10.0-linux-x64.tar.gz" https://nodejs.org/dist/v12.10.0/node-v12.10.0-linux-x64.tar.gz
mkdir -p "bin/linux/x64/node"
tar -xzf "node-v12.10.0-linux-x64.tar.gz" -C "bin/linux/x64/node"
rm -r 'bin/linux/x64/node/node-v12.10.0-linux-x64/lib'
rm 'bin/linux/x64/node/node-v12.10.0-linux-x64/bin/npm'
rm 'bin/linux/x64/node/node-v12.10.0-linux-x64/bin/npx'
rm "node-v12.10.0-linux-x64.tar.gz"
sed -i '/\/bin\//d' -- '.gitignore'
git add "bin/linux/x64/node"
git -c user.name="GitHub" -c user.email="noreply@github.com" commit --author="github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>" -m"Add Linux x64 Node 12.10.0 release artifacts" | sed -n 1p
git checkout -- '.gitignore'
sudo ln -sf "$(pwd)/bin/linux/x64/node/node-v12.10.0-linux-x64/bin/node" /usr/local/bin/node
if [[ $(git status --porcelain | tee /dev/stderr | head -c1 | wc -c) -ne 0 || $(git clean -dffx | tee /dev/stderr | head -c1 | wc -c) -ne 0 ]]
  then exit 1
fi

# Electron Windows x86
export force_no_cache=true
export npm_config_platform=win32
export npm_config_arch=ia32
export npm_version=$(curl -sS 'https://registry.npmjs.org/npm' | python -c "import sys, json; print(json.load(sys.stdin)['dist-tags']['latest-6'])")
wget -nv -O "npm-$npm_version.tgz" "https://registry.npmjs.org/npm/-/npm-$npm_version.tgz"
mkdir -p "bin/all/all/npm/npm-$npm_version/npm"
tar -xzf "npm-$npm_version.tgz" --strip-components=1 -C "bin/all/all/npm/npm-$npm_version/npm"
rm "npm-$npm_version.tgz"
sed -i "0,/\"npm\": \".*\"/s//\"npm\": \"$(cat bin/all/all/npm/npm-$npm_version/npm/package.json | python -c "import sys, json; print(json.load(sys.stdin)['version'])")\"/" package.json
bin/linux/x64/node/node-v12.10.0-linux-x64/bin/node bin/all/all/npm/npm-$npm_version/npm/bin/npm-cli.js install electron@$(cat package.json | python -c "import sys, json; print(json.load(sys.stdin)['dependencies']['electron'])") --no-offline
rm -rf .npm/
export npm_config_target=$(cat node_modules/electron/package.json | python -c "import sys, json; print(json.load(sys.stdin)['version'])")
bin/linux/x64/node/node-v12.10.0-linux-x64/bin/node bin/all/all/npm/npm-$npm_version/npm/bin/npm-cli.js dedupe
rm -rf .npm/
rm -r node_modules/electron/node_modules/@types/
bin/linux/x64/node/node-v12.10.0-linux-x64/bin/node bin/all/all/npm/npm-$npm_version/npm/bin/npm-cli.js dedupe
rm -rf .npm/
bin/linux/x64/node/node-v12.10.0-linux-x64/bin/node node_modules/electron/install.js
mkdir -p "bin/windows/x86/electron/electron-v$npm_config_target-win32-ia32"
mv -T node_modules/electron/dist "bin/windows/x86/electron/electron-v$npm_config_target-win32-ia32"
rm -r bin/all/
rm -r node_modules/
rm package-lock.json
git checkout -- 'package.json'
if [[ $(stat -c%s "bin/windows/x86/electron/electron-v$npm_config_target-win32-ia32/electron.exe") -gt 104857600 ]]; then
  split -b 104857600 --numeric-suffixes=1 --suffix-length=3 "bin/windows/x86/electron/electron-v$npm_config_target-win32-ia32/electron.exe" "bin/windows/x86/electron/electron-v$npm_config_target-win32-ia32/electron.exe."
  rm "bin/windows/x86/electron/electron-v$npm_config_target-win32-ia32/electron.exe"
fi
sed -i '/\/bin\//d' -- '.gitignore'
git add "bin/windows/x86/electron"
git -c user.name="GitHub" -c user.email="noreply@github.com" commit --author="github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>" -m"Add Windows x86 Electron $npm_config_target release artifacts" | sed -n 1p
git checkout -- '.gitignore'
if [[ $(git status --porcelain | tee /dev/stderr | head -c1 | wc -c) -ne 0 || $(git clean -dffx | tee /dev/stderr | head -c1 | wc -c) -ne 0 ]]
  then exit 1
fi

# Electron Windows x64
export npm_config_arch=x64
wget -nv -O "npm-$npm_version.tgz" "https://registry.npmjs.org/npm/-/npm-$npm_version.tgz"
mkdir -p "bin/all/all/npm/npm-$npm_version/npm"
tar -xzf "npm-$npm_version.tgz" --strip-components=1 -C "bin/all/all/npm/npm-$npm_version/npm"
rm "npm-$npm_version.tgz"
sed -i "0,/\"npm\": \".*\"/s//\"npm\": \"$(cat bin/all/all/npm/npm-$npm_version/npm/package.json | python -c "import sys, json; print(json.load(sys.stdin)['version'])")\"/" package.json
bin/linux/x64/node/node-v12.10.0-linux-x64/bin/node bin/all/all/npm/npm-$npm_version/npm/bin/npm-cli.js install electron@$(cat package.json | python -c "import sys, json; print(json.load(sys.stdin)['dependencies']['electron'])") --no-offline
rm -rf .npm/
bin/linux/x64/node/node-v12.10.0-linux-x64/bin/node bin/all/all/npm/npm-$npm_version/npm/bin/npm-cli.js dedupe
rm -rf .npm/
rm -r node_modules/electron/node_modules/@types/
bin/linux/x64/node/node-v12.10.0-linux-x64/bin/node bin/all/all/npm/npm-$npm_version/npm/bin/npm-cli.js dedupe
rm -rf .npm/
bin/linux/x64/node/node-v12.10.0-linux-x64/bin/node node_modules/electron/install.js
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
bin/linux/x64/node/node-v12.10.0-linux-x64/bin/node bin/all/all/npm/npm-$npm_version/npm/bin/npm-cli.js install electron@$(cat package.json | python -c "import sys, json; print(json.load(sys.stdin)['dependencies']['electron'])") --no-offline
rm -rf .npm/
bin/linux/x64/node/node-v12.10.0-linux-x64/bin/node bin/all/all/npm/npm-$npm_version/npm/bin/npm-cli.js dedupe
rm -rf .npm/
rm -r node_modules/electron/node_modules/@types/
bin/linux/x64/node/node-v12.10.0-linux-x64/bin/node bin/all/all/npm/npm-$npm_version/npm/bin/npm-cli.js dedupe
rm -rf .npm/
bin/linux/x64/node/node-v12.10.0-linux-x64/bin/node node_modules/electron/install.js
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
bin/linux/x64/node/node-v12.10.0-linux-x64/bin/node bin/all/all/npm/npm-$npm_version/npm/bin/npm-cli.js install --no-offline
rm -rf .npm/
bin/linux/x64/node/node-v12.10.0-linux-x64/bin/node bin/all/all/npm/npm-$npm_version/npm/bin/npm-cli.js dedupe
rm -rf .npm/
rm -r node_modules/electron/node_modules/
rm -r node_modules/npm/node_modules/cli-table3/node_modules/ansi-regex/
rm -r node_modules/npm/node_modules/string-width/node_modules/ansi-regex/
rm -r node_modules/npm-6/node_modules/npm/node_modules/cliui/node_modules/ansi-regex/
rm -r node_modules/npm-6/node_modules/npm/node_modules/string-width/node_modules/ansi-regex/
rm -r node_modules/npm-6/node_modules/npm/node_modules/wrap-ansi/node_modules/ansi-regex/
rm -r node_modules/npm-6/node_modules/npm/node_modules/yargs/node_modules/ansi-regex/
rm -r node_modules/npm/node_modules/json-schema/
rm -r node_modules/npm-6/node_modules/npm/node_modules/json-schema/
rm node_modules/cheerio/node_modules/tslib/modules/package.json
rm node_modules/electron/install.js
cp -a node_modules/ansi-regex/ node_modules/npm/node_modules/cli-table3/node_modules/ansi-regex/
cp -a node_modules/ansi-regex/ node_modules/npm/node_modules/string-width/node_modules/ansi-regex/
cp -a node_modules/ansi-regex/ node_modules/npm-6/node_modules/npm/node_modules/cliui/node_modules/ansi-regex/
cp -a node_modules/ansi-regex/ node_modules/npm-6/node_modules/npm/node_modules/string-width/node_modules/ansi-regex/
cp -a node_modules/ansi-regex/ node_modules/npm-6/node_modules/npm/node_modules/wrap-ansi/node_modules/ansi-regex/
cp -a node_modules/ansi-regex/ node_modules/npm-6/node_modules/npm/node_modules/yargs/node_modules/ansi-regex/
cp -a node_modules/postman-request/node_modules/http-signature/node_modules/jsprim/node_modules/json-schema/ node_modules/npm/node_modules/json-schema/
cp -a node_modules/postman-request/node_modules/http-signature/node_modules/jsprim/node_modules/json-schema/ node_modules/npm-6/node_modules/npm/node_modules/json-schema/
sed -i "0,/\"_inBundle\": false/s//\"_inBundle\": true/" node_modules/npm/node_modules/cli-table3/node_modules/ansi-regex/package.json
sed -i -z "0,/  \"_requiredBy\": \[\n    \".*\"\n  \]/s//  \"_requiredBy\": \[\n    \"\/npm\/cli-table3\"\n  \]/" node_modules/npm/node_modules/cli-table3/node_modules/ansi-regex/package.json
sed -i "0,/\"_location\": \".*\"/s//\"_location\": \"\/npm\/cli-table3\/ansi-regex\"/" node_modules/npm/node_modules/cli-table3/node_modules/ansi-regex/package.json
sed -i "0,/\"_inBundle\": false/s//\"_inBundle\": true/" node_modules/npm/node_modules/string-width/node_modules/ansi-regex/package.json
sed -i -z "0,/  \"_requiredBy\": \[\n    \".*\"\n  \]/s//  \"_requiredBy\": \[\n    \"\/npm\/string-width\"\n  \]/" node_modules/npm/node_modules/string-width/node_modules/ansi-regex/package.json
sed -i "0,/\"_location\": \".*\"/s//\"_location\": \"\/npm\/string-width\/ansi-regex\"/" node_modules/npm/node_modules/string-width/node_modules/ansi-regex/package.json
sed -i "0,/\"_inBundle\": false/s//\"_inBundle\": true/" node_modules/npm-6/node_modules/npm/node_modules/cliui/node_modules/ansi-regex/package.json
sed -i -z "0,/  \"_requiredBy\": \[\n    \".*\"\n  \]/s//  \"_requiredBy\": \[\n    \"\/npm-6\/npm\/cliui\"\n  \]/" node_modules/npm-6/node_modules/npm/node_modules/cliui/node_modules/ansi-regex/package.json
sed -i "0,/\"_location\": \".*\"/s//\"_location\": \"\/npm-6\/npm\/cliui\/ansi-regex\"/" node_modules/npm-6/node_modules/npm/node_modules/cliui/node_modules/ansi-regex/package.json
sed -i "0,/\"_inBundle\": false/s//\"_inBundle\": true/" node_modules/npm-6/node_modules/npm/node_modules/string-width/node_modules/ansi-regex/package.json
sed -i -z "0,/  \"_requiredBy\": \[\n    \".*\"\n  \]/s//  \"_requiredBy\": \[\n    \"\/npm-6\/npm\/string-width\"\n  \]/" node_modules/npm-6/node_modules/npm/node_modules/string-width/node_modules/ansi-regex/package.json
sed -i "0,/\"_location\": \".*\"/s//\"_location\": \"\/npm-6\/npm\/string-width\/ansi-regex\"/" node_modules/npm-6/node_modules/npm/node_modules/string-width/node_modules/ansi-regex/package.json
sed -i "0,/\"_inBundle\": false/s//\"_inBundle\": true/" node_modules/npm-6/node_modules/npm/node_modules/wrap-ansi/node_modules/ansi-regex/package.json
sed -i -z "0,/  \"_requiredBy\": \[\n    \".*\"\n  \]/s//  \"_requiredBy\": \[\n    \"\/npm-6\/npm\/wrap-ansi\"\n  \]/" node_modules/npm-6/node_modules/npm/node_modules/wrap-ansi/node_modules/ansi-regex/package.json
sed -i "0,/\"_location\": \".*\"/s//\"_location\": \"\/npm-6\/npm\/wrap-ansi\/ansi-regex\"/" node_modules/npm-6/node_modules/npm/node_modules/wrap-ansi/node_modules/ansi-regex/package.json
sed -i "0,/\"_inBundle\": false/s//\"_inBundle\": true/" node_modules/npm-6/node_modules/npm/node_modules/yargs/node_modules/ansi-regex/package.json
sed -i -z "0,/  \"_requiredBy\": \[\n    \".*\"\n  \]/s//  \"_requiredBy\": \[\n    \"\/npm-6\/npm\/yargs\"\n  \]/" node_modules/npm-6/node_modules/npm/node_modules/yargs/node_modules/ansi-regex/package.json
sed -i "0,/\"_location\": \".*\"/s//\"_location\": \"\/npm-6\/npm\/yargs\/ansi-regex\"/" node_modules/npm-6/node_modules/npm/node_modules/yargs/node_modules/ansi-regex/package.json
sed -i "0,/\"_inBundle\": false/s//\"_inBundle\": true/" node_modules/npm/node_modules/json-schema/package.json
sed -i -z "0,/  \"_requiredBy\": \[\n    \".*\"\n  \]/s//  \"_requiredBy\": \[\n    \"\/npm\"\n  \]/" node_modules/npm/node_modules/json-schema/package.json
sed -i "0,/\"_location\": \".*\"/s//\"_location\": \"\/npm\/json-schema\"/" node_modules/npm/node_modules/json-schema/package.json
sed -i "0,/\"_inBundle\": false/s//\"_inBundle\": true/" node_modules/npm-6/node_modules/npm/node_modules/json-schema/package.json
sed -i -z "0,/  \"_requiredBy\": \[\n    \".*\"\n  \]/s//  \"_requiredBy\": \[\n    \"\/npm-6\/npm\"\n  \]/" node_modules/npm-6/node_modules/npm/node_modules/json-schema/package.json
sed -i "0,/\"_location\": \".*\"/s//\"_location\": \"\/npm-6\/npm\/json-schema\"/" node_modules/npm-6/node_modules/npm/node_modules/json-schema/package.json
sed -i "0,/\"ansi-regex\": \".*\"/s//\"ansi-regex\": \"$(cat node_modules/ansi-regex/package.json | python -c "import sys, json; print(json.load(sys.stdin)['version'])")\"/" node_modules/npm/node_modules/cli-table3/node_modules/strip-ansi/package.json
sed -i "0,/\"ansi-regex\": \".*\"/s//\"ansi-regex\": \"$(cat node_modules/ansi-regex/package.json | python -c "import sys, json; print(json.load(sys.stdin)['version'])")\"/" node_modules/npm/node_modules/string-width/node_modules/strip-ansi/package.json
sed -i "0,/\"ansi-regex\": \".*\"/s//\"ansi-regex\": \"$(cat node_modules/ansi-regex/package.json | python -c "import sys, json; print(json.load(sys.stdin)['version'])")\"/" node_modules/npm/node_modules/strip-ansi/package.json
sed -i "0,/\"ansi-regex\": \".*\"/s//\"ansi-regex\": \"$(cat node_modules/ansi-regex/package.json | python -c "import sys, json; print(json.load(sys.stdin)['version'])")\"/" node_modules/npm-6/node_modules/npm/node_modules/cliui/node_modules/strip-ansi/package.json
sed -i "0,/\"ansi-regex\": \".*\"/s//\"ansi-regex\": \"$(cat node_modules/ansi-regex/package.json | python -c "import sys, json; print(json.load(sys.stdin)['version'])")\"/" node_modules/npm-6/node_modules/npm/node_modules/string-width/node_modules/strip-ansi/package.json
sed -i "0,/\"ansi-regex\": \".*\"/s//\"ansi-regex\": \"$(cat node_modules/ansi-regex/package.json | python -c "import sys, json; print(json.load(sys.stdin)['version'])")\"/" node_modules/npm-6/node_modules/npm/node_modules/strip-ansi/package.json
sed -i "0,/\"ansi-regex\": \".*\"/s//\"ansi-regex\": \"$(cat node_modules/ansi-regex/package.json | python -c "import sys, json; print(json.load(sys.stdin)['version'])")\"/" node_modules/npm-6/node_modules/npm/node_modules/wrap-ansi/node_modules/strip-ansi/package.json
sed -i "0,/\"ansi-regex\": \".*\"/s//\"ansi-regex\": \"$(cat node_modules/ansi-regex/package.json | python -c "import sys, json; print(json.load(sys.stdin)['version'])")\"/" node_modules/npm-6/node_modules/npm/node_modules/yargs/node_modules/strip-ansi/package.json
sed -i "0,/\"json-schema\": \".*\"/s//\"json-schema\": \"$(cat node_modules/postman-request/node_modules/http-signature/node_modules/jsprim/node_modules/json-schema/package.json | python -c "import sys, json; print(json.load(sys.stdin)['version'])")\"/" node_modules/npm/node_modules/jsprim/package.json
sed -i "0,/\"json-schema\": \".*\"/s//\"json-schema\": \"$(cat node_modules/postman-request/node_modules/http-signature/node_modules/jsprim/node_modules/json-schema/package.json | python -c "import sys, json; print(json.load(sys.stdin)['version'])")\"/" node_modules/npm-6/node_modules/npm/node_modules/jsprim/package.json
sed -i '/"dependencies": {/,/},/d' -- 'node_modules/electron/package.json'
echo -n "electron" > "node_modules/electron/path.txt"
bin/linux/x64/node/node-v12.10.0-linux-x64/bin/node bin/all/all/npm/npm-$npm_version/npm/bin/npm-cli.js dedupe
rm -rf .npm/
rm -r bin/all/
git checkout -- 'package.json'
find node_modules/ -mindepth 2 -type d \( -name '.github' -o -name 'docs' -o -name 'example' -o -name 'tap-snapshots' -o -name 'test' -o -name 'typings' \) | xargs rm -rf
find node_modules/ -mindepth 2 -type f \( -name '*.d.ts' -o -name '*.d.ts.map' -o -name '*.js.map' -o -name '.eslintrc.yml' -o -name '.gitmodules' -o -name '.npmignore' -o -name '.travis.yml' -o -name 'yarn.lock' \) -exec bash -c 'rm "$1"; rmdir --ignore-fail-on-non-empty $(dirname "$1")' bash '{}' ';'
find node_modules/ -mindepth 2 -type f -name 'package.json' -exec sed -i '/"_where": "/d' -- '{}' ';'
find node_modules/ -mindepth 2 -type f -name 'package.json' -exec sed -i '/"man": \[/,/\],/d' -- '{}' ';'
sed -i '/\/node_modules\//d' -- '.gitignore'
find node_modules/ -mindepth 2 -maxdepth 3 -type f -name 'package.json' -exec bash -c 'path="{}"; git add -- "${path:0:-13}"; git -c user.name="GitHub" -c user.email="noreply@github.com" commit --author="github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>" -m"Add ${path:13:-13} release artifacts" | sed -n 1p' ';'
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
