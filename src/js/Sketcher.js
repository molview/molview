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
		this.initPeriodicTable();
		this.resizeToolbars();

		$("#action-mp-skeletal-formula").toggleClass("tool-button-active",
				!Preferences.get("sketcher", "skeletal_formula", true));

		if(Detector.canvas)
		{
			this.molpad = new MolPad(document.getElementById("molpad-canvas"));

			if(MolView.loadDefault)
			{
				this.loadMOL(defaultMol2D);
			}

			this.molpad.onChange(function()
			{
				Sketcher.metadata = {};
				$("#action-resolve").removeClass("resolve-updated");
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
		$("#molpad-canvas").css({
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

				if(element.name == "") continue;

				for(var f = position; f < element.position - 1; f++)//fill remaining space
					$('<div class="pt-space"></div>').appendTo("#periodictable");

				$('<div class="pt-element"></div>')
					.attr("title", element.name)
					.append($("<h3></h3>").html(element.number))
					.append($("<h4></h4>").html(element.small)
						.css("color", JmolAtomColorsCSS[element.small]))
					.data("nr", element.small)
					.on(MolView.trigger, function()
					{
						$("#molpad .primary-tool").removeClass("tool-button-selected");
						$("#action-mp-periodictable").addClass("tool-button-selected");

						Sketcher.molpad.setTool("atom", $(this).data("nr"));
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

	markOutdated: function()
	{
		$("#action-resolve").removeClass("resolve-updated");
	},

	markUpdated: function()
	{
		$("#action-resolve").addClass("resolve-updated");
	},

	toDataURL: function(cb)
	{
		if(this.molpad)
		{
			return this.molpad.toDataURL(cb);
		}
		else cb("");
	}
};
