/**
 * This file is part of MolView (http://molview.org)
 * Copyright (c) 2014-2023 Herman Bergwerf
 */

//array containing properties supported by PubChem using a CID
var PubChemProps = {
	"formula": "MolecularFormula",
	"mw": "MolecularWeight",
	"donors": "HBondDonorCount",
	"acceptors": "HBondAcceptorCount",
	"sysname": "IUPACName",
	"canonicalsmiles": "CanonicalSMILES",
	"isomericsmiles": "IsomericSMILES",
	"inchikey": "InChIKey",
	"inchi": "InChI"
};

//array containing all requested PubChem props
var PubChemPropNames = [ "MolecularFormula", "MolecularWeight",
	"HBondDonorCount", "HBondAcceptorCount", "IUPACName",
	"CanonicalSMILES", "IsomericSMILES", "InChIKey", "InChI" ];

//array containing properties supported by the Chemical Identifier Resolver
var CIRProps = {
	"formula": "formula",
	"mw": "mw",
	"donors": "h_bond_donor_count",
	"acceptors": "h_bond_acceptor_count",
	"sysname": "iupac_name",
	"canonicalsmiles": "smiles",
	"inchikey": "stdinchikey",
	"inchi": "stdinchi",
	"cas": "cas",
	"csid": "chemspider_id"
};

/**
 * InfoCard content layer wrapper
 * @type {Object}
 */
