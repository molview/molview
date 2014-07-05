/*!
MolView v2.1 (http://molview.org)
Copyright (c) 2014, Herman Bergwerf
ALL RIGHTS RESERVED
*/
"use strict";

var Messages = {
	cir_down: "The Chemical Identifier Resolver is temporarily offline. Therefore, some functions are unavailable.",
	cir_func_down: "This function is unavailable because the Chemical Identifier Resolver is temporarily offline.",
	
	switch_engine: "",
	compound: "Loading compound...",
	protein: "Loading protein...",
	crystal: "Loading crystal...",
	crystal_structure: "Loading crystal structure...",
	
	search: "Searching...",
	clean: "Cleaning...",
	resolve: "Resolving...",
	
	no_glmol_crystals: "You cannot view crystals using GLmol",
	
	init_jmol: "",
	jmol_calculation: "",
	
	no_webgl_support: Detector.getWebGLErrorMessage(),
	no_canvas_support: "Your browser doesn't support this web application, try <a class='link' href='//google.com/chrome' title='A modern browser'>Google Chrome</a> instead.",
	
	sketcher_no_proteins: "Proteins cannot be displayed in the sketcher",
	mobile_old_no_proteins: "Proteins cannot be viewed on your device",
	smiles_load_error: "Failed to load structure from sketcher",
	smiles_load_error_force: "Failed to load structure from sketcher",
	
	load_fail: "Failed to load structure <small>The source database might be offline.</small>",
	search_fail: "Structure cannot be found",
	resolve_fail: "Structure cannot be resolved",
	clean_fail: "Structure cannot be cleaned",
	crystal_2d_fail: "Failed to load structural formula for this crystal structure",
	
	init: function()
	{		
		$("#start-messages-close").on("click", function(){ Messages.hide(); });
		$("#sketcher-messages .btn.ok").on("click", function(){ Progress.complete(); Messages.hide(); });
		$("#model-messages .btn.ok").on("click", function(){ Progress.complete(); Messages.hide(); });
		$("#content-messages .btn.ok").on("click", function(){ Progress.complete(); Messages.hide(); });
	},
	
	process: function(cb, what)
	{
		/*
		Valid strings for {what}
		- switch_engine
		- compound
		- protein
		- crystal
		- crystal_cell
		
		- search
		- clean
		- resolve
		
		- init_jmol
		- jmol_calculation
		- misc
		*/
		
		$("body").addClass("process");
		$("#content").removeClass("start-messages sketcher-messages model-messages content-messages message-alert stay")
			.addClass("message-process");
		
		if(what == "clean")
		{
			$("#sketcher-messages .text").first().html(Messages[what]);
			$("#content").addClass("sketcher-messages");
		}
		else if(what == "switch_engine" || what == "protein" || what == "resolve"
			 || what == "init_jmol" || what == "jmol_calculation" || what == "crystal_structure")
		{
			$("#model-messages .text").first().html(Messages[what]);
			$("#content").addClass("model-messages");
		}
		else if(what == "compound" || what == "crystal" || what == "search")
		{
			$("#content-messages .text").first().html(Messages[what]);
			$("#content").addClass("content-messages");
		}
		else if(what == "misc")
		{
			$("#content-messages .text").first().html("");
			$("#content").addClass("content-messages");
		}
		
		window.setTimeout(cb, 300);
	},
	
	alert: function(cause, error)
	{
		/*
		Valid strings for {cause}
		- cir_down
		- cir_func_down
		
		- no_canvas_support
		- no_webgl_support
		- no_glmol_crystals
		
		- sketcher_no_proteins
		
		- smiles_load_error
		- smiles_load_error_force
		
		- load_fail
		- search_fail
		- resolve_fail
		- clean_fail
		- crystal_2d_fail
		*/
		
		$("body").removeClass("process");
		$("#content").removeClass("start-messages content-messages message-process stay "
			/* do not hide sketcher-messages or model-messages if smiles cannot be loaded
			so the error message is automatically displayed in the right messages layer */
			+ ((cause == "smiles_load_error" || cause == "clean_fail" || cause == "resolve_fail") ? "" : "sketcher-messages model-messages"))
			.addClass("message-alert");
		
		if(cause == "sketcher_no_proteins" || cause == "crystal_2d_fail")
		{
			$("#sketcher-messages .text").first().html(Messages[cause]);
			$("#content").addClass("sketcher-messages");
		}
		else if(cause == "no_webgl_support" || cause == "no_glmol_crystals")
		{
			$("#model-messages .text").first().html(Messages[cause]);
			$("#content").addClass("model-messages");
		}
		else if(cause == "cir_down" || cause == "cir_func_down" || cause == "no_canvas_support" || cause == "search_fail" || cause == "load_fail"  || cause == "mobile_old_no_proteins")
		{
			$("#content-messages .text").first().html(Messages[cause]);
			$("#content").addClass("content-messages");
			
			if(cause == "no_canvas_support")
				$("#content").addClass("stay");
		}
		else if(cause == "smiles_load_error" || cause == "clean_fail" || cause == "resolve_fail")
		{
			if(error) $("#sketcher-messages .text, #model-messages .text, #content-messages .text").html(Messages[cause] + " <small>" + (error.message || error.detailMessage || error) + "</small>");
			else $("#sketcher-messages .text, #model-messages .text, #content-messages .text").html(Messages[cause]);
		}
		else if(cause == "smiles_load_error_force")
		{
			if(error) $("#content-messages .text").html(Messages[cause] + " <small>" + (error.message || error.detailMessage || error) + "</small>");
			$("#content").addClass("content-messages");
		}
		
		Progress.alert();
	},
	
	hide: function()
	{
		$("body").removeClass("process");
		$("#content").removeClass("start-messages sketcher-messages model-messages content-messages message-process message-alert stay");
	},
};
