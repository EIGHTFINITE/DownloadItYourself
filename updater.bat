@echo off
setlocal
cd /d %~dp0
reg Query "HKLM\Hardware\Description\System\CentralProcessor\0" | "%windir%\System32\find.exe" /i "x86" > nul && set osArchitecture=86 || set osArchitecture=64
cmd /c bin\windows\x%osArchitecture%\node\npm install
bin\windows\x%osArchitecture%\node\node --use_strict updater.js
