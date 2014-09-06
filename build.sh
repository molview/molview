#!/usr/bin/env bash

# Build entire MolView project

# Download and unzip JSmol
wget http://downloads.sourceforge.net/project/jmol/Jmol/Version%2014.2/Version%2014.2.4/Jmol-14.2.4_2014.08.03-binary.zip
unzip Jmol-14.2.4_2014.08.03-binary.zip
unzip jmol-14.2.4_2014.08.03/jsmol.zip
mv jsmol/JSmol.min.js src/js/lib/JSmol.min.js
mkdir jmol
mv jsmol/j2s jmol/j2s
rm -r jsmol
rm -r jmol-14.2.4_2014.08.03
rm Jmol-14.2.4_2014.08.03-binary.zip

# Download some third party code
wget http://code.jquery.com/jquery-1.11.1.min.js
mv jquery-1.11.1.min.js src/js/lib/jquery.min.js

wget https://raw.githubusercontent.com/jeresig/jquery.hotkeys/master/jquery.hotkeys.js
mv jquery.hotkeys.js src/js/lib/jquery.hotkeys.js

wget https://raw.githubusercontent.com/eligrey/FileSaver.js/master/FileSaver.js
mv FileSaver.js src/js/lib/FileSaver.js

wget https://raw.githubusercontent.com/eligrey/Blob.js/master/Blob.js
mv Blob.js src/js/lib/Blob.js

# Install node modules and run grunt
npm install
grunt

# Render SVG logos as PNG images
inkscape src/svg/icon/48.svg --export-png=img/logo.png -w192 -h192
inkscape src/svg/icon/square.svg --export-png=img/image.png --export-background=#ffffff  -w256 -h256

inkscape src/svg/icon/square-precomposed.svg --export-png=homescreen-192x192.png -w192 -h192
inkscape src/svg/icon/square-precomposed.svg --export-png=homescreen-128x128.png -w128 -h128
inkscape src/svg/icon/square.svg --export-png=apple-touch-icon.png -w57 -h57
inkscape src/svg/icon/square.svg --export-png=apple-touch-icon-60x60.png -w60 -h60
inkscape src/svg/icon/square.svg --export-png=apple-touch-icon-72x72.png -w72 -h72
inkscape src/svg/icon/square.svg --export-png=apple-touch-icon-76x76.png -w76 -h76
inkscape src/svg/icon/square.svg --export-png=apple-touch-icon-114x114.png -w114 -h114
inkscape src/svg/icon/square.svg --export-png=apple-touch-icon-120x120.png -w120 -h120
inkscape src/svg/icon/square.svg --export-png=apple-touch-icon-144x144.png -w144 -h144
inkscape src/svg/icon/square.svg --export-png=apple-touch-icon-152x152.png -w152 -h152

inkscape src/svg/icon/16.svg --export-png=favicon-16x16.png -w16 -h16
inkscape src/svg/icon/16.svg --export-png=favicon-24x24.png -w24 -h24
inkscape src/svg/icon/16.svg --export-png=favicon-32x32.png -w32 -h32
inkscape src/svg/icon/16.svg --export-png=favicon-64x64.png -w64 -h64
convert favicon-16x16.png favicon-24x24.png favicon-32x32.png favicon-64x64.png favicon.ico
