/**
 * This file is part of MolView (http://molview.org)
 * Copyright (c) 2014-2023 Herman Bergwerf
 */

/**
 * Stores user preferences using WebStorage
 *
 * Known Preferences:
 * - molview.theme
 * - sketcher.hstrip
 * - model.background
 * - messages.crystal_2d_unreliable
 *
 * @type {Object}
 */
var Preferences = {
	/**
	 * Initialize Preferences
	 */
	init: function () {
		if (Storage === undefined) {
			window.localStorage = {};
		}
	},

	/**
	 * Get value for Preferences key in specified module
	 * @param  {String}         mod Module name (should be lowercase)
	 * @param  {String}         key Key name (should be lowercase)
	 * @param  {Boolean|String} def Default value
	 * @return {Boolean|String}     Value for key in specified module
	 */
	get: function (mod, key, def) {
		// If we are in an embedded IFrame, this may cause permission issues.
		try {
			var val = window.localStorage[mod + "." + key];
			if (val === "true") return true;
			else if (val === "false") return false;
			else return val || def;
		} catch (e) {
			return def
		}
	},

	/**
	 * Set value for Preferences key in specified module
	 * @param  {String}         mod Module name (should be lowercase)
	 * @param  {String}         key Key name (should be lowercase)
	 * @param  {Boolean|String} val Value for key in module
	 */
	set: function (mod, key, val) {
		window.localStorage[mod + "." + key] = val;
	}
};
