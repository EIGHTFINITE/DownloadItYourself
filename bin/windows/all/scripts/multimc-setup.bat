@echo off

:: Rename executable
move /Y MultiMC.exe Minecraft.exe

:: Create instance
if not exist instances\default (
  md instances\default
)

:: Create junction
if exist instances\default\.minecraft (
  rd instances\default\.minecraft
)
mklink /j instances\default\.minecraft ..\minecraft

:: Configure MultiMC
echo AutoUpdate=false>multimc.cfg
echo JavaPath=../bin/windows/x64/JRE/jre-8u152-windows-x64/jre1.8.0_152/bin/javaw.exe>>multimc.cfg
echo Language=en>>multimc.cfg
echo LastHostname=%computername%>>multimc.cfg

:: Configure instance
echo ForgeVersion=10.13.4.1614>instances\default\instance.cfg
echo InstanceType=OneSix>>instances\default\instance.cfg
echo IntendedVersion=1.7.10>>instances\default\instance.cfg
echo name=default>>instances\default\instance.cfg
echo SelectedInstance=default>>instances\default\instance.cfg

:: Configure Minecraft
echo guiScale:^2>..\minecraft\options.txt
echo difficulty:^3>>..\minecraft\options.txt
echo key_key.streamStartStop:^0>>..\minecraft\options.txt
echo key_of.key.zoom:^0>>..\minecraft\options.txt

:: Configure OptiFine
echo ofRandomMobs:false>..\minecraft\optionsof.txt

:: Configure Shaders
echo shaderPack=KUDA-Shaders v6.5.56.zip>..\minecraft\optionsshaders.txt
echo tweakBlockDamage=true>>..\minecraft\optionsshaders.txt
echo oldLighting=true>>..\minecraft\optionsshaders.txt

:: Create config directory
md ..\minecraft\config

:: Configure Custom Main Menu
md ..\minecraft\config\CustomMainMenu
echo {>..\minecraft\config\CustomMainMenu\mainmenu.json
echo    "images": {>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo         "modpack": {>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "image": "mainmenu:modpack.png",>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "posX": -125,>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "posY": -155,>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "width": 250,>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "height": 150,>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "alignment": "center">>..\minecraft\config\CustomMainMenu\mainmenu.json
echo         }>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo     },>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo     "buttons": {>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo         "singleplayer": {>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "text": "menu.singleplayer",>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "posX": -100,>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "posY": 25,>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "width": 98,>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "height": 20,>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "alignment": "center",>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "texture": "mainmenu:shortbutton.png",>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "action": {>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo                 "type": "openGui",>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo                 "gui": "singleplayer">>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             }>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo         },>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo         "multiplayer": {>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "text": "menu.multiplayer",>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "posX": 2,>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "posY": 25,>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "width": 98,>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "height": 20,>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "alignment": "center",>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "texture": "mainmenu:shortbutton.png",>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "action": {>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo                 "type": "openGui",>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo                 "gui": "multiplayer">>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             }>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo         },>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo         "mods": {>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "text": "Mods",>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "posX": 2,>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "posY": 50,>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "width": 98,>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "height": 20,>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "alignment": "center",>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "texture": "mainmenu:shortbutton.png",>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "action": {>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo                 "type": "openGui",>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo                 "gui": "mods">>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             }>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo         },>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo         "options": {>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "text": "menu.options",>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "posX": -100,>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "posY": 50,>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "width": 98,>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "height": 20,>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "alignment": "center",>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "texture": "mainmenu:shortbutton.png",>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "action": {>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo                 "type": "openGui",>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo                 "gui": "options">>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             }>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo         },>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo         "quit": {>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "text": "menu.quit",>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "posX": -100,>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "posY": 75,>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "width": 200,>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "height": 20,>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "alignment": "center",>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "texture": "mainmenu:longbutton.png",>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "action": {>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo                 "type": "quit">>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             }>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo         }>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo     },>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo     "texts": {>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo         "mojang": {>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "text": "Copyright Mojang AB",>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "posX": -65,>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "posY": -7,>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "fontSize": .6,>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "color": -1,>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "hoverColor": -1,>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "alignment": "bottom_right">>..\minecraft\config\CustomMainMenu\mainmenu.json
echo         },>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo         "forge": {>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "text": "Minecraft #mcversion#",>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "posX": 3,>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "posY": -19,>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "fontSize": .6,>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "color": -1,>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "hoverColor": -1,>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "alignment": "bottom_left">>..\minecraft\config\CustomMainMenu\mainmenu.json
echo         },>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo         "modsloaded": {>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "text": "#modsloaded# Mods Loaded",>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "posX": 3,>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "posY": -13,>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "fontSize": .6,>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "color": -1,>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "hoverColor": -1,>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "alignment": "bottom_left">>..\minecraft\config\CustomMainMenu\mainmenu.json
echo         },>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo         "modsactive": {>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "text": "#modsactive# Mods Active",>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "posX": 3,>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "posY": -7,>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "fontSize": .6,>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "color": -1,>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "hoverColor": -1,>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "alignment": "bottom_left">>..\minecraft\config\CustomMainMenu\mainmenu.json
echo         },>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo         "modpack": {>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "text": "EIGHTFINITE",>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "posX": 3,>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "posY": -25,>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "fontSize": .6,>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "color": -1,>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "hoverColor": -1,>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "alignment": "bottom_left">>..\minecraft\config\CustomMainMenu\mainmenu.json
echo         }>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo     },>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo     "other": {>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo         "background": {>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "image": "mainmenu:background.png",>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo             "mode": "fill">>..\minecraft\config\CustomMainMenu\mainmenu.json
echo         }>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo     }>>..\minecraft\config\CustomMainMenu\mainmenu.json
echo }>>..\minecraft\config\CustomMainMenu\mainmenu.json