var InfoCard = {
	/**
	 * Stores last PubChem request in order to load multiple Pubchem
	 * properties in one AJAX call while using a single property method interface
	 * @type {Object}
	 */
	PubChem_cache: undefined,

	/**
	 * Properties which are waiting for the PubChem cache to be loaded
	 * Stored as callbacks to inside function in loadFrom_PubChem_cache methods
	 * [{success: Function, fail: Function}]
	 * @type {Array}
	 */
	PubChem_queue: [],

	/**
	 * Stores all raw InfoCard data
	 * @type {Object}
	 */
	data: {},

	/**
	 * Indicates if InfoCard content has been updated
	 * @type {Boolean}
	 */
	updated: false,

	/**
	 * Percent composition values precision
	 * @type {Number}
	 */
	percentCompositionPrecision: 5,

	/**
	 * Updates InfoCard card data
	 * @param  {String}  smiles SMILES string
	 * @return {Boolean}        Indicates if content should be reloaded
	 */
	update: function(smiles)
	{
		if(this.data["smiles"] !== smiles && smiles !== "")
		{
			$(".chemprop").html("").val("").addClass("chemprop-loading");
			$("#molecule-image").css("filter", "url('#pubchemImageFilter'");
			$("#molecule-image").attr("src", emptyImage);
			$("#molecule-image-wrapper").show();
			$("#molecule-info").hide();
			$("#molecule-title").text("");
			$("#molecule-description").text("");
			$("#percent-composition-table, #percent-composition-title").hide();
			$("#common-chem-props tr").show();
			$(".chem-identifier").show();
			$(".chem-link").hide();

			this.PubChem_cache = undefined;
			this.PubChem_queue = [];
			this.data = {};
			this.data["smiles"] = smiles;
			this.data["cid"] = Sketcher.metadata.cid;
			this.data["inchikey"] = Sketcher.metadata.inchikey;
			this.data["inchi"] = Sketcher.metadata.inchi;
			this.updated = false;

			return true;
		}
		else
		{
			return false;
		}
	},

	/**
	 * Loads content of InfoCard card using InfoCard.data.smiles
	 */
	load: function()
	{
		if(this.updated) return;
		else this.updated = true;

		this.updateImage();

		//load CID (required for PubChem property loading)
		this.loadProperty("cid", function(cid)
		{
			if(cid)
			{
				$("#pubchem-link").attr("href", Request.PubChem.staticURL(cid)).show();
			}

			//load properties
			InfoCard.loadProperty("formula");
			InfoCard.loadProperty("mw");
			InfoCard.loadProperty("donors");
			InfoCard.loadProperty("acceptors");
			InfoCard.loadProperty("sysname");
			InfoCard.loadProperty("canonicalsmiles");
			InfoCard.loadProperty("isomericsmiles", function(smiles)
			{
				/* if(smiles)
				{
					$("#chemicalize-link").attr("href",
						"http://www.chemicalize.org/structure?mol=" + smiles).show();
				} */
			});
			InfoCard.loadProperty("inchikey");
			InfoCard.loadProperty("inchi", function(inchi)
			{
				/* if(inchi)
				{
					$("#google-link").attr("href",
						"http://www.google.nl/search?q=" + encodeURIComponent(inchi)).show();
				} */
			});
			InfoCard.loadProperty("cas");
			InfoCard.loadProperty("csid", function(csid)
			{
				if(csid)
				{
					$("#chemspider-link").attr("href",
						"http://www.chemspider.com/Chemical-Structure."
						+ csid + ".html").show();
				}
			});

			//load description
			if(cid)
			{
				Request.PubChem.description(cid, function(data)
				{
					var title, desc;
					for(var i = 0; i < data.InformationList.Information.length; i++)
					{
						if(title === undefined && data.InformationList.Information[i].Title !== undefined)
							title = ucfirst(humanize(data.InformationList.Information[i].Title));
						if(desc === undefined && data.InformationList.Information[i].Description !== undefined)
							desc = data.InformationList.Information[i].Description;
					}

					document.title = title;
					$("#molecule-info").show();
					$("#molecule-title").html(title);
					$("#molecule-description").html(desc);
				});
			}
		});
	},

	/**
	 * Process molecular formula string and fill the percent composition table
	 * @param  {String} formula Molecular formula
	 * @return {String} formatted molecular formula
	 */
	processFormula: function(formula)
	{
		//parse molecule
		this.data.molecule = {};
		regex = /((?:[A-Z][a-z]?))([\d,.]*)/g;
		var match;
		while((match = regex.exec(formula)) !== null)
		{
		    this.data.molecule[match[1]] = parseFloat(match[2]) || 1;
		}

		//fill percent composition table
		$("#percent-composition-title").show();
		$("#percent-composition-table").empty().show();
		var totalMass = 0;
		jQuery.each(this.data.molecule, function(key, value)
		{
			totalMass += ElementsMolarTable[key] * value;
		});

		jQuery.each(this.data.molecule, function(key, value)
		{
			$("#percent-composition-table").append("<tr>\
				<td>" + key + "</td>\
				<td>" + ElementsMolarTable[key] + " u &times; " + value + "</td>\
				<td>" + (ElementsMolarTable[key] * value / totalMass * 100)
					.toPrecision(InfoCard.percentCompositionPrecision) + " %</td>\
			</tr>");
		});

		return formatMFormula(formula);
	},

	/**
	 * Updates InfoCard card image
	 */
	updateImage: function()
	{
		if(InfoCard["smiles"] === "") return;

		var img = new Image();
		img.onload = function()
		{
			$("#molecule-image").attr("src", img.src);
			$("#molecule-image").css("width", 300 / MolView.devicePixelRatio);
			$("#molecule-image-wrapper").show();
		}
		img.onerror = function()
		{
			$("#molecule-image").attr("src", emptyImage);
			$("#molecule-image-wrapper").hide();
		}

		if(Sketcher.metadata.cid) img.src = Request.PubChem.image(Sketcher.metadata.cid);
		else img.src = Request.PubChem.smilesToImage(InfoCard.data["smiles"]);
	},

	/**
	 * Helper function for loading the Properties card
	 * Loads the given parameter into the HTML card using getProperty
	 * @param {String}   id Property name
	 * @param {Function} cb Optional callback for custom code (passes undefined if request failed)
	 */
	loadProperty: function(id, cb)
	{
		InfoCard.getProperty(id, function(prop)
		{
			if(id === "mw") prop += " u";//append Units unit (u)
			var out = $("#prop-" + id);
			if(out.is("input")) out.val(prop).removeClass("chemprop-loading");
			else out.html(prop).removeClass("chemprop-loading");

			if(cb) cb(prop);
		}, function()
		{
			$("#prop-" + id + "-wrapper").hide();

			if(cb) cb();
		})
	},

	/**
	 * Retrieve property using property name. Properties are retrieved from
	 * PubChem or the Chemical Identifier Resolver
	 *
	 * Note: you have to call getProperty("cid") first in order to enable
	 * property retrieving via PubChem
	 *
	 * Allowed properties:
	 *  - formula HTML formatted molecular formula
	 *  - mw Molecular Weight in Units
	 *  - donors Hydrogen Donors
	 *  - acceptors Hydrogen Acceptors
	 *  - sysname Systematic IUPAC name
	 *  - smiles Isomeric SMILES string
	 *  - inchikey InChiKey
	 *  - inchi InChi
	 *  - cas CAS Registry Number
	 *  - csid ChemSpider ID
	 *  - cid PubChem Compound ID
	 *
	 * @param {String}   id      Property name
	 * @param {Function} success Called when property is retrieved
	 * @param {Function} fail    Called when property cannot be retrieved
	 */
	getProperty: function(id, success, fail)
	{
		function _fail()
		{
			if(id === "isomericsmiles")
			{
				InfoCard.data["isomericsmiles"] = InfoCard.data["smiles"];
				success(InfoCard.data["isomericsmiles"]);
			}
			else if(fail)
			{
				fail();
			}
		}

		if(InfoCard.data[id])
		{
			success(InfoCard.data[id]);
		}
		else//retrieve property
		{
			if(id === "cid")
			{
				Request.PubChem.smilesToCID(InfoCard.data["smiles"], function(cid)
				{
					InfoCard.data["cid"] = cid;
					success(InfoCard.data["cid"]);
				}, function()
				{
					InfoCard.data["cid"] = -1;
					_fail();
				});
			}
			else
			{
				InfoCard.getPropertyFromPubChem(id, success, _fail);
			}
		}
	},

	getPropertyFromPubChem: function(id, success, fail)
	{
		if(InfoCard.data["cid"] === -1)
		{
			InfoCard.getPropertyFromCIR(id, success, fail);
		}
		else if(InfoCard.data["cid"] && id === "cas")
		{
			Request.PubChem.casNumber(InfoCard.data["cid"], function(cas)
			{
				InfoCard.data["cas"] = cas;
				success(InfoCard.data["cas"]);
			},
			function()
			{
				InfoCard.getPropertyFromCIR(id, success, fail);
			});
		}
		else if(PubChemProps[id])
		{
			if(InfoCard.PubChem_cache)
			{
				InfoCard.loadFrom_PubChem_cache(id, success, function()
				{
					InfoCard.getPropertyFromCIR(id, success, fail);
				});
			}
			else if(InfoCard.data["cid"])
			{
				InfoCard.PubChem_cache = { loading: true };

				Request.PubChem.properties(InfoCard.data["cid"], PubChemPropNames,
				function(data)
				{
					InfoCard.PubChem_cache = data.PropertyTable.Properties[0] || { failed: true };

					for(var i = 0; i < InfoCard.PubChem_queue.length; i++)
					{
						InfoCard.PubChem_queue[i].success();
					}
					InfoCard.PubChem_queue = [];
					InfoCard.loadFrom_PubChem_cache(id, success, function()
					{
						InfoCard.getPropertyFromCIR(id, success, fail);
					});
				},
				function()
				{
					for(var i = 0; i < InfoCard.PubChem_queue.length; i++)
					{
						InfoCard.PubChem_queue[i].fail();
					}
					InfoCard.PubChem_queue = [];
					InfoCard.PubChem_cache = { failed: true };
					InfoCard.getPropertyFromCIR(id, success, fail);
				});
			}
		}
		else
		{
			InfoCard.getPropertyFromCIR(id, success, fail);
		}
	},

	getPropertyFromCIR: function(id, success, fail)
	{
		if(InfoCard.data["smiles"] && CIRProps[id] !== undefined)
		{
			Request.CIR.property(
				InfoCard.data["isomericsmiles"] || InfoCard.data["smiles"],
				CIRProps[id], function(data)
			{
				if(id === "formula")
				{
					InfoCard.data["formula"] = InfoCard.processFormula(data);
				}
				else if(id === "sysname")
				{
					InfoCard.data["sysname"] = humanize(data);
				}
				else
				{
					InfoCard.data[id] = data;
				}

				success(InfoCard.data[id]);
			}, fail);
		}
		else
		{
			fail();
		}
	},

	/**
	 * Loads PubChem property from cache (only the last PubChem request
	 * is cached)
	 * @param  {String}   propName PubChem property name
	 * @param  {Function} succes   Called when property is loaded from the cache
	 * @param  {Function} fail     Called when property cannot be loaded
	 * @return {Boolean}           Indicates if property is loaded successfully
	 */
	loadFrom_PubChem_cache: function(id, success, fail)
	{
		function _load(id)
		{
			if(InfoCard.PubChem_cache[PubChemProps[id]] !== undefined)
			{
				if(id === "formula")
				{
					InfoCard.data[id] = InfoCard.processFormula(
						InfoCard.PubChem_cache[PubChemProps[id]]);
				}
				else
				{
					InfoCard.data[id] = InfoCard.PubChem_cache[PubChemProps[id]];
				}
				return true;
			}
			else return false;
		}

		if(!InfoCard.PubChem_cache || InfoCard.PubChem_cache.failed)
		{
			fail();
		}
		else if(InfoCard.PubChem_cache.loading)
		{
			InfoCard.PubChem_queue.push({
				success: function()
				{
					if(_load(id)) success(InfoCard.data[id]);
					else fail();
				},
				fail: fail
			});
		}
		else
		{
			if(_load(id)) success(InfoCard.data[id]);
			else fail();
		}
	}
};
