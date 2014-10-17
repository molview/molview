MolView
=======
MolView is a web application for drawing, searching and viewing chemical
structures. This web application is built on top of the JavaScript libraries
and online services listed below. I also drew inspration from the
[Virtual Model Kit](http://chemagic.com/JSmolVMK2.htm),
a similar webapplication.

**JavaScript libraries**

  - [MolEdit v1.2.4](https://www.molsoft.com/moledit.html): structural formula sketcher
  - [Ketcher](http://ggasoftware.com/opensource/ketcher): Molfile to SMILES conversion
  - [GLmol v0.47](http://webglmol.sourceforge.jp/index-en.html): primary 3D render engine
  - [JSmol v14.3.8](http://sourceforge.net/projects/jsmol/): 3D render engine
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
MolView (https://molview.org)
Copyright (c) 2014, Herman Bergwerf

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

1. Copy all files to a server with PHP and .htaccess support
2. Make sure npm, grunt, the Inkscape and the ImageMagick CLI are installed
3. Run `./build.sh`

Test
----
Below are all test instructions you have to pass before commiting changes

### Unstable build
1. Successfully run the build script
2. Check if `/embed?pdbid=2por&chainColor=residue&chainBonds=true&chainType=cylinders&mode=vdw` still works as expected
3. Verify for chances mentioned in CHANGELOG.md:
    1. Expected behaviour in Chrome and Firefox
    2. Expected layout and design on desktops (test Chrome and Firefox) and touch devices

### Stable build
1. Successful unstable build
2. Verify for all functions mentioned in docs/manual.pdf:
    1. Expected behaviour on desktops (test Chrome and Firefox), touch devices and mobile devices
    2. Expected layout and design on desktops (test Chrome and Firefox), touch devices and mobile devices
3. Verify for chances mentioned in CHANGELOG.md:
    1. Behaviour on desktops (test Chrome and Firefox), touch devices and mobile devices is "as designed"
    2. Layout and design on desktops (test Chrome and Firefox), touch devices and mobile devices is "as designed"
4. Make sure all pages are up-to-date
