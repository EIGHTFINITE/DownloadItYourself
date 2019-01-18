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
echo difficulty:^3>instances\default\.minecraft\options.txt
echo key_of.key.zoom:0>>instances\default\.minecraft\options.txt

:: Configure OptiFine
echo ofRandomMobs:false>instances\default\.minecraft\optionsof.txt

:: Create config directory
mkdir instances\default\.minecraft\config

:: Configure Et Futurum
echo general {>instances\default\.minecraft\config\etfuturum.cfg
echo     B:"Allow non-opaque armour"=true>>instances\default\.minecraft\config\etfuturum.cfg
echo     B:Anvil=true>>instances\default\.minecraft\config\etfuturum.cfg
echo     B:"Armour Stand"=true>>instances\default\.minecraft\config\etfuturum.cfg
echo     B:"Baby growth boost"=true>>instances\default\.minecraft\config\etfuturum.cfg
echo     B:Banners=true>>instances\default\.minecraft\config\etfuturum.cfg
echo     B:Beetroot=true>>instances\default\.minecraft\config\etfuturum.cfg
echo     B:"Bows render pulling animation on inventory"=true>>instances\default\.minecraft\config\etfuturum.cfg
echo     B:"Brewing Stands"=true>>instances\default\.minecraft\config\etfuturum.cfg
echo     B:"Chorus Fruit (and related blocks)"=true>>instances\default\.minecraft\config\etfuturum.cfg
echo     B:"Coarse Dirt"=true>>instances\default\.minecraft\config\etfuturum.cfg
echo     B:"Colourful Beacon Beams"=true>>instances\default\.minecraft\config\etfuturum.cfg
echo     B:"Crying Obsidian"=false>>instances\default\.minecraft\config\etfuturum.cfg
echo     B:"Dead Bushes drop sticks"=true>>instances\default\.minecraft\config\etfuturum.cfg
echo     B:Doors=true>>instances\default\.minecraft\config\etfuturum.cfg
echo     B:"Dragon respawning"=true>>instances\default\.minecraft\config\etfuturum.cfg
echo     B:Elytra=false>>instances\default\.minecraft\config\etfuturum.cfg
echo     B:"Enchanting Table"=true>>instances\default\.minecraft\config\etfuturum.cfg
echo     B:Endermite=false>>instances\default\.minecraft\config\etfuturum.cfg
echo     B:"Fancy Skulls"=true>>instances\default\.minecraft\config\etfuturum.cfg
echo     B:"Fences and Gates"=true>>instances\default\.minecraft\config\etfuturum.cfg
echo     B:"Fences, gates and dead bushes burn"=true>>instances\default\.minecraft\config\etfuturum.cfg
echo     B:"Frost Walker"=true>>instances\default\.minecraft\config\etfuturum.cfg
echo     I:"Frost Walker ID"=36>>instances\default\.minecraft\config\etfuturum.cfg
echo     B:"Grass Path"=false>>instances\default\.minecraft\config\etfuturum.cfg
echo     B:"Heart Damage Indicator"=false>>instances\default\.minecraft\config\etfuturum.cfg
echo     B:"Inverted Daylight Sensor"=true>>instances\default\.minecraft\config\etfuturum.cfg
echo     B:"Iron Trapdoor"=true>>instances\default\.minecraft\config\etfuturum.cfg
echo     B:"Lingering Potions"=true>>instances\default\.minecraft\config\etfuturum.cfg
echo     I:"Max number of 1.8 stones in a cluster"=33>>instances\default\.minecraft\config\etfuturum.cfg
echo     B:Mending=true>>instances\default\.minecraft\config\etfuturum.cfg
echo     I:"Mending ID"=37>>instances\default\.minecraft\config\etfuturum.cfg
echo     B:"Mushroom Blocks"=true>>instances\default\.minecraft\config\etfuturum.cfg
echo     B:Mutton=true>>instances\default\.minecraft\config\etfuturum.cfg
echo     B:"Old Gravel"=false>>instances\default\.minecraft\config\etfuturum.cfg
echo     B:"Old Roses"=true>>instances\default\.minecraft\config\etfuturum.cfg
echo     B:Prismarine=true>>instances\default\.minecraft\config\etfuturum.cfg
echo     B:Rabbits=true>>instances\default\.minecraft\config\etfuturum.cfg
echo     B:"Recipes for prismarine"=false>>instances\default\.minecraft\config\etfuturum.cfg
echo     B:"Red Sandstone"=true>>instances\default\.minecraft\config\etfuturum.cfg
echo     B:"Shearing Snow Golems"=true>>instances\default\.minecraft\config\etfuturum.cfg
echo     B:"Shears harvest cobwebs"=true>>instances\default\.minecraft\config\etfuturum.cfg
echo     B:"Skin overlays"=false>>instances\default\.minecraft\config\etfuturum.cfg
echo     B:"Skulls drop from charged creeper kills"=true>>instances\default\.minecraft\config\etfuturum.cfg
echo     B:"Slime Block"=true>>instances\default\.minecraft\config\etfuturum.cfg
echo     B:Sponge=true>>instances\default\.minecraft\config\etfuturum.cfg
echo     B:"Stone Brick Recipes"=true>>instances\default\.minecraft\config\etfuturum.cfg
echo     B:Stones=true>>instances\default\.minecraft\config\etfuturum.cfg
echo     B:"Tipped Arrows"=true>>instances\default\.minecraft\config\etfuturum.cfg
echo     B:"Use updated food values"=true>>instances\default\.minecraft\config\etfuturum.cfg
echo     B:"Use updated harvest levels"=true>>instances\default\.minecraft\config\etfuturum.cfg
echo     B:"Villager Zombies"=true>>instances\default\.minecraft\config\etfuturum.cfg
echo     B:"Villagers turn into Witches when struck by lightning"=true>>instances\default\.minecraft\config\etfuturum.cfg
echo }>>instances\default\.minecraft\config\etfuturum.cfg

:: Configure Morpheus
echo settings {>instances\default\.minecraft\config\Morpheus.cfg
echo     B:AlertEnabled=true>>instances\default\.minecraft\config\Morpheus.cfg
echo     B:IncludeMiners=true>>instances\default\.minecraft\config\Morpheus.cfg
echo     S:OnMorningText=Wakey, wakey, rise and shine... Good Morning everyone!>>instances\default\.minecraft\config\Morpheus.cfg
echo     S:OnSleepText=is now sleeping.>>instances\default\.minecraft\config\Morpheus.cfg
echo     S:OnWakeText=has left their bed.>>instances\default\.minecraft\config\Morpheus.cfg
echo     I:SleeperPerc=50>>instances\default\.minecraft\config\Morpheus.cfg
echo }>>instances\default\.minecraft\config\Morpheus.cfg

:: Create shortcut
if exist "..\Play Minecraft.lnk" (
  del ""..\Play Minecraft.lnk""
)
..\bin\windows\all\shortcut\Shortcut.exe /F:"..\Play Minecraft.lnk" /A:C /T:"%cd%\Minecraft.exe" /W:"%cd%"