:: Custom Main Menu resources
md ..\minecraft\resources
md ..\minecraft\resources\mainmenu
copy "%~dp0\assets\background.png" ..\minecraft\resources\mainmenu\background.png
copy "%~dp0\assets\longbutton.png" ..\minecraft\resources\mainmenu\longbutton.png
copy "%~dp0\assets\midbutton.png" ..\minecraft\resources\mainmenu\midbutton.png
copy "%~dp0\assets\modpack.png" ..\minecraft\resources\mainmenu\modpack.png
copy "%~dp0\assets\shortbutton.png" ..\minecraft\resources\mainmenu\shortbutton.png
md ..\minecraft\mod-config
copy "%~dp0\assets\menu.dat" ..\minecraft\mod-config\menu.dat

:: Configure Dynamic Lights
echo general {>..\minecraft\config\DynamicLights.cfg
echo     # Comma separated list of items that do not give off light when dropped and in water, have to be present in Light Items.>>..\minecraft\config\DynamicLights.cfg
echo     S:"Items Turned Off By Water"=torch,lava_bucket>>..\minecraft\config\DynamicLights.cfg
echo.>>..\minecraft\config\DynamicLights.cfg
echo     # Comma separated list of items that shine light when dropped in the World or held in player's or mob's hands.>>..\minecraft\config\DynamicLights.cfg
echo     S:"Light Items"=torch,glowstone=12,glowstone_dust=10,lit_pumpkin,lava_bucket,redstone_torch=10,redstone=10,golden_helmet=14,easycoloredlights:easycoloredlightsCLStone=-1>>..\minecraft\config\DynamicLights.cfg
echo.>>..\minecraft\config\DynamicLights.cfg
echo     # Optifine has a Dynamic Lights of its own.  This mod will turn itself off if Optifine is loaded.>>..\minecraft\config\DynamicLights.cfg
echo     # Set this to true if you aren't going to use Optifine's Dynamic Lights (even though they work just as well!).>>..\minecraft\config\DynamicLights.cfg
echo     B:"Optifine Override"=true>>..\minecraft\config\DynamicLights.cfg
echo.>>..\minecraft\config\DynamicLights.cfg
echo     # Update Interval time in milliseconds. The lower the better and costlier.>>..\minecraft\config\DynamicLights.cfg
echo     I:"Update Interval"=^0>>..\minecraft\config\DynamicLights.cfg
echo }>>..\minecraft\config\DynamicLights.cfg

