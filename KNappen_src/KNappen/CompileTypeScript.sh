#!/bin/bash

export PATH=$PATH:/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin:/usr/X11/bin

#find . -type f | grep "\.ts" | grep -v "\.d\.ts" > TypeScriptFiles.txt
(
  find ./KNappen.MobileSPA/JS/System/ -type f; 
  find ./KNappen.MobileSPA/JS/App/ -type f;
  find ./KNappen.MobileSPA/PhoneGap/ -type f
) | grep "\.ts" | grep -v "\.d\.ts" > TypeScriptFiles.txt

tsc --comments --sourcemap @TypeScriptFiles.txt
rm -rf TypeScriptFiles.txt

