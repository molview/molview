/*!
MolView v2.2 (http://molview.org)
Copyright (c) 2014, Herman Bergwerf
ALL RIGHTS RESERVED
*/

var Loader = {	
	CIRsearch: function()
	{
		if(!Request.ChemicalIdentifierResolver.available)
		{
			Messages.alert("cir_down");
			return;
		}
		
		Progress.clear();
		Progress.setSteps(3);
		
		var name = $("#search-input").val();

		Request.CIRsearch(name, false, function(mol3d, text)
		{			
			Model.loadMOL(mol3d);
			
			text = text.charAt(0).toUpperCase() + text.slice(1);
			document.title = text;
			
			Progress.complete();
			Messages.hide();
		}, function()
		{
			Messages.alert("search_fail");
		});
	},
	
	RCSB: {
		
		loadCID: function(cid, name)
		{
			Progress.clear();
			Progress.setSteps(3);
			
			name = name.charAt(0).toUpperCase() + name.slice(1);
			
			Messages.process(function()
			{
				//request 3D molecule
				Request.PubChem.mol(cid, false, function(mol3d)
				{
					Model.loadMOL(mol3d);
					
					document.title = name || "MolView";
					
					Progress.complete();
					Messages.hide();
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
							Messages.hide();
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
	
	RCSB: {
		loadPDBID: function(pdbid, name)
		{
			Progress.clear();
			Progress.setSteps(2);
			
			Messages.process(function()
			{
				Progress.increment();
				
				Request.RCSB.PDB(pdbid, function(pdb)
				{
					if(!Detector.webgl)
					{
						if(MolView.mobile)
						{
							Messages.alert("mobile_old_no_biomolecules");
						}
						else
						{
							Messages.process(function()
							{
								if(Model.engine == "JSmol")
								{
									Model.loadPDB(pdb);
						
									document.title = name || pdbid.toUpperCase();
									
									Progress.complete();
									Messages.hide();
								}
								else//switch to JSmol
								{
									Model.loadPDB(pdb, true);
									Model.JSmol.setPlatformSpeed(1);
									Model.setRenderEngine("JSmol", function()
									{										
										document.title = name || pdbid.toUpperCase();
										
										Progress.complete();
										Messages.hide();
									});
								}
							}, "biomolecule");
						}
					}
					else
					{
						Model.loadPDB(pdb);
						
						document.title = name || pdbid.toUpperCase();
						
						Progress.complete();
						Messages.hide();
					}
				},
				function()
				{
					Messages.alert("no_webgl_support");
				});
			}, "biomolecule");
		}
	},
	
	COD: {
		loadCODID: function(codid, name)
		{
			Progress.clear();
			Progress.setSteps(2);
			
			Messages.process(function()
			{
				Progress.increment();
				
				Request.COD.CIF(codid, function(cif)
				{
					Model.loadCIF(cif);
					
					document.title = name || "COD: " + codid;
					
					Progress.complete();
					Messages.hide();
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
		
		Progress.clear();
		Progress.setSteps(2);
		
		document.title = "MolView";
		
		Request.ChemicalIdentifierResolver.resolve3d(smiles, function(mol)
		{
			Model.loadMOL(mol);
			Progress.complete();
			Messages.hide();
		},
		function()
		{
			Messages.alert("load_fail");
		});
	}
};
