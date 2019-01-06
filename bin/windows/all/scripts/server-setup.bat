@echo off

:: Create EULA agreement
echo eula=true>eula.txt

:: Create server properties
echo difficulty=^3>server.properties

:: Create server start script
echo @echo off>ServerStart.bat
echo del /f /q autostart.stamp ^>nul 2^>^&^1>>ServerStart.bat
echo.>>ServerStart.bat
echo echo Starting server>>ServerStart.bat
echo call :server_start>>ServerStart.bat
echo.>>ServerStart.bat
echo :server_loop>>ServerStart.bat
echo if exist autostart.stamp (>>ServerStart.bat
echo     del /f /q autostart.stamp ^>nul 2^>^&^1>>ServerStart.bat
echo     echo If you want to completely stop the server process now, press Ctrl+C before the time is up!>>ServerStart.bat
echo     for /l %%i in (5,-1,1) do (>>ServerStart.bat
echo         echo Restarting server in %%i>>ServerStart.bat
echo         choice /t 1 /d y ^>nul>>ServerStart.bat
echo     )>>ServerStart.bat
echo     echo Starting server now>>ServerStart.bat
echo 	call :server_start>>ServerStart.bat
echo     echo Server process finished>>ServerStart.bat
echo     goto :server_loop>>ServerStart.bat
echo )>>ServerStart.bat
echo echo Exiting...>>ServerStart.bat
echo exit /B>>ServerStart.bat
echo.>>ServerStart.bat
echo :server_start>>ServerStart.bat
echo ..\bin\windows\x64\JRE\jre-8u152-windows-x64\jre1.8.0_152\bin\java.exe -jar FTBServer-1.7.10-1614.jar nogui>>ServerStart.bat
echo goto :EOF>>ServerStart.bat

:: Create shortcut
if exist "..\Start Server.lnk" (
  del ""..\Start Server.lnk""
)
..\bin\windows\all\shortcut\Shortcut.exe /F:"..\Start Server.lnk" /A:C /T:"%cd%\ServerStart.bat" /W:"%cd%"
