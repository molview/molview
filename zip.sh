#!/bin/bash

cp -r build embed/v1/build
cp -r jmol embed/v1/jmol

zip -r MolView.zip \
	build img jmol pages php embed \
	.htaccess robots.txt index.html page.php favicon.ico *.md *.png
