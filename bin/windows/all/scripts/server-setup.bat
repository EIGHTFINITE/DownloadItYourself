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

:: Create config directory
md config

:: Configure Et Futurum
echo general {>config\etfuturum.cfg
echo     B:"Allow non-opaque armour"=true>>config\etfuturum.cfg
echo     B:Anvil=true>>config\etfuturum.cfg
echo     B:"Armour Stand"=true>>config\etfuturum.cfg
echo     B:"Baby growth boost"=true>>config\etfuturum.cfg
echo     B:Banners=true>>config\etfuturum.cfg
echo     B:Beetroot=true>>config\etfuturum.cfg
echo     B:"Bows render pulling animation on inventory"=true>>config\etfuturum.cfg
echo     B:"Brewing Stands"=true>>config\etfuturum.cfg
echo     B:"Chorus Fruit (and related blocks)"=true>>config\etfuturum.cfg
echo     B:"Coarse Dirt"=true>>config\etfuturum.cfg
echo     B:"Colourful Beacon Beams"=true>>config\etfuturum.cfg
echo     B:"Crying Obsidian"=false>>config\etfuturum.cfg
echo     B:"Dead Bushes drop sticks"=true>>config\etfuturum.cfg
echo     B:Doors=true>>config\etfuturum.cfg
echo     B:"Dragon respawning"=true>>config\etfuturum.cfg
echo     B:Elytra=false>>config\etfuturum.cfg
echo     B:"Enchanting Table"=true>>config\etfuturum.cfg
echo     B:Endermite=false>>config\etfuturum.cfg
echo     B:"Fancy Skulls"=true>>config\etfuturum.cfg
echo     B:"Fences and Gates"=true>>config\etfuturum.cfg
echo     B:"Fences, gates and dead bushes burn"=true>>config\etfuturum.cfg
echo     B:"Frost Walker"=true>>config\etfuturum.cfg
echo     I:"Frost Walker ID"=36>>config\etfuturum.cfg
echo     B:"Grass Path"=false>>config\etfuturum.cfg
echo     B:"Heart Damage Indicator"=false>>config\etfuturum.cfg
echo     B:"Inverted Daylight Sensor"=true>>config\etfuturum.cfg
echo     B:"Iron Trapdoor"=true>>config\etfuturum.cfg
echo     B:"Lingering Potions"=true>>config\etfuturum.cfg
echo     I:"Max number of 1.8 stones in a cluster"=33>>config\etfuturum.cfg
echo     B:Mending=true>>config\etfuturum.cfg
echo     I:"Mending ID"=37>>config\etfuturum.cfg
echo     B:"Mushroom Blocks"=true>>config\etfuturum.cfg
echo     B:Mutton=true>>config\etfuturum.cfg
echo     B:"Old Gravel"=false>>config\etfuturum.cfg
echo     B:"Old Roses"=true>>config\etfuturum.cfg
echo     B:Prismarine=true>>config\etfuturum.cfg
echo     B:Rabbits=true>>config\etfuturum.cfg
echo     B:"Recipes for prismarine"=false>>config\etfuturum.cfg
echo     B:"Red Sandstone"=true>>config\etfuturum.cfg
echo     B:"Shearing Snow Golems"=true>>config\etfuturum.cfg
echo     B:"Shears harvest cobwebs"=true>>config\etfuturum.cfg
echo     B:"Skin overlays"=false>>config\etfuturum.cfg
echo     B:"Skulls drop from charged creeper kills"=true>>config\etfuturum.cfg
echo     B:"Slime Block"=true>>config\etfuturum.cfg
echo     B:Sponge=true>>config\etfuturum.cfg
echo     B:"Stone Brick Recipes"=true>>config\etfuturum.cfg
echo     B:Stones=true>>config\etfuturum.cfg
echo     B:"Tipped Arrows"=true>>config\etfuturum.cfg
echo     B:"Use updated food values"=true>>config\etfuturum.cfg
echo     B:"Use updated harvest levels"=true>>config\etfuturum.cfg
echo     B:"Villager Zombies"=true>>config\etfuturum.cfg
echo     B:"Villagers turn into Witches when struck by lightning"=true>>config\etfuturum.cfg
echo }>>config\etfuturum.cfg

:: Configure Morpheus
echo settings {>config\Morpheus.cfg
echo     B:AlertEnabled=true>>config\Morpheus.cfg
echo     B:IncludeMiners=true>>config\Morpheus.cfg
echo     S:OnMorningText=Wakey, wakey, rise and shine... Good Morning everyone!>>config\Morpheus.cfg
echo     S:OnSleepText=is now sleeping.>>config\Morpheus.cfg
echo     S:OnWakeText=has left their bed.>>config\Morpheus.cfg
echo     I:SleeperPerc=50>>config\Morpheus.cfg
echo }>>config\Morpheus.cfg

:: Configure Mystcraft
md config\mystcraft
echo baselining {>config\mystcraft\core.cfg
echo     # If false, the profiling will run on game startup with the loading bar. If true, it will run in the background when playing. Setting this to false disables tickrate checking, even on the server.>>config\mystcraft\core.cfg
echo     B:client.persave=true>>config\mystcraft\core.cfg
echo.>>config\mystcraft\core.cfg
echo     # If set to true this will prevent clients from connecting while baseline profiling is ongoing (Only works on dedicated servers)>>config\mystcraft\core.cfg
echo     B:server.disconnectclients=false>>config\mystcraft\core.cfg
echo.>>config\mystcraft\core.cfg
echo     # This controls the minimum number of ticks to wait before a new chunk will be generated when doing the baseline profiling in the background.>>config\mystcraft\core.cfg
echo     I:tickrate.minimum=^5>>config\mystcraft\core.cfg
echo.>>config\mystcraft\core.cfg
echo     # If true, the baseline calculations won't run and instead a config file will be read.>>config\mystcraft\core.cfg
echo     B:useconfigs=true>>config\mystcraft\core.cfg
echo }>>config\mystcraft\core.cfg

:: Configure StarMiner
echo basics_server_side_property {>config\Starminer.cfg
echo     I:GSODimentionId_byte=88>>config\Starminer.cfg
echo     I:attractCheckTick=^8>>config\Starminer.cfg
echo     D:bazookaStartSpeed=3.3>>config\Starminer.cfg
echo     B:enableFakeRotatorOnlyVannilaBlock=true>>config\Starminer.cfg
echo     B:generateOres=false>>config\Starminer.cfg
echo     B:generateStars=false>>config\Starminer.cfg
echo     I:maxGravityRad=54>>config\Starminer.cfg
echo     I:maxStarRad=48>>config\Starminer.cfg
echo     B:ticketFreeForTeleport=false>>config\Starminer.cfg
echo }>>config\Starminer.cfg

:: Create shortcut
if exist "..\Start Server.lnk" (
  del ""..\Start Server.lnk""
)
..\bin\windows\all\shortcut\Shortcut.exe /F:"..\Start Server.lnk" /A:C /T:"%cd%\ServerStart.bat" /W:"%cd%"
