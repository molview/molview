/**
 * This file is part of MolView (https://molview.org)
 * Copyright (c) 2014, Herman Bergwerf
 *
 * MolView is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * MolView is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with MolView.  If not, see <http://www.gnu.org/licenses/>.
 */

var Loader = {
	CIRsearch: function()
	{
		if(!Request.ChemicalIdentifierResolver.available)
		{
			Messages.alert("cir_down");
			return;
		}

		Progress.reset(3);

		var name = $("#search-input").val();

		Request.CIRsearch3D(name, function(mol3d, text)
		{
			Model.loadMOL(mol3d);

			text = text.charAt(0).toUpperCase() + text.slice(1);
			document.title = text;

			Progress.complete();
			Messages.clear();
		}, function()
		{
			Messages.alert("search_fail");
		});
	},

	PubChem:
	{
		loadCID: function(cid, name)
		{
			Progress.reset(3);

			name = name.charAt(0).toUpperCase() + name.slice(1);

			Messages.process(function()
			{
				//request 3D molecule
				Request.PubChem.sdf(cid, false, function(mol3d)
				{
					Model.loadMOL(mol3d);

					document.title = name || "MolView";

					Progress.complete();
					Messages.clear();
				},
				function()//error: resolve using NCI
				{
					Progress.increment();

					Request.PubChem.properties(cid, "IsomericSMILES", function(data)
					{
						Progress.increment();

						Request.ChemicalIdentifierResolver.resolve3d(data.PropertyTable.Properties[0].IsomericSMILES,
						function(mol3d)
						{
							Model.loadMOL(mol3d);

							document.title = name || "MolView";

							Progress.complete();
							Messages.clear();
						},
						function()
						{
							Messages.alert("load_fail");
						});
					},
					function()
					{
						Messages.alert("load_fail");
					});
				});
			}, "compound");
		}
	},

	RCSB:
	{
		loadPDBID: function(pdbid, name)
		{
			Progress.reset(2);

			function finish()
			{
				document.title = name || pdbid.toUpperCase();

				Progress.complete();
				Messages.clear();
			}

			Messages.process(function()
			{
				Progress.increment();

				Request.RCSB.PDB(pdbid, function(pdb)
				{
					if(!Detector.webgl)
					{
						if(MolView.mobile)
						{
							Messages.alert("mobile_old_no_macromolecules");
						}
						else
						{
							if(Model.isJSmol())
							{
								Model.loadPDB(pdb);
								finish();
							}
							else//switch to JSmol
							{
								Model.preloadPDB(pdb);
								Model.setRenderEngine("JSmol", finish);
							}
						}
					}
					else
					{
						if(Model.isGLmol())
						{
							Model.loadPDB(pdb);
							finish();
						}
						else//switch to GLmol
						{
							Model.preloadPDB(pdb);
							Model.setRenderEngine("GLmol", finish);
						}
					}
				},
				function()
				{
					Messages.alert("load_fail");
				});
			}, "macromolecule");
		}
	},

	COD:
	{
		loadCODID: function(codid, name)
		{
			Progress.reset(2);

			Messages.process(function()
			{
				Progress.increment();

				Request.COD.CIF(codid, function(cif)
				{
					Model.loadCIF(cif);

					document.title = name || "COD: " + codid;

					Progress.complete();
					Messages.clear();
				},
				function()
				{
					Messages.alert("load_fail");
				});
			}, "crystal");
		}
	},

	loadSMILES: function(smiles)
	{
		if(!Request.ChemicalIdentifierResolver.available)
		{
			Messages.alert("cir_down");
			return;
		}

		Progress.reset(2);

		document.title = "MolView";

		Request.ChemicalIdentifierResolver.resolve3d(smiles, function(mol)
		{
			Model.loadMOL(mol);
			Progress.complete();
			Messages.clear();
		},
		function()
		{
			Messages.alert("load_fail");
		});
	}
};
