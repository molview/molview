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

	export_sketcher_png: function()
	{
		var dataURL = Sketcher.getDataURL();
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

		if(Spectroscopy.data["smiles"] && Spectroscopy.data["smiles"] == smiles)
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
	jmol_clean:    function() { Model.JSmol.clean(); },
	jmol_hq:       function() { Model.JSmol.setQuality(!$("#action-jmol-hq").hasClass("checked")); },
	jmol_mep_lucent:    function() { Model.JSmol.loadMEPSurface(true); },
	jmol_mep_opaque:    function() { Model.JSmol.loadMEPSurface(false); },
	jmol_charge:   function() { Model.JSmol.displayCharge(); },
	jmol_bond_dipoles:  function() { Model.JSmol.displayDipoles(); },
	jmol_net_dipole:    function() { Model.JSmol.displayNetDipole(); },
	jmol_minimize: function() { Model.JSmol.calculateEnergyMinimization(); },

	jmol_measure_distance: function()
	{
		Model.JSmol.setMeasure($("#action-measure-distance").hasClass("checked")
			? "OFF" : "DISTANCE");
	},

	jmol_measure_angle: function()
	{
		Model.JSmol.setMeasure($("#action-measure-angle").hasClass("checked")
			? "OFF" : "ANGLE");
	},

	jmol_measure_torsion: function()
	{
		Model.JSmol.setMeasure($("#action-measure-torsion").hasClass("checked")
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
	mp_center: function()
	{
		Sketcher.center();
	},

	mp_clean: function()
	{
		Messages.process(Loader.clean, "clean");
	},

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
