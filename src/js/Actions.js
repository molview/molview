/*!
MolView v2.2 (http://molview.org)
Copyright (c) 2014, Herman Bergwerf
ALL RIGHTS RESERVED
*/

var Actions = {
	/*
	MolView menu
	*/
	window_sketcher: function() { MolView.setLayout("sketcher"); },
	window_model: function() { MolView.setLayout("model"); },
	window_vsplit: function() { MolView.setLayout("vsplit"); },
	window_hsplit: function() { MolView.setLayout("hsplit"); },

	theme_desktop: function()
	{
		MolView.setTheme("desktop");
	},

	theme_touch: function()
	{
		MolView.setTheme("touch");
	},

	help: function()
	{
		MolView.showDialog("help");
	},

	about: function()
	{
		MolView.showDialog("about");
	},

	/*
	Tools menu
	*/
	share: function()
	{
		Link.updateShareDialog();
		MolView.showDialog("share");
	},

	embed: function()
	{
		Link.updateEmbedDialog();
		MolView.showDialog("embed");
	},

	export_2D: function()
	{
		var dataURL = Sketcher.toDataURL();
		var blob = dataURItoBlob(dataURL);
		if(blob !== null) saveAs(blob, document.title + " (structural formula).png");
	},

	export_3D: function()
	{
		var dataURL = Model.toDataURL();
		var blob = dataURItoBlob(dataURL);
		if(blob !== null) saveAs(blob, document.title + " (model).png");
	},

	save_local_3D: function(name)
	{
		var blob = Model.getDataBlob();
		saveAs(blob, (name || document.title) + "." + (Model.getDataExstension().toLowerCase()));
	},

	data_infocard: function()
	{
		var smiles;
		try { smiles = Sketcher.getSMILES(); }
		catch(error) { Messages.alert("smiles_load_error_force", error); return; }

		InfoCard.update(smiles);
		MolView.showLayer("infocard");
	},

	data_spectra: function()
	{
		var smiles;
		try { smiles = Sketcher.getSMILES(); }
		catch(error) { Messages.alert("smiles_load_error_force", error); return; }

		if(Spectroscopy.data["smiles"] && Spectroscopy.data["smiles"] == smiles)
		{
			MolView.showLayer("spectra");
		}
		else
		{
			Spectroscopy.update(smiles);
			MolView.showLayer("spectra");
		}

		Spectroscopy.resize();
	},

	png_current_spectrum: function()
	{
		if(!Spectroscopy.data[$("#spectrum-select").val()])
		{
			alert("No spectrum selected!");
			return;
		}

		var dataURL = document.getElementById("spectrum-canvas").toDataURL("image/png");
		var blob = dataURItoBlob(dataURL);
		if(blob !== null) saveAs(blob, $("#spectrum-select").find("option:selected").text() + ".png");
	},

	jcamp_current_spectrum: function()
	{
		if(!Spectroscopy.data[$("#spectrum-select").val()])
		{
			alert("No spectrum selected!");
			return;
		}

		var blob = new Blob([ Spectroscopy.data[$("#spectrum-select").val()] ],
			{ type: "chemical/x-jcamp-dx;charset=utf-8" });
		if(blob !== null) saveAs(blob, $("#spectrum-select").find("option:selected").text() + ".jdx");
	},

	search_substructure: function()
	{
		MolView.hideDialogs();
		Actions.hide_search_layer();
		Messages.process(function()
		{
			if(Sketcher.metadata.cid)
			{
				Loader.PubChem.structureSearch("cid", Sketcher.metadata.cid, "substructure");
			}
			else
			{
				var smiles;
				try { smiles = Sketcher.getSMILES(); }
				catch(error) { Messages.alert("smiles_load_error_force", error); return; }
				Loader.PubChem.structureSearch("smiles", smiles, "substructure");
			}
		}, "search");
	},

	search_superstructure: function()
	{
		MolView.hideDialogs();
		Actions.hide_search_layer();
		Messages.process(function()
		{
			if(Sketcher.metadata.cid)
			{
				Loader.PubChem.structureSearch("cid", Sketcher.metadata.cid, "superstructure");
			}
			else
			{
				var smiles;
				try { smiles = Sketcher.getSMILES(); }
				catch(error) { Messages.alert("smiles_load_error_force", error); return; }
				Loader.PubChem.structureSearch("smiles", smiles, "superstructure");
			}
		}, "search");
	},

	search_similarity: function()
	{
		MolView.hideDialogs();
		Actions.hide_search_layer();
		Messages.process(function()
		{
			if(Sketcher.metadata.cid)
			{
				Loader.PubChem.structureSearch("cid", Sketcher.metadata.cid, "similarity");
			}
			else
			{
				var smiles;
				try { smiles = Sketcher.getSMILES(); }
				catch(error) { Messages.alert("smiles_load_error_force", error); return; }
				Loader.PubChem.structureSearch("smiles", smiles, "similarity");
			}
		}, "search");
	},

	/*
	Model menu
	*/
	model_reset:     function() { Model.reset(); },
	model_balls:     function() { Model.setRepresentation("balls"); },
	model_stick:     function() { Model.setRepresentation("stick"); },
	model_vdw:       function() { Model.setRepresentation("vdw"); },
	model_wireframe: function() { Model.setRepresentation("wireframe"); },
	model_line:      function() { Model.setRepresentation("line"); },

	model_bg_black: function() { Model.setBackground("black"); },
	model_bg_grey:  function() { Model.setBackground("grey"); },
	model_bg_white: function() { Model.setBackground("white"); },

	engine_glmol: function()
	{
		//clear Model window
		Messages.clear();

		Messages.process(function()
		{
			Model.setRenderEngine("GLmol", Messages.clear);
		}, "switch_engine");
	},

	engine_jmol: function()
	{
		//clear Model window
		Messages.clear();

		Messages.process(function()
		{
			Model.setRenderEngine("JSmol", Messages.clear);
		}, "switch_engine");
	},

	engine_cdw: function()
	{
		//clear Model window
		Messages.clear();

		Messages.process(function()
		{
			Model.setRenderEngine("CDW", Messages.clear);
		}, "switch_engine");
	},

	cif_unit_cell: function()
	{
		if(Model.data.current == "CIF")
		{
			Messages.process(function()
			{
				Model.loadCIF(Model.data.cif, [1, 1, 1]);
				Messages.clear();
			}, "crystal_structure");
		}
	},

	cif_2x2x2_cell: function()
	{
		if(Model.data.current == "CIF")
		{
			Messages.process(function()
			{
				Model.loadCIF(Model.data.cif, [2, 2, 2]);
				Messages.clear();
			}, "crystal_structure");
		}
	},

	cif_1x3x3_cell: function()
	{
		if(Model.data.current == "CIF")
		{
			Messages.process(function()
			{
				Model.loadCIF(Model.data.cif, [1, 3, 3]);
				Messages.clear();
			}, "crystal_structure");
		}
	},

	/*
	GLmol menu
	*/
	bio_assembly:          function() { Model.GLmol.setBioAssembly(!$("#bio-assembly").hasClass("checked")); },
	glmol_chain_ribbon:    function() { Model.GLmol.setChainType("ribbon", !$("#glmol-chain-ribbon").hasClass("checked")); },
	glmol_chain_cylinders: function() { Model.GLmol.setChainType("cylinders", !$("#glmol-chain-cylinders").hasClass("checked")); },
	glmol_chain_btube:     function() { Model.GLmol.setChainType("btube", !$("#glmol-chain-btube").hasClass("checked")); },
	glmol_chain_ctrace:    function() { Model.GLmol.setChainType("ctrace", !$("#glmol-chain-ctrace").hasClass("checked")); },
	glmol_chain_bonds:     function() { Model.GLmol.setChainBonds(!$("#glmol-chain-bonds").hasClass("checked")); },
	glmol_color_ss:        function() { Model.GLmol.setChainColor("ss"); },
	glmol_color_spectrum:  function() { Model.GLmol.setChainColor("spectrum"); },
	glmol_color_chain:     function() { Model.GLmol.setChainColor("chain"); },
	glmol_color_bfactor:   function() { Model.GLmol.setChainColor("bfactor"); },
	glmol_color_polarity:  function() { Model.GLmol.setChainColor("polarity"); },

	/*
	Jmol menu
	*/
	jmol_clean:    function() { Model.JSmol.clean(); },
	mep_lucent:    function() { Model.JSmol.loadMEPSurface(true); },
	mep_opaque:    function() { Model.JSmol.loadMEPSurface(false); },
	jmol_charge:   function() { Model.JSmol.displayCharge(); },
	bond_dipoles:  function() { Model.JSmol.displayDipoles(); },
	net_dipole:    function() { Model.JSmol.displayNetDipole(); },
	jmol_minimize: function() { Model.JSmol.calculateEnergyMinimization(); },

	measure_distance: function()
	{
		Model.JSmol.setPicking($("#measure-torsion").hasClass("checked")
			? "OFF" : "DISTANCE");
	},

	measure_angle: function()
	{
		Model.JSmol.setPicking($("#measure-torsion").hasClass("checked")
			? "OFF" : "ANGLE");
	},

	measure_torsion: function()
	{
		Model.JSmol.setPicking($("#measure-torsion").hasClass("checked")
			? "OFF" : "TORSION");
	},

	jmol_render_all: function()
	{
		Model.JSmol.setPlatformSpeed(7);
	},

	jmol_render_normal: function()
	{
		Model.JSmol.setPlatformSpeed(4);
	},

	jmol_render_minimal: function()
	{
		Model.JSmol.setPlatformSpeed(1);
	},

	/*
	Searching
	*/
	fast_search: function()
	{
		if($("#search-input").val() === "")
		{
			MolView.alertEmptyInput();
		}
		else
		{
			$("#search-input").blur();
			MolView.hideDialogs();
			Messages.process(Loader.CIRsearch, "search");
		}
	},

	pubchem_search: function()
	{
		if($("#search-input").val() === "")
		{
			MolView.alertEmptyInput();
		}
		else
		{
			$("#search-input").blur();
			MolView.hideDialogs();
			Messages.process(Loader.PubChem.search, "search");
		}
	},

	rcsb_search: function()
	{
		if($("#search-input").val() === "")
		{
			MolView.alertEmptyInput();
		}
		else
		{
			$("#search-input").blur();
			MolView.hideDialogs();
			Messages.process(Loader.RCSB.search, "search");
		}
	},

	cod_search: function()
	{
		if($("#search-input").val() === "")
		{
			MolView.alertEmptyInput();
		}
		else
		{
			$("#search-input").blur();
			MolView.hideDialogs();
			Messages.process(Loader.COD.search, "search");
		}
	},

	show_search_layer: function()
	{
		$("#show-search-layer").hide();
		$("#hide-search-layer").show();
		MolView.showLayer("search");
	},

	hide_search_layer: function()
	{
		$("#show-search-layer").show();
		$("#hide-search-layer").hide();
		MolView.showLayer("main");
	},

	load_more_pubchem: function()
	{
		Loader.PubChem.loadNextSet();
	},

	load_more_rcsb: function()
	{
		Loader.RCSB.loadNextSet();
	},

	load_more_cod: function()
	{
		Loader.COD.loadNextSet();
	},

	//sketcher
	clean: function()
	{
		Messages.process(Loader.clean, "clean");
	},

	resolve: function()
	{
		Messages.process(Loader.resolve, "resolve");
	},

	//misc
	request_fullscreen: function() { launchFullscreen(document.documentElement); },
	exit_fullscreen: function() { exitFullscreen(); }
};
