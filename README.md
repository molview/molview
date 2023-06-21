MolView
=======
This repository holds the code of MolView.org. MolView and the source code of
MolView are Copyright of Herman Bergwerf. You are not allowed to redistribute it
without written permission.

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
