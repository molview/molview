/**
 * This file is part of MolView (http://molview.org)
 * Copyright (c) 2014-2023 Herman Bergwerf
 */

/**
 * Embed dialog wrapper
 * @type {Object}
 */
var Link = {
	embedHTML: "",

	init: function()
	{
		$("#embed-width, #embed-height").on("keyup", this.updateEmbedDialog);
	},

	updateEmbedDialog: function()
	{
		if($("#action-resolve").hasClass("resolve-outdated") && MolView.layout !== "model") $("#embed-2d-not-3d").show();
		else $("#embed-2d-not-3d").hide();

		var url = "https://embed.molview.org/v1/?mode=" + Model.representation;

		if(oneOf(Loader.lastQuery.type, ["smiles", "cid", "pdbid", "codid"]))
		{
			url += "&" + Loader.lastQuery.type + "=" + specialEncodeURIComponent(Loader.lastQuery.content.replace(/^ /, ""));
		}

		if(Model.bg.colorName !== "black")
		{
			url += "&bg=" + Model.bg.colorName;
		}

		if(Model.isPDB())
		{
			if(Model.chain.type === "ribbon" || Model.chain.type === "cylinders"
			|| Model.chain.type === "btube" || Model.chain.type === "ctrace")
			{
				url += "&chainType=" + Model.chain.type;
			}
			if(Model.chain.bonds)
			{
				if(Model.chain.type === "none")
				{
					url += "&chainType=bonds";
				}
				else
				{
					url += "&chainBonds=true"
				}
			}
			if(Model.chain.color)
			{
				url += "&chainColor=" + Model.chain.color;
			}
		}

		Link.embedHTML = '<iframe style="width: ' + $("#embed-width").val() + '; height: ' + $("#embed-height").val() + ';" frameborder="0" src="' + url + '"></iframe>';
		$("#embed-code").val(Link.embedHTML);
		$("#embed-url").val(url);
	}
};
