/**
 * This file is part of MolView (http://molview.org)
 * Copyright (c) 2014-2023 Herman Bergwerf
 */

/**
 * Wrapper for all MolView actions which can be triggered in the UI
 * All methods are binded in MolView.init
 * @type {Object}
 */
var Actions = {
	/*
	MolView menu
	*/
	layout_sketcher: function() { MolView.setLayout("sketcher"); },
	layout_model: function() { MolView.setLayout("model"); },
	layout_vsplit: function() { MolView.setLayout("vsplit"); },
	layout_hsplit: function() { MolView.setLayout("hsplit"); },

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
	embed: function()
	{
		Link.updateEmbedDialog();
		MolView.showDialog("embed");
	},

	export_sketcher_png: function()
	{
		var dataURL = Sketcher.toDataURL();
		var blob = dataURItoBlob(dataURL);
		if(blob !== null) saveAs(blob, document.title + " (structural formula).png");
	},

	export_model_png: function()
	{
		var dataURL = Model.getImageDataURL();
		var blob = dataURItoBlob(dataURL);
		if(blob !== null) saveAs(blob, document.title + " (model).png");
	},

	export_model: function()
	{
		var blob = Model.getFileBlob();
		saveAs(blob, document.title + "." + (Model.getFileExstension().toLowerCase()));
	},

	data_infocard: function()
	{
		var smiles;
		try { smiles = Sketcher.getSMILES(); }
		catch(error) { Messages.alert("smiles_load_error_force", error); return; }

		InfoCard.update(smiles);
		InfoCard.load();
		MolView.setLayer("infocard");
	},

	data_spectra: function()
	{
		var smiles;
		try { smiles = Sketcher.getSMILES(); }
		catch(error) { Messages.alert("smiles_load_error_force", error); return; }

		if(Spectroscopy.data["smiles"] && Spectroscopy.data["smiles"] === smiles)
		{
			MolView.setLayer("spectra");
		}
		else
		{
			Spectroscopy.update(smiles);
			MolView.setLayer("spectra");
		}

		Spectroscopy.resize();
	},

	search_substructure: function()
	{
		MolView.hideDialogs();
		MolView.setLayer("main");
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
		MolView.setLayer("main");
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
		MolView.setLayer("main");
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
	model_bg_gray:  function() { Model.setBackground("gray"); },
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
		if(Model.isCIF())
		{
			Messages.process(function()
			{
				Model.loadCIF(Model.data.cif, [1, 1, 1]);
				Messages.clear();
			}, "crystal_structure");
		}
	},

	cif_cubic_supercell: function()
	{
		if(Model.isCIF())
		{
			Messages.process(function()
			{
				Model.loadCIF(Model.data.cif, [2, 2, 2]);
				Messages.clear();
			}, "crystal_structure");
		}
	},

	cif_flat_supercell: function()
	{
		if(Model.isCIF())
		{
			Messages.process(function()
			{
				Model.loadCIF(Model.data.cif, [1, 3, 3]);
				Messages.clear();
			}, "crystal_structure");
		}
	},

	/*
	Protein menu
	*/
	bio_assembly:          function() { Model.setBioAssembly(!Model.displayBU); },
	chain_type_ribbon:     function() { Model.setChainType(!$("#action-chain-type-ribbon").hasClass("checked") ? "ribbon" : "none"); },
	chain_type_cylinders:  function() { Model.setChainType(!$("#action-chain-type-cylinders").hasClass("checked") ? "cylinders" : "none"); },
	chain_type_btube:      function() { Model.setChainType(!$("#action-chain-type-btube").hasClass("checked") ? "btube" : "none"); },
	chain_type_ctrace:     function() { Model.setChainType(!$("#action-chain-type-ctrace").hasClass("checked") ? "ctrace" : "none"); },
	chain_type_bonds:      function() { Model.setChainBonds(!$("#action-chain-type-bonds").hasClass("checked")); },

	chain_color_ss:        function() { Model.setChainColor("ss"); },
	chain_color_spectrum:  function() { Model.setChainColor("spectrum"); },
	chain_color_chain:     function() { Model.setChainColor("chain"); },
	chain_color_residue:   function() { Model.setChainColor("residue"); },
	chain_color_polarity:  function() { Model.setChainColor("polarity"); },
	chain_color_bfactor:   function() { Model.setChainColor("bfactor"); },

	/*
	Jmol menu
	*/
	jmol_clean: function() {
		Model.JSmol.clean();
	},
	jmol_hq: function() {
		Model.JSmol.setQuality(!$("#action-jmol-hq").hasClass("checked"));
	},
	jmol_mep_lucent: function() {
		Model.JSmol.loadMEPSurface(true);
		Messages.alert("calculation_unreliable");
	},
	jmol_mep_opaque: function() {
		Model.JSmol.loadMEPSurface(false);
		Messages.alert("calculation_unreliable");
	},
	jmol_charge: function() {
		Model.JSmol.displayCharge();
		Messages.alert("calculation_unreliable");
	},
	jmol_bond_dipoles: function() {
		Model.JSmol.displayDipoles();
		Messages.alert("calculation_unreliable");
	},
	jmol_net_dipole: function() {
		Model.JSmol.displayNetDipole();
		Messages.alert("calculation_unreliable");
	},
	jmol_minimize: function() {
		Model.JSmol.calculateEnergyMinimization();
		Messages.alert("calculation_unreliable");
	},

	jmol_measure_distance: function()
	{
		Messages.alert("measurements_unreliable");
		Model.JSmol.setMeasure($("#action-jmol-measure-distance").hasClass("checked")
			? "OFF" : "DISTANCE");
	},

	jmol_measure_angle: function()
	{
		Messages.alert("measurements_unreliable");
		Model.JSmol.setMeasure($("#action-jmol-measure-angle").hasClass("checked")
			? "OFF" : "ANGLE");
	},

	jmol_measure_torsion: function()
	{
		Messages.alert("measurements_unreliable");
		Model.JSmol.setMeasure($("#action-jmol-measure-torsion").hasClass("checked")
			? "OFF" : "TORSION");
	},

	/*
	Autocomplete
	*/
	search_pubchem: function()
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

	search_rcsb: function()
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

	search_cod: function()
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
		MolView.setLayer("search");
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

	/*
	Sketcher
	*/
	mp_bond_single: function(){ Sketcher.setTool(this, "bond", { type: MP_BOND_SINGLE }); },
	mp_bond_double: function(){ Sketcher.setTool(this, "bond", { type: MP_BOND_DOUBLE }); },
	mp_bond_triple: function(){ Sketcher.setTool(this, "bond", { type: MP_BOND_TRIPLE }); },
	mp_bond_wedge: function(){ Sketcher.setTool(this, "bond", { stereo: MP_STEREO_UP }); },
	mp_bond_hash: function(){ Sketcher.setTool(this, "bond", { stereo: MP_STEREO_DOWN }); },

	mp_frag_benzene: function(){ Sketcher.setTool(this, "fragment", { frag: MPFragments.benzene }); },
	mp_frag_cyclopropane: function(){ Sketcher.setTool(this, "fragment", { frag: MPFragments.cyclopropane }); },
	mp_frag_cyclobutane: function(){ Sketcher.setTool(this, "fragment", { frag: MPFragments.cyclobutane }); },
	mp_frag_cyclopentane: function(){ Sketcher.setTool(this, "fragment", { frag: MPFragments.cyclopentane }); },
	mp_frag_cyclohexane: function(){ Sketcher.setTool(this, "fragment", { frag: MPFragments.cyclohexane }); },
	mp_frag_cycloheptane: function(){ Sketcher.setTool(this, "fragment", { frag: MPFragments.cycloheptane }); },

	mp_chain: function(){ Sketcher.setTool(this, "chain", {}); },
	mp_charge_add: function(){ Sketcher.setTool(this, "charge", { charge: 1 }); },
	mp_charge_sub: function(){ Sketcher.setTool(this, "charge", { charge: -1 }); },

	mp_clear: function(){ Sketcher.clear(); },
	mp_eraser: function(){ Sketcher.setTool(this, "erase", {}); },
	mp_drag: function(){ Sketcher.setTool(this, "drag", {}); },
	mp_undo: function(){ Sketcher.undo(); },
	mp_redo: function(){ Sketcher.redo(); },
	mp_rect: function(){ Sketcher.setTool(this, "select", { type: "rect" }); },
	mp_lasso: function(){ Sketcher.setTool(this, "select", { type: "lasso" }); },
	mp_color_mode: function(){ Sketcher.toggleColorMode(); },
	mp_skeletal_formula: function(){ Sketcher.toggleSkeletalFormula(); },
	mp_center: function(){ Sketcher.center(); },
	mp_clean: function(){ Sketcher.clean(); },

	mp_atom_c: function(){ Sketcher.setTool(this, "atom", { element: "C" }); },
	mp_atom_h: function(){ Sketcher.setTool(this, "atom", { element: "H" }); },
	mp_atom_n: function(){ Sketcher.setTool(this, "atom", { element: "N" }); },
	mp_atom_o: function(){ Sketcher.setTool(this, "atom", { element: "O" }); },
	mp_atom_p: function(){ Sketcher.setTool(this, "atom", { element: "P" }); },
	mp_atom_s: function(){ Sketcher.setTool(this, "atom", { element: "S" }); },
	mp_atom_f: function(){ Sketcher.setTool(this, "atom", { element: "F" }); },
	mp_atom_cl: function(){ Sketcher.setTool(this, "atom", { element: "Cl" }); },
	mp_atom_br: function(){ Sketcher.setTool(this, "atom", { element: "Br" }); },
	mp_atom_i: function(){ Sketcher.setTool(this, "atom", { element: "I" }); },

	mp_periodictable: function()
	{
		MolView.showDialog("periodictable");
	},

	resolve: function()
	{
		Messages.process(Loader.resolve, "resolve");
	},

	/*
	Misc
	*/
	start_help: function()
	{
		MolView.showDialog("help");
	},

	export_spectrum_png: function()
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

	export_spectrum_jcamp: function()
	{
		if(!Spectroscopy.data[$("#spectrum-select").val()])
		{
			alert("No spectrum selected!");
			return;
		}

		var blob = new Blob([ Spectroscopy.data[$("#spectrum-select").val()] ],
			{ type: "chemical/x-jcamp-dx;charset=utf-8" });
		if(blob !== null) saveAs(blob, $("#spectrum-select").find("option:selected").text() + ".jdx");
	}
};
