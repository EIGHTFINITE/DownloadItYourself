@echo off
setlocal
cd /d %~dp0
reg Query "HKLM\Hardware\Description\System\CentralProcessor\0" | "%windir%\System32\find.exe" /i "x86" > nul && set osArch=86 || set osArch=64
for /f "tokens=1,2 delims=:, " %%a in (' find ":" ^< "package.json" ') do (
  set "%%~a_version=%%~b"
)
cmd /c bin\windows\x%osArch%\node\node-v%node_version%-win-x%osArch%\node --use_strict main.js
