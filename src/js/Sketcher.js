/**
 * This file is part of MolView (http://molview.org)
 * Copyright (c) 2014-2023 Herman Bergwerf
 */

/**
 * MolView sketcher wrapper
 * Wraps MolPad
 * @type {Object}
 */
var Sketcher = {
	molpad: undefined,
	metadata: {
		cid: undefined,
		inchi: undefined,
		inchikey: undefined,
		smiles: undefined,
	},

	/**
	 * Init sketcher
	 */
	init: function()
	{
		MPFragments.init();

		this.initPeriodicTable();
		this.resizeToolbars();

		$("#action-mp-color-mode").toggleClass("tool-button-selected",
				Preferences.get("sketcher", "colored", true));
		$("#action-mp-skeletal-formula").toggleClass("tool-button-selected",
				!Preferences.get("sketcher", "skeletal_formula", true));

		if(Detector.canvas)
		{
			this.molpad = new MolPad(document.getElementById("molpad-canvas-wrapper"),
				MolView.devicePixelRatio, {
					undo: "#action-mp-undo",
					redo: "#action-mp-redo"
				});
			this.molpad.setSkeletalDisplay(Preferences.get("sketcher", "skeletal_formula", true));
			this.setColored(Preferences.get("sketcher", "colored", true));
			this.setTool($("#action-mp-lasso"), "select", { type: "lasso" });

			if(MolView.loadDefault)
			{
				this.loadMOL(defaultMol2D);
			}

			this.molpad.onChange(function()
			{
				Sketcher.metadata = {};

				if(Sketcher.molpad.mol.copy.fingerprint === Sketcher.fingerprint)
				{
					Sketcher.markUpdated();
				}
				else
				{
					Sketcher.markOutdated();
				}
			});
		}
		else
		{
			Messages.alert("no_canvas_support");
		}
	},

	/**
	 * Auto resize sketcher
	 */
	resize: function()
	{
		if(this.molpad)
		{
			this.resizeToolbars();
			this.molpad.resize();
		}
	},

	/**
	 * Auto resize sketcher toolbars to fit scrollbar
	 */
	resizeToolbars: function()
	{
		var top   = 40 + $("#edit-tools").css("height", 40).scrollTop(40).scrollTop();
		var left  = 40 + $("#chem-tools").css("width", 40).scrollLeft(40).scrollLeft();
		var right = 40 + $("#elem-tools").css("width", 40).scrollLeft(40).scrollLeft();

		$("#edit-tools").css({
			left: left,
			height: top
		});
		$("#chem-tools").css({
			width: left
		});
		$("#elem-tools").css({
			top: top,
			width: right
		});
		$("#molpad-canvas-wrapper").css({
			top: top,
			left: left,
			right: right,
		});
	},

	/**
	 * Build periodic table in periodictable dialog
	 */
	initPeriodicTable: function()
	{
		var table = PeriodicTable.table;
		table.push({ "elements": PeriodicTable.lanthanoids })
		table.push({ "elements": PeriodicTable.actinoids });

		for(var group = 0; group < table.length; group++)
		{
			var position = -1;
			for(var i = 0; i < table[group].elements.length; i++)
			{
				var element = table[group].elements[i];

				if(element.name === "") continue;

				for(var f = position; f < element.position - 1; f++)//fill remaining space
					$('<div class="pt-space"></div>').appendTo("#periodictable");

				$('<div class="pt-element"></div>')
					.attr("title", element.name)
					.append($("<h3></h3>").html(element.number))
					.append($("<h4></h4>").html(element.small)
						.css("color", JmolAtomColorsHashHex[element.small]))
					.data("element", element.small)
					.on(MolView.trigger, function()
					{
						$("#molpad .primary-tool").removeClass("tool-button-selected");
						$("#action-mp-periodictable").addClass("tool-button-selected");

						Sketcher.molpad.setTool("atom", { element: $(this).data("element") });
						MolView.hideDialogs();
					})
					.appendTo("#periodictable");

				position = element.position;
			}
			$("<br/>").appendTo("#periodictable");
		}
	},

	/**
	 * Load molfile into sketcher
	 * @param {String} mol Molfile
	 */
	loadMOL: function(mol)
	{
		if(this.molpad)
		{
			this.molpad.loadMOL(mol);
		}
	},

	/**
	 * Get molfile from sketcher
	 * @return {String} molfile
	 */
	getMOL: function()
	{
		if(this.molpad)
		{
			return this.molpad.getMOL();
		}
		else return "";
	},

	/**
	 * Get SMILES from sketcher
	 * Uses M2S from Ketcher
	 * @return {String} SMILES
	 */
	getSMILES: function()
	{
		if(this.metadata.smiles)
		{
			return this.metadata.smiles;
		}
		else if(this.molpad)
		{
			this.metadata.smiles = this.molpad.getSMILES();
			return this.metadata.smiles;
		}
		else return "";
	},

	setTool: function(button, type, data)
	{
		if(this.molpad) this.molpad.setTool(type, data);

		$(".primary-tool").removeClass("tool-button-selected");
		$(button).addClass("tool-button-selected");
	},

	clear: function()
	{
		if(this.molpad) this.molpad.clear();
	},

	undo: function()
	{
		if(this.molpad) this.molpad.undo();
	},

	redo: function()
	{
		if(this.molpad) this.molpad.redo();
	},

	setColored: function(colored)
	{
		if(this.molpad)
		{
			$(".tool-element").toggleClass("element-colored", colored);
			Preferences.set("sketcher", "colored", colored);
			this.molpad.setColored(colored);
		}
	},

	toggleColorMode: function()
	{
		if(this.molpad)
		{
			this.setColored($("#action-mp-color-mode")
					.toggleClass("tool-button-selected")
					.hasClass("tool-button-selected"));
		}
	},

	toggleSkeletalFormula: function()
	{
		if(this.molpad)
		{
			var skeletal = !$("#action-mp-skeletal-formula")
					.toggleClass("tool-button-selected")
					.hasClass("tool-button-selected");
			Preferences.set("sketcher", "skeletal_formula", skeletal);
			this.molpad.setSkeletalDisplay(skeletal);
		}
	},

	center: function()
	{
		if(this.molpad) this.molpad.center();
	},

	clean: function()
	{
		Messages.process(Loader.clean, "clean");
	},

	markOutdated: function()
	{
		$("#action-resolve").addClass("resolve-outdated");
	},

	markUpdated: function()
	{
		this.fingerprint = this.molpad.mol.copy.fingerprint;
		$("#action-resolve").removeClass("resolve-outdated");
	},

	toDataURL: function()
	{
		if(this.molpad)
		{
			return this.molpad.toDataURL();
		}
		else return "";
	}
};
