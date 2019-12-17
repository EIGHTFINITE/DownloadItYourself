@echo off
setlocal
cd /d %~dp0
reg Query "HKLM\Hardware\Description\System\CentralProcessor\0" | "%windir%\System32\find.exe" /i "x86" > nul && set osArchitecture=86 || set osArchitecture=64
bin\windows\x%osArchitecture%\node\node-v12.10.0-win-x%osArchitecture%\node --use_strict main.js
