@echo off
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
git remote add origin https://github.com/EIGHTFINITE/DownloadItYourself.git
git fetch --force --all --tags
git reset --hard
git checkout -B master refs/remotes/origin/master
git restore --source=artifacts -- bin/ node_modules/ package-lock.json
setlocal
cd /d %~dp0
for /f "tokens=1,2 delims=:, " %%a in (' find ":" ^< "package.json" ') do (
  set "%%~a_version=%%~b"
)
cmd /c bin\windows\x64\node\node-v%node_version%-win-x64\node --use_strict index.js
