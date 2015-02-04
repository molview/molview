Wishlist
========

Main interface
--------------
- Material Design
- Touch menu drawer
- Preferences dialog
- Autocomplete for SMILES, InChi, InChiKey and Molecular Formula
- Dataset checklist for common Autocomplete autofill sources
- Dynamic CIF cell size in crystal menu

Sketcher
--------
- Class implementation
- Ring detection
- Soft hydrogens
- Functional groups
- Lewis dot structures display
- Polymer units implementation
- PoseView like protein display: http://poseview.zbh.uni-hamburg.de
- URL API for /embed.sketcher (create new inheritance model)
- SVG export (through canvas context wrapper)

Model
-----
- Class implementation
- Auto-rotate function
- Toolbar with contextual tools
- EDTSurf (protein surfaces) implementation in GLmol
- THREE.js upgrade for GLmol
- THREE.CanvasRenderer for GLmol
- THREE.RaytracingRenderer for GLmol
- HQ OBJ export on top of GLmol
- CIF loader for GLmol
- Protein solvents display
- Dotted H-bonds and SS-bonds for proteins
- Switch for multiple protein assemblies
- Electron density maps (MO) for macromolecules and small molecules
- Interactive macromolecule exploration mode

Datasets
--------
- Crystal morphology from Smorf viewer (special collection)
- Reaction animations using the MACiE database (special collection)
- Reaction animations from ChemTube3D (special collection)
- More extensive protein autocomplete dataset
- PDBe binding in order to replace RCSB
- ChemSpider PHP binding
- OpenData spectra from ChemSpider
- New SpectrumView class with support for more spectra and spectral analysis
- COD image API
- COD mirror

Misc
----
- Create MolView blog based on Jekyll
- Move changelog to GitHub release notes
- Use GitHub issue tracker for all revisions and bugs
- MolView home website (pages: features, about, manual, changelog, license, feedback)
- MolView manual as single wikitext collection
- Images and animations for MolView web manual
- JMV (JSON MolView data) files (local, gdrive, dropbox)
- Client-side structural formula depiction using JavaScript
- Server-side structural formula rendering using NodeJS
- Server-side protein thumbnail rendering using NodeJS and PV (http://github.com/biasmv/pv)
- Developer framework: layer extensions and search extensions
- Create extensions from already existing features to remove them from the core program
- Android app based on CrossWalk
