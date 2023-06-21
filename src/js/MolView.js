/**
 * This file is part of MolView (http://molview.org)
 * Copyright (c) 2014-2023 Herman Bergwerf
 */

var MolView = {
	/**
	 * MolView layout content class
	 * @type {String}
	 */
	layout: "",

	/**
	 * Indicates touch-only devices
	 * @type {Boolean}
	 */
	touch: false,

	/**
	 * Indicates mobile devices
	 * @type {Boolean}
	 */
	mobile: false,

	/**
	 * Device pixel ratio used for rendering
	 * @type {Float}
	 */
	devicePixelRatio: 1.0,

	/**
	 * jQuery.on trigger for buttons
	 * @type {String}
	 */
	trigger: "click",

	/**
	 * URL query
	 * @type {Object}
	 */
	query: {},

	/**
	 * Indicates if Model and Sketcher should load the default molecule
	 * on initialization
	 * @type {Boolean}
	 */
	loadDefault: true,

	/**
	 * Indicates macromolecule support
	 * @type {Boolean}
	 */
	macromolecules: true,

	/**
	 * JSmol J2S root path on server
	 * @type {String}
	 */
	JMOL_J2S_PATH: "jmol/j2s",

	/**
	 * Initializes full MolView UI
	 */
	init: function()
	{
		//setup
		MolView.devicePixelRatio = window.devicePixelRatio || (MolView.mobile ? 1.5 : 1.0);

		Preferences.init();
		Progress.init();
		History.init();
		Link.init();

		Model.preloadQuery(this.query);
		if(this.query.q || this.query.smiles || this.query.cid || this.query.pdbid || this.query.codid)
		{
			this.loadDefault = false;
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
		$("#main-layer").saveSize();

		//window events
		$(window).on("resize", function()
		{
			$(".dropdown-menu").css("max-height", $("#content").height() - 10);

			//compact menu bar
			MolView.setMenuLayout($(window).width() < 1100,
					$(window).width() < 1100 && !MolView.touch,
					$(window).width() < 390 && MolView.touch);

			Progress.resize();

			if(!$("#main-layer").is(":hidden"))
			{
				$("#main-layer").saveSize();
				Sketcher.resize();
				Model.resize();
			}
		});

		//dropdown events
		$(".dropdown-toggle").on(this.trigger, function(e)
		{
			e.stopPropagation();
			Autocomplete.hide();
			$(".dropdown-toggle").not(this).parent().removeClass("open");
			$("#menu").toggleClass("menu-open",
				$(this).parent().toggleClass("open").hasClass("open"))
				.scrollTop(0);
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
				&& document.activeElement.id === "search-input")
				$("#search-input").blur();
		});

		//window events
		$("#dialog-click-area").on("mousedown", function(e)
		{
			var target = e.target || e.srcElement;
			if(window.getSelection().type !== "Range" && !$(document.activeElement).is("input"))
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
		this.addAction("layout_sketcher", "menu", true);
		this.addAction("layout_model", "menu", true);
		this.addAction("layout_vsplit", "menu", true);
		this.addAction("layout_hsplit", "menu", true);
		this.addAction("theme_desktop", "menu", true);
		this.addAction("theme_touch", "menu", true);
		this.addAction("help", "menu", true);
		this.addAction("about", "menu", true);

		this.addAction("embed", "menu", true);
		this.addAction("export_sketcher_png", "menu", true);
		this.addAction("export_model_png", "menu", true);
		this.addAction("export_model", "menu", true);
		this.addAction("data_infocard", "menu", true);
		this.addAction("data_spectra", "menu", true);
		this.addAction("search_substructure", "menu", true);
		this.addAction("search_superstructure", "menu", true);
		this.addAction("search_similarity", "menu", true);

		this.addAction("model_reset", "menu", true);
		this.addAction("model_balls", "menu", true);
		this.addAction("model_stick", "menu", true);
		this.addAction("model_vdw", "menu", true);
		this.addAction("model_wireframe", "menu", true);
		this.addAction("model_line", "menu", true);
		this.addAction("model_bg_black", "menu", true);
		this.addAction("model_bg_gray", "menu", true);
		this.addAction("model_bg_white", "menu", true);
		this.addAction("engine_glmol", "menu", true);
		this.addAction("engine_jmol", "menu", true);
		this.addAction("engine_cdw", "menu", true);
		this.addAction("cif_unit_cell", "menu", true);
		this.addAction("cif_cubic_supercell", "menu", true);
		this.addAction("cif_flat_supercell", "menu", true);

		this.addAction("bio_assembly", "menu", true);
		this.addAction("chain_type_ribbon", "menu", true);
		this.addAction("chain_type_cylinders", "menu", true);
		this.addAction("chain_type_btube", "menu", true);
		this.addAction("chain_type_ctrace", "menu", true);
		this.addAction("chain_type_bonds", "menu", true);
		this.addAction("chain_color_ss", "menu", true);
		this.addAction("chain_color_spectrum", "menu", true);
		this.addAction("chain_color_chain", "menu", true);
		this.addAction("chain_color_residue", "menu", true);
		this.addAction("chain_color_polarity", "menu", true);
		this.addAction("chain_color_bfactor", "menu", true);

		this.addAction("jmol_hq", "menu", true);
		this.addAction("jmol_clean", "menu", true);
		this.addAction("jmol_mep_lucent", "menu", true);
		this.addAction("jmol_mep_opaque", "menu", true);
		this.addAction("jmol_charge", "menu", true);
		this.addAction("jmol_bond_dipoles", "menu", true);
		this.addAction("jmol_net_dipole", "menu", true);
		this.addAction("jmol_minimize", "menu", true);
		this.addAction("jmol_measure_distance", "menu", true);
		this.addAction("jmol_measure_angle", "menu", true);
		this.addAction("jmol_measure_torsion", "menu", true);

		this.addAction("search_pubchem", "menu", true);
		this.addAction("search_rcsb", "menu", true);
		this.addAction("search_cod", "menu", true);
		this.addAction("show_search_layer", "menu", true);
		this.addAction("load_more_pubchem", "button", true);
		this.addAction("load_more_rcsb", "button", true);
		this.addAction("load_more_cod", "button", true);

		this.addAction("mp_bond_single", "button", true);
		this.addAction("mp_bond_double", "button", true);
		this.addAction("mp_bond_triple", "button", true);
		this.addAction("mp_bond_wedge", "button", true);
		this.addAction("mp_bond_hash", "button", true);
		this.addAction("mp_frag_benzene", "button", true);
		this.addAction("mp_frag_cyclopropane", "button", true);
		this.addAction("mp_frag_cyclobutane", "button", true);
		this.addAction("mp_frag_cyclopentane", "button", true);
		this.addAction("mp_frag_cyclohexane", "button", true);
		this.addAction("mp_frag_cycloheptane", "button", true);
		this.addAction("mp_chain", "button", true);
		this.addAction("mp_charge_add", "button", true);
		this.addAction("mp_charge_sub", "button", true);
		this.addAction("mp_clear", "button", true);
		this.addAction("mp_eraser", "button", true);
		this.addAction("mp_drag", "button", true);
		this.addAction("mp_undo", "button", true);
		this.addAction("mp_redo", "button", true);
		this.addAction("mp_rect", "button", true);
		this.addAction("mp_lasso", "button", true);
		this.addAction("mp_color_mode", "button", true);
		this.addAction("mp_skeletal_formula", "button", true);
		this.addAction("mp_center", "button", true);
		this.addAction("mp_clean", "button", true);
		this.addAction("mp_atom_c", "button", true);
		this.addAction("mp_atom_h", "button", true);
		this.addAction("mp_atom_n", "button", true);
		this.addAction("mp_atom_o", "button", true);
		this.addAction("mp_atom_p", "button", true);
		this.addAction("mp_atom_s", "button", true);
		this.addAction("mp_atom_f", "button", true);
		this.addAction("mp_atom_cl", "button", true);
		this.addAction("mp_atom_br", "button", true);
		this.addAction("mp_atom_i", "button", true);
		this.addAction("mp_periodictable", "button", true);
		this.addAction("resolve", "button", true);

		this.addAction("start_help", "button", true);
		this.addAction("export_spectrum_png", "button", true);
		this.addAction("export_spectrum_jcamp", "button", true);

		$("#welcome-loading-msg").hide();
		$("#welcome-button-bar").show();

		//custom event trackers
		$("#model-source").on(this.trigger, function()
		{
			MolView.pushEvent("link", "click", "model source", 0);
		});
		$("#spectrum-nist-source").on(this.trigger, function()
		{
			MolView.pushEvent("link", "click", "spectrum nist source", 0);
		});

		Model.init(function()
		{
			//execute query commands
			MolView.executeQuery();
			Sketcher.markUpdated();

			if(!Request.CIR.available)
			{
				Messages.alert("cir_down");
			}
		}, "GLmol");
	},

	/**
	 * Bind action using $(#action-id).on(MolView.trigger, Actions[id])
	 * DOM ID: '_' is replaced with '-'
	 * Event label: '_' is replaced with ' '
	 * @param {String}  id       Action identifier ([a-z]_)
	 * @param {String}  category Event tracking category (button|menu)
	 * @param {Boolean} track    Indicates if action should be tracked using GA
	 */
	addAction: function(id, category, track)
	{
		$("#action-" + id.replace(/_/g, "-")).on(this.trigger, function(e)
		{
			if($(this).hasClass("disabled") || $(this).hasClass("tool-button-disabled")) return;

			if(track && Preferences.get("molview", "allow_tracking", false))
			{
				MolView.pushEvent(category, "click",
					id.replace(/_/g, " "), Actions[id].call(this) || 0);
			}
			else
			{
				Actions[id].call(this);
			}
		});
	},

	/**
	 * Track certain events (no longer used).
	 */
	pushEvent: function(category, action, label, number)
	{
		console.log(category, action, label, number);
	},

	/**
	 * Executes URL query
	 */
	executeQuery: function()
	{
		$.each(this.query, function(key, value)
		{
			if(key === "q")
			{
				$("#search-input").val(value);
				Messages.process(Loader.CIRsearch, "search");
			}
			else if(key === "smiles")
			{
				Messages.process(function()
				{
					Loader.loadSMILES(value, document.title);
				}, "compound");
			}
			else if(key === "cid")
			{
				Loader.PubChem.loadCID(value, document.title);
			}
			else if(key === "pdbid")
			{
				Loader.RCSB.loadPDBID(value, value.toUpperCase());
			}
			else if(key === "codid")
			{
				Loader.COD.loadCODID(value, document.title);
			}
			else if(key === "dialog")
			{
				MolView.showDialog(value);
			}
			else if(key === "bg")
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
	 * @param {String}  name        Layer name
	 * @param {Boolean} forceResize Force Sketcher and Model resize
	 */
	setLayer: function(name, forceResize)
	{
		$(".layer").hide();
		$("#" + name + "-layer").show();

		if(name === "main" && ($("#main-layer").sizeChanged() || forceResize))
		{
			$("#main-layer").saveSize();
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
		$("#layout-menu > a").removeClass("selected");
		$("#action-layout-" + layout).addClass("selected");
		$("#main-layer").removeClass("layout-sketcher layout-model layout-vsplit layout-hsplit").addClass("layout-" + layout);
		this.layout = layout;
		this.setLayer("main", true);
	},

	/**
	 * Sets main menu layout
	 * @param {Boolean} compact   Indicates use of compact layout
	 * @param {Boolean} collapse  Collapse search-input and brand
	 * @param {Boolean} fitSearch Fit #search in screen width
	 */
	setMenuLayout: function(compact, collapse, fitSearch)
	{
		$("#search").css("margin", collapse ? 0 : "");
		$("#search-input").css("width", collapse ? 100 : (fitSearch ? $(window).width() - 90 : ""));
		$("#brand").toggle(!collapse);
		$("#search-dropdown .dropdown-menu").toggleClass("dropdown-left",
				$(window).width() >= $("#search-dropdown .dropdown-menu").outerWidth() && !collapse)
				.toggleClass("dropdown-compact", compact);
		$("#jmol-dropdown .dropdown-menu, #protein-dropdown .dropdown-menu").toggleClass("dropdown-left", compact);
	},

	/**
	 * Sets MolView UI theme by replacing the UI CSS link with
	 * build/molview-$theme.min.css
	 * @param {String} theme Theme name
	 */
	setTheme: function(theme)
	{
		Preferences.set("molview", "theme", theme);

		$("#action-theme-desktop, #action-theme-touch").removeClass("checked");
		$("#action-theme-" + theme).addClass("checked");
		$("#theme-stylesheet").attr("href", "build/molview-" + theme + ".min.css");
	},

	/**
	 * Makes sure the Model view is visible
	 */
	makeModelVisible: function()
	{
		if(this.layout === "sketcher")
			MolView.setLayout("both");
	},

	/**
	 * Applies alert effect to #search-input to notify the user that it's empty
	 */
	alertEmptyInput: function()
	{
		if(MolView.search_input_timeout !== null)
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
