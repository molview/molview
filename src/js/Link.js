/*!
MolView v2.1 (http://molview.org)
Copyright (c) 2014, Herman Bergwerf
ALL RIGHTS RESERVED
*/
"use strict";

var Link = {
	embedHTML: "",
	
	init: function()
	{
		$("#embed-width, #embed-height").on("keyup", this.updateEmbedDialog);
	},
	
	updateShareDialog: function()
	{
		if(!$("#resolve").hasClass("updated") && MolView.layout != "model") $("#share-2d-not-3d").show();
		else $("#share-2d-not-3d").hide();
		
		var url = window.location.origin + window.location.pathname + "?mode=" + Model.representation;
		var msg = "";
		
		if(Loader.lastQuery.type !== "")
		{
			msg = "Cool structure on MolView!";
			url += "&" + Loader.lastQuery.type + "=" + specialEncodeURIComponent(Loader.lastQuery.content.replace(/^ /, ""));
		}
		if((MolView.layout == "sketcher" || MolView.layout == "model") && Model.data.current != "PDB")
		{
			url += "&layout=" + MolView.layout;
		}
		
		$("#share-link").val(url);
		$("#share-dialog .social").share({ all: url }, false, msg);
	},
	
	updateEmbedDialog: function()
	{
		if(!$("#resolve").hasClass("updated") && MolView.layout != "model") $("#share-2d-not-3d").show();
		else $("#share-2d-not-3d").hide();
		
		var url = window.location.origin + window.location.pathname + "embed/?mode=" + Model.representation;
		
		if(Loader.lastQuery.type !== "")
		{
			url += "&" + Loader.lastQuery.type + "=" + specialEncodeURIComponent(Loader.lastQuery.content.replace(/^ /, ""));
		}
		
		Link.embedHTML = '<iframe style="width: ' + $("#embed-width").val() + '; height: ' + $("#embed-height").val() + ';" frameborder="0" src="' + url + '"></iframe>';
		$("#embed-code").val(Link.embedHTML);
	}
};
