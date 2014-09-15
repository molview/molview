## Whishlist:

  - Add CIF loader to GLmol
  - Add EDTSurf (protein surfaces) implementation to GLmol
  - Add THREE.CanvasRenderer to GLmol (update THREE.js)
  - Add protein solvents display
  - Add electron density maps for macromolecules
  - Add dotted H-bonds and SS-bonds for proteins
  - Create interactive macromolecule exploration

  - Integrate COD image archive
  - Build COD archive mirror
  - Create Touch menu drawer
  - MolView home website (pages: features, about, manual, changelog, license, feedback)
  - MolView for Android and iOS using CocoonJS
  - Backend services using CDK and the Google Cloud Platform
  - Investigate Mathematica features

## 2.2.x

Project:

  - Added AGPL license
  - Added build script (fetch libs, run grunt, render SVG)
  > Add Privacy Policy
  > Add test procedure

Bugfixes:

  - Added CIF validation in cif.php mirror
  - Patched Chemical Identifier Resolver lookup failure ('/' as '%5C')
  - Patched Firefox mousewheel bug in sketcher (removed jMouseWheel everywhere)
  - Patched GLmol.zoomInto bug
  - Fixed GLmol face culling issue
  - Fixed JSmol measure and rotate issue

Revisions:

  - Revised logo
  - Revised CSS efficiency
  - Migrated CSS to LESS
  - Redesigned sketcher selection style
  - Redesigned UI (flat and light)
  - Redesigned search results style
  - Added crystal 2D depiction fallbacks
  - Revised Information loading sequence
  - Renamed Loader modules
  - Renamed protein to biomolecule
  - Splitted `ChemicalData` into `InfoCard` and `Spectroscopy`
  - Moved metadata lookup to separate PHP file
  - Replaced Jmol render-mode menu with hq switch
  - Removed auto layout-model onload crystals
  - Removed embed warning about slow, non-WebGL devices

Features:

  - Added PDBID search
  - Added JSmol middle mouse button dragging
  - Added Autocomplete for compounds, minerals and proteins
  - Added transparency to exported images
  - Added dialog close buttons
  - Added welcome dialog
  - Added Model background color menu
  - Added MolView themes menu (desktop and touch)
  - Added UI layer framework (layers: main, search, infocard, spectra)
  - Added menu-toggle hover event for non-touch devices
  - Added menu-item icons
  - Added bio-assembly function
  - Added protein chain representation and color scheme settings
  > Add external references to Information card (Chemicalize, Google, PDB, COD)
  > Add scientific reference to the NIST Chemistry WebBook for spectra
  > Add percent composition table to Information card
  > Add CAS lookup fallback using PubChem
  > Add SMILES 3D conformation fallback using PubChem
  > Add SMILES 3D conformation URL keys (CID > InChiKey > SMILES)
  > Add *Don't show me again* option to Messages alerts
  > Add user preferences storage using HTML5 Web Storage
  > Add functional groups support in Sketcher
  > Track user interaction via analytics.js
  > Debug via analytics.js

## 2.1.3 (2014-07-07)

Bugfixes:

  - Removed wrong reference to `cb` in the `Loader.Compounds.loadCID` CIR fallback
  - Added PubChem 2D fallback for SMILES error in the `Loader.Compounds.loadCID` CIR fallback

## 2.1.2 (2014-07-05)

Revisions:

  - Hide molecule-image when unavailable
  - Improved small screen messages layout
  - Removed double `Messages.progress` calls for CID, PDBID and CODID loading

Features:

  - Crystals CODID direct search

## 2.1.1 (2014-07-04)

Bugfixes:

  - Removed `jMouseWheel` from GLmol (Firefox bug)
  - Fixed crystal search results formula overflow

Revisions:

  - Revised ChemicalData image loading appearance

## 2.1.x (2014-07-04)

Bugfixes:

  - No auto hsplit when loaded as `?layout=model`
  - Jmol CIF no full unitcell after initialisation (using scriptWaitOutput)
  - Jmol load structure + setRepresentation flash (using scriptWaitOutput)
  - Jmol re-enable measurement after Model is updated
  - Removed alerts in m2s (Ketcher MOL2SMILES port)

Revisions:

  - Replaced `MolView.contentClass` with `MolView.layout`
  - Replaced /data/CSID2CODID.txt with COD chemspider_x_cod database
  - Implemented Jmol scriptWaitOutput
  - Improved `ChemicalView.removeImplicitHydrogen`
  - Revised search result title appereance
  - Removed forced model view for crystals (except for onload view)
  - ChemicalData PubChem integration redesign
  - ChemicalData CanonicalSMILES from PubChem

Features:

  - Form focus styles
  - Jmol MMFF94 energy minimalization implementation
  - COD SMILES to Sketcher implementation
  - PubChem CID search by entering integer
  - Improved properties dialog layout on tablets

## 2.0.x (2014-07-01)

Features:

  - MolEdit integration
  - GLmol, JSmol, ChemDoodle Web integration
  - JSmol scripts
  - NCI/CADD Chemical Identifier Resolver integration
  - PubChem integration
  - RCSB integration (PDB only)
  - COD integration (CIF only)
  - NIST Chemistry Webbook integration
