/*
MolView v2.2 (http://molview.org)
Copyright (c) 2014, Herman Bergwerf
ALL RIGHTS RESERVED
*/

//xhr to abort large AJAX calls
var xhr;

function getISOLanguageCode(str)
{
	//cut off from '-' / '_' / ';'
	if(str.indexOf(";") != -1) str = str.substr(0, str.indexOf(";"));
	if(str.indexOf("-") != -1) str = str.substr(0, str.indexOf("-"));
	if(str.indexOf("_") != -1) str = str.substr(0, str.indexOf("_"));
	return str;
}

var Request = {
	HTTP_CLIENT_IP: "",
	HTTP_ACCEPT_LANGUAGE: "",
	alternativeLanguages: [],

	init: function()
	{
		//find first non English language specified by browser
		var languages = this.HTTP_ACCEPT_LANGUAGE.split(",");
		for(var i = 0; i < languages.length; i++)
		{
			var iso = languages[i].substr(0, 2);
			if(iso != "en") Request.alternativeLanguages.push(iso);
		}
	},

	translation: function(text, success)
	{
		if(Request.alternativeLanguages.length > 0 && text.length > 0)
		{
			AJAX({
				dataType: "json",
				url: "http://mymemory.translated.net/api/get?q=" + encodeURI(text)
				+ "&langpair=" + Request.alternativeLanguages[0] + "|en&de=hermanbergwerf@gmail.com&ip=" + Request.HTTP_CLIENT_IP,
				success: function(response)
				{
					for(var i = 0; i < response.matches.length; i++)
					{
						if(response.matches[i].translation == text)
						{
							success(text)
							return;
						}
					}
					success(response.responseData.translatedText);
				},
				error: function(jqXHR, textStatus)
				{
					success(text);
				}
			});
		}
		else success(text);
	},
	
	CIRsearch: function(text, both, success, error)//success(2d, 3d, tranlated_text)
	{
		if(text === "")
		{
			error();
			return;
		}
		
		//try CIR
		Request.ChemicalIdentifierResolver.search(text, false, function(mol3d)
		{
			Progress.increment();
			
			if(both) Request.ChemicalIdentifierResolver.search(text, true, function(mol2d)
				{ success(mol2d, mol3d, text); }, error);
			else success(mol3d, text);
			
		},
		function()
		{
			Progress.increment();
			
			//translate
			Request.translation(text, function(translated)
			{
				Progress.increment();
				
				text = translated;
				
				//try CIR
				Request.ChemicalIdentifierResolver.search(text, false, function(mol3d)
				{
					Progress.increment();
					
					if(both) Request.ChemicalIdentifierResolver.search(text, true, function(mol2d)
						{ success(mol2d, mol3d, text); }, error);
					else success(mol3d, text);
				}, error);
			});
	
		}, error);
	},
	
	ChemicalIdentifierResolver: {	
		search: function(text, flat, success, error)
		{
			if(!Request.ChemicalIdentifierResolver.available)
			{
				error();
				return;
			}
			
			if(xhr !== undefined) xhr.abort();
			xhr = AJAX({
				dataType: "text",
				url: "http://cactus.nci.nih.gov/chemical/structure/" + text + "/file?format=sdf&get3d=" + (flat ? "False" : "True"),
				success: function(response)
				{
					if(response == "<h1>Page not found (404)</h1>\n" || response === undefined) error();
					else success(response);
				},
				error: function(jqXHR, textStatus)
				{
					if(textStatus != "error") return;
					if(error) error();
				}
			});
		},
		
		resolve3d: function(smiles, success, error)
		{
			if(!Request.ChemicalIdentifierResolver.available)
			{
				error();
				return;
			}
			
			smiles = smiles.replace(/#/g, "%23");
			if(xhr !== undefined) xhr.abort();
			xhr = AJAX({
				dataType: "text",
				url: "http://cactus.nci.nih.gov/chemical/structure/" + smiles + "/file?format=sdf&get3d=True",
				success: function(response)
				{
					if(response === "<h1>Page not found (404)</h1>\n" || response === undefined)
						{ if(error) error(); }
					else success(response);
				},
				error: function(jqXHR, textStatus)
				{
					if(textStatus != "error") return;
					if(error) error();
				}
			});
		},
		
		resolve2d: function(smiles, success, error)
		{
			if(!Request.ChemicalIdentifierResolver.available)
			{
				error();
				return;
			}
			
			smiles = smiles.replace(/#/g, "%23");
			if(xhr !== undefined) xhr.abort();
			xhr = AJAX({
				dataType: "text",
				url: "http://cactus.nci.nih.gov/chemical/structure/" + smiles + "/file?format=sdf&get3d=False",
				success: function(response)
				{
					if(response === "<h1>Page not found (404)</h1>\n" || response === undefined)
						{ if(error) error(); }
					else success(response);
				},
				error: function(jqXHR, textStatus)
				{
					if(textStatus != "error") return;
					if(error) error();
				}
			});
		},
		
		/*
		Properties:
		- formula
		- mw (molecular weight)
		- h_bond_donor_count
		- h_bond_acceptor_count
		- rule_of_5_violation_count
		- rotor_count
		- effective_rotor_count
		- ring_count
		- ringsys_count
		- cas
		*/
		getProperty: function(smiles, property, success, error, unavailable)
		{
			if(!Request.ChemicalIdentifierResolver.available)
			{
				error();
				return;
			}
            
			smiles = smiles.replace(/#/g, "%23");
			AJAX({
				dataType: "text",
				url: "http://cactus.nci.nih.gov/chemical/structure/" + smiles + "/" + property,
				success: function(response)
				{
					if(response === "<h1>Page not found (404)</h1>\n" || response === undefined)
						{ if(error) error(); }
					else success(response);
				},
				error: function(jqXHR, textStatus)
				{
					if(jqXHR.status == 404)
					{
						if(unavailable) unavailable();
						return;
					}
					
					if(textStatus != "error") return;
					if(error) error();
				}
			});
		}
	},
	
	PubChem: {
		data: [],
		maxRecords: 50,
		MaxSeconds: 10,
		
		search: function(text, success, error)
		{
			if(text === "")
			{
				if(error) error();
				return;
			}
					
			Request.translation(text, function(translated)
			{
				Progress.increment();
				
				text = translated;
				
				if(xhr !== undefined) xhr.abort();
				xhr = AJAX({
					dataType: "json",
					url: "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/" + encodeURIComponent(text) + "/cids/json?name_type=word",
					success: function(data)
					{
						Progress.increment();
						Request.PubChem.data = data.IdentifierList.CID.reverse();
						success();
					},
					error: function(jqXHR, textStatus)
					{
						if(textStatus != "error") return;
						if(error) error();
					}
				});
			});
		},
		
		//request PubChem compound list
		listkey: function(query, value, type, success, error)
		{
			if(xhr !== undefined) xhr.abort();
			xhr = AJAX({
				dataType: "json",
				url: type == "smiles" ?
					"https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/" + type + "/smiles/json?smiles=" + value :
					"https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/" + type + "/" + query + "/" + value + "/json?MaxRecords=" + Request.PubChem.maxRecords + "&MaxSeconds=" + Request.PubChem.MaxSeconds,
				success: function(data)
				{
					success(data.Waiting.ListKey);
				},
				error: function(jqXHR, textStatus)
				{
					if(textStatus != "error") return;
					if(error) error();
				}
			});
		},
		
		//retrieve PubChem compound list
		list: function(listkey, success, wait, error)
		{
			if(xhr !== undefined) xhr.abort();
			xhr = AJAX({
				dataType: "json",
				url: "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/listkey/" + listkey + "/cids/json",
				success: function(data)
				{
					if(data.IdentifierList)
					{
						Request.PubChem.data = data.IdentifierList.CID;
						success();
					}
					else if(data.Waiting)
					{
						wait(data.Waiting.ListKey);
					}
					else if(data.Fault)
					{
						if(error) error();
					}
				},
				error: function(jqXHR, textStatus)
				{
					if(textStatus != "error") return;
					if(error) error();
				}
			});
		},
		
		nameToCID: function(name, success, error)
		{
			AJAX({
				dataType: "json",
				url: "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/" + name + "/cids/json",
				success: function(data)
				{
					if(data.IdentifierList)
						success(data.IdentifierList.CID[0]);
					else error();
				},
				error: function(jqXHR, textStatus)
				{
					if(textStatus != "error") return;
					if(error) error();
				}
			});
		},
		
		description: function(cids, success, error)//cids as array
		{
			AJAX({
				dataType: "json",
				url: "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/" + cids + "/description/json",
				success: success,
				error: function(jqXHR, textStatus)
				{
					if(textStatus != "error") return;
					if(error) error();
				}
			});
		},
		
		properties: function(cids, properties, success, error)//cids as array
		{
			AJAX({
				dataType: "json",
				url: "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/" + cids + "/property/" + properties + "/json",
				success: success,
				error: function(jqXHR, textStatus)
				{
					if(textStatus != "error") return;
					if(error) error();
				}
			});
		},
		
		image: function(cid)
		{
			return "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/" + cid + "/png?record_type=2d";
		},
		
		mol: function(cid, flat, success, error)
		{
			if(xhr !== undefined) xhr.abort();
			xhr = AJAX({
				dataType: "text",
				url: "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/" + cid + "/sdf?record_type=" + (flat ? "2d" : "3d"),
				success: success,
				error: function(jqXHR, textStatus)
				{
					if(textStatus != "error") return;
					if(error) error();
				}
			});
		},
		
		SMILES: {
			description: function(smiles, success, error)
			{
				AJAX({
					dataType: "json",
					url: "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/smiles/description/json?smiles=" + encodeURIComponent(smiles),
					success: success,
					error: function(jqXHR, textStatus)
					{
						if(textStatus != "error") return;
						if(error) error();
					}
				});
			},
			
			properties: function(smiles, properties, success, error)//cids as array
			{
				AJAX({
					dataType: "json",
					url: "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/smiles/property/" + properties + "/json?smiles=" + encodeURIComponent(smiles),
					success: success,
					error: function(jqXHR, textStatus)
					{
						if(textStatus != "error") return;
						if(error) error();
					}
				});
			},
			
			image: function(smiles)
			{
				return "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/smiles/png?record_type=2d&smiles=" + encodeURIComponent(smiles);
			}
		}
	},
	
	RCSB: {
		data: [],
		
		search: function(text, success, error)
		{
			if(text === "")
			{
				if(error) error();
				return;
			}
			
			Request.translation(text, function(translated)
			{
				Progress.increment();
				
				text = translated;
				text = text.replace(/\s/g, "|");
				
				if(xhr !== undefined) xhr.abort();
				xhr = AJAX({
					type: "POST",
					data:
						"<orgPdbQuery>\
						<queryType>org.pdb.query.simple.AdvancedKeywordQuery</queryType>\
						<description>Proteins search from MolView</description>\
						<keywords>" + text + "</keywords>\
						</orgPdbQuery>",
					contentType: "application/x-www-form-urlencoded",
					dataType: "text",
					url: "http://www.pdb.org/pdb/rest/search?sortfield=rank",
					success: function(data)
					{
						Progress.increment();
						
						Request.RCSB.data = data.split(/\n/);
						Request.RCSB.data = Request.RCSB.data.filter(function(a){ return a !== ""; });
						Request.RCSB.data.reverse();
						
						if(Request.RCSB.data.length > 0) success();
						else if(error) error();
					},
					error: function(jqXHR, textStatus)
					{
						if(textStatus != "error") return;
						if(error) error();
					}
				});
			});
		},
		
		information: function(pdbids, success, error)//pdbids separated by ","
		{
			if(xhr !== undefined) xhr.abort();
			xhr = AJAX({
				dataType: "text",
				url: "http://www.rcsb.org/pdb/rest/customReport?pdbids=" + pdbids.join() + "&customReportColumns=structureId,structureTitle",
				success: function(xml)
				{
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
					for(i = 0; i < records.length; i++)
					{
						dataset.push({
							"structureId": $(records[i]).find("dimStructure\\.structureId").text(),
							"structureTitle": $(records[i]).find("dimStructure\\.structureTitle").text()
						});
					}
					
					//resort JSON dataset to pdbids order
					for(i = 0; i < pdbids.length; i++)
					{
						//find PDBID in dataset
						for(var j = 0; j < dataset.length; j++)
						{
							if(dataset[j].structureId == pdbids[i])
							{
								json.dataset.push(dataset[j]);
								continue;
							}
						}
					}
					
					success(json);
				},
				error: function(jqXHR, textStatus)
				{
					if(textStatus != "error") return;
					if(error) error();
				}
			});
		},
		
		image: function(pdbid)
		{
			return "http://www.rcsb.org/pdb/images/" + pdbid + "_bio_r_500.jpg";
		},
		
		PDB: function(pdbid, success, error)
		{
			if(xhr !== undefined) xhr.abort();
			xhr = AJAX({
				dataType: "text",
				url: "http://www.rcsb.org/pdb/files/" + pdbid + ".pdb",
				success: success,
				error: function(jqXHR, textStatus)
				{
					if(textStatus != "error") return;
					if(error) error();
				}
			});
		}
	},
	
	NMRdb: {
		prediction: function(smiles, success, error)
		{
			AJAX({
				dataType: "json",
				url: "http://www.nmrdb.org/service/prediction?smiles=" + encodeURIComponent(smiles),
				success: function(data)
				{
					success(data.jcamp.value);
				},
				error: function(jqXHR, textStatus)
				{
					if(textStatus != "error") return;
					if(error) error();
				}
			});
		}
	},
	
	NIST: {
		IRlookup: function(cas, success, error)
		{
			AJAX({
				dataType: "json",
				url: "nist.php?type=lookup&cas=" + cas,
				success: function(data)
				{
					//data postprocessing
					var output = [];
					output.mass = data.mass;
					output.uvvis = data.uvvis;
					output.ir = new Array();
					
					//ir records postprocessing
					data.ir.sort(function(a, b){ return a.i > b.i; });
					for(var i = 0; i < data.ir.length; i++)
					{
						if(data.ir[i].source.indexOf("NO SPECTRUM") == -1)
						{
							var state = humanize(data.ir[i].state);							
							output.ir.push({ i: data.ir[i].i, state: state });
						}
						//else output.ir.push({ i: data.ir[i].i, state: "photocopy" });
					}
					
					success(output);
				},
				error: function(jqXHR, textStatus)
				{
					if(textStatus != "error") return;
					if(error) error();
				}
			});
		},
		
		spectrum: function(cas, type, success, error)
		{
			/*
			Accepted type values:
			- mass
			- ir-{i}
			- uvvis
			*/
			var i = 0;
			if(type.indexOf("ir") != -1)
			{
				i = parseInt(type.substr(3));
				type = "ir";
			}			
			
			AJAX({
				dataType: "text",
				url: "nist.php?type=" + type + "&cas=" + cas + "&i=" + i,
				success: success,
				error: function(jqXHR, textStatus)
				{
					if(textStatus != "error") return;
					if(error) error();
				}
			});
		}
	},
	
	COD: {
		data: [],
		
		search: function(text, success, error)
		{
			if(text === "")
			{
				if(error) error();
				return;
			}
		
			Request.translation(text, function(translated)
			{
				Progress.increment();
				
				text = translated;
				
				if(xhr !== undefined) xhr.abort();
				xhr = AJAX({
					dataType: "json",
					url: "cod.php?type=search&q=" + encodeURIComponent(text),
					success: function(data)
					{
						Progress.increment();
						if(data.records.length > 0)
						{
							Request.COD.data = data.records;
							success();
						}
						else if(error) error();
					},
					error: function(jqXHR, textStatus)
					{
						if(textStatus != "error") return;
						if(error) error();
					}
				});
			});
		},
		
		information: function(codids, success, error)
		{
			if(xhr !== undefined) xhr.abort();
			xhr = AJAX({
				dataType: "json",
				url: "cod.php?type=information&codids=" + codids,
				success: success,
				error: function(jqXHR, textStatus)
				{
					if(textStatus != "error") return;
					if(error) error();
				}
			});
		},
		
		SMILES: function(codids, success, error)
		{
			if(xhr !== undefined) xhr.abort();
			xhr = AJAX({
				dataType: "json",
				url: "cod.php?type=smiles&codids=" + codids,
				success: success,
				error: function(jqXHR, textStatus)
				{
					if(textStatus != "error") return;
					if(error) error();
				}
			});
		},
		
		CIF: function(codid, success, error)
		{
			if(xhr !== undefined) xhr.abort();
			xhr = AJAX({
				dataType: "text",
				url: "cif.php?codid=" + codid,
				success: success,
				error: function(jqXHR, textStatus)
				{
					if(textStatus != "error") return;
					if(error) error();
				}
			});
		}
	}
};
