/*!
MolView v2.2 (http://molview.org)
Copyright (c) 2014, Herman Bergwerf
ALL RIGHTS RESERVED
*/
"use strict";

var Autocomplete = {
	//fuzzy-search algorithm parameters
	PROTEINS_THRESHOLD: 0.05,
	MINERALS_THRESHOLD: 0.005,
	PROTEINS_NUMBER: 10,//max number of biomolecule records in final mix
	MINERALS_NUMBER: 10,//max number of mineral records in final mix
	PUBCHEM_NUMBER: 10,//max number of pubchem records in final mix
	MIX_THRESHOLD: 0.05,
	
	minLength: 2,
	maxLength: 32,
	maxResults: 20,
	biomolecules: undefined,
	minerals: undefined,
	
	oldText: "",
	PubChem_cache: {},
	records: [],
	i: -1,
	
	init: function()
	{
		this.biomolecules = new Fuse(commonBiomolecules.biomolecules, {
			threshold: this.PROTEINS_THRESHOLD,
			keys: ["name"]
		});
		
		this.minerals = new Fuse(mineralNames.minerals, {
			threshold: this.MINERALS_THRESHOLD,
			keys: ["name"]
		});
		
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
		var key = e.keyCode || e.which;
		switch(key)
		{
			case 38://up
				this.i--;
				if(this.i < -1) this.i = this.records.length - 1;
				$(".autocomplete-item").removeClass("autocomplete-item-active");
				if(this.i != -1) $(".autocomplete-item").eq(this.i).addClass("autocomplete-item-active");
				return false;
			
			case 40://down
				this.i++;
				if(this.i >= this.records.length) this.i = -1;
				$(".autocomplete-item").removeClass("autocomplete-item-active");
				if(this.i != -1) $(".autocomplete-item").eq(this.i).addClass("autocomplete-item-active");
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
			if(MolView.biomolecules)
				mix = this.biomolecules.search(text).slice(0, this.PROTEINS_NUMBER)
			  .concat(this.minerals.search(text).slice(0, this.MINERALS_NUMBER));
			else mix = this.minerals.search(text);
			
			this.getPubChemAutocomplete(text, function(array)
			{
				var fuse = new Fuse(mix.concat(array), {
					shouldSort: false,
					threshold: Autocomplete.MIX_THRESHOLD,
					keys: ["name"]
				});
				
				Autocomplete.display(fuse.search(text).slice(0, Autocomplete.maxResults));
			});
		}
	},
	
	display: function(records)
	{
		/*
		Record structure:
		<ul>
			<li class="clearfix autocomplete-item autocomplete-biomolecule">
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
			if(records[i].pdbids)//biomolecule
			{
				li.addClass("autocomplete-biomolecule");
				$('<span class="autocomplete-type"></span>').html(commonBiomolecules.types[records[i].type] + " (Biomolecule)").appendTo(li);
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
				
				if(this.records[this.i].pdbids)//biomolecule
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
					+ this.PUBCHEM_NUMBER + "&q=" + text,
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
