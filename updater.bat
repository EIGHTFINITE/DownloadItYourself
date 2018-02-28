@cls
@echo off
setlocal
cd /d %~dp0
reg Query "HKLM\Hardware\Description\System\CentralProcessor\0" | find /i "x86" > nul && set osArchitecture=86 || set osArchitecture=64
cmd /c bin\windows\x%osArchitecture%\node\npm install 1>nul 2>nul
bin\windows\x%osArchitecture%\node\node --use_strict updater.js
