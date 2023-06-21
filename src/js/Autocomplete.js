/**
 * This file is part of MolView (http://molview.org)
 * Copyright (c) 2014-2023 Herman Bergwerf
 */

/**
 * AutocompleteBuilder constructor
 * @param {Array}  array Autocomplete data array
 * @param {String} key   Autocomplete sort field
 */
function AutocompleteBuilder(array, key)
{
	this.array = array;
	this.key = key;
}

/**
 * Sort Auotocomplete data
 * @param  {String}  str    Sort string (converted to lower case)
 * @param  {Float}   minsim Minimal similairity (0-100)
 * @param  {Integer} length Number of returned items
 * @return {Array}          Best < $length items for $str where
 *                          similiarity >= $minsim
 */
AutocompleteBuilder.prototype.sort = function(str, minsim, length)
{
	str = str.toLowerCase();
	var cpy = this.array.slice(0);
	for(var i = 0; i < cpy.length; i++)
	{
		cpy[i].similarity = similar_text(str, cpy[i][this.key].toLowerCase(), true);

		//add 100 to similarity if first characters are the same
		if(cpy[i][this.key].toLowerCase().indexOf(str) === 0)
		{
			cpy[i].similarity += 100;
		}

		if(minsim && cpy[i].similarity < minsim)
		{
			cpy.splice(i, 1);
			i--;
		}
	}

	return cpy.sort(function(a, b)
	{
		return b.similarity - a.similarity;
	}).slice(0, length ? length : cpy.length);
}

/**
 * Autocomplete UI component
 * @type {Object}
 */
