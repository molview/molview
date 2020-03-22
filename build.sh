#!/usr/bin/env bash

# Build script for the MolView source code

if [[ $1 == "fetch" ]]
	then

	if [[ $2 == "jmol" ]]
		then

		# Download and unzip JSmol
		if [[ $3 == "nightly" ]]
			then

			wget -O Jmol.zip http://chemapps.stolaf.edu/jmol/zip/Jmol.zip
			unzip Jmol.zip jsmol.zip

		else # stable

			wget -O Jmol.zip http://sourceforge.net/projects/jmol/files/latest/download?source=files
			unzip -j Jmol.zip */jsmol.zip

		fi

		unzip jsmol.zip
		mv jsmol/JSmol.min.js src/js/lib/JSmol.min.js
		rm -r jmol
		mkdir jmol
		mv jsmol/j2s jmol/j2s
		rm -r jsmol
		rm jsmol.zip
		rm Jmol.zip

	fi

	# Download third party PHP
	wget https://raw.githubusercontent.com/erusev/parsedown/master/Parsedown.php
	mv Parsedown.php php/Parsedown.php

	wget https://raw.githubusercontent.com/serbanghita/Mobile-Detect/master/Mobile_Detect.php
	mv Mobile_Detect.php php/Mobile_Detect.php

fi

if [[ $1 != "render" ]]
	then

	./node_modules/.bin/bower install
	./node_modules/.bin/grunt

fi

# Render SVG logos as PNG images
inkscape src/svg/icon/mark.svg --export-png=img/mark.png -w1050 -h256
inkscape src/svg/icon/48.svg --export-png=img/logo.png -w256 -h256
inkscape src/svg/icon/48.svg --export-png=img/image.png --export-background=#ffffff -w256 -h256

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
