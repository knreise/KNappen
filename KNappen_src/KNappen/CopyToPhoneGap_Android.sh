#!/bin/bash

DD=../../PhoneGap/Android/KNappen/assets/world/KNappen
rm -rf $DD
mkdir $DD
cp -va ./KNappen.MobileSPA/* $DD

pushd $DD
rm -rf bin obj Properties UnitTests index.html Test.html index.html *.csproj *.user config.xml Web*.config packages.config
popd

