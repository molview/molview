MolView
=======
This repository contains the code of the old MolView app which was developed
between 2012 and 2015, and which as of 2025 can still be used without charge
at https://molview.org. Since 2023 patches to this code are no longer released
under an open-source license. This repository also includes the code of several
external open-source dependencies. In most code files, the author and copyright
details are indicated in the header. For more information please send an email
to info@bergwerf-labs.com.

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
