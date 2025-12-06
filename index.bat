@echo off
cd /d "%~dp0"
git init .
git config core.autocrlf false
git config core.ignorecase false
git config core.fscache true
git config core.longpaths true
git config diff.renameLimit 0
git config status.renameLimit 0
git config merge.renameLimit 0
git config http.lowSpeedLimit 0
git config http.lowSpeedTime 300
git config http.postBuffer 1048576000
git config pack.threads 1
git config index.threads 0
git remote add origin https://github.com/EIGHTFINITE/DownloadItYourself.git 2>nul
git remote set-url origin https://github.com/EIGHTFINITE/DownloadItYourself.git
git fetch --force --all --tags
git reset --hard
git checkout -B master refs/remotes/origin/master
git reflog expire --expire-unreachable=now --all
git gc --aggressive --prune=all
git fsck --unreachable --no-reflogs
for /f "tokens=1,2 delims=:, " %%a in (' find ":" ^< "package.json" ') do (
  set "%%~a_version=%%~b"
)
git checkout refs/tags/artifacts -- "bin/linux/x64/node/node-v%node_version%-linux-x64/lib/" bin/windows/ extensions/ node_modules/ package-lock.json
git clean -ffxe "bin/windows/x64/electron/electron-v%electron_version%-win32-x64/electron.exe" -- bin/ extensions/ node_modules/
git reset -- "bin/linux/x64/node/node-v%node_version%-linux-x64/lib/" bin/windows/ extensions/ node_modules/ package-lock.json
cmd /c "bin\windows\x64\node\node-v%node_version%-win-x64\node" --use_strict index.js
