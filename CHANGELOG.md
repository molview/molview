## 2.2.0

Bugfixes:

  > Added GLmol zoom boundary
  > Direct CODID search boundary
  - Added `Loader.Crystals.loadCODID` CIF validation

Revisions:

  - Added `min-width: 550px;` for `#edit-tools > .inner`
  - Removed model onload layout for CODID

Features:

  > Custom GLmol menu for WebGL devices
  > Custom protein coloring in GLmol menu
  > Custom chain representation in GLmol menu
  > Biological assembly in GLmol menu
  > Query parameters for GLmol representation
  > Query parameters for biological assembly

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

