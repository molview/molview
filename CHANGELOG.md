## 2.3.x

Improvement subjects:

 - Add CIF loader to GLmol
 - Add EDTSurf implementation to GLmol
 - Add protein solvents display to GLmol
 - Add THREE.CanvasRenderer to GLmol (update THREE.js)
 - Add electron density maps for macromolecules

 - Server-sise backend services (depiction)
 - MolView home website (features, mission, manual)
 - MolView for Android and iOS using Apache Cordova

## 2.2.x

Bugfixes:

  - Patched Chemical Identifier Resolver lookup failure ('/' as '%5C')
  - Patched Firefox mousewheel bug in sketcher (removed jMouseWheel everywhere)
  - Added empty CIF validation in cif.php mirror
  - Added crystal 2D depiction fallbacks
  - Fixed GLmol face culling issue

Revisions:

  - Revised logo
  - Removed auto onload model layout for crystals
  - Redesigned sketcher selection style
  - Redesigned UI (flat and light)
  - Redesigned search results style
  - Revised CSS efficiency
  - Migrated CSS to LESS
  - Minified JS and CSS
  - Minified SVG
  - Renamed Loader modules
  - Renamed protein to biomolecule
  - Splitted `ChemicalData` into `InfoCard` and `Spectroscopy`
  - Revised Information loading sequence
  - Moved metadata lookup to separate PHP file

Features:

  - Added PDBID search
  - Added GLmol menu for WebGL devices
  - Added JSmol middle mouse button dragging
  - Added Autocomplete for compounds, minerals and proteins
  - Moved InfoCard and Spectra to separate layer
  - Added transparency support for exported images
  - Added option to alter the Model background color
  - Added dialog close buttons
  - Added welcome dialog
  - Added option to switch between MolView themes (desktop and touch)
  - Added menu-toggle hover event for non-touch devices
  > Added menu-item icons
  > Added external references to Information card (Chemicalize, Google, PDB, COD)
  > Added scientific reference to the NIST Chemistry WebBook for spectra
  > Added percent composition table to Information card
  > Added CAS lookup fallback using PubChem
  > Added SMILES 3D conformation fallback using PubChem
  > Added SMILES 3D conformation URL keys (CID > InChiKey > SMILES)
  > Added *Don't show me again* option to Messages alerts
  > Added user preferences storage using HTML5 Web Storage
  > Added functional groups support in Sketcher
  > Integrated COD image archive
  > Track user interaction via analytics.js

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
