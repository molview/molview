/**
 * This file is part of MolView (http://molview.org)
 * Copyright (c) 2014-2023 Herman Bergwerf
 */

/**
 * MolView spectra layer wrapper
 * @type {Object}
 */
var Spectroscopy = {
	data: {},
	spectrum: undefined,
	spectrumRatio: 1 / .3,

	/**
	 * Initializes Spectoscopy DOM
	 */
	init: function()
	{
		$(window).on("resize", function()
		{
			if($("#spectra-layer").is(":visible"))
			{
				Spectroscopy.resize();
			}
		});

		$("#spectrum-select").on("change", function()
		{
			Spectroscopy.load($("#spectrum-select").val());
		});

		if(MolView.mobile) {
			//enable mobile scrolling
			$("#spectrum-wrapper").on("touchmove", function(e) {
				e.stopImmediatePropagation();
			});

			this.spectrum_ratio = 1 / .5;
			this.spectrum = new ChemDoodle.ObserverCanvas("spectrum-canvas", 100, 100);
		} else {
			this.spectrum = new ChemDoodle.SeekerCanvas("spectrum-canvas", 100, 100,
				ChemDoodle.SeekerCanvas.SEEK_PLOT);
		}

		this.spectrum.specs.plots_showYAxis = true;
		this.spectrum.specs.plots_flipXAxis = true;
		this.spectrum.specs.plots_showGrid = true;
		this.spectrum.specs.backgroundColor = "#ffffff";
		this.spectrum.emptyMessage = "No spectrum selected";
	},

	/**
	 * Resets Spectroscopy dialog and updates spectra dropdown using SMILES
	 * @param {String} smiles SMILES string
	 */
	update: function(smiles)
	{
		this.data = {};
		InfoCard.update(smiles);

		$("#spectrum-nist-source").hide();
		$("#spectrum").addClass("loading");
		$("#spectrum-select")
			.html('<option value="loading" selected>Loading&hellip;</option>')
			.val("loading");
		this.print("No spectrum selected");

		//update available spectra
		function noSpectra()
		{
			$("#spectrum-select").empty();
			$("#spectrum-select").append('<option value="default" disabled selected style="display:none;">There are no spectra available</option>');
			//$("#spectrum-select").append('<option value="nmrdb">H1-NMR prediction</option>');
			$("#spectrum").removeClass("loading");
		}

		InfoCard.getProperty("cas", function(cas)
		{
			Spectroscopy.data["cas"] = cas;
			Request.NIST.lookup(Spectroscopy.data["cas"], function(data)
			{
				$("#spectrum-select").empty();
				$("#spectrum-select").append('<option value="default" disabled selected style="display:none;">Choose a spectrum</option>');

				if(data.mass) {
					$("#spectrum-select").append('<option value="nist-mass">Mass spectrum</option>');
				}
				//if(data.uvvis) $("#spectrum-select").append('<option value="nist-uvvis">UV-Visible spectrum</option>');

				if(data.ir !== undefined) {
					for(var i = 0; i < data.ir.length; i++) {
						$("#spectrum-select").append('<option value="nist-ir-'
							+ data.ir[i].i + '">IR spectrum [' + data.ir[i].state + ']</option>');
					}
				}

				//$("#spectrum-select").append('<option value="nmrdb">H1-NMR prediction</option>').val("default");

				if(data.mass || (data.ir !== undefined && data.ir.length > 0)) {
					$("#spectrum").removeClass("loading");
					$("#spectrum-nist-source").attr("href", data.url).show();
				}	else {
					noSpectra();
				}
			}, noSpectra);
		}, noSpectra);
	},

	/**
	 * Loads spectrum into spectrum canvas using the specified spectrum type.
	 * Spectrum types:
	 *  - nmrdb
	 *  - nist-mass
	 *  - nist-ir-{i}
	 *  - nist-uvvis (not supported yet)
	 *
	 * @param  {String} type Spectrum type
	 */
	load: function(type)
	{
		this.print("Loading\u2026");
		$("#spectrum").addClass("loading");

		function displayNMRDB()
		{
			var spectrum = ChemDoodle.readJCAMP(Spectroscopy.data.nmrdb);
			spectrum.title = ucfirst(humanize(spectrum.title));
			spectrum.yUnit = ucfirst(humanize(spectrum.yUnit));
			Spectroscopy.spectrum.specs.plots_flipXAxis = true;
			Spectroscopy.spectrum.loadSpectrum(spectrum);
			$("#spectrum").removeClass("loading");
		}

		function displayNISTSpectrum()
		{
			/*
			For UV-Vis support (using js/lib/jcamp-dx.js from NIST)
			var spectrum = new jdx_parse();
			spectrum.load(Spectroscopy.data[type], 0, true);
			*/

			var spectrum = ChemDoodle.readJCAMP(Spectroscopy.data[type]);
			spectrum.title = ucfirst(humanize(spectrum.title));
			spectrum.yUnit = ucfirst(humanize(spectrum.yUnit));

			if(type === "nist-mass") Spectroscopy.spectrum.specs.plots_flipXAxis = false;
			else Spectroscopy.spectrum.specs.plots_flipXAxis = true;

			Spectroscopy.spectrum.loadSpectrum(spectrum);
			$("#spectrum").removeClass("loading");
		}

		if(type === "nmrdb")
		{
			if(!this.data["nmrdb"])
			{
				InfoCard.getProperty("smiles", function(smiles)
				{
					Request.NMRdb.prediction(smiles, function(jcamp)
					{
						Spectroscopy.data.nmrdb = jcamp;
						displayNMRDB();
					}, function()
					{
						Spectroscopy.print("Spectrum unavailable");
					});
				});
			}
			else displayNMRDB();
		}
		else if(type.indexOf("nist" !== -1))
		{
			if(!Spectroscopy.data[type])
			{
				Request.NIST.spectrum(this.data["cas"], type.substr(5), function(jcamp)
				{
					Spectroscopy.data[type] = jcamp;
					displayNISTSpectrum();
				}, function()
				{
					Spectroscopy.print("Spectrum unavailable");
				});
			}
			else displayNISTSpectrum();
		}
	},

	print: function(str)
	{
		Spectroscopy.spectrum.emptyMessage = str;
		Spectroscopy.spectrum.loadSpectrum(null);
	},

	resize: function()
	{
		var w = $("#spectrum-wrapper").width();
		var h = Math.round(w / Spectroscopy.spectrumRatio);
		Spectroscopy.spectrum.resize(w, h);
	},
};
