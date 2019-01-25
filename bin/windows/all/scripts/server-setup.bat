@echo off

:: Create EULA agreement
echo eula=true>eula.txt

:: Create server properties
copy ..\docs\assets\server.properties server.properties

:: Create server start script
copy ..\docs\assets\ServerStart.bat ServerStart.bat

:: Create config directory
md config

:: Configure The Aether II
md config\aether
copy "..\docs\assets\config\aether\Aether II.cfg" "config\aether\Aether II.cfg"

:: Configure Applied Energistics 2
md config\AppliedEnergistics2
copy ..\docs\assets\config\AppliedEnergistics2\AppliedEnergistics2.cfg config\AppliedEnergistics2\AppliedEnergistics2.cfg

:: Configure Ars Magica 2
md config\AM2
copy ..\docs\assets\config\AM2\AM2.cfg config\AM2\AM2.cfg

:: Configure Atum
copy ..\docs\assets\config\atum.cfg config\atum.cfg

:: Configure Biomes O' Plenty
md config\biomesoplenty
copy ..\docs\assets\config\biomesoplenty\ids.cfg config\biomesoplenty\ids.cfg

:: Configure Blood Magic
copy ..\docs\assets\config\AWWayofTime.cfg config\AWWayofTime.cfg

:: Configure Botania
copy ..\docs\assets\config\Botania.cfg config\Botania.cfg

:: Configure Buildcraft
md config\buildcraft
copy ..\docs\assets\config\buildcraft\main.cfg config\buildcraft\main.cfg

:: Configure CoFH Core
md config\cofh
md config\cofh\core
copy ..\docs\assets\config\cofh\core\common.cfg config\cofh\core\common.cfg

:: Configure CoFHTweaks
md config\cofh\tweak
copy ..\docs\assets\config\cofh\tweak\common.cfg config\cofh\tweak\common.cfg

:: Configure The Erebus
copy ..\docs\assets\config\erebus.cfg config\erebus.cfg

:: Configure Et Futurum
copy ..\docs\assets\config\etfuturum.cfg config\etfuturum.cfg

:: Configure Industrial Craft
copy ..\docs\assets\config\IC2.ini config\IC2.ini

:: Configure Mo' Creatures
md config\MoCreatures
copy ..\docs\assets\config\MoCreatures\MoCSettings.cfg config\MoCreatures\MoCSettings.cfg

:: Configure Morpheus
copy ..\docs\assets\config\Morpheus.cfg config\Morpheus.cfg

:: Configure Mystcraft
md config\mystcraft
copy ..\docs\assets\config\mystcraft\core.cfg config\mystcraft\core.cfg

:: Configure Shadow World
copy ..\docs\assets\config\shadowworld.cfg config\shadowworld.cfg

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
