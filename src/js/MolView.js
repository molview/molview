/*!
MolView v2.2 (http://molview.org)
Copyright (c) 2014, Herman Bergwerf
ALL RIGHTS RESERVED
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
		if(this.query.q || this.query.smiles || this.query.cid || this.query.pdbid || this.query.codid)
			this.loadDefault = false;

		this.height = window.innerHeight;

		if(this.mobile && !Detector.webgl)
		{
			this.macromolecules = false;
			$("#rcsb-search").hide();
		}

		//add 10 to compensate small browser differences
		$("#menu > .inner").css("min-width", $("#main-menu").outerWidth() + $("#search").outerWidth() + 10);

		Progress.init();
		if(this.loadDefault)
		{
			Progress.clear();
			Progress.setSteps(2);
		}

		History.init();
		Link.init();
		Spectroscopy.init();
		Autocomplete.init();

		//window events
		$(window).on("resize", function()
		{
			//don't resize when content is hidden
			if($("#main-layer").is(":hidden")) return;

			//don't resize for virtual keyboard (common on touch devices)
			if(!(document.activeElement.id == "search-input" && MolView.touch))
			{
				Sketcher.resize();
				Model.resize();
			}
			else//virtual keyboard
			{
				if(window.innerHeight > MolView.height)
				//virtual keyboard is closed
				{
					$("#search-input").blur();
				}

				MolView.height = window.innerHeight;
			}
		});

		//dropdown events
		$(".dropdown-toggle").on(this.trigger, function(e)
		{
			e.stopPropagation();
			Autocomplete.hide();
			$(".dropdown-toggle").not(this).parent().removeClass("open");

			$(this).parent().toggleClass("open");
			if($(this).parent().hasClass("open"))
			{
				$("#menu").addClass("open");
			}
			else
			{
				$("#menu").removeClass("open");
			}
		});

		if(!this.touch)
		{
			$(".dropdown-toggle").hover(function(e)
			{
				if($(".dropdown").hasClass("open"))
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
				e.stopImmediatePropagation();
			else
			{
				$(".dropdown-toggle").not(this).parent().removeClass("open");
				$("#menu").removeClass("open");
				$("#menu").scrollTop(0);
			}
		});

		$(window).on(this.trigger, function(e)
		{
			var container = $(".dropdown.open .dropdown-menu");
			var form = $("#search");

			if(!container.is(e.target) && container.has(e.target).length === 0)
			{
				window.setTimeout(function()
				{
					container.parent().removeClass("open");
					$("#menu").removeClass("open");
				}, 100);
			}

			if(!form.is(e.target) && form.has(e.target).length === 0
				&& document.activeElement.id == "search-input")
				$("#search-input").blur();
		});

		//window events
		$("#dialog-overlay, #dialog-wrapper").on("mousedown", function(e)
		{
			var target = e.target || e.srcElement;
			if(window.getSelection().type != "Range" && !$(document.activeElement).is("input"))
			{
				if($(target).is(this))
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
			MolView.showLayer("main");
		});

		//enable expandable expanding
		$(".expandable-title").on(this.trigger, function(e)
		{
			$(this).parent().toggleClass("open");
		});

		//form
		$("#search-input-wrap").on(this.trigger, function()
		{
			$("#search-input").focus();
		});

		//initialize
		Request.init();
		Sketcher.init();

		if(this.loadDefault) Progress.increment();

		if(this.touch && !Detector.webgl)
		{
			Model.JSmol.platformSpeed = 1;
		}

		Model.init(function()
		{
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
			$("#model-bg-grey").on(this.trigger, Actions.model_bg_grey);
			$("#model-bg-white").on(this.trigger, Actions.model_bg_white);

			$("#cif-unit-cell").on(this.trigger, Actions.cif_unit_cell);
			$("#cif-2x2x2-cell").on(this.trigger, Actions.cif_2x2x2_cell);
			$("#cif-1x3x3-cell").on(this.trigger, Actions.cif_1x3x3_cell);

			$("#engine-glmol").on(this.trigger, Actions.engine_glmol);
			$("#engine-jmol").on(this.trigger, Actions.engine_jmol);
			$("#engine-cdw").on(this.trigger, Actions.engine_cdw);

			$("#bio-assembly").on(this.trigger, Actions.bio_assembly);
			$("#glmol-chain-ribbon").on(this.trigger, Actions.glmol_chain_ribbon);
			$("#glmol-chain-cylinders").on(this.trigger, Actions.glmol_chain_cylinders);
			$("#glmol-chain-btube").on(this.trigger, Actions.glmol_chain_btube);
			$("#glmol-chain-ctrace").on(this.trigger, Actions.glmol_chain_ctrace);
			$("#glmol-chain-bonds").on(this.trigger, Actions.glmol_chain_bonds);
			$("#glmol-color-ss").on(this.trigger, Actions.glmol_color_ss);
			$("#glmol-color-spectrum").on(this.trigger, Actions.glmol_color_spectrum);
			$("#glmol-color-chain").on(this.trigger, Actions.glmol_color_chain);
			$("#glmol-color-bfactor").on(this.trigger, Actions.glmol_color_bfactor);
			$("#glmol-color-polarity").on(this.trigger, Actions.glmol_color_polarity);

			$("#jmol-clean").on(this.trigger, Actions.jmol_clean);
			$("#mep-lucent").on(this.trigger, Actions.mep_lucent);
			$("#mep-opaque").on(this.trigger, Actions.mep_opaque);
			$("#jmol-charge").on(this.trigger, Actions.jmol_charge);
			$("#bond-dipoles").on(this.trigger, Actions.bond_dipoles);
			$("#net-dipole").on(this.trigger, Actions.net_dipole);
			$("#jmol-minimize").on(this.trigger, Actions.jmol_minimize);

			$("#measure-distance").on(this.trigger, Actions.measure_distance);
			$("#measure-angle").on(this.trigger, Actions.measure_angle);
			$("#measure-torsion").on(this.trigger, Actions.measure_torsion);

			$("#jmol-render-all").on(this.trigger, Actions.jmol_render_all);
			$("#jmol-render-normal").on(this.trigger, Actions.jmol_render_normal);
			$("#jmol-render-minimal").on(this.trigger, Actions.jmol_render_minimal);

			$("#pubchem-search").on("click", Actions.pubchem_search);
			$("#rcsb-search").on("click", Actions.rcsb_search);
			$("#cod-search").on("click", Actions.cod_search);

			$("#show-search-layer, #menu-show-search-layer").on(this.trigger, Actions.show_search_layer);
			$("#hide-search-layer, #menu-hide-search-layer").on(this.trigger, Actions.hide_search_layer);

			$("#load-more-pubchem").on(this.trigger, Actions.load_more_pubchem);
			$("#load-more-rcsb").on(this.trigger, Actions.load_more_rcsb);
			$("#load-more-cod").on(this.trigger, Actions.load_more_cod);

			$("#me-clean").on(this.trigger, Actions.clean);
			$("#resolve").on(this.trigger, Actions.resolve);
			$("#me-info").on(this.trigger, Actions.about);

			$("#start-help").on(this.trigger, Actions.help);

			$("#png-current-spectrum").on(this.trigger, Actions.png_current_spectrum);
			$("#jcamp-current-spectrum").on(this.trigger, Actions.jcamp_current_spectrum);

			if(this.loadDefault)
			{
				Progress.complete();
				Progress.hide();
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

				if(MolView.query.search)
				{
					if(MolView.query.search == "fast")
						Messages.process(Loader.CIRsearch, "search");
					else if(MolView.query.search == "pubchem")
						Messages.process(Loader.PubChem.search, "search");
					else if(MolView.query.search == "rcsb")
						Messages.process(Loader.RCSB.search, "search");
					else if(MolView.query.search == "cod")
						Messages.process(Loader.COD.search, "search");
				}
				else Messages.process(Loader.CIRsearch, "search");
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
					Model.GLmol.setChainType(value, true);
				}

				if(value == "bonds")
				{
					Model.GLmol.setChainType("none", true);
					Model.GLmol.setChainBonds(true);
				}
			}
			else if(key == "chainBonds")
			{
				Model.GLmol.setChainBonds(value == "true");
			}
			else if(key == "chainColor")
			{
				if(value == "ss" || value == "spectrum"
				|| value == "chain" || value == "bfactor"
				|| value == "polarity")
				{
					Model.GLmol.setChainColor(value);
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
	 * Hides dialog with id #$name-layer
	 * @param {String} name Layer name
	 */
	showLayer: function(name)
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

		Actions.hide_search_layer();
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
