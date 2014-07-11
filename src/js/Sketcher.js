/*!
MolView v2.2 (http://molview.org)
Copyright (c) 2014, Herman Bergwerf
ALL RIGHTS RESERVED
*/
"use strict";

var Sketcher = {
	moledit: undefined,
	title_lock: false,//prevent title switching while Loading compound
	CID: undefined,
	
	//init and load defaults
	init: function()
	{
		this.initPeriodicTable();

		if(Detector.canvas)
		{
			this.moledit = new ChemicalView(document.getElementById("moledit-area"), document.getElementById("moledit-canvas"));
			
			if(MolView.loadDefault)
			{
				this.loadMOL(defaultMol2D);
			}
			
			this.moledit.onChanged = function()
			{
				Sketcher.CID = undefined;
				$("#resolve").removeClass("resolve-updated");
				if(!Sketcher.title_lock) document.title = "MolView";
			};
		}
		else Messages.alert("no_canvas_support");
	},
	
	resize: function()
	{
		if(this.moledit !== undefined)
			this.moledit.resize();
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
						window.setTimeout(MolView.hideWindows, 0);
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
		if(this.moledit !== undefined)
		{
			this.title_lock = true;
			this.moledit.loadMOL(mol);
			this.moledit.removeImplicitHydrogen();
			this.title_lock = false;
		}
	},
	
	getMOL: function()
	{
		if(this.moledit !== undefined)
			return this.moledit.getMOL();
		else return "";
	},
	
	getSMILES: function()
	{
		if(this.moledit !== undefined)
		{
			if(this.moledit.chem.atoms.length == 0) throw new Error("No atoms found");
			var molecule = chem.Molfile.parseCTFile(this.getMOL().split("\n"));
			return (new chem.SmilesSaver()).saveMolecule(molecule);
		}
		else return "";
	},
	
	markOutdated: function()
	{
		$("#resolve").removeClass("resolve-updated");
	},
	
	markUpdated: function()
	{
		$("#resolve").addClass("resolve-updated");
	},
	
	toDataURL: function()
	{
		if(this.moledit !== undefined)
			return document.getElementById("moledit-canvas").toDataURL("image/png");
	}
};
