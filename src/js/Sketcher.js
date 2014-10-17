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

var Sketcher = {
	moledit: undefined,
	metadata: {
		cid: undefined,
		inchi: undefined,
		inchikey: undefined,
		smiles: undefined,
	},

	init: function()
	{
		this.initPeriodicTable();
		this.resizeToolbars();

		$("#hstrip").on(MolView.trigger, function()
		{
			if($(this).toggleClass("tool-button-selected").hasClass("tool-button-selected"))
			{
				Sketcher.moledit.removeImplicitHydrogen();
			}
		});

		if(Detector.canvas)
		{
			this.moledit = new ChemicalView(document.getElementById("moledit-area"), document.getElementById("moledit-canvas"), MolView.devicePixelRatio);

			if(MolView.loadDefault)
			{
				this.loadMOL(defaultMol2D);
			}

			this.moledit.onChanged = function()
			{
				Sketcher.metadata = {};
				$("#resolve").removeClass("resolve-updated");
			};
		}
		else Messages.alert("no_canvas_support");
	},

	resize: function()
	{
		if(this.moledit)
		{
			this.moledit.resize();
			this.resizeToolbars();
		}
	},

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
		$("#moledit-area").css({
			top: top,
			left: left,
			right: right,
		});
	},

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
						$("#moledit .tool-button:not(.custom)").not(this).removeClass("tool-button-selected");
						$("#me-elements").addClass("tool-button-selected");

						Sketcher.moledit.setElement.call(Sketcher.moledit, $(this).data("nr"));
						window.setTimeout(MolView.hideDialogs, 0);
					})
					.appendTo("#periodictable");
				position = element.position;
			}
			$("<br/>").appendTo("#periodictable");
		}

		$("#me-elements").on(MolView.trigger, function()
		{
			$("#me-elements").removeClass("tool-button-selected");
			MolView.showDialog("elements");
		});
	},

	loadMOL: function(mol)
	{
		//load molecule
		if(this.moledit)
		{
			this.moledit.loadMOL(mol);

			if($("#hstrip").hasClass("tool-button-selected"))
			{
				this.moledit.removeImplicitHydrogen();
			}
		}
	},

	getMOL: function()
	{
		if(this.moledit)
		{
			return this.moledit.getMOL();
		}
		else return "";
	},

	getSMILES: function()
	{
		if(this.metadata.smiles)
		{
			return this.metadata.smiles;
		}
		else if(this.moledit)
		{
			if(this.moledit.chem.atoms.length == 0) throw new Error("No atoms found");
			var molecule = chem.Molfile.parseCTFile(this.getMOL().split("\n"));
			this.metadata.smiles = new chem.SmilesSaver().saveMolecule(molecule);
			return this.metadata.smiles;
		}
		else return "";
	},

	removeAllHydrogen: function()
	{
		this.moledit.removeAllHydrogen();
	},

	markOutdated: function()
	{
		$("#resolve").removeClass("resolve-updated");
	},

	markUpdated: function()
	{
		$("#resolve").addClass("resolve-updated");
	},

	getImageDataURL: function()
	{
		if(this.moledit)
		{
			return document.getElementById("moledit-canvas").toDataURL("image/png");
		}
		else return "";
	}
};
