@echo off
setlocal
cd /d %~dp0
reg Query "HKLM\Hardware\Description\System\CentralProcessor\0" | "%windir%\System32\find.exe" /i "x86" > nul && set osArch=86 || set osArch=64
cmd /c bin\windows\x%osArch%\node\node-v12.22.12-win-x%osArch%\node --use_strict main.js
