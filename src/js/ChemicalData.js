/*!
MolView v2.1 (http://molview.org)
Copyright (c) 2014, Herman Bergwerf
ALL RIGHTS RESERVED
*/
"use strict";

var ChemicalData = {
	smiles: "",
	data: {},
	spectrum_data: {},
	
	spectrum: undefined,
	spectrum_ratio: 1 / .3,
	
	CIR_retry_interval: 1000,
	updated: {
		properties: false,
		spectra: false,
	},
	
	init: function()
	{
		$(window).on("resize", function()
		{
			if($("#properties-dialog").is(":visible"))
			{
				ChemicalData.updateMoleculeImage();
			}
			
			if($("#spectra-dialog").is(":visible"))
			{
				ChemicalData.resizeSpectrum();
			}
		});
		
		$("#spectrum-select").on("change", function()
		{
			ChemicalData.loadSpectrum($("#spectrum-select").val());
		});
		
		if(MolView.mobile)
		{
			//enable mobile scrolling
			$("#spectrum-wrapper").on("touchmove", function(e)
			{
				e.stopImmediatePropagation();
			});
			
			this.spectrum_ratio = 1 / .5;
			this.spectrum = new ChemDoodle.ObserverCanvas("spectrum-canvas", 100, 100);
		}
		else this.spectrum = new ChemDoodle.SeekerCanvas("spectrum-canvas", 100, 100, ChemDoodle.SeekerCanvas.SEEK_PLOT);
		
		this.spectrum.specs.plots_showYAxis = true;
		this.spectrum.specs.plots_flipXAxis = true;
		this.spectrum.specs.plots_showGrid = true;
		this.spectrum.specs.backgroundColor = "#ffffff";
		this.spectrum.emptyMessage = "No spectrum selected";
	},
	
	update: function(smiles)
	{
		if(this.smiles != smiles && smiles != "")
		{
			$(".chemprop").removeClass("unavailable").addClass("loading");
			$(".chemprop:not(.chem-spectrum)").html("").val("");
			$("#molecule-image").attr("src", "src/img/empty.png");
			$("#molecule-info").hide();
			$("#molecule-title").text("");
			$("#molecule-description").text("");
			
			$("#chemspider-external-link").hide();
			$("#pubchem-external-link").hide();
			
			this.smiles = smiles;
			this.data = {};
			this.spectrum_data = {};
			this.updated.properties = false;
			this.updated.spectra = false;
		}
	},
	
	updateProperties: function()
	{
		if(this.updated.properties) return;
		else this.updated.properties = true;
		
		//update formula
		Request.ChemicalIdentifierResolver.getProperty(this.smiles, "formula",
		function(formula)
		{
			ChemicalData.data["formula"] = formula;
			$("#prop-formula").html(chemFormulaFormat(formula)).removeClass("loading");
		}, function(){ $("#prop-formula").addClass("unavailable") });
		
		//update mass
		Request.ChemicalIdentifierResolver.getProperty(this.smiles, "mw",
		function(mw)
		{
			ChemicalData.data["mw"] = mw;
			$("#prop-weight").text(mw + " u").removeClass("loading");
		}, function(){ $("#prop-weight").addClass("unavailable") });
		
		//update primary properties
		this.CIRproperty("prop-h-donors", "h_bond_donor_count");
		this.CIRproperty("prop-h-acceptors", "h_bond_acceptor_count");
		this.CIRproperty("prop-ro5-violations", "rule_of_5_violation_count");
		this.CIRproperty("prop-fr-bonds", "rotor_count");
		this.CIRproperty("prop-er-bonds", "effective_rotor_count");
		this.CIRproperty("prop-rings", "ring_count");
		this.CIRproperty("prop-ring-systems", "ringsys_count");
		
		//update identifiers
		this.CIRproperty("prop-stdinchikey", "stdinchikey");
		this.CIRproperty("prop-stdinchi", "stdinchi");
		this.CIRproperty("prop-cas", "cas");
		this.CIRproperty("prop-chemspider_id", "chemspider_id", function()
		{
			$("#chemspider-external-link").attr("href", "http://www.chemspider.com/Chemical-Structure."
				+ ChemicalData.data.chemspider_id + ".html").show();
		});
		
		//load data from PubChem
		function addCIDlink()
		{
			$("#pubchem-external-link").attr("href",
				"https://pubchem.ncbi.nlm.nih.gov/summary/summary.cgi?cid="
				+ ChemicalData.data.CID).show();
		}
		
		if(Sketcher.CID)
		{
			ChemicalData.data.CID = Sketcher.CID;
			$("#prop-cid").val(ChemicalData.data.CID).removeClass("loading");
			addCIDlink();
			
			Request.PubChem.description(Sketcher.CID, function(data)
			{
				data = data.InformationList.Information[0];
				
				$("#molecule-info").show();
				$("#molecule-title").text(ucfirst(data.Title));
				$("#molecule-description").text(data.Description);
				
				ChemicalData.PubChemProperty("prop-iupac", "IUPACName");
				ChemicalData.PubChemProperty("prop-smiles", "CanonicalSMILES");
			},
			function()
			{
				$("#prop-smiles").val(ChemicalData.smiles).removeClass("loading");
				$("#prop-iupac").removeClass("loading").addClass("unavailable");
			});
		}
		else//retireve cid
		{
			Request.PubChem.SMILES.description(this.smiles, function(data)
			{
				data = data.InformationList.Information[0];
				
				ChemicalData.data.CID = data.CID;
				$("#prop-cid").val(data.CID).removeClass("loading");
				addCIDlink();
				
				$("#molecule-info").show();
				$("#molecule-title").text(ucfirst(data.Title));
				$("#molecule-description").text(data.Description);
				
				ChemicalData.PubChemProperties([ "prop-iupac", "prop-smiles" ], [ "IUPACName", "CanonicalSMILES" ]);
			},
			function()
			{
				$("#prop-smiles").val(ChemicalData.smiles).removeClass("loading");
				$("#prop-cid").removeClass("loading").addClass("unavailable");
				$("#prop-iupac").removeClass("loading").addClass("unavailable");
			});
		}
	},
	
	updateSpectra: function()
	{
		if(this.updated.spectra) return;
		else this.updated.spectra = true;
		
		$("#spectrum").addClass("loading");
		$("#spectrum-select").html('<option value="loading" disabled selected style="display:none;">Loading...</option>').val("loading");
		this.spectrumPrint("No spectrum selected");
		
		//update available spectra
		function no_spectra()
		{
			$("#spectrum-select").append('<option value="default" disabled selected style="display:none;">Choose a spectrum</option>');
			$("#spectrum-select").append('<option value="nmrdb">H1-NMR prediction</option>');
			$("#spectrum").removeClass("loading");
		}
		
		this.CIRproperty("prop-cas", "cas", function()
		{
			Request.NIST.IRlookup(ChemicalData.data.cas, function(data)
			{
				$("#spectrum-select").empty();
				$("#spectrum-select").append('<option value="default" disabled selected style="display:none;">Choose a spectrum</option>');
				$("#spectrum-select").append('<option value="nmrdb">H1-NMR prediction</option>');
				
				if(data.mass) $("#spectrum-select").append('<option value="nist-mass">Mass spectrum</option>');
				
				if(data.ir !== undefined)
				{
					for(var i = 0; i < data.ir.length; i++)
					{
						$("#spectrum-select").append('<option value="nist-ir-'
							+ data.ir[i].i + '">IR spectrum [' + data.ir[i].state + ']</option>');
					}
				}
					
				//if(data.uvvis) $("#spectrum-select").append('<option value="nist-uvvis">UV-Visible spectrum</option>');
				
				$("#spectrum-select").val("default");
				$("#spectrum").removeClass("loading");
			}, no_spectra);
		}, no_spectra);
	},
	
	loadSpectrum: function(type)
	{
		/*
		Accepted types:
		- nmrdb
		- nist-mass
		- nist-ir-{i}
		- nist-uvvis (not supported yet)
		*/
		
		this.spectrumPrint("Loading...");
		$("#spectrum").addClass("loading");
		
		function display_nmrdb()
		{
			var spectrum = ChemDoodle.readJCAMP(ChemicalData.spectrum_data.nmrdb);
			spectrum.title = ucfirst(humanize(spectrum.title));
			spectrum.yUnit = ucfirst(humanize(spectrum.yUnit));
			ChemicalData.spectrum.specs.plots_flipXAxis = true;
			ChemicalData.spectrum.loadSpectrum(spectrum);
			$("#spectrum").removeClass("loading");
		}
		
		function display_nist_spectrum()
		{
			/*
			For UV-Vis support (using js/lib/jcamp-dx.js):
			var spectrum = new jdx_parse();
			spectrum.load(ChemicalData.spectrum_data[type], 0, true);
			*/
			
			var spectrum = ChemDoodle.readJCAMP(ChemicalData.spectrum_data[type]);
			spectrum.title = ucfirst(humanize(spectrum.title));
			spectrum.yUnit = ucfirst(humanize(spectrum.yUnit));
			
			if(type == "nist-mass") ChemicalData.spectrum.specs.plots_flipXAxis = false;
			else ChemicalData.spectrum.specs.plots_flipXAxis = true;
			
			ChemicalData.spectrum.loadSpectrum(spectrum);
			$("#spectrum").removeClass("loading");
		}
			
		if(type == "nmrdb")
		{
			if(!this.spectrum_data.nmrdb)
			{
				Request.NMRdb.prediction(this.smiles, function(jcamp)
				{
					ChemicalData.spectrum_data.nmrdb = jcamp;
					display_nmrdb();
				}, function()
				{
					ChemicalData.spectrumPrint("Spectrum unavailable");
				});
			}
			else display_nmrdb();
		}
		else if(type.indexOf("nist" != -1))
		{
			if(!this.data.cas) return;
			
			if(this.spectrum_data[type] === undefined)
			{
				Request.NIST.spectrum(this.data.cas, type.substr(5), function(jcamp)
				{
					ChemicalData.spectrum_data[type] = jcamp;
					display_nist_spectrum();
				}, function()
				{
					ChemicalData.spectrumPrint("Spectrum unavailable");
				});
			}
			else display_nist_spectrum();
		}
	},
	
	spectrumPrint: function(str)
	{
		ChemicalData.spectrum.emptyMessage = str;
		ChemicalData.spectrum.loadSpectrum(null);
	},
	
	resizeSpectrum: function()
	{
		var w = $("#spectrum").width();
		var h = Math.round(w / ChemicalData.spectrum_ratio);
		$("#spectrum-wrapper").css({
			"width": w, "height": h
		});
		ChemicalData.spectrum.resize(w * (MolView.mobile ? 2 : 1), h * (MolView.mobile ? 2 : 1));
	},
	
	updateMoleculeImage: function()
	{
		if(ChemicalData.smiles == "") return;
		
		$("#molecule-image").addClass("loading");
		$("#molecule-image-wrapper").show();
		
		var imgw = $("#molecule-image").width() * (MolView.mobile ? 1.5 : 1);
		var img = new Image();
		img.onload = function()
		{
			$("#molecule-image").attr("src", img.src).removeClass("loading");
			$("#molecule-image-wrapper").show();
		}
		img.onerror = function()
		{
			$("#molecule-image-wrapper").hide();
			$("#molecule-image").attr("src", "src/img/empty.png").removeClass("loading");
		}
		
		if(Sketcher.CID)
			img.src = Request.PubChem.image(Sketcher.CID) + "&image_size=" + imgw + "x" + imgw;
		else
			img.src = Request.PubChem.SMILES.image(ChemicalData.smiles) + "&image_size=" + imgw + "x" + imgw;
	},
	
	CIRproperty: function(id, property, success, error)
	{
		if(ChemicalData.data[property] != undefined)
		{
			if(success) success();
			return;
		}
		
		id = "#" + id;
		var smiles = ChemicalData.smiles;
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
				
				ChemicalData.data[property] = value;
				$(id).removeClass("loading");
				if($(id).is("input")) $(id).val(value);
				else $(id).text(value);
				if(success) success();
			},
			function()
			{
				if(smiles == ChemicalData.smiles)
					window.setTimeout(request, ChemicalData.CIR_retry_interval);
			},
			function()
			{
				$(id).removeClass("loading").addClass("unavailable");
				if(error) error();
			});
		}
		request();
	},
	
	PubChemProperties: function(targets, properties)
	{
		if(!ChemicalData.data.CID || targets.length != properties.length) return;
		
		Request.PubChem.properties(ChemicalData.data.CID, "" + properties, function(data)
		{
			data = data.PropertyTable.Properties[0];
			
			for(var i = 0; i < targets.length; i++)
			{
				var tar = "#" + targets[i];
				$(tar).removeClass("loading");
				if(data[properties[i]])
				{
					ChemicalData.data[properties[i]] = data[properties[i]];
					if($(tar).is("input")) $(tar).val(data[properties[i]]);
					else $(tar).text(data[properties[i]]);
				}
				else $(tar).addClass("unavailable");
			}
		}, function()
		{
			$("#" + targets.reduce(function(a, b){ return a + ",#" + b; })).removeClass("loading").addClass("unavailable");
		});
	}
};
