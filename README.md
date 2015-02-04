MolView
=======
MolView is an intuitive, Open-Source web-application to make chemistry and biology
more awesome! MolView is mainly intended as web-based data visualization platform.
You can use MolView to search through different scientific databases including
compound databases, protein databases and spectral databases, and view records
from these databases as interactive visualizations using WebGL and HTML5 technologies.
This web application is built on top of the JavaScript libraries and online services listed below.
The [Virtual Model Kit](http://chemagic.com/JSmolVMK2.htm) has been a source of
inspiration for the birth of this project.

**JavaScript libraries**

  - [Ketcher](http://ggasoftware.com/opensource/ketcher): Chemical 2D data reader/writer
  - [GLmol v0.47](http://webglmol.sourceforge.jp/index-en.html): primary 3D render engine
  - [JSmol](http://jmol.sourceforge.net/): 3D render engine
  - [ChemDoodle Web Components v6.0.1](http://web.chemdoodle.com/): 3D render engine
    and spectrum display

**Databases/REST API's**

  - [NCI/CADD Chemical Identifier Resolver](http://cactus.nci.nih.gov/chemical/structure)
  - [RCSB Protein Databank](http://www.rcsb.org/pdb/software/rest.do) (~100.000 macromolecules)
  - [The PubChem Project](https://pubchem.ncbi.nlm.nih.gov/pug_rest/PUG_REST.html) (~51 million compounds)
  - [Crystallography Open Database](http://www.crystallography.net/) (~300.000 crystals)
  - [NIST Chemistry WebBook](http://webbook.nist.gov/chemistry) (~30.000 spectra)
  - [NMR Database](http://www.nmrdb.org/)
  - [MyMemory translation API](http://mymemory.translated.net/doc/spec.php)

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
Instructions:

1. Copy all files to a server with support for: PHP5, php5-curl, .htaccess and mod_rewrite
2. Configure $directory in `php/utility.php` to point to the MolView root directory
3. Configure ErrorDocument in `.htaccess` to point to `page.php`
4. Make sure the Inkscape and the ImageMagick CLI are installed
5. Install npm and install local npm modules
6. Run `./build.sh fetch jmol`

Committing
---------
Below are all tests you have to pass before committing changes

### Unstable build
1. Successfully run the build script
2. Check if the embedding is still working as expected:
    1. [2POR](embed?pdbid=2por&chainColor=residue&chainBonds=true&chainType=cylinders&mode=vdw) (PDBID loading & protein representation)
    2. [LSD](embed?smiles=O=C%28[C@@]%28[H]%291C=C2C3C=CC=C4C=3C%28=CN4[H]%29C[C@@]2%28[H]%29N%28C%29C1%29N%28CC%29CC&bg=white) (SMILES resolving & background color)
    3. [Mustard gas](embed?cid=10461&mode=wireframe) (CID loading & molecule representation)
    4. [Pyrite](embed?codid=5000115&bg=black) (CODID loading & background color)
    4. [Benzene](embed?q=Benzene) (text resolving)
3. Verify for chances mentioned in CHANGELOG.md:
    1. Expected behaviour in Chrome and Firefox
    2. Expected layout and design on desktops (test on Chrome and Firefox) and touch devices

### Stable build
1. Successful unstable build
2. Verify for all functions mentioned in docs/manual.pdf:
    1. Expected behaviour on desktops (test on Chrome and Firefox), touch devices and mobile devices
    2. Expected layout and design on desktops (test on Chrome and Firefox), touch devices and mobile devices
3. Verify for chances mentioned in CHANGELOG.md:
    1. Behaviour on desktops (test on Chrome and Firefox), touch devices and mobile devices is "as designed"
    2. Layout and design on desktops (test on Chrome and Firefox), tablets and smartphones is "as designed"
4. Verify if all pages are up-to-date
