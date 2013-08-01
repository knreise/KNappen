#!/bin/bash

DD=../../PhoneGap/ios/KNappen/assets/world/KNappen
rm -rf "$DD"
mkdir -p "$DD"
cp -va ./KNappen.MobileSPA/* "$DD"

pushd "$DD"
rm -rf Brukerdokumentasjon *.ts bin obj Properties UnitTests index.html Test.html index.html *.csproj *.user config.xml Web*.config packages.config
popd
