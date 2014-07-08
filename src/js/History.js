/*!
MolView v2.2 (http://molview.org)
Copyright (c) 2014, Herman Bergwerf
ALL RIGHTS RESERVED
*/
"use strict";

var History = {
	init: function()
	{
		window.addEventListener('popstate', function(event)
		{
			var q = getQuery();
			if(JSON.stringify(q) != JSON.stringify(MolView.query))
			{
				MolView.query = q
				MolView.executeQuery();
			}
		});
	},
	
	push: function(id, value)
	{
		value = "" + value;
		var query = id + "=" + specialEncodeURIComponent(value.replace(/^ /, ""));
		if(history && history.pushState && location.search.indexOf(query) == -1)
			history.pushState(null, document.title, "?" + query);
	}
}