:: Configure Et Futurum
echo general {>..\minecraft\config\etfuturum.cfg
echo     B:"Allow non-opaque armour"=true>>..\minecraft\config\etfuturum.cfg
echo     B:Anvil=true>>..\minecraft\config\etfuturum.cfg
echo     B:"Armour Stand"=true>>..\minecraft\config\etfuturum.cfg
echo     B:"Baby growth boost"=true>>..\minecraft\config\etfuturum.cfg
echo     B:Banners=true>>..\minecraft\config\etfuturum.cfg
echo     B:Beetroot=true>>..\minecraft\config\etfuturum.cfg
echo     B:"Bows render pulling animation on inventory"=true>>..\minecraft\config\etfuturum.cfg
echo     B:"Brewing Stands"=true>>..\minecraft\config\etfuturum.cfg
echo     B:"Chorus Fruit (and related blocks)"=true>>..\minecraft\config\etfuturum.cfg
echo     B:"Coarse Dirt"=true>>..\minecraft\config\etfuturum.cfg
echo     B:"Colourful Beacon Beams"=true>>..\minecraft\config\etfuturum.cfg
echo     B:"Crying Obsidian"=false>>..\minecraft\config\etfuturum.cfg
echo     B:"Dead Bushes drop sticks"=true>>..\minecraft\config\etfuturum.cfg
echo     B:Doors=true>>..\minecraft\config\etfuturum.cfg
echo     B:"Dragon respawning"=true>>..\minecraft\config\etfuturum.cfg
echo     B:Elytra=false>>..\minecraft\config\etfuturum.cfg
echo     B:"Enchanting Table"=true>>..\minecraft\config\etfuturum.cfg
echo     B:Endermite=false>>..\minecraft\config\etfuturum.cfg
echo     B:"Fancy Skulls"=true>>..\minecraft\config\etfuturum.cfg
echo     B:"Fences and Gates"=true>>..\minecraft\config\etfuturum.cfg
echo     B:"Fences, gates and dead bushes burn"=true>>..\minecraft\config\etfuturum.cfg
echo     B:"Frost Walker"=true>>..\minecraft\config\etfuturum.cfg
echo     I:"Frost Walker ID"=36>>..\minecraft\config\etfuturum.cfg
echo     B:"Grass Path"=false>>..\minecraft\config\etfuturum.cfg
echo     B:"Heart Damage Indicator"=false>>..\minecraft\config\etfuturum.cfg
echo     B:"Inverted Daylight Sensor"=true>>..\minecraft\config\etfuturum.cfg
echo     B:"Iron Trapdoor"=true>>..\minecraft\config\etfuturum.cfg
echo     B:"Lingering Potions"=true>>..\minecraft\config\etfuturum.cfg
echo     I:"Max number of 1.8 stones in a cluster"=33>>..\minecraft\config\etfuturum.cfg
echo     B:Mending=true>>..\minecraft\config\etfuturum.cfg
echo     I:"Mending ID"=37>>..\minecraft\config\etfuturum.cfg
echo     B:"Mushroom Blocks"=true>>..\minecraft\config\etfuturum.cfg
echo     B:Mutton=true>>..\minecraft\config\etfuturum.cfg
echo     B:"Old Gravel"=false>>..\minecraft\config\etfuturum.cfg
echo     B:"Old Roses"=true>>..\minecraft\config\etfuturum.cfg
echo     B:Prismarine=true>>..\minecraft\config\etfuturum.cfg
echo     B:Rabbits=true>>..\minecraft\config\etfuturum.cfg
echo     B:"Recipes for prismarine"=false>>..\minecraft\config\etfuturum.cfg
echo     B:"Red Sandstone"=true>>..\minecraft\config\etfuturum.cfg
echo     B:"Shearing Snow Golems"=true>>..\minecraft\config\etfuturum.cfg
echo     B:"Shears harvest cobwebs"=true>>..\minecraft\config\etfuturum.cfg
echo     B:"Skin overlays"=false>>..\minecraft\config\etfuturum.cfg
echo     B:"Skulls drop from charged creeper kills"=true>>..\minecraft\config\etfuturum.cfg
echo     B:"Slime Block"=true>>..\minecraft\config\etfuturum.cfg
echo     B:Sponge=true>>..\minecraft\config\etfuturum.cfg
echo     B:"Stone Brick Recipes"=true>>..\minecraft\config\etfuturum.cfg
echo     B:Stones=true>>..\minecraft\config\etfuturum.cfg
echo     B:"Tipped Arrows"=true>>..\minecraft\config\etfuturum.cfg
echo     B:"Use updated food values"=true>>..\minecraft\config\etfuturum.cfg
echo     B:"Use updated harvest levels"=true>>..\minecraft\config\etfuturum.cfg
echo     B:"Villager Zombies"=true>>..\minecraft\config\etfuturum.cfg
echo     B:"Villagers turn into Witches when struck by lightning"=true>>..\minecraft\config\etfuturum.cfg
echo }>>..\minecraft\config\etfuturum.cfg

