@echo off
setlocal
cd /d %~dp0
for /f "tokens=1,2 delims=:, " %%a in (' find ":" ^< "package.json" ') do (
  set "%%~a_version=%%~b"
)
cmd /c bin\windows\x64\node\node-v%node_version%-win-x64\node --use_strict main.js
