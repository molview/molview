/**
 * This file is part of MolView (http://molview.org)
 * Copyright (c) 2014-2023 Herman Bergwerf
 */

/**
 * MolView messages interface wrapper
 * @type {Object}
 */
var Messages = {
	//notifications
	cir_down: "The Chemical Identifier Resolver is offline, some functions might be unavailable.",
	cir_func_down: "This function is unavailable because the Chemical Identifier Resolver is offline.",
	crystal_2d_unreliable: "The structural formula might not fully represent the crystal structure",
	resolved_3d_unreliable: 'The resolved 3D structure can sometimes be inaccurate <a href="http://blog.molview.org/2016/10/10/issues-in-3d-resolving/" target="_blank">Read more</a>',
	calculation_unreliable: "Calculation results can be inaccurate or wrong.",
	measurements_unreliable: "Measurement results can be inaccurate or wrong.",

	//progress
	switch_engine: "Loading engine&hellip;",
	compound: "Loading compound&hellip;",
	macromolecule: "Loading macromolecule&hellip;",
	crystal: "Loading crystal&hellip;",
	crystal_structure: "Loading crystal structure&hellip;",
	search: "Searching&hellip;",
	clean: "Cleaning&hellip;",
	resolve: "Updating&hellip;",
	model_update: "Updating&hellip;",
	init_jmol: "Initializing Jmol&hellip;",
	jmol_calculation: "Calculation in progress&hellip;",

	//support
	no_webgl_support: Detector.getWebGLErrorMessage(),
	mobile_old_no_macromolecules: "Macromolecules cannot be viewed on your device",
	no_glmol_crystals: "You cannot view crystals using GLmol",
	glmol_and_jmol_only: "This feature is only available in GLmol and Jmol",
	glmol_only: "This feature is only available in GLmol",
	no_jmol_chain_type: "The current chain representation is not supported by Jmol",
	no_chemdoodle_chain_type: "The current chain representation is not supported by ChemDoodle",
	no_chemdoodle_chain_color: "The current chain representation is not supported by ChemDoodle",

	//fails
	smiles_load_error: "Failed to load structure from sketcher",
	smiles_load_error_force: "Failed to load structure from sketcher",
	load_fail: "Failed to load structure from its database",
	search_fail: "The database did not return any records",
	search_notfound: "The database could not find any matches",
	structure_search_fail: "Structure search has failed",
	remote_noreach: "Remote database is not reachable",
	crystal_2d_fail: "Failed to resolve a 2D representation of this crystal structure",
	no_protein: "The current 3D model is not a protein",

	permDismiss: [
		"crystal_2d_unreliable",
		"resolved_3d_unreliable",
		"calculation_unreliable",
		"measurements_unreliable"
	],

	/**
	 * Sets message with $id to be not shown again
	 * @param {String} id
	 */
	dontShowAgain: function(id)
	{
		Preferences.set("messages", id, true);
	},

	/**
	 * Displays progress message assosiated with $what and call $cb using a
	 * timeout in order to update the UI
	 * @param  {Function} cb
	 * @param  {String}   what
	 * @return {Boolean}  Indicates if process message is shown
	 */
	process: function(cb, what)
	{
		/*
		Valid strings for {what}
		- switch_engine
		- compound
		- macromolecule
		- crystal
		- crystal_cell
		- search
		- clean
		- resolve
		- init_jmol
		- jmol_calculation
		- model_update
		*/

		var ret = true;

		//Do not replace the current message (if present) with model_update
		if(!(what === "model_update" && !Messages.isEmpty()))
		{
			Messages.clear();

			if(what && what !== "" && Messages[what] && Messages[what] !== "")
			{
				$("body").addClass("progress-cursor");

				var msg =  $("<div/>").addClass("message");
				$("<div/>").addClass("message-text")
					.html(Messages[what])
					.appendTo(msg);
				msg.appendTo($("#messages"));
			}
		}
		else
		{
			ret = false;
		}

		window.setTimeout(cb, 300);//delay in order to update screen
		return ret;
	},

	/**
	 * Displays alert or error message assosiated with $cause and appends
	 * $error if defined
	 * @param {String} cause
	 * @param {String} error
	 */
	alert: function(cause, error)
	{
		/*
		Valid strings for {cause}
		- cir_down
		- cir_func_down
		- crystal_2d_unreliable
		- resolved_3d_unreliable

		- no_canvas_support
		- no_webgl_support
		- no_glmol_crystals
		- glmol_and_jmol_only
		- glmol_only
		- no_jmol_chain_type
		- no_chemdoodle_chain_type
		- no_chemdoodle_chain_color

		- smiles_load_error
		- smiles_load_error_force
		- load_fail
		- search_fail
		- search_notfound
		- remote_noreach
		- crystal_2d_fail
		- no_protein
		*/

		if(cause === "no_canvas_support")
		{
			window.location = window.location.origin + window.location.pathname + "htmlCanvas";
			return;
		}

		$("body").removeClass("progress-cursor");

		if(!Preferences.get("messages", cause, false))
		{
			var msg =  $("<div/>").addClass("message alert-message");
			var text = $("<div/>").addClass("message-text").html(Messages[cause] || cause);

			if(error)
			{
				text.append('<span class="error-message">' +
						(error.message || error.detailMessage || error) + "</span>");
			}

			text.appendTo(msg);

			$('<button class="message-close-btn">OK</button>').on(MolView.trigger,
					function(){ $(this).parent().remove(); }).appendTo(msg);

			if(Messages.permDismiss.indexOf(cause) !== -1)
			{
				$('<button class="message-close-btn">Don\'t show again</button>').on(MolView.trigger,
						function(){ $(this).parent().remove(); Messages.dontShowAgain(cause); }).appendTo(msg);
			}

			msg.appendTo($("#messages"));
		}

		this.clear();
		Progress.complete();
	},

	/**
	 * Clears all messages which are no longer necessary
	 * @param {Boolean} byUser Indicates if the clear method is triggered by the user
	 */
	clear: function(byUser)
	{
		$("body").removeClass("progress-cursor");

		$("#messages").children().each(function()
		{
			if(!$(this).hasClass("alert-message"))
			{
				$(this).remove();
			}
		});
	},

	isEmpty: function()
	{
		return $("#messages").is(':empty');
	},

	size: function()
	{
		return $("#messages .message").length;
	}
};
