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

var MolView = {
	layout: "",
	touch: false,
	mobile: false,
	height: 0,//used to detect virtual keyboard
	trigger: "click",
	query: {},
	loadDefault: true,
	macromolecules: true,
	JMOL_J2S_PATH: "jmol/j2s",

	/**
	 * Initializes full MolView UI
	 */
	init: function()
	{
		Progress.init();
		History.init();
		Link.init();

		if(this.query.q || this.query.smiles || this.query.cid || this.query.pdbid || this.query.codid)
		{
			this.loadDefault = false;
		}
		else
		{
			Progress.reset(1);
		}

		Spectroscopy.init();
		Autocomplete.init();
		Request.init();
		Sketcher.init();
		SearchGrid.init();

		if(this.touch && !Detector.webgl)
		{
			this.macromolecules = false;
			Model.JSmol.setQuality(false);
		}

		this.height = window.innerHeight;
		$(".dropdown-menu").css("max-height", $("#content").height() - 10);

		//window events
		$(window).on("resize", function()
		{

			$(".dropdown-menu").css("max-height", $("#content").height() - 10);

			//compact menu bar
			if($(window).width() < 1100 && !MolView.touch)
			{
				$("#search").css("margin", 0);
				$("#search-input").css("width", 100);
				$("#brand").hide();
				$("#search-dropdown .dropdown-menu").removeClass("dropdown-left");
				$("#jmol-dropdown .dropdown-menu").addClass("dropdown-left");
			}
			else
			{
				$("#search").css("margin", "");
				$("#search-input").css("width", "");
				$("#brand").show();
				$("#search-dropdown .dropdown-menu").addClass("dropdown-left");
				$("#jmol-dropdown .dropdown-menu").removeClass("dropdown-left");
			}

			Progress.resize();

			if(!$("#main-layer").is(":hidden"))
			{
				//don't resize for virtual keyboard (common on touch devices)
				if(!(document.activeElement.id == "search-input" && MolView.touch))
				{
					Sketcher.resize();
					Model.resize();
				}
				else//virtual keyboard
				{
					if(window.innerHeight > MolView.height)//virtual keyboard is closed
					{
						$("#search-input").blur();
					}

					MolView.height = window.innerHeight;
				}
			}
		});

		//dropdown events
		$(".dropdown-toggle").on(this.trigger, function(e)
		{
			e.stopPropagation();
			Autocomplete.hide();
			$(".dropdown-toggle").not(this).parent().removeClass("open");
			$("#menu").toggleClass("menu-open",
				$(this).parent().toggleClass("open").hasClass("open"));
		});

		if(!this.touch)
		{
			$(".dropdown-toggle").hover(function(e)
			{
				if($("#menu").hasClass("menu-open"))
				{
					e.stopPropagation();
					$(".dropdown").removeClass("open");
					$(this).parent().addClass("open");
				}
			}, function(){});
		}

		$(".dropdown-menu a").on(this.trigger, function(e)
		{
			if($(this).hasClass("disabled"))
			{
				e.stopImmediatePropagation();
			}
			else
			{
				$(".dropdown-toggle").not(this).parent().removeClass("open");
				$("#menu").removeClass("menu-open");
			}
		});

		$(window).on(this.trigger, function(e)
		{
			var container = $(".dropdown.open .dropdown-menu");
			var searchInput = $("#search-input");

			if(!container.is(e.target) && container.has(e.target).length === 0)
			{
				e.stopPropagation();
				$("#menu").removeClass("menu-open");
				$(".dropdown").removeClass("open");
			}

			if(!searchInput.is(e.target) && searchInput.has(e.target).length === 0
				&& document.activeElement.id == "search-input")
				$("#search-input").blur();
		});

		//window events
		$("#dialog-click-area").on("mousedown", function(e)
		{
			var target = e.target || e.srcElement;
			if(window.getSelection().type != "Range" && !$(document.activeElement).is("input"))
			{
				if($(target).is(this) || $(target).is("#dialog-wrapper"))
				{
					MolView.hideDialogs();
					window.getSelection().removeAllRanges();
				}
			}
		});

		$(".dialog .btn.close, .dialog-close-btn").on(this.trigger, function(e)
		{
			MolView.hideDialogs();
		});

		$(".layer .btn.close").on(this.trigger, function(e)
		{
			MolView.setLayer("main");
		});

		//enable expandable expanding
		$(".expandable-title").on(this.trigger, function(e)
		{
			$(this).parent().toggleClass("open");
		});

		//actions
		$("#window-sketcher").on(this.trigger, Actions.window_sketcher);
		$("#window-model").on(this.trigger, Actions.window_model);
		$("#window-vsplit").on(this.trigger, Actions.window_vsplit);
		$("#window-hsplit").on(this.trigger, Actions.window_hsplit);

		$("#theme-desktop").on(this.trigger, Actions.theme_desktop);
		$("#theme-touch").on(this.trigger, Actions.theme_touch);

		$("#mv-help").on(this.trigger, Actions.help);
		$("#mv-about").on(this.trigger, Actions.about);

		$("#mv-share").on(this.trigger, Actions.share);
		$("#mv-embed").on(this.trigger, Actions.embed);

		$("#export-2d").on(this.trigger, Actions.export_2D);
		$("#export-3d").on(this.trigger, Actions.export_3D);
		$("#save-local-3d").on(this.trigger, function(){ Actions.save_local_3D(Loader.lastQuery.name); });

		$("#data-infocard").on(this.trigger, Actions.data_infocard);
		$("#data-spectra").on(this.trigger, Actions.data_spectra);

		$("#search-substructure").on(this.trigger, Actions.search_substructure);
		$("#search-superstructure").on(this.trigger, Actions.search_superstructure);
		$("#search-similarity").on(this.trigger, Actions.search_similarity);

		$("#model-reset").on(this.trigger, Actions.model_reset);

		$("#model-balls").on(this.trigger, Actions.model_balls);
		$("#model-stick").on(this.trigger, Actions.model_stick);
		$("#model-vdw").on(this.trigger, Actions.model_vdw);
		$("#model-wireframe").on(this.trigger, Actions.model_wireframe);
		$("#model-line").on(this.trigger, Actions.model_line);

		$("#model-bg-black").on(this.trigger, Actions.model_bg_black);
		$("#model-bg-gray").on(this.trigger, Actions.model_bg_gray);
		$("#model-bg-white").on(this.trigger, Actions.model_bg_white);

		$("#cif-unit-cell").on(this.trigger, Actions.cif_unit_cell);
		$("#cif-2x2x2-cell").on(this.trigger, Actions.cif_2x2x2_cell);
		$("#cif-1x3x3-cell").on(this.trigger, Actions.cif_1x3x3_cell);

		$("#engine-glmol").on(this.trigger, Actions.engine_glmol);
		$("#engine-jmol").on(this.trigger, Actions.engine_jmol);
		$("#engine-cdw").on(this.trigger, Actions.engine_cdw);

		$("#bio-assembly").on(this.trigger, Actions.bio_assembly);
		$("#chain-type-ribbon").on(this.trigger, Actions.chain_type_ribbon);
		$("#chain-type-cylinders").on(this.trigger, Actions.chain_type_cylinders);
		$("#chain-type-btube").on(this.trigger, Actions.chain_type_btube);
		$("#chain-type-ctrace").on(this.trigger, Actions.chain_type_ctrace);
		$("#chain-type-bonds").on(this.trigger, Actions.chain_type_bonds);

		$("#chain-color-ss").on(this.trigger, Actions.chain_color_ss);
		$("#chain-color-spectrum").on(this.trigger, Actions.chain_color_spectrum);
		$("#chain-color-chain").on(this.trigger, Actions.chain_color_chain);
		$("#chain-color-residue").on(this.trigger, Actions.chain_color_residue);
		$("#chain-color-polarity").on(this.trigger, Actions.chain_color_polarity);
		$("#chain-color-bfactor").on(this.trigger, Actions.chain_color_bfactor);

		$("#jmol-clean").on(this.trigger, Actions.jmol_clean);
		$("#jmol-hq").on(this.trigger, Actions.jmol_hq);

		$("#mep-lucent").on(this.trigger, Actions.mep_lucent);
		$("#mep-opaque").on(this.trigger, Actions.mep_opaque);
		$("#jmol-charge").on(this.trigger, Actions.jmol_charge);
		$("#bond-dipoles").on(this.trigger, Actions.bond_dipoles);
		$("#net-dipole").on(this.trigger, Actions.net_dipole);
		$("#jmol-minimize").on(this.trigger, Actions.jmol_minimize);

		$("#measure-distance").on(this.trigger, Actions.measure_distance);
		$("#measure-angle").on(this.trigger, Actions.measure_angle);
		$("#measure-torsion").on(this.trigger, Actions.measure_torsion);

		$("#pubchem-search").on(this.trigger, Actions.pubchem_search);
		$("#rcsb-search").on(this.trigger, Actions.rcsb_search);
		$("#cod-search").on(this.trigger, Actions.cod_search);

		$("#show-search-layer").on(this.trigger, Actions.show_search_layer);

		$("#load-more-pubchem").on(this.trigger, Actions.load_more_pubchem);
		$("#load-more-rcsb").on(this.trigger, Actions.load_more_rcsb);
		$("#load-more-cod").on(this.trigger, Actions.load_more_cod);

		$("#me-clean").on(this.trigger, Actions.clean);
		$("#resolve").on(this.trigger, Actions.resolve);
		$("#me-info").on(this.trigger, Actions.about);

		$("#start-help").on(this.trigger, Actions.help);

		$("#png-current-spectrum").on(this.trigger, Actions.png_current_spectrum);
		$("#jcamp-current-spectrum").on(this.trigger, Actions.jcamp_current_spectrum);

		Model.init(function()
		{
			if(this.loadDefault)
			{
				Progress.complete();
			}

			//execute query commands
			this.executeQuery();
			Sketcher.markUpdated();

			if(!Request.ChemicalIdentifierResolver.available)
			{
				Messages.alert("cir_down");
			}
		}.bind(this), (!Detector.webgl && !MolView.touch) ? "JSmol" : "GLmol");
	},

	/**
	 * Executes URL query
	 */
	executeQuery: function()
	{
		$.each(this.query, function(key, value)
		{
			if(key == "q")
			{
				$("#search-input").val(value);
				Messages.process(Loader.CIRsearch, "search");
			}
			else if(key == "smiles")
			{
				Messages.process(function()
				{
					Loader.loadSMILES(value, document.title);
				}, "compound");
			}
			else if(key == "cid")
			{
				Loader.PubChem.loadCID(value, document.title);
			}
			else if(key == "pdbid")
			{
				Loader.RCSB.loadPDBID(value, value.toUpperCase());
			}
			else if(key == "codid")
			{
				Loader.COD.loadCODID(value, document.title);
			}
			else if(key == "dialog")
			{
				MolView.showDialog(value);
			}
			else if(key == "mode")
			{
				if(value == "balls") Actions.model_balls();
				else if(value == "stick") Actions.model_stick();
				else if(value == "vdw") Actions.model_vdw();
				else if(value == "wireframe") Actions.model_wireframe();
				else if(value == "line") Actions.model_line();
			}
			else if(key == "chainType")
			{
				if(value == "ribbon" || value == "cylinders"
				|| value == "btube" || value == "ctrace")
				{
					Model.setChainType(value, true);
				}

				if(value == "bonds")
				{
					Model.setChainType("none", true);
					Model.setChainBonds(true, true);
				}
			}
			else if(key == "chainBonds")
			{
				Model.setChainBonds(value == "true", true);
			}
			else if(key == "chainColor")
			{
				if(value == "ss" || value == "spectrum"
				|| value == "chain" || value == "residue"
				|| value == "polarity" || value == "bfactor")
				{
					Model.setChainColor(value, true);
				}
			}
			else if(key == "bg")
			{
				Model.setBackground(value);
			}
		});
	},

	/**
	 * Shows dialog with id #$name-dialog
	 * @param {String} name Dialog name
	 */
	showDialog: function(name)
	{
		$("#dialog-overlay .dialog").hide();
		$("#dialog-overlay").show();
		$("#dialog-overlay").scrollTop(0);
		$("#" + name + "-dialog").show();
	},

	/**
	 * Hides all dialogs
	 */
	hideDialogs: function()
	{
		$("#dialog-overlay .dialog").hide();
		$("#dialog-overlay").hide();
	},

	/**
	 * Shows layer with id #$name-layer
	 * @param {String} name Layer name
	 */
	setLayer: function(name)
	{
		$(".layer").hide();
		$("#" + name + "-layer").show();

		if(name == "main")
		{
			Sketcher.resize();
			Model.resize();
		}
	},

	/**
	 * Sets main-layer layout by applying the $layout CSS class
	 * @param {String} layout Layout name and CSS class
	 */
	setLayout: function(layout)
	{
		$("#window-sketcher").removeClass("selected");
		$("#window-model").removeClass("selected");
		$("#window-vsplit").removeClass("selected");
		$("#window-hsplit").removeClass("selected");

		if(layout == "sketcher") $("#window-sketcher").addClass("selected");
		if(layout == "model") $("#window-model").addClass("selected");
		if(layout == "vsplit") $("#window-vsplit").addClass("selected");
		if(layout == "hsplit") $("#window-hsplit").addClass("selected");

		$("#main-layer").removeClass("layout-sketcher layout-model layout-vsplit layout-hsplit").addClass("layout-" + layout);
		this.layout = layout;

		this.setLayer("main");
	},

	/**
	 * Sets MolView UI theme by replacing the UI CSS link with
	 * build/molview.$theme.min.css
	 * @param {String} theme Theme name
	 */
	setTheme: function(theme)
	{
		$("#theme-desktop,#theme-touch").removeClass("checked");
		$("#theme-" + theme).addClass("checked");
		$("#theme-stylesheet").attr("href", "build/molview." + theme + ".min.css");
	},

	/**
	 * Makes sure the Model view is visible
	 */
	makeModelVisible: function()
	{
		if(this.layout == "sketcher")
			MolView.setLayout("both");
	},

	/**
	 * Applies alert effect to #search-input to notify the user that it's empty
	 */
	alertEmptyInput: function()
	{
		if(MolView.search_input_timeout != null)
		{
			window.clearTimeout(MolView.search_input_timeout);
		}

		window.setTimeout(function()
		{
			$("#search-input").addClass("alert").focus();
		}, 0);

		MolView.search_input_timeout = window.setTimeout(function()
		{
			$("#search-input").removeClass("alert");
		}, 1000);
	},

	search_input_timeout: null//use for MolView.alertEmptyInput
};

$(window).on("load", function()
{
	MolView.init();
});
