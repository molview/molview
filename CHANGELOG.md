# Changelog

## 2.3.2

- Added query parameter preloading to Model
- Added shortcuts default action prevention
- Removed implicit H atoms from calculated fragments
- Removed protein display information in embed URL for non-proteins
- Removed inconsistent layer close event tracking
- Reverted HTML select style to native style
- Fixed Autocomplete submit Progress reset in CIR fallback
- Fixed bad contrast for .alert-message links
- Fixed GLmol in iframe pointer loss bug
- Fixed wrong font-family in layout vector drawings

### MolPad

- Revised refresh cycle
- Revised history logic
- Added selection tool
- Added fragment to bond tool
- Added fragment to bond collapsing and side detection
- Added atom and bond drag collapsing
- Added zoom reset when canvas is cleared
- Fixed inverted bonds between overlapping atoms
- Fixed transition from multiTouch to single touch mouseDrag

## 2.3.1

- Revised COD search sorting
- Revised metadata image loading
- Revised URL scheme for PHP calls
- Added metadata image mirror
- Added GLmol.calculateBonds()
- Added MolPad color scheme switch
- Added <!DOCTYPE html> to page.php
- Added loading message to welcome dialog
- Added bond creation to MolPad atom edit
- Added bond-to-atom collapsing to MolPad
- Added bond-to-bond collapsing to MolPad
- Added fragment rotation to MolPad
- Added PubChem lookup for lightning fast Autocomplete submits
- Fixed relative URLs in error pages
- Fixed .menu-item icons in .dropdown-compact
- Fixed #action-model-line checkmark toggling
- Fixed meta+z keyboard shortcut binding
- Fixed MolPad redo function
- Fixed GLmol.calcBondDelta for bond in Z direction
- Changed img/image.png background to white
- Changed element order in #elem-tools to CHNOPS
- Changed toolbar background-color to white
- Restyled all dialog headings (removed .dialog-close-btn)
- Restyled messages (removed border-radius)

## 2.3.x

- Replaced MolEdit with MolPad
- Added skeleton display to MolPad
- Added event tracking checkbox
- Fixed load.php redirect loop
- Fixed GLmol multiTouch issue
- Fixed GLmol O=C=O issue
- Integrated bower
- Slight redesign

## 2.2.x (2014-11-3)

### Bugfixes

- Added CIF validation in cif.php mirror
- Added JSmol middle mouse button dragging
- Patched Chemical Identifier Resolver lookup failure (pass '/' as '%5C' in SMILES)
- Patched Firefox mousewheel bug in MolEdit (removed jMouseWheel everywhere)
- Patched GLmol.zoomInto bug
- Patched GLmol drawBondAsStick issues
- Fixed GLmol face culling issue
- Fixed JSmol measure and rotate issue
- Fixed JSmol unbind default measuring

### Revisions

#### Data loading
- Revised InfoCard loading sequence
- Removed COD text search
- Revised COD search SQL logic
- Merged all COD search data into one request
- Removed MyMemory translation from PubChem, RCSB and COD search

#### Functionality
- Added auto Ball and Stick mode when performing a Jmol measurement
- Replaced Jmol render-mode menu with HQ switch
- Removed auto layout-model onload crystals
- Removed embed warning about slow, non-WebGL devices
- Removed identifier search from Advanced search functions
- Added history.replaceState for first History.push
- Added multi-touch edit lock to MolEdit
- Added meta key support for Mac

#### Design
- Redesigned messages
- Redesigned layout-menu
- Redesigned search results
- Redesigned menu overflow scrolling
- Redesigned search form (align left)
- Redesigned UI components (flat and light)
- Redesigned MolEdit selection style
- Redesigned MolEdit charge style
- Added touchOnly mode to MolEdit
- Added compact menu layout
- Added canvas based Progress bar
- Added server-side device detection using MobileDetect

#### Refactoring
- Added JS units: base, applib, datasets, core, sketcher, app, embed
- Revised CSS efficiency
- Migrated CSS to LESS
- Renamed Loader modules
- Renamed protein to biomolecule
- Renamed ChemicalView to MolEdit
- Moved metadata lookup to separate PHP file
- Splitted `ChemicalData` into `InfoCard` and `Spectroscopy`
- Added COD MineralNames auto-update script

### Features

#### Data loading
- Added server-side COD search sorting
- Added JSON format for COD search errors
- Added crystal 2D depiction fallbacks
- Added server-side ?cid redirect if ?smiles is a PubChem entry
- Added client-side ?smiles with ?cid replacement if ?smiles is a PubChem entry
- Added SMILES resolving using PubChem (CIR as fallback)
- Added CAS lookup using PubChem synonyms (CIR as fallback)

#### Functionality
- Added Autocomplete for compound, mineral and macromolecule names
- Added protein chain representation and color scheme settings
- Added bio-assembly function
- Added MolView themes menu (desktop and touch)
- Added Model background color menu
- Added transparency to exported images
- Added open in new tab support for search results
- Added auto search results loading when scrolling to the bottom of the page
- Added Preferences interface using HTML5 Web Storage
- Added molview.theme, sketcher.hstrip and model.background to Preferences
- Added "Don't show again" Messages and Preferences
- Added deuterium support to the MolEdit (without UI binding)
- Added implicit hydrogen stripping switch to Sketcher
- Added 3D model source reference to Tool menu
- Added NIST Chemistry WebBook page reference
- Added percent composition table to Information card
- Added auto Model view after 2D to 3D while in Sketcher view

#### Design
- Added UI layer framework (layers: main, search, infocard, spectra)
- Added menu-toggle hover event for non-touch devices
- Added menu-item icons
- Added welcome dialog
- Added dialog close buttons
- Added CODID to COD advanced search results
- Added responsive search results layout
- Added support for exact devicePixelRatio

#### Analytics
- Added event tracking using Google Analytics
- Added JavaScript error tracking using Google Analytics
- Added AJAX error tracking using Google Analytics

### Miscellaneous

- Redesigned logo
- Added Tems of Use
- Added eBook manual
- Added AGPL license
- Added testing procedure
- Added build script (fetch libs, run grunt, render SVG)
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
