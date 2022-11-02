MolView
=======
This repository holds the code of MolView.org. There is some work on a new
version of this site that will fix some of the issues with this version.

License
-------
```
MolView (http://molview.org)
Copyright (c) 2014, 2015 Herman Bergwerf

MolView is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

MolView is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with MolView.  If not, see <http://www.gnu.org/licenses/>.
```
See LICENSE.md for more details about third party code.

Build
-----

1. Copy all files to a server with support for: PHP, PHP cURL, mod_rewrite.
2. Make sure the Inkscape and the ImageMagick CLI are installed.
3. Install npm and install local npm modules.
4. Run the build script: `./build.sh fetch jmol`
   - Only render images: `./build.sh render`
   - Also run bower and grunt: `./build.sh`
   - Also download Parsedown (PHP) library: `./build.sh fetch`
   - Also download Jmol from sourceforge: `./build.sh fetch jmol`
   - Also download Jmol from stolaf.edu: `./build.sh fetch jmol nightly`
