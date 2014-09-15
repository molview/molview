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

var Messages = {
	//notifications
	cir_down: "The Chemical Identifier Resolver is offline, some functions might be unavailable.",
	cir_func_down: "This function is unavailable because the Chemical Identifier Resolver is offline.",
	crystal_2d_unreliable: "This structural formula might not correspond to the crystal structure",

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
	no_canvas_support: "Your browser doesn't support this web application, try <a class='link' href='//google.com/chrome' title='A modern browser'>Google Chrome</a> instead.",
	sketcher_no_macromolecules: "Macromolecules cannot be displayed in the sketcher",
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
	load_fail: "Failed to load structure",
	search_fail: "Structure cannot be found",
	structure_search_fail: "Failed to execute structure search",
	resolve_fail: "Structure cannot be resolved",
	clean_fail: "Structure cannot be cleaned",
	crystal_2d_fail: "Failed to load a structural formula for this crystal structure",
	no_protein: "The current 3D model is not a protein",

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
		if(!(what == "model_update" && !Messages.isEmpty()))
		{
			Messages.clear();

			if(what && what != "" && Messages[what] && Messages[what] != "")
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

		- no_canvas_support
		- no_webgl_support
		- no_glmol_crystals
		- sketcher_no_macromolecules
		- glmol_and_jmol_only
		- glmol_only
		- no_jmol_chain_type
		- no_chemdoodle_chain_type
		- no_chemdoodle_chain_color

		- smiles_load_error
		- smiles_load_error_force
		- load_fail
		- search_fail
		- structure_search_fail
		- resolve_fail
		- clean_fail
		- crystal_2d_fail
		- no_protein
		*/

		//ignored causes
		if(cause == "sketcher_no_macromolecules") return;

		$("body").removeClass("progress-cursor");

		if(error)
		{
			var msg =  $("<div/>").addClass("message alert-message");
			$("<div/>").addClass("message-text")
				.html(Messages[cause])
				.append('<span class="error-message">' + (error.message || error.detailMessage || error) + "</span>")
				.appendTo(msg);
			$('<button class="message-close-btn">OK</button>').on(MolView.trigger,
				function(){ Progress.complete(); Messages.clear(true); }).appendTo(msg);
			msg.appendTo($("#messages"));
		}
		else
		{
			var msg =  $("<div/>").addClass("message alert-message");
			$("<div/>").addClass("message-text")
				.html(Messages[cause] || cause)
				.appendTo(msg);
			$('<button class="message-close-btn">OK</button>').on(MolView.trigger,
				function(){ Progress.complete(); Messages.clear(true); }).appendTo(msg);
			msg.appendTo($("#messages"));
		}

		Progress.alert();
	},

	/**
	 * Clears all messages
	 * @param {Boolean} byUser Indicates if the clear method is triggered by the user
	 */
	clear: function(byUser)
	{
		if(!$("#messages").children().hasClass("alert-message") || byUser)
		{
			$("#messages").empty();
			$("body").removeClass("progress-cursor");
		}
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
