/**
 * This file is part of MolView (https://molview.org)
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

/**
 * Share/embed dialog wrapper
 * @type {Object}
 */
var Link = {
	embedHTML: "",

	init: function()
	{
		$("#embed-width, #embed-height").on("keyup", this.updateEmbedDialog);
	},

	updateShareDialog: function()
	{
		if(!$("#resolve").hasClass("resolve-updated") && MolView.layout != "model") $("#share-2d-not-3d").show();
		else $("#share-2d-not-3d").hide();

		var url = window.location.origin + window.location.pathname;
		var msg = "";

		if(Loader.lastQuery.type !== "")
		{
			msg = "Cool structure on MolView!";
			url += "?" + Loader.lastQuery.type + "=" + specialEncodeURIComponent(Loader.lastQuery.content.replace(/^ /, ""));
		}

		$("#share-link").val(url);
		$("#share-dialog .social").share({ all: url }, false, msg);
	},

	updateEmbedDialog: function()
	{
		if(!$("#resolve").hasClass("resolve-updated") && MolView.layout != "model") $("#embed-2d-not-3d").show();
		else $("#embed-2d-not-3d").hide();

		var url = window.location.origin + window.location.pathname + "embed?mode=" + Model.representation;

		if(Loader.lastQuery.type !== "")
		{
			url += "&" + Loader.lastQuery.type + "=" + specialEncodeURIComponent(Loader.lastQuery.content.replace(/^ /, ""));
		}

		if(Model.bg.colorName != "black")
		{
			url += "&bg=" + Model.bg.colorName;
		}

		if(Model.chain.type == "ribbon" || Model.chain.type == "cylinders"
		|| Model.chain.type == "btube" || Model.chain.type == "ctrace")
		{
			url += "&chainType=" + Model.chain.type;
		}
		if(Model.chain.bonds)
		{
			if(Model.chain.type == "none")
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

		Link.embedHTML = '<iframe style="width: ' + $("#embed-width").val() + '; height: ' + $("#embed-height").val() + ';" frameborder="0" src="' + url + '"></iframe>';
		$("#embed-code").val(Link.embedHTML);
	}
};
