# Changelog

## 2.2.x

### Bugfixes

- Added CIF validation in cif.php mirror
- Added JSmol middle mouse button dragging
- Patched Chemical Identifier Resolver lookup failure (pass '/' as '%5C' in SMILES)
- Patched Firefox mousewheel bug in sketcher (removed jMouseWheel everywhere)
- Patched GLmol.zoomInto bug
- Fixed GLmol face culling issue
- Fixed JSmol measure and rotate issue

### Revisions

#### Data loading
- Revised InfoCard loading sequence
- Removed COD text search
- Revised COD search SQL logic
- Merged all COD search data into one request
- Removed MyMemory translation from PubChem, RCSB and COD search

#### Functionality
- Replaced Jmol render-mode menu with HQ switch
- Removed auto layout-model onload crystals
- Removed embed warning about slow, non-WebGL devices
- Removed identifier search from Advanced search functions
- Added meta key support for Mac

#### Design
- Redesigned messages
- Redesigned search results
- Redesigned search form (align left)
- Redesigned general UI components (flat and light)
- Redesigned sketcher selection style
- Improved menu overflow scrolling
- Added compact menu layout
- Added canvas based Progress bar
- Added server-side device detection using MobileDetect

#### Refactoring
- Revised CSS efficiency
- Migrated CSS to LESS
- Renamed Loader modules
- Renamed protein to biomolecule
- Moved metadata lookup to separate PHP file
- Splitted `ChemicalData` into `InfoCard` and `Spectroscopy`
- Added COD MineralNames auto-update script

### Features

#### Data loading
- Added server-side COD search sorting
- Added JSON format for COD search errors
- Added crystal 2D depiction fallbacks
+ Add SMILES 3D conformation method using PubChem (CIR as fallback)
+ Add CAS lookup method using PubChem (CIR as fallback)

#### Functionality
- Added Autocomplete for compound, mineral and macromolecule names
- Added protein chain representation and color scheme settings
- Added bio-assembly function
- Added MolView themes menu (desktop and touch)
- Added Model background color menu
- Added transparency to exported images
- Added open in new tab support for search results
- Added auto search results loading when scrolling to the bottom of the page
+ Add Preferences interface using HTML5 Web Storage
+ Add "Don't show again" hide option to Messages alerts
- Added deuterium support to the Sketcher (without UI binding)
- Added implicit hydrogen stripping switch to Sketcher
- Added 3D model source reference to Tool menu
- Added NIST Chemistry WebBook page reference
- Added percent composition table to Information card

#### Design
- Added UI layer framework (layers: main, search, infocard, spectra)
- Added menu-toggle hover event for non-touch devices
- Added menu-item icons
- Added welcome dialog
- Added dialog close buttons
- Added CODID to COD advanced search results
- Added responsive search results layout
- Added support for devicePixelRatio > 1.0

#### Analytics
+ Add user interaction tracker using analytics.js
+ Add debugging using analytics.js

### Miscellaneous

- Redesigned logo
- Added AGPL license
- Added build script (fetch libs, run grunt, render SVG)
- Added Tems of Use
- Added testing procedure
- Added markdown renderer for markdown files (thanks, changelog, license, legal)
- Added markdown based error pages (internetExplorer, htmlCanvas, HTTP errors)

## 2.1.3 (2014-07-07)

### Bugfixes
- Removed wrong reference to `cb` in the `Loader.Compounds.loadCID` CIR fallback
- Added PubChem 2D fallback for SMILES error in the `Loader.Compounds.loadCID` CIR fallback

## 2.1.2 (2014-07-05)

### Revisions
- Hide molecule-image when unavailable
- Improved small screen messages layout
- Removed double `Messages.progress` calls for CID, PDBID and CODID loading

### Features
- Crystals CODID direct search

## 2.1.1 (2014-07-04)

### Bugfixes
- Removed `jMouseWheel` from GLmol (Firefox bug)
- Fixed crystal search results formula overflow

### Revisions

- Revised ChemicalData image loading appearance

## 2.1.x (2014-07-04)

### Bugfixes
- No auto hsplit when loaded as `?layout=model`
- Jmol CIF no full unitcell after initialisation (using scriptWaitOutput)
- Jmol load structure + setRepresentation flash (using scriptWaitOutput)
- Jmol re-enable measurement after Model is updated
- Removed alerts in m2s (Ketcher MOL2SMILES port)

### Revisions
- Replaced `MolView.contentClass` with `MolView.layout`
- Replaced /data/CSID2CODID.txt with COD chemspider_x_cod database
- Implemented Jmol scriptWaitOutput
- Improved `ChemicalView.removeImplicitHydrogen`
- Revised search result title appereance
- Removed forced model view for crystals (except for onload view)
- ChemicalData PubChem integration redesign
- ChemicalData CanonicalSMILES from PubChem

### Features
- Form focus styles
- Jmol MMFF94 energy minimalization implementation
- COD SMILES to Sketcher implementation
- PubChem CID search by entering integer
- Improved properties dialog layout on tablets

## 2.0.x (2014-07-01)

### Features
- MolEdit integration
- GLmol, JSmol, ChemDoodle Web integration
- JSmol scripts
- NCI/CADD Chemical Identifier Resolver integration
- PubChem integration
- RCSB integration (PDB only)
- COD integration (CIF only)
- NIST Chemistry Webbook integration
