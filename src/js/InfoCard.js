/*!
MolView v2.2 (http://molview.org)
Copyright (c) 2014, Herman Bergwerf
ALL RIGHTS RESERVED
*/

var InfoCard = {
	data: {},

	/**
	 * Updates content of InfoCard card
	 * @param {String} smiles SMILES string
	 */
	update: function(smiles, cid, inchikey, inchi)
	{
		if(this.data["smiles"] != smiles && smiles != "")
		{
			$(".chemprop").html("").val("").removeClass("chemprop-unavailable").addClass("chemprop-loading");
			$("#molecule-image").attr("src", "img/empty.png");
			$("#molecule-info").hide();
			$("#molecule-title").text("");
			$("#molecule-description").text("");
			$("#common-chem-props tr").show();
			$("#chem-identifiers tr").show();

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
				InfoCard.loadProperty("formula");
				InfoCard.loadProperty("mw");
				InfoCard.loadProperty("donors");
				InfoCard.loadProperty("acceptors");
				InfoCard.loadProperty("sysname");
				InfoCard.loadProperty("canonicalsmiles");
				InfoCard.loadProperty("isomericsmiles");
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

		$("#molecule-image-wrapper").hide();

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
			$("#molecule-image").attr("src", "img/empty.png");
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

		if(InfoCard.data[id])
		{
			success(InfoCard.data[id]);
		}
		else//retrieve property
		{
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

			function tryPubChem()
			{
				if(InfoCard.data["cid"] && PubChemProps.indexOf(id) != -1)
				{
					var propName = PubChemPropNames[PubChemProps.indexOf(id)];
					Request.PubChem.properties(InfoCard.data["cid"], propName,
					function(data)
					{
						if(data.PropertyTable.Properties[0][propName])
						{
							if(id == "formula")
							{
								InfoCard.data[id] = chemFormulaFormat(
									data.PropertyTable.Properties[0][propName]);
							}
							else
							{
								InfoCard.data[id] = data.PropertyTable.Properties[0][propName];
							}

							if(id == "isomericsmiles")
							{
								InfoCard.data["smiles"] = InfoCard.data["isomericsmiles"];
							}

							success(InfoCard.data[id]);
						}
						else
						{
							tryCIR();
						}
					}, tryCIR);
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
					Request.ChemicalIdentifierResolver.property(InfoCard.data["smiles"],
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
	}
};
