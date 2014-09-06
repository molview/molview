/**
 * This file is part of MolView (http://molview.org)
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

//array containing properties supported by PubChem using a CID
var PubChemProps = [ "formula", "mw", "donors", "acceptors",
	"sysname", "canonicalsmiles", "isomericsmiles", "inchikey", "inchi" ];

//array containing PubChem names for the properties in PubChemProps
var PubChemPropNames = [ "MolecularFormula", "MolecularWeight",
	"HBondDonorCount", "HBondAcceptorCount", "IUPACName",
	"CanonicalSMILES", "IsomericSMILES", "InChIKey", "InChI" ];

//array containing properties supported by the Chemical Identifier Resolver
var CIRProps = [ "formula", "mw", "donors", "acceptors",
	"smiles", "inchikey", "inchi", "cas", "csid" ];

//array containing CIR names for the properties in CIRProps
var CIRPropNames = [ "formula", "mw", "h_bond_donor_count", "h_bond_acceptor_count",
	"smiles", "stdinchikey", "stdinchi", "cas", "chemspider_id" ];

var InfoCard = {
	/**
	 * Stores last PubChem request in order to load multiple Pubchem
	 * properties in one AJAX call while using a single property method interface
	 */
	PubChem_cache: undefined,

	/**
	 * Properties which are waiting for the PubChem cache to be loaded
	 * Stored as callbacks to inside function in loadFromPubChemCache methods
	 * [{success: Function, fail: Function}]
	 */
	PubChem_queue: [],

	/**
	 * Stores all raw InfoCard data
	 */
	data: {},

	/**
	 * Updates content of InfoCard card
	 * @param {String} smiles SMILES string
	 */
	update: function(smiles)
	{
		if(this.data["smiles"] != smiles && smiles != "")
		{
			$(".chemprop").html("").val("").removeClass("chemprop-unavailable").addClass("chemprop-loading");
			$("#molecule-image").attr("src", emptyImage);
			$("#molecule-image-wrapper").show();
			$("#molecule-info").hide();
			$("#molecule-title").text("");
			$("#molecule-description").text("");
			$("#common-chem-props tr").show();
			$("#chem-identifiers tr").show();

			this.PubChem_cache = undefined;
			this.PubChem_queue = [];
			this.data = {};
			this.data["smiles"] = smiles;
			this.data["cid"] = Sketcher.metadata.cid;
			this.data["inchikey"] = Sketcher.metadata.inchikey;
			this.data["inchi"] = Sketcher.metadata.inchi;

			this.updateImage();

			//load CID (required for PubChem property loading)
			this.loadProperty("cid", function(cid)
			{
				if(cid)
				{
					$("#pubchem-external-link").attr("href",
						"https://pubchem.ncbi.nlm.nih.gov/summary/summary.cgi?cid="
						+ cid).show();
				}

				//load properties
				InfoCard.loadProperty("isomericsmiles");//first in order to use isomericsmiles ASAP
				InfoCard.loadProperty("formula");
				InfoCard.loadProperty("mw");
				InfoCard.loadProperty("donors");
				InfoCard.loadProperty("acceptors");
				InfoCard.loadProperty("sysname");
				InfoCard.loadProperty("canonicalsmiles");
				InfoCard.loadProperty("inchikey");
				InfoCard.loadProperty("inchi");
				InfoCard.loadProperty("cas");
				InfoCard.loadProperty("csid", function(csid)
				{
					if(csid)
					{
						$("#chemspider-external-link").attr("href",
							"http://www.chemspider.com/Chemical-Structure."
							+ csid + ".html");
					}
				});

				//load description
				if(cid)
				{
					Request.PubChem.description(cid, function(data)
					{
						data = data.InformationList.Information[0];
						data.Title = ucfirst(humanize(data.Title));

						document.title = data.Title;
						$("#molecule-info").show();
						$("#molecule-title").text(ucfirst(data.Title));
						$("#molecule-description").text(data.Description);
					});
				}
			});
		}
	},

	/**
	 * Updates InfoCard card image
	 */
	updateImage: function()
	{
		if(InfoCard["smiles"] == "") return;

		var img = new Image();
		img.onload = function()
		{
			$("#molecule-image").attr("src", img.src);
			if(MolView.mobile)
			{
				$("#molecule-image").css("width", 200);
			}

			$("#molecule-image-wrapper").show();
		}
		img.onerror = function()
		{
			$("#molecule-image").attr("src", emptyImage).hide();
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
			if(id == "mw") prop += " u";//append Units unit (u)
			$("#prop-" + id).html(prop).val(prop).removeClass("chemprop-loading");

			if(cb) cb(prop);
		}, function()
		{
			$("#prop-" + id + "-title").hide();
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
			if(id == "isomericsmiles")
			{
				InfoCard.data["isomericsmiles"] = InfoCard.data["smiles"];
				success(InfoCard.data["isomericsmiles"]);
			}
			else if(fail)
			{
				fail();
			}
		}

		function tryPubChem()
		{
			if(InfoCard.PubChem_cache && PubChemProps.indexOf(id) != -1)
			{
				InfoCard.loadFromPubChemCache(id, success, tryCIR);
			}
			else if(InfoCard.data["cid"] && PubChemProps.indexOf(id) != -1)
			{
				InfoCard.PubChem_cache = { loading: true };

				Request.PubChem.properties(InfoCard.data["cid"], PubChemPropNames,
				function(data)
				{
					InfoCard.PubChem_cache = data;
					for(var i = 0; i < InfoCard.PubChem_queue.length; i++)
					{
						InfoCard.PubChem_queue[i].success();
					}
					InfoCard.PubChem_queue = [];
					InfoCard.loadFromPubChemCache(id, success, tryCIR);
				},
				function()
				{
					for(var i = 0; i < InfoCard.PubChem_queue.length; i++)
					{
						InfoCard.PubChem_queue[i].fail();
					}
					InfoCard.PubChem_queue = [];
					InfoCard.PubChem_cache = { failed: true };
					tryCIR();
				});
			}
			else
			{
				tryCIR();
			}
		}

		function tryCIR()
		{
			if(InfoCard.data["smiles"] && CIRProps.indexOf(id) != -1)
			{
				Request.ChemicalIdentifierResolver.property(
					InfoCard.data["isomericsmiles"] || InfoCard.data["smiles"],
					CIRPropNames[CIRProps.indexOf(id)],
					function(data)
				{
					if(id == "formula")
					{
						InfoCard.data[id] = chemFormulaFormat(data);
					}
					else
					{
						InfoCard.data[id] = data;
					}

					success(InfoCard.data[id]);
				}, _fail);
			}
			else
			{
				_fail();
			}
		}

		if(InfoCard.data[id])
		{
			success(InfoCard.data[id]);
		}
		else//retrieve property
		{
			if(id == "cid")
			{
				Request.PubChem.smilesToCID(InfoCard.data["smiles"], function(cid)
				{
					InfoCard.data[id] = cid;
					success(InfoCard.data[id]);
				}, _fail);
			}
			else
			{
				tryPubChem();
			}
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
	loadFromPubChemCache: function(id, success, fail)
	{
		function _load(id)
		{
			var propName = PubChemPropNames[PubChemProps.indexOf(id)];
			if(InfoCard.PubChem_cache.PropertyTable.Properties[0][propName] !== undefined)
			{
				if(propName == "MolecularFormula")
				{
					InfoCard.data[id] = chemFormulaFormat(
						InfoCard.PubChem_cache.PropertyTable.Properties[0][propName]);
				}
				else
				{
					InfoCard.data[id] = InfoCard.PubChem_cache.PropertyTable.Properties[0][propName];
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
