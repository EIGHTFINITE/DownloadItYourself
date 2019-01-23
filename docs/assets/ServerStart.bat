@echo off
del /f /q autostart.stamp >nul 2>&1

echo Starting server
call :server_start

:server_loop
if exist autostart.stamp (
    del /f /q autostart.stamp >nul 2>&1
    echo If you want to completely stop the server process now, press Ctrl+C before the time is up!
    for /l %i in (5,-1,1) do (
        echo Restarting server in %i
        choice /t 1 /d y >nul
    )
    echo Starting server now
	call :server_start
    echo Server process finished
    goto :server_loop
)
echo Exiting...
exit /B

:server_start
..\bin\windows\x64\JRE\jre-8u152-windows-x64\jre1.8.0_152\bin\java.exe -jar FTBServer-1.7.10-1614.jar nogui
goto :EOF
