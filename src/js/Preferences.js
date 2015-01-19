/**
 * This file is part of MolView (http://molview.org)
 * Copyright (c) 2014, 2015 Herman Bergwerf
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
	init: function()
	{
		if(Storage === undefined)
		{
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
	get: function(mod, key, def)
	{
		var val = window.localStorage[mod + "." + key];
		if(val === "true") return true;
		else if(val === "false") return false;
		else return val || def;
	},

	/**
	 * Set value for Preferences key in specified module
	 * @param  {String}         mod Module name (should be lowercase)
	 * @param  {String}         key Key name (should be lowercase)
	 * @param  {Boolean|String} val Value for key in module
	 */
	set: function(mod, key, val)
	{
		window.localStorage[mod + "." + key] = val;
	}
};
