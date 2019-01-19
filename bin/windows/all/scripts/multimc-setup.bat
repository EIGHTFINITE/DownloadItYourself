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
echo difficulty:^3>..\minecraft\options.txt
echo key_of.key.zoom:0>>..\minecraft\options.txt

:: Configure OptiFine
echo ofRandomMobs:false>..\minecraft\optionsof.txt

:: Create config directory
mkdir ..\minecraft\config

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
echo     B:"Grass Path"=true>>..\minecraft\config\etfuturum.cfg
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

:: Create shortcut
if exist "..\Play Minecraft.lnk" (
  del ""..\Play Minecraft.lnk""
)
..\bin\windows\all\shortcut\Shortcut.exe /F:"..\Play Minecraft.lnk" /A:C /T:"%cd%\Minecraft.exe" /W:"%cd%"
