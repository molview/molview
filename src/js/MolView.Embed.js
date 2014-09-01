/*!
MolView v2.2 (http://molview.org)
Copyright (c) 2014, Herman Bergwerf
ALL RIGHTS RESERVED
*/

var MolView = {
	touch: false,
	mobile: false,
	trigger: "click",
	query: {},
	loadDefault: true,
	JMOL_J2S_PATH: "../jmol/j2s",


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
		Request.init();

		$(window).on("resize", function()
		{
			Model.resize();
		});

		Progress.increment();

		Model.init((function()
		{
			if(this.touch && !Detector.webgl)
				Model.JSmol.setPlatformSpeed(1);

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
				else if(key == "mode")
				{
					if(value == "balls" || value == "stick"
					|| value == "vdw" || value == "wireframe"
					|| value == "line")
					{
						Model.setRepresentation(value);
					}
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
		}).bind(this), Detector.webgl ? "GLmol" : ((this.query.pdbid || this.query.codid) ? "JSmol" : "GLmol"));
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
