/*!
MolView v2.2 (http://molview.org)
Copyright (c) 2014, Herman Bergwerf
ALL RIGHTS RESERVED
*/

var ChemProps = {
	data: {},

    update: function(smiles)
	{
		if(this.data["smiles"] != smiles && smiles != "")
		{
			$(".chemprop").removeClass("chemprop-unavailable").addClass("chemprop-loading");
			$(".chemprop:not(.chem-spectrum)").html("").val("");
			$("#molecule-image").attr("src", "img/empty.png");
			$("#molecule-info").hide();
			$("#molecule-title").text("");
			$("#molecule-description").text("");

			$("#chemspider-external-link").hide();
			$("#pubchem-external-link").hide();

			this.data = {};
            this.data["smiles"] = smiles;

    		//update formula
    		Request.ChemicalIdentifierResolver.getProperty(smiles, "formula",
    		function(formula)
    		{
    			ChemProps.data["formula"] = formula;
    			$("#prop-formula").html(chemFormulaFormat(formula)).removeClass("chemprop-loading");
    		}, function(){ $("#prop-formula").removeClass("chemprop-loading").addClass("chemprop-unavailable") },
    		   function(){ $("#prop-formula").removeClass("chemprop-loading").addClass("chemprop-unavailable") });

    		//update mass
    		Request.ChemicalIdentifierResolver.getProperty(smiles, "mw",
    		function(mw)
    		{
    			ChemProps.data["mw"] = mw;
    			$("#prop-weight").text(mw + " u").removeClass("chemprop-loading");
    		}, function(){ $("#prop-weight").removeClass("chemprop-loading").addClass("chemprop-unavailable") },
    		   function(){ $("#prop-weight").removeClass("chemprop-loading").addClass("chemprop-unavailable") });

    		//update primary properties
    		this.CIRproperty("prop-donors", "h_bond_donor_count");
    		this.CIRproperty("prop-acceptors", "h_bond_acceptor_count");

    		//update identifiers
    		this.CIRproperty("prop-stdinchikey", "stdinchikey");
    		this.CIRproperty("prop-stdinchi", "stdinchi");
    		this.CIRproperty("prop-cas", "cas");
    		this.CIRproperty("prop-csid", "chemspider_id", function()
    		{
    			$("#chemspider-external-link").attr("href", "http://www.chemspider.com/Chemical-Structure."
    				+ ChemProps.data.csid + ".html").show();
    		});

    		//load data from PubChem
    		function addCIDlink()
    		{
    			$("#pubchem-external-link").attr("href",
    				"https://pubchem.ncbi.nlm.nih.gov/summary/summary.cgi?cid="
    				+ ChemProps.data.CID).show();
    		}

    		if(Sketcher.CID)
    		{
    			ChemProps.data.CID = Sketcher.CID;
    			$("#prop-cid").val(ChemProps.data.CID).removeClass("chemprop-loading");
    			addCIDlink();

    			Request.PubChem.description(Sketcher.CID, function(data)
    			{
    				data = data.InformationList.Information[0];
    				data.Title = ucfirst(humanize(data.Title));

    				document.title = data.Title;
    				$("#molecule-info").show();
    				$("#molecule-title").text(data.Title);
    				$("#molecule-description").text(data.Description);

    				ChemProps.PubChemProperties([ "prop-sysname", "prop-smiles" ], [ "IUPACName", "IsomericSMILES" ]);
    			},
    			function()
    			{
    				$("#prop-smiles").val(ChemProps.smiles).removeClass("chemprop-loading");
    				$("#prop-sysname").removeClass("chemprop-loading").addClass("chemprop-unavailable");
    			});
    		}
    		else//retireve cid
    		{
    			Request.PubChem.SMILES.description(smiles, function(data)
    			{
    				data = data.InformationList.Information[0];
    				data.Title = ucfirst(humanize(data.Title));

    				ChemProps.data.CID = data.CID;
    				$("#prop-cid").val(data.CID).removeClass("chemprop-loading");
    				addCIDlink();

    				document.title = data.Title;
    				$("#molecule-info").show();
    				$("#molecule-title").text(data.Title);
    				$("#molecule-description").text(data.Description);

    				ChemProps.PubChemProperties([ "prop-sysname", "prop-smiles" ], [ "IUPACName", "IsomericSMILES" ]);
    			},
    			function()
    			{
    				$("#prop-smiles").val(ChemProps.smiles).removeClass("chemprop-loading");
    				$("#prop-cid").removeClass("chemprop-loading").addClass("chemprop-unavailable");
    				$("#prop-sysname").removeClass("chemprop-loading").addClass("chemprop-unavailable");
    			});
    		}
        }
	},

	updateImage: function()
	{
		if(ChemProps.smiles == "") return;

		$("#molecule-image").addClass("chemprop-loading");
		$("#molecule-image-wrapper").show();

		var imgw = $("#molecule-image").width() * (MolView.mobile ? 1.5 : 1);
		var img = new Image();
		img.onload = function()
		{
			$("#molecule-image").attr("src", img.src).removeClass("chemprop-loading");
			$("#molecule-image-wrapper").show();
		}
		img.onerror = function()
		{
			$("#molecule-image-wrapper").hide();
			$("#molecule-image").attr("src", "img/empty.png").removeClass("chemprop-loading");
		}

		if(Sketcher.CID)
			img.src = Request.PubChem.image(Sketcher.CID) + "&image_size=" + imgw + "x" + imgw;
		else
			img.src = Request.PubChem.SMILES.image(ChemProps.data["smiles"]) + "&image_size=" + imgw + "x" + imgw;
	},

	getProperty: function(id, cb)
	{
		if(ChemProps.data[id]) cb(ChemProps.data[id]);
	},

	CIRproperty: function(id, property, success, error)
	{
		if(ChemProps.data[property] != undefined)
		{
			if(success) success();
			return;
		}

		id = "#" + id;
		var smiles = ChemProps.data["smiles"];

		function request()
		{
			Request.ChemicalIdentifierResolver.getProperty(smiles, property,
			function(data)
			{
				var array = data.split("\n");

				var value = array[0];

				if(property == "cas")
				{
					array.sort(function(a, b){ return a.length > b.length; });
					value = array[0];
				}

				ChemProps.data[id.substr(6)] = value;
				$(id).removeClass("chemprop-loading");
				if($(id).is("input")) $(id).val(value);
				else $(id).text(value);
				if(success) success();
			},
			function()
			{
				if(smiles == ChemProps.smiles)
					window.setTimeout(request, ChemProps.CIR_retry_interval);
			},
			function()
			{
				$(id).removeClass("chemprop-loading").addClass("chemprop-unavailable");
				if(error) error();
			});
		}
		request();
	},

	PubChemProperties: function(targets, properties)
	{
		if(!ChemProps.data.CID || targets.length != properties.length) return;

		Request.PubChem.properties(ChemProps.data.CID, "" + properties, function(data)
		{
			data = data.PropertyTable.Properties[0];

			for(var i = 0; i < targets.length; i++)
			{
				var tar = "#" + targets[i];
				$(tar).removeClass("chemprop-loading");
				if(data[properties[i]])
				{
					ChemProps.data[properties[i]] = data[properties[i]];
					if($(tar).is("input")) $(tar).val(data[properties[i]]);
					else $(tar).text(data[properties[i]]);
				}
				else $(tar).addClass("chemprop-unavailable");
			}
		}, function()
		{
			$("#" + targets.reduce(function(a, b){ return a + ",#" + b; }))
				.removeClass("chemprop-loading").addClass("chemprop-unavailable");
		});
	}
};
