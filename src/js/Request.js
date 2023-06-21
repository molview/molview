/**
 * This file is part of MolView (http://molview.org)
 * Copyright (c) 2014-2023 Herman Bergwerf
 */

/**
 * Wrapper handling all AJAX calls for loading remote data
 * @type {Object}
 */
var Request = {
	/**
	 * API root URL, inject a different value when the API is not accessible
	 * under the HTML index directory.
	 */
	API_ROOT: "",

	/**
	 * Initializes Request object
	 */
	init: function () { },

	/**
	 * Retrieve 2D and 3D molfile using a text string (CIR identifier)
	 * Max calls to Progress.increment: 3
	 *
	 * @param {String}   text    Input text string
	 * @param {Function} success Called as (2D, 3D, tranlated_text) when AJAX is finished
	 * @param {Function} error   Called when request has failed
	 */
	CIRsearch: function (text, success, error) {
		if (text === "") {
			error();
			return;
		}

		//try CIR
		Request.CIR.resolve(text, false, function (mol3d) {
			Progress.increment();
			Request.CIR.resolve(text, true, function (mol2d) {
				success(mol2d, mol3d, text);
			}, error);

		}, error);
	},

	/**
	 * Retrieve 3D molfile using a text string (CIR identifier)
	 * Max calls to Progress.increment: 2
	 *
	 * @param {String}   text    Input text string
	 * @param {Function} success Called as (3D, tranlated_text) when AJAX is finished
	 * @param {Function} error   Called when request has failed
	 */
	CIRsearch3D: function (text, success, error) {
		if (text === "") {
			error();
			return;
		}

		//try CIR
		Request.CIR.resolve(text, false, function (mol3d) {
			Progress.increment();
			success(mol3d, text);

		},
			function () {
				Progress.increment();

				//translate
				Request.translation(text, function (translated) {
					Progress.increment();

					text = translated;

					//try CIR with translated input
					Request.CIR.resolve(text, false, function (mol3d) {
						success(mol3d, text);
					}, error);
				});

			}, error);
	},

	/**
	 * Retrieve 2D or 3D molfile using a SMILES or CID input
	 * Tries PubChem first and then the Chemical Identifier Resolver
	 * Max calls to Progress.increment: 3
	 * Max calls to Progress.increment if CID > 0: 1
	 * Max calls to Progress.increment if CID = -1: 0
	 *
	 * @param  {[type]} smiles  Input SMILES
	 * @param  {[type]} cid     Input CID (-1 = no CID available, 0 = CID unknown, > 0 = CID)
	 * @param  {[type]} flat    Indicates if a flat (2D) or a 3D molfile should be retrieved
	 * @param  {[type]} success Called as (molfile, cid || -1) on success
	 * @param  {[type]} error   Called when request has failed
	 */
	resolve: function (smiles, cid, flat, success, error) {
		function _resolve(cid) {
			if (cid > 0) {
				Request.PubChem.sdf(cid, flat, function (mol) {
					success(mol, cid);
				},
					function ()//no coordinates for given CID
					{
						Progress.increment();
						Request.CIR.resolve(smiles, flat, function (mol) {
							//do not pass CID if no 2D coords for this CID
							success(mol, flat ? -1 : cid);
						}, error);
					});
			}
			else {
				Request.CIR.resolve(smiles, flat, function (mol) {
					success(mol, -1);
				}, error);
			}
		}

		if (cid === 0) {
			Request.PubChem.smilesToCID(smiles, function (cid) {
				Progress.increment();
				_resolve(cid);
			},
				function ()//no CID for the given SMILES
				{
					Progress.increment();
					_resolve(-1);
				});
		}
		else {
			_resolve(cid);
		}
	},

	CIR:
	{
		available: false,

		resolve: function (text, flat, success, error) {
			if (!Request.CIR.available) {
				error();
				return;
			}

			text = text.replace(/#/g, "%23").replace(/\\/g, "%5C");
			AJAX({
				primary: true,
				dataType: "text",
				url: "https://cactus.nci.nih.gov/chemical/structure/" + text + "/file?format=sdf&get3d=" + (flat ? "False" : "True"),
				defaultError: error,
				success: function (response) {
					if (response === "<h1>Page not found (404)</h1>\n" || response === undefined) error();
					else success(response);
				}
			});
		},

		/**
		 * Load property using Chemical Identifier Resolver
		 * @param {String}   smiles   Input SMILES string
		 * @param {String}   property Property id
		 * @param {Function} success
		 * @param {Function} error
		 */
		property: function (smiles, property, success, error) {
			if (!Request.CIR.available) {
				error();
				return;
			}

			smiles = smiles.replace(/#/g, "%23").replace(/\\/g, "%5C");
			AJAX({
				dataType: "text",
				url: "https://cactus.nci.nih.gov/chemical/structure/" + smiles + "/" + property,
				defaultError: error,
				success: function (response) {
					if (response === "<h1>Page not found (404)</h1>\n" || response === undefined) {
						if (error) error();
					}
					else {
						var array = response.split("\n");
						var value = array[0];

						if (property === "cas") {
							array.sort(function (a, b) { return a.length - b.length; });
							value = array[0];
						}
						else if (property === "stdinchikey") {
							value = value.substr(9);
						}

						success(value);
					}
				}
			});
		}
	},

	PubChem:
	{
		data: [],
		maxRecords: 50,
		MaxSeconds: 10,

		search: function (text, success, error) {
			if (text === "") {
				if (error) error();
				return;
			}

			Progress.increment();

			AJAX({
				primary: true,
				dataType: "json",
				url: "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/" + encodeURIComponent(text) + "/cids/json?name_type=word",
				defaultError: error,
				success: function (data) {
					Progress.increment();
					Request.PubChem.data = data.IdentifierList.CID;
					success();
				}
			});
		},

		/**
		 * Executes advances PubChem search query and returns listkey.
		 * @param  {String} query   Input data type (cid, smiles, ...)
		 * @param  {String} value   Input data
		 * @param  {String} type    Search query type (superstructure, ...)
		 * @param  {String} success Called when search query has beed queued
		 *                          with current listkey as first argument
		 * @param  {String} error   Called when search query has failed
		 */
		structureSearch: function (query, value, type, success, error) {
			AJAX({
				primary: true,
				dataType: "json",
				url: query === "smiles" ?//use URL parameter for SMILES
					"https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/"
					+ type + "/" + query + "/json?" + query + "=" + encodeURIComponent(value)
					+ "&MaxRecords=" + Request.PubChem.maxRecords
					+ "&MaxSeconds=" + Request.PubChem.MaxSeconds :
					"https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/"
					+ type + "/" + query + "/" + value
					+ "/json?MaxRecords=" + Request.PubChem.maxRecords
					+ "&MaxSeconds=" + Request.PubChem.MaxSeconds,
				defaultError: error,
				success: function (data) {
					success(data.Waiting.ListKey);
				}
			});
		},

		/**
		 * Retrieves listdata using a given listkey
		 * @param  {[type]} listkey Listkey
		 * @param  {[type]} success Called when listdata is loaded
		 * @param  {[type]} wait    Called when listdata is not yet ready
		 *                          with current listkey as first argument
		 * @param  {[type]} error   Called when request has failed
		 */
		list: function (listkey, success, wait, error) {
			AJAX({
				primary: true,
				dataType: "json",
				url: "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/listkey/" + listkey + "/cids/json",
				defaultError: error,
				success: function (data) {
					if (data.IdentifierList) {
						Request.PubChem.data = data.IdentifierList.CID;
						success();
					}
					else if (data.Waiting) {
						wait(data.Waiting.ListKey);
					}
					else if (data.Fault) {
						if (error) error();
					}
				}
			});
		},

		/**
		 * Retrives CID for given SMILES
		 * @param {String}   smiles  Input SMILES string
		 * @param {Function} success
		 * @param {Function} error
		 */
		smilesToCID: function (smiles, success, error) {
			AJAX({
				dataType: "json",
				url: "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/smiles/cids/json?smiles=" + encodeURIComponent(smiles),
				defaultError: error,
				success: function (data) {
					if (data.IdentifierList && data.IdentifierList.CID[0] > 0) {
						success(data.IdentifierList.CID[0]);
					}
					else {
						error();
					}
				}
			});
		},

		/**
		* Retrives first CID for given Name
		* @param {String}   smiles  Input Name string
		* @param {Function} success
		* @param {Function} error
		*/
		nameToCID: function (name, success, error) {
			AJAX({
				dataType: "json",
				url: "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/" + name + "/cids/json",
				defaultError: error,
				success: function (data) {
					if (data.IdentifierList) {
						success(data.IdentifierList.CID[0]);
					}
					else {
						error();
					}
				}
			});
		},

		primaryName: function (name, success, error) {
			AJAX({
				dataType: "json",
				url: "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/" + name + "/description/json",
				defaultError: error,
				success: function (data) {
					if (data.InformationList) {
						success(data.InformationList.Information[0].Title);
					}
					else if (error) {
						error();
					}
				}
			});
		},

		description: function (cids, success, error) {
			AJAX({
				dataType: "json",
				url: "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/" + cids + "/description/json",
				defaultError: error,
				success: success
			});
		},

		properties: function (cids, properties, success, error) {
			AJAX({
				dataType: "json",
				url: "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/" + cids + "/property/" + properties + "/json",
				defaultError: error,
				success: success
			});
		},

		casNumber: function (cid, success, error) {
			AJAX({
				dataType: "text",
				url: "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/" + cid + "/synonyms/txt",
				defaultError: error,
				success: function (data) {
					var regex = /^\d{2,7}-\d{2}-\d$/gm;
					var array = [], match = {};
					while ((match = regex.exec(data)) !== null) {
						array.push(match[0]);
					}

					if (array.length > 0) {
						array.sort(function (a, b) { return a.length - b.length; });
						success(array[0]);
					}
					else {
						error();
					}
				}
			});
		},

		image: function (cid, width) {
			var w = Math.round((width || 300) * MolView.devicePixelRatio);
			return "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/" + cid
				+ "/png?record_type=2d&image_size=" + w	+ "x" + w;
		},

		smilesToImage: function (smiles) {
			var w = Math.round(300 * MolView.devicePixelRatio);
			return "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/smiles/png?record_type=2d&smiles="
				+ encodeURIComponent(smiles) + "&image_size=" + w	+ "x" + w;
		},

		/**
		 * Retrieves 2D or 3D SDF file from PubChem
		 * @param  {String}   cid     Compound ID
		 * @param  {Boolean}  flat    Load 2D SDF if True
		 * @param  {Function} success Called when SDF is loaded
		 * @param  {Function} error   Called when SDF request has failed
		 */
		sdf: function (cid, flat, success, error) {
			AJAX({
				primary: true,
				dataType: "text",
				url: "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/" + cid + "/sdf?record_type=" + (flat ? "2d" : "3d"),
				defaultError: error,
				success: success
			});
		},

		staticURL: function (cid) {
			return "https://pubchem.ncbi.nlm.nih.gov/compound/" + cid;
		}
	},

	RCSB:
	{
		data: [],

		search: function (text, success, error) {
			if (text === "") {
				if (error) error();
				return;
			}

			Progress.increment();

			text = text.replace(/\s/g, "|");

			AJAX({
				primary: true,
				type: "POST",
				data: "<orgPdbQuery>\
<queryType>org.pdb.query.simple.AdvancedKeywordQuery</queryType>\
<description>Text search for: " + text + "(molview.org)</description>\
<keywords>" + text + "</keywords>\
</orgPdbQuery>",
				contentType: "application/x-www-form-urlencoded",
				dataType: "text",
				url: "https://www.rcsb.org/pdb/rest/search?sortfield=rank",
				defaultError: error,
				success: function (data) {
					Progress.increment();

					Request.RCSB.data = data.split(/\n/);
					Request.RCSB.data = Request.RCSB.data.filter(function (a) { return a !== ""; });
					Request.RCSB.data.reverse();

					if (Request.RCSB.data.length > 0) success();
					else if (error) error();
				}
			});
		},

		information: function (pdbids, success, error)//pdbids separated by ","
		{
			AJAX({
				primary: true,
				dataType: "text",
				url: "https://www.rcsb.org/pdb/rest/customReport?pdbids=" + pdbids.join() + "&customReportColumns=structureId,structureTitle",
				defaultError: error,
				success: function (xml) {
					/* convert XML to JSON:
					<dataset>
						<record>
							<dimStructure.structureId>1BLU</dimStructure.structureId>
							<dimStructure.structureTitle>
								STRUCTURE OF THE 2[4FE-4S] FERREDOXIN FROM CHROMATIUM VINOSUM
							</dimStructure.structureTitle>
						</record>
					</dataset>

					to

					{
						dataset: [
							{
								"structureId": "1BLU",
								"structureTitle": "STRUCTURE OF THE 2[4FE-4S] FERREDOXIN FROM CHROMATIUM VINOSUM"
							}
						]
					}
					*/

					var json = {
						dataset: []
					};
					var dataset = [];//store unsorted records here
					var i;//loop index

					var records = $(xml).find("record");
					for (i = 0; i < records.length; i++) {
						dataset.push({
							"structureId": $(records[i]).find("dimStructure\\.structureId").text(),
							"structureTitle": $(records[i]).find("dimStructure\\.structureTitle").text()
						});
					}

					//resort JSON dataset to pdbids order
					for (i = 0; i < pdbids.length; i++) {
						//find PDBID in dataset
						for (var j = 0; j < dataset.length; j++) {
							if (dataset[j].structureId === pdbids[i]) {
								json.dataset.push(dataset[j]);
								continue;
							}
						}
					}

					success(json);
				}
			});
		},

		image: function (pdbid) {
			return "https://www.rcsb.org/pdb/images/" + pdbid + "_bio_r_500.jpg";
		},

		PDB: function (pdbid, success, error) {
			AJAX({
				primary: true,
				dataType: "text",
				url: "https://files.rcsb.org/view/" + pdbid + ".pdb",
				defaultError: error,
				success: success
			});
		},

		staticURL: function (pdbid) {
			return "http://www.rcsb.org/pdb/explore/explore.do?structureId=" + pdbid;
		}
	},

	COD:
	{
		data: { records: [] },

		search: function (text, success, error) {
			if (text === "") {
				if (error) error();
				return;
			}

			Progress.increment();

			AJAX({
				primary: true,
				dataType: "json",
				url: Request.API_ROOT + "php/cod.php?action=search&q=" + encodeURIComponent(text),
				defaultError: error,
				success: function (data) {
					Progress.increment();
					if (data.error) {
						if (error) error(true);
					}
					else if (data.records && data.records.length > 0) {
						Request.COD.data = data.records;
						success();
					}
					else if (error) error(false);
				}
			});
		},

		smiles: function (codids, success, error) {
			AJAX({
				primary: true,
				dataType: "json",
				url: Request.API_ROOT + "php/cod.php?action=smiles&q=" + codids,
				defaultError: error,
				success: success
			});
		},

		name: function (codids, success, error) {
			AJAX({
				primary: true,
				dataType: "json",
				url: Request.API_ROOT + "php/cod.php?action=name&q=" + codids,
				defaultError: error,
				success: success
			});
		},

		CIF: function (codid, success, error) {
			AJAX({
				primary: true,
				dataType: "text",
				url: "https://molview.org/php/cif.php?codid=" + codid,
				defaultError: error,
				success: success
			});
		},

		staticURL: function (codid) {
			return "http://www.crystallography.net/" + codid + ".html";
		}
	},

	NMRdb:
	{
		prediction: function (smiles, success, error) {
			AJAX({
				dataType: "json",
				url: "http://www.nmrdb.org/service/prediction?smiles=" + encodeURIComponent(smiles),
				defaultError: error,
				success: function (data) {
					success(data.jcamp.value);
				}
			});
		}
	},

	NIST:
	{
		lookup: function (cas, success, error) {
			AJAX({
				dataType: "json",
				url: Request.API_ROOT + "php/nist.php?type=lookup&cas=" + cas,
				defaultError: error,
				success: function (data) {
					//data postprocessing
					var output = [];
					output.url = data.url;
					output.mass = data.mass;
					output.uvvis = data.uvvis;
					output.ir = new Array();

					//ir records postprocessing
					data.ir.sort(function (a, b) { return a.i - b.i; });
					for (var i = 0; i < data.ir.length; i++) {
						if (data.ir[i].source.indexOf("NO SPECTRUM") === -1) {
							var state = humanize(data.ir[i].state);
							output.ir.push({ i: data.ir[i].i, state: state });
						}
						//else output.ir.push({ i: data.ir[i].i, state: "photocopy" });
					}

					success(output);
				}
			});
		},

		spectrum: function (cas, type, success, error) {
			/*
			Accepted type values:
			- mass
			- ir-{i}
			- uvvis
			*/
			var i = -1;
			if (type.indexOf("ir") !== -1) {
				i = parseInt(type.substr(3));
				type = "ir";
			}

			AJAX({
				dataType: "text",
				url: Request.API_ROOT + "php/nist.php?type=" + type + "&cas=" + cas + (i != -1 ? "&i=" + i : ""),
				defaultError: error,
				success: success
			});
		}
	}
};
