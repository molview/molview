/*!
MolView v2.2 (http://molview.org)
Copyright (c) 2014, Herman Bergwerf
ALL RIGHTS RESERVED
*/
"use strict";

var Messages = {
	cir_down: "Structure unavailable<br/><small>(the Chemical Identifier Resolver is temporarily offline)</small>",
	
	compound: "Loading compound...",
	protein: "Loading protein...",
	crystal: "Loading crystal...",
	
	search: "Searching...",
	
	no_webgl_support: "You cannot use this render engine because your browser doesn't support WebGL, find out how to get it <a class='link' href='http://get.webgl.org/'>here</a>",
	no_canvas_support: "Your browser doesn't support this web application, try <a class='link' href='//google.com/chrome' title='A modern browser'>Google Chrome</a> instead.",
	
	mobile_old_no_proteins: "Proteins cannot be viewed on your device",
	
	load_fail: "Failed to load structure <small>This could mean the source database is offline</small>",
	search_fail: "Structure cannot be found",
	
	init: function()
	{
	},
	
	process: function(cb, what)
	{
		/*
		Valid strings for {what}
		- compound
		- protein
		- crystal
		*/
		
		$("body").addClass("progress-cursor");
		$(".process-img, .alert-img").hide();
		$(".process-img").show();
		
		$("#model-messages .message-text").html(Messages[what]);
		$("body").addClass("model-messages");
		
		window.setTimeout(cb, 300);
	},
	
	alert: function(cause)
	{
		/*
		Valid strings for {cause}
		- cir_down
		
		- no_canvas_support
		- no_webgl_support
		
		- load_fail
		- search_fail
		
		- mobile_old_no_proteins
		*/
		
		$("body").removeClass("progress-cursor");
		$(".process-img, .alert-img").hide();
		$(".process-img").show();
		
		$("#model-messages .message-text").html(Messages[cause] || "");
		$("body").addClass("model-messages");
		
		Progress.alert();
	},
	
	hide: function()
	{
		$("body").removeClass("progress-cursor");
		$("body").removeClass("model-messages");
	},
};

