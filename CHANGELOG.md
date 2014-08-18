## 2.2.0

Bugfixes:

  - Added GLmol zoom boundary
  - Direct CODID search boundary
  - Added `Loader.Crystals.loadCODID` CIF validation
  - Catch `ucfirst()` and `humanize()` undefined input
  - Test if translation is necessary
  - Patched Firefox mousewheel bug in sketcher (removed jMouseWheel)
  > Spectrum loading error handling

Backend:

  - Added `min-width: 550px;` for `#edit-tools > .inner`
  - Removed model onload layout for CODID
  - CSS efficiency review
  - JS and CSS minification
  - Renamed protein to biomolecule
  - Changed search query to search = fast || pubchem || rcsb || cod
  - Renamed `Loader.Compounds` to `Loader.PubChem`
  - Renamed `Loader.Biomolecules` to `Loader.RCSB`
  - Renamed `Loader.Crystals` to `Loader.COD`
  - Moved message SVG images to CSS
  - SVG minification
  - Replace '/' with '%5C' for Chemical Identifier Resolver lookup
  - Splitted `ChemicalData` into `ChemProps` and `Spectroscopy`
  - Added two `ChemProps` dialogs; biomolecule and crystal
  - Migrated CSS to LESS
  - Revised Information loading sequence
  > SMILES 2D/3D conversion; PubChem > Chemical Identifier Resolver
  > Save Sketcher.InChiKey from Chemical Identifier Resolver search

Frontend:

  - Direct PDBID search
  - Custom GLmol menu for WebGL devices
  - Chain representation/coloring and biological assembly in GLmol menu
  - Updated logo
  - JSmol middle mouse button dragging
  - Fast search auto-complete to CID, PDBID or CODID
  - Model background switch
  - Export images with alpha channel
  - Light sketcher toolbars
  - Dialog close buttons
  - Sketcher selection restyling
  - UI restyle with flat design
  - New search results layout
  - New welcome dialog
  - New messages bar design
  - Switch to Desktop or Touch theme via MolView menu
  - Information card external references (Chemicalize, Google, PDB, COD)
  > SMILES 3D conformation URL key; CID > InChiKey (CIR only) > SMILES
  > Save user preferences using HTML5 Web Storage
  > Functional groups in Sketcher
  > COD image archive

## 2.1.3 (2014-07-07)

Bugfixes:

  - Removed wrong reference to `cb` in the `Loader.Compounds.loadCID` CIR fallback
  - Added PubChem 2D fallback for SMILES error in the `Loader.Compounds.loadCID` CIR fallback

## 2.1.2 (2014-07-05)

Revisions:

  - Hide molecule-image when unavailable
  - Improved small screen messages layout
  - Removed unnecessary `Messages.progress` calls for CID, PDBID and CODID loading

Features:

  - Crystals CODID direct search

## 2.1.1 (2014-07-04)

Bugfixes:

  - Removed `jMouseWheel` from GLmol (firefox bug)
  - Search results long formula overflow

Revisions:

  - ChemicalData image loading appearance

## 2.1.0 (2014-07-04)

Bugfixes:

  - No auto hsplit when loaded as `MolView.layout == model`
  - Jmol CIF no full unitcell after initialisation (scriptWaitOutput fix)
  - Jmol load structure + setRepresentation flashing (scriptWaitOutput fix)
  - Jmol measurement after structure is resolved
  - Removed alerts in m2s (Ketcher MOL2SMILES port)

Revisions:

  - Replaced `MolView.contentClass` with `MolView.layout`
  - Replaced /data/CSID2CODID.txt with COD chemspider_x_cod database
  - Implemented Jmol scriptWaitOutput
  - Improved `ChemicalView.removeImplicitHydrogen`
  - Changed search result title appereance
  - Removed forced model view for CIF files (except for onload view)
  - ChemicalData PubChem integration redesign
  - ChemicalData CanonicalSMILES from PubChem

Features:

  - Form focus styles
  - Jmol MMFF94 energy minimalization implementation
  - COD SMILES to Sketcher implementation
  - PubChem CID search by entering integer
  - Improved properties dialog layout on tablets

## 2.0.0 (2014-07-01)

Features:

  - MolEdit integration
  - GLmol, JSmol, ChemDoodle Web integration
  - JSmol scripts
  - NCI/CADD Chemical Identifier Resolver integration
  - PubChem integration
  - RCSB integration (PDB only)
  - COD integration (CIF only)
  - NIST Chemistry Webbook integration
