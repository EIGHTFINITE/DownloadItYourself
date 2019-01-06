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

:: Create shortcut
if exist "..\Play Minecraft.lnk" (
  del ""..\Play Minecraft.lnk""
)
..\bin\windows\all\shortcut\Shortcut.exe /F:"..\Play Minecraft.lnk" /A:C /T:"%cd%\Minecraft.exe" /W:"%cd%"
