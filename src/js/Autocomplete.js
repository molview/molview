/*!
MolView v2.2 (http://molview.org)
Copyright (c) 2014, Herman Bergwerf
ALL RIGHTS RESERVED
*/

function AutocompleteBuilder(array, key)
{
	this.array = array;
	this.key = key;
}

AutocompleteBuilder.prototype.sort = function(str, minsim, length)
{
	str = str.toLowerCase();
	var cpy = this.array.slice(0);
	for(var i = 0; i < cpy.length; i++)
	{
		cpy[i].similarity = similar_text(str, cpy[i][this.key].toLowerCase(), true);
		if(minsim && cpy[i].similarity < minsim)
		{
			cpy.splice(i, 1);
			i--;
		}
	}

	return cpy.sort(function(a, b)
		{ return b.similarity - a.similarity; }).slice(0, length ? length : cpy.length);
}

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
	PubChem_cache: {},
	records: [],
	i: -1,

	/**
	 * Initializes autocomplete component
	 */
	init: function()
	{
		this.macromolecules = new AutocompleteBuilder(commonMacromolecules.macromolecules, "name");
		this.minerals = new AutocompleteBuilder(mineralNames.minerals, "name");

		$("#search-input")[0].addEventListener("input", Autocomplete.refresh.bind(Autocomplete));
		$("#search-input").on("keydown", Autocomplete.keydown.bind(Autocomplete));
		$("#search").on("submit", Autocomplete.submit.bind(Autocomplete));

		$("#search-input").on("focus", Autocomplete.show.bind(Autocomplete));

		//hide autocomplete when clicked outside input and autocomplete
		$(window).on(MolView.trigger, function(e)
		{
			var container = $("#search-input, #search-autocomplete");

			if(!container.is(e.target) && container.has(e.target).length === 0)
			{
				Autocomplete.hide();
			}
		});
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

		$(".autocomplete-item").removeClass("autocomplete-item-hover");

		var target = $(".autocomplete-item").eq(i);
		if(i != -1)
		{
			target.addClass("autocomplete-item-hover");
			var position = target.position();
			if(position.top + target.outerHeight() > $("#search-autocomplete").outerHeight())
				$("#search-autocomplete").scrollTop($("#search-autocomplete").scrollTop()
			- $("#search-autocomplete").outerHeight() + position.top + target.outerHeight());
			else if(position.top < 0)
				$("#search-autocomplete").scrollTop($("#search-autocomplete").scrollTop() + position.top);
		}
	},

	/**
	 * Handles keyboard events
	 * @param  {Event} e
	 */
	keydown: function(e)
	{
		var key = e.keyCode || e.which;
		switch(key)
		{
			case 38://up
				this.i--;
				if(this.i < -1) this.i = this.records.length - 1;
				this.focusRecord(this.i);
				return false;

			case 40://down
				this.i++;
				if(this.i >= this.records.length) this.i = 0;
				this.focusRecord(this.i);
				return false;

			case 39://right

				/* complete input with first record which starts with the input
				text if you press the right arrow after the end of the input text */
				if(document.getElementById("search-input").selectionStart == $("#search-input").val().length)
				{
					var matches = this.records.filter(function(record)
					{
						return record.name.toLowerCase().indexOf(
							$("#search-input").val().toLowerCase()) == 0;
					});
					
					if(matches.length > 0)
					{
						$("#search-input").val(matches[0].label);
					}

					return false;
				}
		}
	},

	/**
	 * Updates autocomplete dropdown records
	 */
	refresh: function()
	{
		var text = $("#search-input").val();
		if(text.length > Autocomplete.maxLength) return;
		else if(text.length < Autocomplete.minLength) Autocomplete.display([]);
		else
		{
			var mix = [];
			if(MolView.macromolecules)
				mix = this.macromolecules.sort(text, this.MIN_SIM, this.MAX_NUMBER)
			  .concat(this.minerals.sort(text, this.MIN_SIM, this.MAX_NUMBER));
			else mix = this.minerals.sort(text, this.MIN_SIM, this.MAX_NUMBER);

			this.getPubChemAutocomplete(text, function(array)
			{
				if($("#search-input").val() != "")
				{
					mix = mix.concat(array);
					for(var i = 0; i < mix.length; i++)
					{
						mix[i].label = ucfirst(humanize(mix[i].name));
					}

					Autocomplete.display(new AutocompleteBuilder(mix, "name").sort(text));
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

		for(var i = 0; i < records.length; i++)
		{
			var li = $('<li class="clearfix autocomplete-item"></li>');
			$('<span class="autocomplete-label"></span>').html(records[i].label).appendTo(li);
			if(records[i].pdbids)//macromolecule
			{
				li.addClass("autocomplete-macromolecule");
				$('<span class="autocomplete-type"></span>').html(commonMacromolecules.types[records[i].type]).appendTo(li);
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

			li.data("i", i);
			li.on(MolView.trigger, function()
			{
				Autocomplete.i = $(this).data("i");
				Autocomplete.submit();
			});

			ul.append(li);
		}

		$("#autocomplete-dropdown").append(ul);
	},

	/**
	 * Shows autocomplete dropdown
	 */
	show: function()
	{
		Autocomplete.i = -1;
		$(".autocomplete-item").removeClass("autocomplete-item-hover");
		$("#autocomplete-dropdown").show();
	},

	/**
	* Hides autocomplete dropdown
	*/
	hide: function()
	{
		$("#autocomplete-dropdown").hide();
	},

	/**
	* Submits autocomplete selection
	*/
	submit: function()
	{
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
			Actions.hide_search_results();

			if(this.i == -1)//try to find a record match
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

			if(this.i == -1)//fast search using CIR
			{
				Messages.process(Loader.CIRsearch, "search");
			}
			else
			{
				$("#search-input").val(this.records[this.i].label);
				this.refresh();

				if(this.records[this.i].pdbids)//RCSB macromolecule
				{
					Loader.RCSB.loadPDBID(this.records[this.i].pdbids[0],
						this.records[this.i].label);
				}
				else if(this.records[this.i].codid)//COD mineral
				{
					Loader.COD.loadCODID(this.records[this.i].codid,
						this.records[this.i].label);
				}
				else//PubChem compound
				{
					Loader.PubChem.loadName(this.records[this.i].name);
				}
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
		if(this.PubChem_cache[text]) cb(this.PubChem_cache[text]);
		else
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
						array.push({ name: data.autocp_array[i] });
					}

					Autocomplete.PubChem_cache[text] = array;

					cb(array);
				}
			});
		}
	}
}
