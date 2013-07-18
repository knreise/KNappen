#!/bin/bash


echo
echo
echo
echo HUSK: Det hjelper ikke å oppgradere noe uten TypeScript compile...
echo
echo
echo

pushd ../../..
svn update
popd

echo Deleting old files
rm -rf KNappen/assets/world/KNappen/*

echo Copying new files.
cp -a ../../KNappen_src/KNappen/KNappen.MobileSPA/* KNappen/assets/world/KNappen/

echo Done, ready to compile.

