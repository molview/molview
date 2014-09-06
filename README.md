MolView
=======
MolView is a web application for drawing, searching and viewing chemical
structures. This web application is built upon the JavaScript libraries
and online services listed below. I also drew inspration from the
[Virtual Model Kit](http://chemagic.com/JSmolVMK2.htm),
a similar webapplication.

**JavaScript libraries**

  - [MolEdit v1.2.4](https://www.molsoft.com/moledit.html): sketcher
    (modified with permission from [MolSoft](https://www.molsoft.com/))
  - [Ketcher](http://ggasoftware.com/opensource/ketcher): SMILES conversion
    (modified under GNU Affero GPL)
  - [GLmol v0.47](http://webglmol.sourceforge.jp/index-en.html): 3D rendering
    (modified under MIT licence)
  - [JSmol](http://sourceforge.net/projects/jsmol/): 3D rendering
    (Jmol v14.0.11)
  - [ChemDoodle Web Components v6.0.1](http://web.chemdoodle.com/): 3D rendering
    and spectrum display

**Databases/REST API's**

  - [NCI/CADD Chemical Identifier Resolver](http://cactus.nci.nih.gov/chemical/structure)
  - [RCSB Protein Databank](http://www.rcsb.org/pdb/software/rest.do)
  - [The PubChem Project](https://pubchem.ncbi.nlm.nih.gov/pug_rest/PUG_REST.html)
  - [Crystallography Open Database](http://www.crystallography.net/)
  - [NMR Database](http://www.nmrdb.org/)
  - [NIST Chemistry WebBook](http://webbook.nist.gov/chemistry)
  - [MyMemory translation API](http://mymemory.translated.net/doc/spec.php)

License
-------
MolView (http://molview.org)
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

See LICENSE.md for more details about third party code.

Build
-----
Instructions:
1. Copy all files to a server with PHP and .htaccess support
2. Make sure npm, grunt, the Inkscape and the ImageMagick CLI are installed
3. Run `./build.sh`
