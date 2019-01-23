@echo off

:: Create EULA agreement
echo eula=true>eula.txt

:: Create server properties
copy ..\docs\assets\server.properties server.properties

:: Create server start script
copy ..\docs\assets\ServerStart.bat ServerStart.bat

:: Create config directory
md config

:: Configure Biomes O' Plenty
md config\biomesoplenty
copy ..\docs\assets\config\biomesoplenty\ids.cfg config\biomesoplenty\ids.cfg

:: Configure The Erebus
copy ..\docs\assets\config\erebus.cfg config\erebus.cfg

:: Configure Et Futurum
copy ..\docs\assets\config\etfuturum.cfg config\etfuturum.cfg

:: Configure Morpheus
copy ..\docs\assets\config\Morpheus.cfg config\Morpheus.cfg

:: Configure Mystcraft
md config\mystcraft
copy ..\docs\assets\config\mystcraft\core.cfg config\mystcraft\core.cfg

:: Configure StarMiner
copy ..\docs\assets\config\Starminer.cfg config\Starminer.cfg

:: Configure Thaumcraft
copy ..\docs\assets\config\Thaumcraft.cfg config\Thaumcraft.cfg

:: Configure The Twilight Forest
copy ..\docs\assets\config\TwilightForest.cfg config\TwilightForest.cfg

:: Create shortcut
if exist ..\Start Server.lnk (
  del ..\Start Server.lnk
)
..\bin\windows\all\shortcut\Shortcut.exe /F:"..\Start Server.lnk" /A:C /T:"%cd%\ServerStart.bat" /W:"%cd%"
