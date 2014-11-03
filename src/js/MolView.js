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
		//exeption tracking
		window.onerror = function(message, url, row, column)
		{
			ga("send", "exception", {
				"exDescription": url + " " + row + "," + column + ": " + message,
				"exFatal": false,
			});
		};

		$(document).ajaxError(function(e, request, settings)
		{
			ga("send", "exception", {
				"exDescription": "AJAX error: " + settings.type + " " + settings.url + ": " + request.statusText,
				"exFatal": false
			});
		});

		//setup
		MolView.devicePixelRatio = window.devicePixelRatio || (MolView.mobile ? 1.5 : 1.0);

		Preferences.init();
		Progress.init();
		History.init();
		Link.init();

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
			MolView.pushEvent("button", "click", "layer close", 0);
		});

		//enable expandable expanding
		$(".expandable-title").on(this.trigger, function(e)
		{
			$(this).parent().toggleClass("open");
		});

		//actions
		this.addAction("layout_sketcher", "menu");
		this.addAction("layout_model", "menu");
		this.addAction("layout_vsplit", "menu");
		this.addAction("layout_hsplit", "menu");
		this.addAction("theme_desktop", "menu");
		this.addAction("theme_touch", "menu");
		this.addAction("help", "menu");
		this.addAction("about", "menu");

		this.addAction("share", "menu");
		this.addAction("embed", "menu");
		this.addAction("export_sketcher_png", "menu");
		this.addAction("export_model_png", "menu");
		this.addAction("export_model", "menu");
		this.addAction("data_infocard", "menu");
		this.addAction("data_spectra", "menu");
		this.addAction("search_substructure", "menu");
		this.addAction("search_superstructure", "menu");
		this.addAction("search_similarity", "menu");

		this.addAction("model_reset", "menu");
		this.addAction("model_balls", "menu");
		this.addAction("model_stick", "menu");
		this.addAction("model_vdw", "menu");
		this.addAction("model_wireframe", "menu");
		this.addAction("model_line", "menu");
		this.addAction("model_bg_black", "menu");
		this.addAction("model_bg_gray", "menu");
		this.addAction("model_bg_white", "menu");
		this.addAction("engine_glmol", "menu");
		this.addAction("engine_jmol", "menu");
		this.addAction("engine_cdw", "menu");
		this.addAction("cif_unit_cell", "menu");
		this.addAction("cif_cubic_supercell", "menu");
		this.addAction("cif_flat_supercell", "menu");

		this.addAction("bio_assembly", "menu");
		this.addAction("chain_type_ribbon", "menu");
		this.addAction("chain_type_cylinders", "menu");
		this.addAction("chain_type_btube", "menu");
		this.addAction("chain_type_ctrace", "menu");
		this.addAction("chain_type_bonds", "menu");
		this.addAction("chain_color_ss", "menu");
		this.addAction("chain_color_spectrum", "menu");
		this.addAction("chain_color_chain", "menu");
		this.addAction("chain_color_residue", "menu");
		this.addAction("chain_color_polarity", "menu");
		this.addAction("chain_color_bfactor", "menu");

		this.addAction("jmol_hq", "menu");
		this.addAction("jmol_clean", "menu");
		this.addAction("jmol_mep_lucent", "menu");
		this.addAction("jmol_mep_opaque", "menu");
		this.addAction("jmol_charge", "menu");
		this.addAction("jmol_bond_dipoles", "menu");
		this.addAction("jmol_net_dipole", "menu");
		this.addAction("jmol_minimize", "menu");
		this.addAction("jmol_measure_distance", "menu");
		this.addAction("jmol_measure_angle", "menu");
		this.addAction("jmol_measure_torsion", "menu");

		this.addAction("search_pubchem", "menu");
		this.addAction("search_rcsb", "menu");
		this.addAction("search_cod", "menu");
		this.addAction("show_search_layer", "menu");
		this.addAction("load_more_pubchem", "button");
		this.addAction("load_more_rcsb", "button");
		this.addAction("load_more_cod", "button");

		this.addAction("mp_clean", "button");
		this.addAction("mp_periodictable", "button");
		this.addAction("resolve", "button");

		this.addAction("start_help", "button");
		this.addAction("export_spectrum_png", "button");
		this.addAction("export_spectrum_jcamp", "button");

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
		}, (!Detector.webgl && !MolView.touch) ? "JSmol" : "GLmol");
	},

	/**
	 * Bind action using $(#action-id).on(MolView.trigger, Actions[id])
	 * DOM ID: '_' is replaced with '-'
	 * Event label: '_' is replaced with ' '
	 * @param {String} id       Action identifier ([a-z]_)
	 * @param {String} category Event tracking category (button|menu)
	 */
	addAction: function(id, category)
	{
		$("#action-" + id.replace(/_/g, "-")).data("id", id).on(this.trigger, function()
		{
			var id = $(this).data("id");
			MolView.pushEvent(category, "click", id.replace(/_/g, " "),
				Actions[id].call(this) || 0);
		});
	},

	/**
	 * Wrapper for analytics.js
	 */
	pushEvent: function(category, action, label, number)
	{
		ga("send", "event", category, action, label, number);
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
		$("#layout-menu > a").removeClass("selected");
		$("#action-layout-" + layout).addClass("selected");
		$("#main-layer").removeClass("layout-sketcher layout-model layout-vsplit layout-hsplit").addClass("layout-" + layout);
		this.layout = layout;
		this.setLayer("main");
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
