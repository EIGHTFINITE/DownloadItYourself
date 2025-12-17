@echo off
:: https://learn.microsoft.com/en-us/windows/win32/intl/code-page-identifiers
chcp 437 >nul
cd /d "%~dp0"
goto:start

:git
if not exist "bin\windows\x64\git\PortableGit-%portable-git-short-version%-64-bit\bin\git.exe" (
  echo git is missing. Downloading it now...
  curl.exe -#Lo"artifacts.zip" https://github.com/EIGHTFINITE/DownloadItYourself/archive/refs/tags/artifacts.zip
  echo Extracting...
  tar.exe -xf "artifacts.zip" --strip-components=1 -C "."
  del artifacts.zip
  for /f "tokens=1,2 delims=:, " %%a in (' find ":" ^< "downloadlist.json" ') do (
    set "%%~a-version=%%~b"
  )
)
bin\windows\x64\git\PortableGit-%portable-git-short-version%-64-bit\bin\git.exe %*
goto:eof

:start
for /f "tokens=1,2 delims=:, " %%a in (' find ":" ^< "downloadlist.json" ') do (
  set "%%~a-version=%%~b"
)
set GIT_ASK_YESNO=false
call:git init .
call:git config core.autocrlf false
call:git config core.ignorecase false
call:git config core.fscache true
call:git config core.longpaths true
call:git config diff.renameLimit 0
call:git config status.renameLimit 0
call:git config merge.renameLimit 0
call:git config http.lowSpeedLimit 0
call:git config http.lowSpeedTime 300
call:git config http.postBuffer 1048576000
call:git config pack.threads 1
call:git config index.threads 0
call:git remote add origin https://github.com/EIGHTFINITE/DownloadItYourself.call:git 2>nul
call:git remote set-url origin https://github.com/EIGHTFINITE/DownloadItYourself.git
call:git fetch --force --all --tags
call:git reset --hard
call:git checkout -B master refs/remotes/origin/master
call:git reflog expire --expire-unreachable=now --all
call:git gc --aggressive --prune=all
call:git fsck --unreachable --no-reflogs
for /f "tokens=1,2 delims=:, " %%a in (' find ":" ^< "package.json" ') do (
  set "%%~a-version=%%~b"
)
call:git checkout refs/tags/artifacts -- "bin/linux/x64/node/node-v%node-version%-linux-x64/lib/" bin/windows/ extensions/ node_modules/ package-lock.json
call:git clean -ffxe "bin/windows/x64/electron/electron-v%electron-version%-win32-x64/electron.exe" -- bin/ extensions/ node_modules/
call:git reset -- "bin/linux/x64/node/node-v%node-version%-linux-x64/lib/" bin/windows/ extensions/ node_modules/ package-lock.json
cmd /c "bin\windows\x64\node\node-v%node-version%-win-x64\node" --use_strict index.js
