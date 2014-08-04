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
	//fuzzy-search algorithm parameters
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

	keydown: function(e)
	{
		function focus_item(i)
		{
			var target = $(".autocomplete-item").eq(i);
			$(".autocomplete-item").removeClass("autocomplete-item-hover");
			if(i != -1) target.addClass("autocomplete-item-hover");
			if(i != -1 &&
				(target.position().top + target.height() > $("#search-autocomplete").height()
				|| target.position().top < 0))
				$("#search-autocomplete").scrollTop(target.position().top);
		}

		var key = e.keyCode || e.which;
		switch(key)
		{
			case 38://up
				this.i--;
				if(this.i < -1) this.i = this.records.length - 1;
				focus_item(this.i);
				return false;

			case 40://down
				this.i++;
				if(this.i >= this.records.length) this.i = 0;
				focus_item(this.i);
				return false;
		}
	},

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
				Autocomplete.display(new AutocompleteBuilder(mix.concat(array), "name").sort(text));
			});
		}
	},

	display: function(records)
	{
		/*
		Record structure:
		<ul>
			<li class="clearfix autocomplete-item autocomplete-macromolecule">
				<span class="autocomplete-label">DNA</span>
				<span class="autocomplete-type"></span>
			</li>
		</ul>
		*/

		Autocomplete.records = records;
		Autocomplete.i = -1;

		$("#search-autocomplete").empty();
		var ul = $("<ul></ul>");

		for(var i = 0; i < records.length; i++)
		{
			var li = $('<li class="clearfix autocomplete-item"></li>');
			$('<span class="autocomplete-label"></span>').html(ucfirst(humanize(records[i].name))).appendTo(li);
			if(records[i].pdbids)//macromolecule
			{
				li.addClass("autocomplete-macromolecule");
				$('<span class="autocomplete-type"></span>').html("Macromolecule [" + commonMacromolecules.types[records[i].type] + "]").appendTo(li);
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

		$("#search-autocomplete").append(ul);
	},

	show: function()
	{
		Autocomplete.i = -1;
		$(".autocomplete-item").removeClass("autocomplete-item-hover");
		$("#search-autocomplete").show();
	},

	hide: function()
	{
		$("#search-autocomplete").hide();
	},

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
			MolView.hideWindows();
			Actions.hide_search_results();

			if(this.i == -1)
			{
				Messages.process(Loader.CIRsearch, "search");
			}
			else
			{
				$("#search-input").val(ucfirst(humanize(this.records[this.i].name)));
				$("#search-autocomplete").empty();

				if(this.records[this.i].pdbids)//macromolecule
				{
					Loader.RCSB.loadPDBID(this.records[this.i].pdbids[0],
						ucfirst(humanize(this.records[this.i].name)));
				}
				else if(this.records[this.i].codid)//mineral
				{
					Loader.COD.loadCODID(this.records[this.i].codid,
						ucfirst(humanize(this.records[this.i].name)));
				}
				else//pubchem
				{
					Loader.PubChem.loadName(this.records[this.i].name);
				}
			}
		}
	},

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
						array.push({ "name": data.autocp_array[i] });

					Autocomplete.PubChem_cache[text] = array;

					cb(array);
				}
			});
		}
	}
}
