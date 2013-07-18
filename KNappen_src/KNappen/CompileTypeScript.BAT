@echo off
del TypeScriptFiles.txt 2> NUL
for /r ".\KNappen.MobileSPA" %%i in (*.ts) do @call :CompileTS "%%i"
tsc.exe --comments --sourcemap @TypeScriptFiles.txt
goto EOF



:CompileTS
if "" == "%1" goto :EOF
setlocal ENABLEEXTENSIONS
set FO=%1
set FO=%FO:.ts"=.js"%
echo %1 >> TypeScriptFiles.txt
endlocal & goto :EOF

:EOF
del TypeScriptFiles.txt
