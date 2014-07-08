/*!
MolView v2.2 (http://molview.org)
Copyright (c) 2014, Herman Bergwerf
ALL RIGHTS RESERVED
*/
"use strict";

var Progress = {
	value: 0.0,//0.0 - 1.0
	steps: 0,
	bar: undefined,
	part: undefined,
	
	init: function()
	{
		this.bar = $("#progress");
		this.part = $("#progress .part");
	},
	
	setValue: function(val)
	{
		if(this.steps == 0) return;
		if(val > 1) val = 1;
		//var delta = val - this.value;
		this.value = val;
		this.part.stop().animate({"width": "" + (this.value * 100) + "%"}, 800, "swing");
	},
	
	clear: function()
	{
		this.value = 0;
		this.part.stop().css({ "width": 0, "opacity": 1 });
	},
	
	add: function(val)
	{
		this.setValue(this.value + val);
	},
	
	setSteps: function(s)
	{
		this.steps = s + 1;
		this.increment();
		document.title = document.title.replace(/ \[loading\]/g, "");
		document.title += " [loading]";
	},
	
	increment: function()
	{
		this.add(1.0 / this.steps);
	},
	
	hide: function()
	{
		Progress.part.animate({
			"opacity": 0
		}, 1000, "swing", function()
		{
			Progress.part.css("width", 0);
		});
	},
	
	alert: function()
	{
		document.title = document.title.replace(/ \[loading\]/g, "");
	},
	
	complete: function()
	{
		this.setValue(1);
		this.hide();
		document.title = document.title.replace(/ \[loading\]/g, "");
	}
};