:: Configure Morpheus
echo settings {>..\minecraft\config\Morpheus.cfg
echo     B:AlertEnabled=true>>..\minecraft\config\Morpheus.cfg
echo     B:IncludeMiners=true>>..\minecraft\config\Morpheus.cfg
echo     S:OnMorningText=Wakey, wakey, rise and shine... Good Morning everyone!>>..\minecraft\config\Morpheus.cfg
echo     S:OnSleepText=is now sleeping.>>..\minecraft\config\Morpheus.cfg
echo     S:OnWakeText=has left their bed.>>..\minecraft\config\Morpheus.cfg
echo     I:SleeperPerc=50>>..\minecraft\config\Morpheus.cfg
echo }>>..\minecraft\config\Morpheus.cfg

:: Configure Mystcraft
md ..\minecraft\config\mystcraft
echo baselining {>..\minecraft\config\mystcraft\core.cfg
echo     # If false, the profiling will run on game startup with the loading bar. If true, it will run in the background when playing. Setting this to false disables tickrate checking, even on the server.>>..\minecraft\config\mystcraft\core.cfg
echo     B:client.persave=true>>..\minecraft\config\mystcraft\core.cfg
echo.>>..\minecraft\config\mystcraft\core.cfg
echo     # If set to true this will prevent clients from connecting while baseline profiling is ongoing (Only works on dedicated servers)>>..\minecraft\config\mystcraft\core.cfg
echo     B:server.disconnectclients=false>>..\minecraft\config\mystcraft\core.cfg
echo.>>..\minecraft\config\mystcraft\core.cfg
echo     # This controls the minimum number of ticks to wait before a new chunk will be generated when doing the baseline profiling in the background.>>..\minecraft\config\mystcraft\core.cfg
echo     I:tickrate.minimum=^5>>..\minecraft\config\mystcraft\core.cfg
echo.>>..\minecraft\config\mystcraft\core.cfg
echo     # If true, the baseline calculations won't run and instead a config file will be read.>>..\minecraft\config\mystcraft\core.cfg
echo     B:useconfigs=true>>..\minecraft\config\mystcraft\core.cfg
echo }>>..\minecraft\config\mystcraft\core.cfg

:: Configure StarMiner
echo basics_server_side_property {>..\minecraft\config\Starminer.cfg
echo     I:GSODimentionId_byte=88>>..\minecraft\config\Starminer.cfg
echo     I:attractCheckTick=^8>>..\minecraft\config\Starminer.cfg
echo     D:bazookaStartSpeed=3.3>>..\minecraft\config\Starminer.cfg
echo     B:enableFakeRotatorOnlyVannilaBlock=true>>..\minecraft\config\Starminer.cfg
echo     B:generateOres=false>>..\minecraft\config\Starminer.cfg
echo     B:generateStars=false>>..\minecraft\config\Starminer.cfg
echo     I:maxGravityRad=54>>..\minecraft\config\Starminer.cfg
echo     I:maxStarRad=48>>..\minecraft\config\Starminer.cfg
echo     B:ticketFreeForTeleport=false>>..\minecraft\config\Starminer.cfg
echo }>>..\minecraft\config\Starminer.cfg

:: Create shortcut
if exist "..\Play Minecraft.lnk" (
  del ""..\Play Minecraft.lnk""
)
..\bin\windows\all\shortcut\Shortcut.exe /F:"..\Play Minecraft.lnk" /A:C /T:"%cd%\Minecraft.exe" /W:"%cd%"
