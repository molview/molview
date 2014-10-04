/**
 * This file is part of MolView (https://molview.org)
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

var Loader = {
	lastQuery: {
		type: "",//q || cid || pdbid || codid || smiles
		content: "",
		name: "",
	},

	CIRsearch: function()
	{
		if(!Request.ChemicalIdentifierResolver.available)
		{
			Messages.alert("cir_func_down");
			return;
		}

		Progress.reset(3);

		var query = $("#search-input").val();

		Request.CIRsearch(query, function(mol2d, mol3d, text)
		{
			Sketcher.loadMOL(mol2d);
			Sketcher.markUpdated();

			Model.loadMOL(mol3d);

			text = ucfirst(text);
			document.title = text;

			Progress.complete();
			Messages.clear();

			Loader.lastQuery.type = "q";
			Loader.lastQuery.content = text;
			History.push("q", text);
		}, function()
		{
			Messages.alert("search_fail");
		});
	},

	PubChem:
	{
		i: 0,
		step: 10,
		loading: false,
		ssli: 1000,//structure search lookup interval

		loadCIDS: function(cids)
		{
			if(cids.length === 0) return;

			Request.PubChem.description(cids, function(data)
			{
				for(var i = 0; i < data.InformationList.Information.length; i++)
				{
					SearchGrid.addEntry(data.InformationList.Information[i]);
				}

				if(Loader.PubChem.i >= Request.PubChem.data.length) $(".load-more").css("display", "none");
				else $("#load-more-pubchem").removeClass("load-more-progress");
				Loader.PubChem.loading = false;
				Progress.complete();
			},
			function()
			{
				Messages.alert("search_noreach");
			});
		},

		loadNextSet: function()
		{
			if(this.loading) return;
			if(this.i < Request.PubChem.data.length)
			{
				this.loading = true;
				var start = this.i;
				var end = this.i + this.step;
				if(end > Request.PubChem.data.length) end = Request.PubChem.data.length;

				this.loadCIDS(Request.PubChem.data.slice(start, end));
				this.i = end;

				$("#load-more-pubchem").addClass("load-more-progress");
			}
		},

		search: function()
		{
			var text = $("#search-input").val();

			Progress.reset(3);

			Request.PubChem.search(text, function()
			{
				Messages.clear();
				Actions.show_search_layer();

				SearchGrid.setDatabase("pubchem");
				SearchGrid.clear();

				Loader.PubChem.i = 0;
				Loader.PubChem.loadNextSet();
			},
			function()
			{
				Messages.alert("search_fail");
			});
		},

		structureSearch: function(query, value, type)
		{
			Progress.reset(3);

			Request.PubChem.structureSearch(query, value, type, function(listkey)
			{
				Progress.increment();

				function lookup()
				{
					Request.PubChem.list(listkey,
					function()//success
					{
						Progress.increment();
						Messages.clear();
						Actions.show_search_layer();

						SearchGrid.setDatabase("pubchem");
						SearchGrid.clear();

						Loader.PubChem.i = 0;
						Loader.PubChem.loadNextSet();
					},
					function(newlistkey)//wait
					{
						listkey = newlistkey;
						window.setTimeout(lookup, Loader.PubChem.ssli);
					},
					function()//error
					{
						Messages.alert("structure_search_fail");
					});
				}

				lookup();
			},
			function()
			{
				Messages.alert("structure_search_fail");
			});
		},

		loadName: function(name)
		{
			Progress.reset(5);

			Messages.process(function()
			{
				Request.PubChem.nameToCID(name, function(cid)
				{
					Loader.PubChem._loadCID(cid, ucfirst(name));
				},
				function()
				{
					Messages.alert("load_fail");
				});
			}, "compound");
		},

		loadCID: function(cid, name)
		{
			Progress.reset(4);

			name = ucfirst(name);

			Messages.process(function()
			{
				Loader.PubChem._loadCID(cid, name);
			}, "compound");
		},

		_loadCID: function(cid, name)
		{
			//request 2D molecule
			Request.PubChem.sdf(cid, true, function(mol2d)
			{
				Sketcher.loadMOL(mol2d);
				Sketcher.metadata.cid = cid;
				Sketcher.markUpdated();

				Progress.increment();

				//request 3D molecule
				Request.PubChem.sdf(cid, false, function(mol3d)
				{
					Model.loadMOL(mol3d);

					Loader.lastQuery.type = "cid";
					Loader.lastQuery.content = "" + cid;

					document.title = name || "MolView";
					History.push("cid", cid);

					Progress.complete();
					Messages.clear();
				},
				function()//error: resolve using NCI
				{
					Progress.increment();

					var smiles;
					try
					{
						smiles = Sketcher.getSMILES();
					}
					catch(error)
					{
						Model.loadMOL(mol2d);
						Sketcher.markUpdated();

						Loader.lastQuery.type = "cid";
						Loader.lastQuery.content = "" + cid;

						document.title = name || "MolView";
						History.push("cid", cid);

						Progress.complete();
						Messages.clear();

						return;
					}

					Progress.increment();

					Request.ChemicalIdentifierResolver.resolve3d(smiles, function(mol3d)
					{
						Model.loadMOL(mol3d);
						Sketcher.markUpdated();

						Loader.lastQuery.type = "cid";
						Loader.lastQuery.content = "" + cid;

						document.title = name || "MolView";
						History.push("cid", cid);

						Progress.complete();
						Messages.clear();
					},
					function()
					{
						Model.loadMOL(mol2d);
						Sketcher.markUpdated();

						Loader.lastQuery.type = "cid";
						Loader.lastQuery.content = "" + cid;

						document.title = name || "MolView";
						History.push("cid", cid);

						Progress.complete();
						Messages.clear();
					});
				});
			},
			function()
			{
				Messages.alert("load_fail");
			});
		}
	},

	RCSB:
	{
		i: 0,
		step: 10,
		loading: false,

		loadPDBIDS: function(pdbids)
		{
			if(pdbids.length === 0) return;

			Request.RCSB.information(pdbids, function(data)
			{
				for(var i = 0; i < data.dataset.length; i++)
				{
					SearchGrid.addEntry(data.dataset[i]);
				}

				if(Loader.RCSB.i >= Request.RCSB.data.length) $(".load-more").css("display", "none");
				else $("#load-more-rcsb").removeClass("load-more-progress");
				Loader.RCSB.loading = false;
				Progress.complete();
			},
			function()
			{
				Messages.alert("search_noreach");
			});
		},

		loadNextSet: function()
		{
			if(this.loading) return;
			if(this.i < Request.RCSB.data.length)
			{
				this.loading = true;
				var start = this.i;
				var end = this.i + this.step;
				if(end > Request.RCSB.data.length) end = Request.RCSB.data.length;

				this.loadPDBIDS(Request.RCSB.data.slice(start, end));
				this.i = end;

				$("#load-more-rcsb").addClass("load-more-progress");
			}
		},

		search: function()
		{

			var text = $("#search-input").val();

			Progress.reset(3);

			Request.RCSB.search(text, function()
			{
				Messages.clear();
				Actions.show_search_layer();

				SearchGrid.setDatabase("rcsb");
				SearchGrid.clear();

				Loader.RCSB.i = 0;
				Loader.RCSB.loadNextSet();
			},
			function()
			{
				Messages.alert("search_fail");
			});
		},

		loadPDBID: function(pdbid, name)
		{
			Progress.reset(2);

			function finish()
			{
				Sketcher.markOutdated();

				document.title = name || pdbid.toUpperCase();

				Progress.complete();
				Messages.clear();
				Messages.alert("sketcher_no_macromolecules");

				Loader.lastQuery.type = "pdbid";
				Loader.lastQuery.content = "" + pdbid;
				History.push("pdbid", pdbid);
			}

			MolView.setLayout("model");
			Messages.process(function()
			{
				Progress.increment();

				Request.RCSB.PDB(pdbid, function(pdb)
				{
					if(!Detector.webgl)
					{
						if(MolView.mobile)
						{
							Messages.alert("mobile_old_no_macromolecules");
						}
						else
						{
							if(Model.isJSmol())
							{
								Model.loadPDB(pdb);
								finish();
							}
							else//switch to JSmol
							{
								Model.preloadPDB(pdb);
								Model.setRenderEngine("JSmol", finish);
							}
						}
					}
					else
					{
						if(Model.isGLmol())
						{
							Model.loadPDB(pdb);
							finish();
						}
						else//switch to GLmol
						{
							Model.preloadPDB(pdb);
							Model.setRenderEngine("GLmol", finish);
						}
					}
				},
				function()
				{
					Messages.alert("load_fail");
				});
			}, "macromolecule");
		}
	},

	COD:
	{
		i: 0,
		step: 10,
		loading: false,

		loadNextSet: function()
		{
			$("#load-more-cod").addClass("load-more-progress");

			window.setTimeout(function()
			{
				if(this.loading) return;
				if(this.i < Request.COD.data.length)
				{
					for(var end = this.i + this.step;
						this.i < Request.COD.data.length && this.i < end; this.i++)
					{
						SearchGrid.addEntry(Request.COD.data[this.i]);
					}

					if(this.i >= Request.COD.data.length) $(".load-more").css("display", "none");
					else $("#load-more-cod").removeClass("load-more-progress");
					this.loading = false;
					Progress.complete();
				}
			}.bind(this), 300);
		},

		search: function()
		{
			var text = $("#search-input").val();

			Progress.reset(3);

			Request.COD.search(text, function()
			{
				Messages.clear();
				Actions.show_search_layer();

				SearchGrid.setDatabase("cod");
				SearchGrid.clear();

				Loader.COD.i = 0;
				Loader.COD.loadNextSet();
			},
			function(offline)
			{
				Messages.alert(offline ? "search_noreach" : "search_fail");
			});
		},

		/**
		 * Load a Crystal model using a COD ID
		 * @param {String} codid        COD ID
		 * @param {String} name         Crystal name
		 * @param {String} cid          PubChem Compound ID for 2D depiction
		 * @param {String} PubChem_name PubChem Compound Name for 2D depiction
		 */
		loadCODID: function(codid, name, cid, PubChem_name)
		{
			Progress.reset(4);

			MolView.makeModelVisible();

			function finish()
			{
				document.title = name || "COD: " + codid;

				Progress.complete();
				Messages.clear();

				Loader.lastQuery.type = "codid";
				Loader.lastQuery.content = "" + codid;
				History.push("codid", codid);
			}

			function load()
			{
				Request.COD.CIF(codid, function(cif)
				{
					if(cif.length > 1)
					{
						Model.loadCIF(cif, [1, 1, 1], function()
						{
							Progress.increment();

							if(cid)
							{
								Request.PubChem.sdf(cid, true, function(mol2d)
								{
									Sketcher.metadata.cid = cid;
									Sketcher.loadMOL(mol2d);
									Sketcher.markUpdated();
									finish();
									Messages.alert("crystal_2d_unreliable");
								},
								function()
								{
									finish();
									Messages.alert("crystal_2d_fail");
								});
							}
							else
							{
								Request.COD.SMILES(codid, function(data)
								{
									Progress.increment();

									if(data.records[0].smiles == "")
									{
										finish();
										Messages.alert("crystal_2d_fail");
									}
									else
									{
										Request.ChemicalIdentifierResolver.resolve2d(data.records[0].smiles,
										function(mol2d)
										{
											Sketcher.metadata.smiles = data.records[0].smiles;
											Sketcher.loadMOL(mol2d);
											Sketcher.removeAllHydrogen();
											Sketcher.markUpdated();
											finish();
											Messages.alert("crystal_2d_unreliable");
										},
										function()
										{
											finish();
											Messages.alert("crystal_2d_fail");
										});
									}
								},
								function()
								{
									finish();
									Messages.alert("crystal_2d_fail");
								});
							}
						});
					}
					else
					{
						Messages.alert("load_fail");
					}
				},
				function()
				{
					Messages.alert("load_fail");
				});
			}

			Messages.process(function()
			{
				if(PubChem_name)
				{
					//only use PubChem_name if it's the compounds primary name
					Request.PubChem.primaryName(PubChem_name, function(name)
					{
						Progress.increment();

						if(name.toLowerCase() == PubChem_name.toLowerCase())
						{
							Request.PubChem.nameToCID(PubChem_name, function(_cid)
							{
								Progress.increment();

								cid = _cid;
								load();
							}, load);
						}
						else
						{
							load();
						}
					}, load);
				}
				else
				{
					load();
				}
			}, "crystal");
		}
	},

	/**
	 * Cleans current structural formula using CIR depictionq
	 */
	clean: function()
	{
		if(!Request.ChemicalIdentifierResolver.available)
		{
			Messages.alert("cir_func_down");
			return;
		}

		var updated = $("#resolve").hasClass("resolve-updated");

		Progress.reset(2);

		var smiles;
		try
		{
			smiles = Sketcher.getSMILES();
		}
		catch(error)
		{
			Messages.alert("smiles_load_error", error);
			return;
		}

		Progress.increment();

		Request.ChemicalIdentifierResolver.resolve2d(smiles, function(mol)
		{
			Sketcher.loadMOL(mol);
			if(updated) Sketcher.markUpdated();

			Progress.complete();
			Messages.clear();
		},
		function()
		{
			Messages.alert("clean_fail");
		});
	},

	/**
	 * Converts the current structural formula into a 3D model
	 */
	resolve: function()
	{
		if(!Request.ChemicalIdentifierResolver.available)
		{
			Messages.alert("cir_func_down");
			return;
		}

		Progress.reset(2);

		var smiles;
		try
		{
			smiles = Sketcher.getSMILES();
		}
		catch(error)
		{
			Messages.alert("smiles_load_error", error);
			return;
		}

		Progress.increment();

		Request.ChemicalIdentifierResolver.resolve3d(smiles, function(mol)
		{
			Model.loadMOL(mol);
			Sketcher.markUpdated();

			document.title = "MolView";

			Progress.complete();
			Messages.clear();

			Loader.lastQuery.type = "smiles";
			Loader.lastQuery.content = smiles;
			History.push("smiles", smiles);
		},
		function()
		{
			Messages.alert("resolve_fail");
		});
	},

	/**
	 * Loads 2D and 3D molecule for a given SMILES string
	 * @param {String} smiles SMILES
	 * @param {String} title  New document title
	 */
	loadSMILES: function(smiles, title)
	{
		if(!Request.ChemicalIdentifierResolver.available)
		{
			Messages.alert("cir_func_down");
			return;
		}

		Progress.reset(2);

		document.title = title || "MolView";

		Request.ChemicalIdentifierResolver.resolve3d(smiles, function(mol3d)
		{
			Progress.increment();

			Model.loadMOL(mol3d);

			Request.ChemicalIdentifierResolver.resolve2d(smiles, function(mol2d)
			{
				Sketcher.loadMOL(mol2d);
				Sketcher.markUpdated();

				Loader.lastQuery.type = "smiles";
				Loader.lastQuery.content = smiles;
				History.push("smiles", smiles);

				Progress.complete();
				Messages.clear();
			},
			function()
			{
				Messages.alert("load_fail");
			});
		},
		function()
		{
			Messages.alert("load_fail");
		});
	}
};
