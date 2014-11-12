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

/**
 * Lightweight MolView variant for /embed
 * @type {Object}
 */
var MolView = {
	touch: false,
	mobile: false,
	devicePixelRatio: 1.0,
	trigger: "click",
	query: {},
	loadDefault: true,
	JMOL_J2S_PATH: "jmol/j2s",


	init: function()
	{
		MolView.devicePixelRatio = window.devicePixelRatio || (MolView.mobile ? 1.5 : 1.0);

		this.query = getQuery();
		if(this.query.q || this.query.smiles || this.query.cid || this.query.pdbid || this.query.codid)
		{
			this.loadDefault = false;
		}

		Progress.init();
		if(this.loadDefault)
		{
			Progress.reset(2);
		}

		//initialize
		Request.init();

		$(window).on("resize", Model.resize.bind(Model));

		Progress.increment();

		if(this.touch && !Detector.webgl)
		{
			Model.JSmol.setQuality(false);
		}

		Model.init((function()
		{
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
						Model.setChainType(value, true);
					}

					if(value == "bonds")
					{
						Model.setChainType("none", true);
						Model.setChainBonds(true, true);
					}
				}
				else if(key == "chainBonds")
				{
					Model.setChainBonds(value == "true", true);
				}
				else if(key == "chainColor")
				{
					if(value == "ss" || value == "spectrum"
					|| value == "chain" || value == "residue"
					|| value == "polarity"|| value == "bfactor")
					{
						Model.setChainColor(value, true);
					}
				}
				else if(key == "bg")
				{
					Model.setBackground(value);
				}
			});
		}).bind(this), Detector.webgl ? "GLmol" : (((this.query.pdbid && !MolView.mobile) || this.query.codid) ? "JSmol" : "GLmol"));
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