var Autocomplete = {
	//autocomplete algorithm parameters
	MIN_SIM: 40,//minimal similarity of records
	MAX_NUMBER: 10,//maximum number of records per category

	minLength: 1,
	maxLength: 32,
	maxResults: 20,
	macromolecules: undefined,
	minerals: undefined,

	oldText: "",
	cache: {},
	records: [],
	i: -1,

	/**
	 * Initializes autocomplete component
	 */
	init: function()
	{
		for(var i = 0; i < PDBNames.macromolecules.length; i++)
		{
			PDBNames.macromolecules[i].label =
				PDBNames.macromolecules[i].name;
		}

		for(var i = 0; i < MineralNames.records.length; i++)
		{
			MineralNames.records[i].label =
				ucfirst(MineralNames.records[i].name);
		}

		this.macromolecules = new AutocompleteBuilder(PDBNames.macromolecules, "name");
		this.minerals = new AutocompleteBuilder(MineralNames.records, "name");

		$("#search-input")[0].addEventListener("input", Autocomplete.refresh.bind(Autocomplete));
		$("#search-input").on("keydown", Autocomplete.keydown.bind(Autocomplete));
		$("#search").on("submit", function(e)
		{
			e.preventDefault();
			Autocomplete.submit();
		});

		$("#search-input").on("focus", function()
		{
			this.select();
			Autocomplete.focus();
		});

		//hide autocomplete when clicked outside input and autocomplete
		$(window).on(MolView.trigger, function(e)
		{
			var container = $("#search-input, #autocomplete-dropdown");

			if(!container.is(e.target) && container.has(e.target).length === 0)
			{
				Autocomplete.hide();
			}
		});

		$(window).on("blur", Autocomplete.hide);
	},

	/**
	 * Selects the specified record in the autocomplete dropdown
	 * @param {Integer} i Record index
	 */
	focusRecord: function(i)
	{
		if(i > -1 && i < Autocomplete.records.length)
		{
			$("#search-input").val(Autocomplete.records[i].label);
		}

		$(".autocomplete-item").removeClass("autocomplete-item-active");

		var target = $(".autocomplete-item").eq(i);
		if(i !== -1)
		{
			target.addClass("autocomplete-item-active");
			var position = target.position();
			if(position.top + target.outerHeight() > $("#autocomplete-dropdown").outerHeight())
				$("#autocomplete-dropdown").scrollTop($("#autocomplete-dropdown").scrollTop()
			  - $("#autocomplete-dropdown").outerHeight() + position.top + target.outerHeight());
			else if(position.top < 0)
				$("#autocomplete-dropdown").scrollTop($("#autocomplete-dropdown").scrollTop() + position.top);
		}
	},

	/**
	 * Handles keyboard events
	 * @param  {Event} e
	 */
	keydown: function(e)
	{
		if(this.i === -1)
		{
			this.oldText = $("#search-input").val();
		}

		var key = e.keyCode || e.which;
		switch(key)
		{
			case 27://esc

				this.hide();
				$("#search-input").blur();
				return true;

			case 38://up

				this.i--;

				if(this.i === -1)
				{
					$("#search-input").val(this.oldText)
				}
				else if(this.i < -1)
				{
					this.i = this.records.length - 1;
				}

				this.focusRecord(this.i);
				return true;

			case 40://down

				this.i++;

				if(this.i >= this.records.length)
				{
					this.i = 0;
				}

				this.focusRecord(this.i);
				return true;

			case 39://right

				/* complete input with first record which starts with the input
				text if you press the right arrow after the end of the input text */
				if(document.getElementById("search-input").selectionStart === $("#search-input").val().length)
				{
					var matches = this.records.filter(function(record)
					{
						return record.name.toLowerCase().indexOf(
							$("#search-input").val().toLowerCase()) === 0;
					});

					if(matches.length > 0)
					{
						$("#search-input").val(matches[0].label);
					}

					return true;
				}
		}
	},

	/**
	 * Updates autocomplete dropdown records
	 */
	refresh: function()
	{
		var text = $("#search-input").val().toLowerCase();

		if(Autocomplete.cache[text])
		{
			Autocomplete.display(Autocomplete.cache[text]);
		}
		else if(text.length > Autocomplete.maxLength)
		{
			return;
		}
		else if(text.length < Autocomplete.minLength)
		{
			Autocomplete.display([]);
		}
		else
		{
			var mix = [];

			//exclude macromolecules if not supported by device
			if(MolView.macromolecules && !(!Detector.webgl && MolView.mobile))
			{
				mix = this.macromolecules.sort(text, this.MIN_SIM, this.MAX_NUMBER).slice(0)
					.concat(this.minerals.sort(text, this.MIN_SIM, this.MAX_NUMBER).slice(0));
			}
			else
			{
				mix = this.minerals.sort(text, this.MIN_SIM, this.MAX_NUMBER).slice(0);
			}

			this.getPubChemAutocomplete(text, function(array)
			{
				for(var i = 0; i < array.length; i++)
				{
					array[i].label = ucfirst(humanize(array[i].name));
				}

				mix = mix.concat(array);

				//autocomplete sort mix
				mix = new AutocompleteBuilder(mix, "label").sort(text);

				/* remove duplicate mineral/compound entries
				(use compound CID for 2D molecule later) */
				for(var i = 0; i < mix.length; i++)
				{
					if(i < mix.length - 1)
					{
						if(mix[i].label === mix[i + 1].label)
						{
							//merge into first entry
							mix[i].codid = mix[i].codid || mix[i + 1].codid;
							mix[i].PubChem_name = mix[i].PubChem_name || mix[i + 1].PubChem_name;

							//remove second duplicate
							mix.splice(i + 1, 1);
						}
					}
				}

				Autocomplete.cache[text] = mix;
				if(text === $("#search-input").val().toLowerCase())
				{
					Autocomplete.display(Autocomplete.cache[text]);
				}
			});
		}
	},

	/**
	 * Updates autocomplete dropdown using passed records
	 * @param  {Array} records Autocomplete content records
	 */
	display: function(records)
	{
		/*
		Record HTML structure:
		<ul>
			<li class="clearfix autocomplete-item autocomplete-macromolecule">
				<span class="autocomplete-label">DNA</span>
				<span class="autocomplete-type"></span>
			</li>
		</ul>
		*/

		Autocomplete.records = records;
		Autocomplete.i = -1;

		$("#autocomplete-dropdown").empty();
		var ul = $("<ul></ul>");
		var text = $("#search-input").val().toLowerCase();

		for(var i = 0; i < records.length; i++)
		{
			var li = $('<li class="autocomplete-item"></li>');

			if(records[i].label.toLowerCase().indexOf(text) === 0)
			{
				$('<span class="autocomplete-label"></span>').html("<b>"
						+ records[i].label.substr(0, text.length) + "</b>"
						+ records[i].label.substr(text.length)).appendTo(li);
			}
			else
			{
				$('<span class="autocomplete-label"></span>').html(records[i].label).appendTo(li);
			}

			if(records[i].pdbids)//macromolecule
			{
				li.addClass("autocomplete-macromolecule");
				$('<span class="autocomplete-type"></span>').html(PDBNames.types[records[i].type]).appendTo(li);
			}
			else if(records[i].codid)//mineral
			{
				li.addClass("autocomplete-mineral");
				$('<span class="autocomplete-type"></span>').html("Mineral").appendTo(li);
			}
			else//PubChem compound
			{
				li.addClass("autocomplete-pubchem");
				$('<span class="autocomplete-type"></span>').html("Compound").appendTo(li);
			}

			$('<div style="clear: both;"></div>').appendTo(li);

			li.data("i", i);
			li.on(MolView.trigger, function()
			{
				Autocomplete.i = $(this).data("i");
				Autocomplete.submit();
			});

			ul.append(li);
		}

		$("#autocomplete-dropdown").append(ul);

		if(records.length > 0) $("#autocomplete-dropdown").show();
		else $("#autocomplete-dropdown").hide();
	},

	focus: function()
	{
		Autocomplete.i = -1;
		$(".autocomplete-item").removeClass("autocomplete-item-active");
		$("#autocomplete-dropdown-wrapper").show();
		$("#autocomplete-dropdown").hide();
		$("#menu").scrollLeft($("#brand").is(":visible") ? 55 : 0);
	},

	/**
	* Hides autocomplete dropdown
	*/
	hide: function()
	{
		$("#autocomplete-dropdown-wrapper").hide();
	},

	/**
	* Submits autocomplete selection
	*/
	submit: function()
	{
		MolView.pushEvent("input", "submit", "autocomplete", 0);

		if($("#search-input").val() === "")
		{
			$("#search-input").focus();
			MolView.alertEmptyInput();
		}
		else
		{
			this.hide();
			$("#search-input").blur();
			MolView.hideDialogs();
			MolView.setLayer("main");

			if(this.i === -1)//try to find a record match
			{
				for(var i = 0; i < this.records.length; i++)
				{
					if(this.records[i].name.toLowerCase() ==
						$("#search-input").val().toLowerCase())
					{
						this.i = i;
						break;
					}
				}
			}

			if(this.i === -1)//fast search using CIR
			{
				var val = $("#search-input").val();
				if(Autocomplete.cache[val] === undefined)
				{
					Loader.PubChem.loadName(val, true);
				}
				else
				{
					Messages.process(Loader.CIRsearch, "search");
				}
			}
			else
			{
				$("#search-input").val(this.records[this.i].label);

				if(this.records[this.i].pdbids)//RCSB macromolecule
				{
					Loader.RCSB.loadPDBID(this.records[this.i].pdbids[0],
						this.records[this.i].label);
				}
				else if(this.records[this.i].codid)//COD mineral
				{
					Loader.COD.loadCODID(this.records[this.i].codid,
						this.records[this.i].label, this.records[this.i].PubChem_name);
				}
				else//PubChem compound
				{
					Loader.PubChem.loadName(this.records[this.i].label);
				}

				this.refresh();
			}
		}
	},

	/**
	 * Retrieves PubChem compounds matching $text using an unofficial
	 * PubChem autocomplete API
	 * All requests are cached
	 * @param {String}   text Input text
	 * @param {Function} cb   Called when compound list is available
	 */
	getPubChemAutocomplete: function(text, cb)
	{
		AJAX({
			dataType: "json",
			url: "https://pubchem.ncbi.nlm.nih.gov/pcautocp/pcautocp.cgi?dict=pc_compoundnames&n="
				+ this.MAX_NUMBER + "&q=" + text,
			success: function(data)
			{
				var array = [];
				for(var i = 0; i < data.autocp_array.length; i++)
				{
					array.push({
						name: data.autocp_array[i],
						PubChem_name: data.autocp_array[i]//trick to recognize PubChem items
					});
				}

				cb(array);
			}
		});
	}
}
