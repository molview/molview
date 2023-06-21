/**
 * This file is part of MolView (http://molview.org)
 * Copyright (c) 2014-2023 Herman Bergwerf
 */

/**
 * Wrapper for the History API
 * This object is mainly used in Loader.js
 * @type {Object}
 */
var History = {
	/**
	 * Initialize History API
	 */
	init: function()
	{
		window.addEventListener('popstate', function(event)
		{
			var q = getQuery();
			if(JSON.stringify(q) !== JSON.stringify(MolView.query))
			{
				document.title = "MolView";
				MolView.query = q;
				MolView.executeQuery();
			}
		});
	},

	/**
	 * Push new URL into web History
	 * This URL only contains one parameter
	 * @param  {String}  key          Parameter key
	 * @param  {String}  value        Parameter value
	 * @param  {Boolean} forceReplace Force usage of replaceState
	 */
	push: function(id, value, forceReplace)
	{
		value = "" + value;
		MolView.query = {};
		MolView.query[id] = value;
		var query = id + "=" + specialEncodeURIComponent(value.replace(/^ /, ""));

		if(history && history.replaceState && history.pushState &&
				location.search.indexOf(query) === -1)
		{
			if(location.search === "" || forceReplace)
			{
				history.replaceState(null, document.title, "?" + query);
			}
			else
			{
				history.pushState(null, document.title, "?" + query);
			}
		}
	}
}
