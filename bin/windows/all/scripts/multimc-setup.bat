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
echo SelectedInstance=default>>multimc.cfg

:: Configure instance
copy ..\docs\assets\instance.cfg instances\default\instance.cfg

:: Configure Minecraft
copy ..\docs\assets\options.txt ..\minecraft\options.txt

:: Configure OptiFine
copy ..\docs\assets\optionsof.txt ..\minecraft\optionsof.txt

:: Configure Shaders
copy ..\docs\assets\optionsshaders.txt ..\minecraft\optionsshaders.txt

:: Create config directory
md ..\minecraft\config

:: Configure The Aether II
md ..\minecraft\config\aether
copy "..\docs\assets\config\aether\Aether II.cfg" "..\minecraft\config\aether\Aether II.cfg"

:: Configure Applied Energistics 2
md ..\minecraft\config\AppliedEnergistics2
copy ..\docs\assets\config\AppliedEnergistics2\AppliedEnergistics2.cfg ..\minecraft\config\AppliedEnergistics2\AppliedEnergistics2.cfg

:: Configure Ars Magica 2
md ..\minecraft\config\AM2
copy ..\docs\assets\config\AM2\AM2.cfg ..\minecraft\config\AM2\AM2.cfg

:: Configure Atum
copy ..\docs\assets\config\atum.cfg ..\minecraft\config\atum.cfg

:: Configure Biomes O' Plenty
md ..\minecraft\config\biomesoplenty
copy ..\docs\assets\config\biomesoplenty\ids.cfg ..\minecraft\config\biomesoplenty\ids.cfg

:: Configure Blood Magic
copy ..\docs\assets\config\AWWayofTime.cfg ..\minecraft\config\AWWayofTime.cfg

:: Configure Botania
copy ..\docs\assets\config\Botania.cfg ..\minecraft\config\Botania.cfg

:: Configure Buildcraft
md ..\minecraft\config\buildcraft
copy ..\docs\assets\config\buildcraft\main.cfg ..\minecraft\config\buildcraft\main.cfg

:: Configure CoFH Core
md config\cofh
md config\cofh\core
copy ..\docs\assets\config\cofh\core\common.cfg ..\minecraft\config\cofh\core\common.cfg

:: Configure Custom Main Menu
md ..\minecraft\config\CustomMainMenu
copy ..\docs\assets\config\CustomMainMenu\mainmenu.json ..\minecraft\config\CustomMainMenu\mainmenu.json

:: Custom Main Menu resources
md ..\minecraft\resources
md ..\minecraft\resources\mainmenu
copy ..\docs\assets\background.png ..\minecraft\resources\mainmenu\background.png
copy ..\docs\assets\longbutton.png ..\minecraft\resources\mainmenu\longbutton.png
copy ..\docs\assets\midbutton.png ..\minecraft\resources\mainmenu\midbutton.png
copy ..\docs\assets\modpack.png ..\minecraft\resources\mainmenu\modpack.png
copy ..\docs\assets\shortbutton.png ..\minecraft\resources\mainmenu\shortbutton.png
md ..\minecraft\mod-config
copy ..\docs\assets\menu.dat ..\minecraft\mod-config\menu.dat

:: Configure Dynamic Lights
copy ..\docs\assets\config\DynamicLights.cfg ..\minecraft\config\DynamicLights.cfg

:: Configure The Erebus
copy ..\docs\assets\config\erebus.cfg ..\minecraft\config\erebus.cfg

:: Configure Et Futurum
copy ..\docs\assets\config\etfuturum.cfg ..\minecraft\config\etfuturum.cfg

:: Configure Industrial Craft
copy ..\docs\assets\config\IC2.ini ..\minecraft\config\IC2.ini

:: Configure Mo' Creatures
md ..\minecraft\config\MoCreatures
copy ..\docs\assets\config\MoCreatures\MoCSettings.cfg ..\minecraft\config\MoCreatures\MoCSettings.cfg

:: Configure Morpheus
copy ..\docs\assets\config\Morpheus.cfg ..\minecraft\config\Morpheus.cfg

:: Configure Mystcraft
md ..\minecraft\config\mystcraft
copy ..\docs\assets\config\mystcraft\core.cfg ..\minecraft\config\mystcraft\core.cfg

:: Configure RotaryCraft
md ..\minecraft\config\Reika
copy ..\docs\assets\config\Reika\RotaryCraft.cfg ..\minecraft\config\Reika\RotaryCraft.cfg

:: Configure Shadow World
copy ..\docs\assets\config\shadowworld.cfg ..\minecraft\config\shadowworld.cfg

:: Configure StarMiner
copy ..\docs\assets\config\Starminer.cfg ..\minecraft\config\Starminer.cfg

:: Configure Thaumcraft
copy ..\docs\assets\config\Thaumcraft.cfg ..\minecraft\config\Thaumcraft.cfg

:: Configure Thaumic Exploration
copy ..\docs\assets\config\ThaumicExploration.cfg ..\minecraft\config\ThaumicExploration.cfg

:: Configure Thaumic Tinkerer
copy ..\docs\assets\config\ThaumicTinkerer.cfg ..\minecraft\config\ThaumicTinkerer.cfg

:: Configure The Twilight Forest
copy ..\docs\assets\config\TwilightForest.cfg ..\minecraft\config\TwilightForest.cfg

:: Create shortcut
if exist ..\Play Minecraft.lnk (
  del ..\Play Minecraft.lnk
)
..\bin\windows\all\shortcut\Shortcut.exe /F:"..\Play Minecraft.lnk" /A:C /T:"%cd%\Minecraft.exe" /W:"%cd%"
