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
..\bin\windows\x64\JRE\jre-8u201-windows-x64\jre1.8.0_201\bin\java.exe -server -XX:+UseG1GC -Xmx4096m -Xms4096m -Dsun.rmi.dgc.server.gcInterval=9223372036854775807L -Dsun.rmi.dgc.client.gcInterval=9223372036854775807L -XX:+UnlockExperimentalVMOptions -XX:G1NewSizePercent=20 -XX:G1ReservePercent=20 -XX:MaxGCPauseMillis=50 -XX:G1HeapRegionSize=32M -XX:+AggressiveOpts -XX:+ParallelRefProcEnabled -XX:+ExplicitGCInvokesConcurrent -jar FTBServer-1.7.10-1614.jar nogui
goto :EOF
