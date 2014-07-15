/*!
MolView v2.2 (http://molview.org)
Copyright (c) 2014, Herman Bergwerf
ALL RIGHTS RESERVED
*/

var History = {
	init: function()
	{
		window.addEventListener('popstate', function(event)
		{
			var q = getQuery();
			if(JSON.stringify(q) != JSON.stringify(MolView.query))
			{
				document.title = "MolView";
				MolView.query = q;
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
