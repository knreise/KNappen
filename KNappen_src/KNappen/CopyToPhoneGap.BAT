@echo off

set DD=..\..\PhoneGap\Android\KNappen\assets\world\KNappen
REM del /S /Q "%DD%\*.*"
REM rd /S /Q "%DD%"
REM mkdir "%DD%"
ROBOCOPY .\KNappen.MobileSPA\ "%DD%" /MIR
cd "%DD%"
cd
rd /S /Q bin
rd /S /Q obj
rd /S /Q Properties
rd /S /Q UnitTests
del /Q index.html Test.html index.html *.csproj *.user config.xml Web*.config packages.config

