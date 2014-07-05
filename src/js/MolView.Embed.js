/*!
MolView v2.1 (http://molview.org)
Copyright (c) 2014, Herman Bergwerf
ALL RIGHTS RESERVED
*/
"use strict";

var MolView = {
	touch: false,
	mobile: false,
	trigger: "click",
	query: {},
	loadDefault: true,
	
	init: function()
	{
		this.query = getQuery();
		
		if(this.query.q || this.query.smiles || this.query.cid || this.query.pdbid || this.query.codid)
			this.loadDefault = false;
		
		this.touch = isTouchDevice();
		if(this.touch) $(document.body).addClass("touch");
		this.mobile = isMobile();
		this.height = window.innerHeight;
		
		Progress.init();
		if(this.loadDefault)
		{
			Progress.clear();
			Progress.setSteps(2);
		}
		
		//initialize
		Messages.init();
		Request.init();
		
		$(window).on("resize", function()
		{
			Model.resize();
		});
		
		Progress.increment();
		
		Model.init(function()
		{
			if(this.touch && !Detector.webgl)
				Model.JSmol.setPlatformSpeed(1);
			if(!Detector.webgl)
				Actions.engine_jmol();
			
			Progress.complete();
			Progress.hide();
			
			//execute query commands
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
					Messages.process(function()
					{
						Loader.Compounds.loadCID(value, document.title);
					}, "compound");
				}
				else if(key == "pdbid")
				{
					Messages.process(function()
					{
						Loader.Proteins.loadPDBID(value, value.toUpperCase());
					}, "protein");
				}
				else if(key == "codid")
				{
					Messages.process(function()
					{
						Loader.Crystals.loadCODID(value, document.title);
					}, "protein");
				}
				else if(key == "mode")
				{
					if(value == "balls") Model.setRepresentation("balls");
					if(value == "stick") Model.setRepresentation("stick");
					if(value == "vdw") Model.setRepresentation("vdw");
					if(value == "wireframe") Model.setRepresentation("wireframe");
					if(value == "line") Model.setRepresentation("lines");
				}
			});
		}.bind(this), Detector.webgl ? "GLmol" : "JSmol");
	},
	
	//do not remove: called from Loader
	makeModelVisible: function()
	{
	},
};

$(document).on("ready", function()
{
	MolView.init();
});

