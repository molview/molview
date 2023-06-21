#!/bin/bash

cp -r pages embed/pages
cp -r php embed/php

cp page.php embed/page.php
cp favicon.ico embed/favicon.ico

cp -r build embed/v1/build
cp -r jmol embed/v1/jmol

zip -r MolView.zip \
	build img jmol pages php embed \
	.htaccess robots.txt index.html page.php favicon.ico *.md *.png
