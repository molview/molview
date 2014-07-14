/*!
MolView v2.2 (http://molview.org)
Copyright (c) 2014, Herman Bergwerf
ALL RIGHTS RESERVED
*/
"use strict";

var Messages = {
	cir_down: "The Chemical Identifier Resolver is temporarily offline. Therefore, some functions are unavailable.",
	cir_func_down: "This function is unavailable because the Chemical Identifier Resolver is temporarily offline.",
	
	switch_engine: "",
	compound: "Loading compound...",
	biomolecule: "Loading biomolecule...",
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
	
	sketcher_no_biomolecules: "Biomolecules cannot be displayed in the sketcher",
	mobile_old_no_biomolecules: "Biomolecules cannot be viewed on your device",
	smiles_load_error: "Failed to load structure from sketcher",
	smiles_load_error_force: "Failed to load structure from sketcher",
	
	load_fail: "Failed to load structure",
	search_fail: "Structure cannot be found",
	resolve_fail: "Structure cannot be resolved",
	clean_fail: "Structure cannot be cleaned",
	crystal_2d_fail: "Failed to load structural formula for this crystal structure",
	
	init: function()
	{		
		$("#start-messages-close").on("click", function(){ Messages.hide(); });
		$("#sketcher-messages .message-btn").on("click", function(){ Progress.complete(); Messages.hide(); });
		$("#model-messages .message-btn").on("click", function(){ Progress.complete(); Messages.hide(); });
		$("#content-messages .message-btn").on("click", function(){ Progress.complete(); Messages.hide(); });
	},
	
	process: function(cb, what)
	{
		/*
		Valid strings for {what}
		- switch_engine
		- compound
		- biomolecule
		- crystal
		- crystal_cell
		
		- search
		- clean
		- resolve
		
		- init_jmol
		- jmol_calculation
		- misc
		*/
		
		$("#start-messages-close").hide();
		$("body").addClass("progress-cursor");
		$("#content").removeClass("start-messages sketcher-messages model-messages content-messages");
		
		$(".message-btn").hide();
		$(".process-img, .alert-img").hide();
		$(".process-img").show();
		
		if(what == "clean")
		{
			$("#sketcher-messages .message-text").html(Messages[what]);
			$("#content").addClass("sketcher-messages");
		}
		else if(what == "switch_engine" || what == "biomolecule" || what == "resolve"
			 || what == "init_jmol" || what == "jmol_calculation" || what == "crystal_structure")
		{
			$("#model-messages .message-text").html(Messages[what]);
			$("#content").addClass("model-messages");
		}
		else if(what == "compound" || what == "crystal" || what == "search")
		{
			$("#content-messages .message-text").html(Messages[what]);
			$("#content").addClass("content-messages");
		}
		else if(what == "misc")
		{
			$("#content-messages .message-text").html("");
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
		
		- sketcher_no_biomolecules
		
		- smiles_load_error
		- smiles_load_error_force
		
		- load_fail
		- search_fail
		- resolve_fail
		- clean_fail
		- crystal_2d_fail
		*/
		
		$("#start-messages-close").hide();
		$("body").removeClass("progress-cursor");
		$("#content").removeClass("start-messages content-messages "
			/* do not hide sketcher-messages or model-messages if smiles cannot be loaded
			so the error message is automatically displayed in the right messages layer */
			+ ((cause == "smiles_load_error" || cause == "clean_fail" || cause == "resolve_fail") ? "" : "sketcher-messages model-messages"));
		
		$(".message-btn").show();
		$(".process-img, .alert-img").hide();
		$(".alert-img").show();
		
		if(cause == "sketcher_no_biomolecules" || cause == "crystal_2d_fail")
		{
			$("#sketcher-messages .message-text").html(Messages[cause]);
			$("#content").addClass("sketcher-messages");
		}
		else if(cause == "no_webgl_support" || cause == "no_glmol_crystals")
		{
			$("#model-messages .message-text").html(Messages[cause]);
			$("#content").addClass("model-messages");
		}
		else if(cause == "cir_down" || cause == "cir_func_down" || cause == "no_canvas_support" || cause == "search_fail" || cause == "load_fail"  || cause == "mobile_old_no_biomolecules")
		{
			$("#content-messages .message-text").html(Messages[cause]);
			$("#content").addClass("content-messages");
			
			if(cause == "no_canvas_support") $(".message-btn").hide();
		}
		else if(cause == "smiles_load_error" || cause == "clean_fail" || cause == "resolve_fail")
		{
			if(error) $("#sketcher-messages .message-text, #model-messages .message-text, #content-messages .message-text").html(Messages[cause] + " <small>" + (error.message || error.detailMessage || error) + "</small>");
			else $("#sketcher-messages .message-text, #model-messages .message-text, #content-messages .message-text").html(Messages[cause]);
		}
		else if(cause == "smiles_load_error_force")
		{
			if(error) $("#content-messages .message-text").html(Messages[cause] + " <small>" + (error.message || error.detailMessage || error) + "</small>");
			$("#content").addClass("content-messages");
		}
		
		Progress.alert();
	},
	
	hide: function()
	{
		$("#start-messages-close").hide();
		$("body").removeClass("progress-cursor");
		$("#content").removeClass("start-messages sketcher-messages model-messages content-messages");
	},
};
