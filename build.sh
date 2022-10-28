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

fi

if [[ $1 != "render" ]]
	then

	bower install
	grunt

fi

# Render SVG logos as PNG images
mkdir -p img
inkscape src/svg/icon/mark.svg --export-filename=img/mark.png -w 1050 -h 256
inkscape src/svg/icon/48.svg --export-filename=img/logo.png -w 256 -h 256
inkscape src/svg/icon/square.svg --export-filename=img/maskable-192x192.png -w 192 -h 192

inkscape src/svg/icon/16.svg --export-filename=favicon-16x16.png -w 16 -h 16
inkscape src/svg/icon/16.svg --export-filename=favicon-24x24.png -w 24 -h 24
inkscape src/svg/icon/16.svg --export-filename=favicon-32x32.png -w 32 -h 32
inkscape src/svg/icon/16.svg --export-filename=favicon-64x64.png -w 64 -h 64
inkscape src/svg/icon/48.svg --export-filename=img/logo-512x512.png -w 512 -h 512
convert favicon-16x16.png favicon-24x24.png favicon-32x32.png favicon-64x64.png favicon.ico
