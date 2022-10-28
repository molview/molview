#!/bin/bash

cp -r build embed/build
cp -r pages embed/pages
cp -r php embed/php
cp -r img embed/img

cp page.php embed/page.php
cp favicon.ico embed/favicon.ico

cp -r build embed/v1/build
cp -r jmol embed/v1/jmol

zip -r dist/molview.zip \
	build img jmol licenses pages php embed \
	.htaccess robots.txt index.html page.php facivon.ico *.md *.png
