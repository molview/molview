Changelog
=========

2.1.1 (2014-07-04)
---------
Bugfixes:
- Removed jMouseWheel from GLmol (firefox bug)
- Search results long formula overflow

Revisions
- ChemicalData image loading appearance

2.1.0 (2014-07-04)
---------

Bugfixes:
- H > W => hsplit when loaded as MolView.layout = model
- Jmol CIF no full unitcell after initialisation (scriptWaitOutput fix)
- Jmol load structure + setRepresentation flashing (scriptWaitOutput fix)
- Jmol measurement after structure is resolved
- Removed alerts in m2s (Ketcher MOL2SMILES port)

Revisions
- Replaced MolView.contentClass with MolView.layout
- Removed Messages.sketcher_no_crystals message for CIF model
- Replaced /data/CSID2CODID.txt with COD chemspider_x_cod database
- Implemented Jmol scriptWaitOutput
- Improved ChemicalView.removeImplicitHydrogen
- Changed search result title appereance
- Removed forced model view for CIF files (except for onload view)
- ChemicalData PubChem integration redesign
- ChemicalData CanonicalSMILES from PubChem

New features
- Form focus styles
- Jmol MMFF94 energy minimalization implementation
- COD SMILES to Sketcher implementation
- PubChem CID search by entering integer
- Improved properties dialog layout on tablets

2.0.0 (2014-07-01)
---------

Features
- MolEdit integration
- GLmol, JSmol, ChemDoodle Web integration
- JSmol scripts
- NCI/CADD Chemical Identifier Resolver integration
- PubChem integration
- RCSB integration (PDB only)
- COD integration (CIF only)
- NIST Chemistry Webbook integration

