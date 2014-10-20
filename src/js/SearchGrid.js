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
 * MolView search results layer wrapper
 * @type {Object}
 */
var SearchGrid = {
    db: "",//pubchem, rcsb, cod

    /**
     * Initializes SearchGrid
     */
    init: function()
    {
        $("#search-layer").on("scroll", function(e)
		{
			if($("#search-layer").scrollTop() + $("#search-layer").outerHeight()
					> $("#search-layer > .container").outerHeight())
			{
				if(SearchGrid.db == "pubchem") Actions.load_more_pubchem();
				else if(SearchGrid.db == "rcsb") Actions.load_more_rcsb();
				else if(SearchGrid.db == "cod") Actions.load_more_cod();
			}
		});
    },

    /**
     * Remove all entries from the SearchGrid
     */
    clear: function()
    {
		$("#search-layer .container").empty();
    },

    /**
     * Sets content database
     * @param {String} db Database identifier
     */
    setDatabase: function(db)
    {
        this.db = db;
		$("#load-more-pubchem").css("display", db == "pubchem" ? "block" : "none");
		$("#load-more-rcsb").css("display", db == "rcsb" ? "block" : "none");
		$("#load-more-cod").css("display", db == "cod" ? "block" : "none");
    },

    /**
     * Add search grid entry based on the current SearchGrid.db
     * @param {Object} data Raw entry data
     */
    addEntry: function(data)
    {
        if(this.db == "pubchem")
        {
			/*
			Search output:
			<div class="search-result">
				<div class="search-result-title"><span>Name</span></div>
				<div class="search-result-img-wrap><div class="search-result-img" style="background-image: url(image.png)"/></div>
			</div>
			*/

            if(!data.CID) return;

			var result = $('<a class="search-result search-result-pubchem"></a>')
					.attr("href", "?cid=" + data.CID)
                    .appendTo("#search-layer .container");

            if(data.Title)
            {
                var title = $('<div class="search-result-title"><span>' + ucfirst(humanize(data.Title)) + "</span></div>");
                result.append(title);
                title.textfill({ maxFontPoints: 26 });
            }

			$("<div class='search-result-img'></div>").css("background-image",
				"url(" + Request.PubChem.image(data.CID) + ")")
				.appendTo($('<div class="search-result-img-wrap"></div>').appendTo(result));

			result.data("cid", data.CID);
			result.data("title", ucfirst(humanize(data.Title)));
			result.on("click", function(e)
			{
				if(e.which != 2)
				{
					MolView.setLayer("main");
					Loader.PubChem.loadCID($(this).data("cid"), $(this).data("title"));
                    return false;
				}
			});
        }
        else if(this.db == "rcsb")
        {
            /*
			Search output:
			<div class="search-result search-result-imgdesc">
				<div class="search-result-description">structureTitle</div>
				<div class="search-result-title"><span>structureId</span></div>
				<div class="search-result-img-wrap><div class="search-result-img" style="background-image: url(image.png)"/></div>
			</div>
			*/

            if(!data.structureId || !data.structureTitle) return;

			var result = $('<div class="search-result"></div>').appendTo("#search-layer .container");

            var title = $('<a class="search-result-title"><span>' + data.structureId + "</span></a>")
                    .attr("href", "?pdbid=" + data.structureId);;
            result.append(title);
            title.textfill({ maxFontPoints: 26 });

			var img = $('<div class="search-result-img"></div>').css("background-image",
				"url(" + Request.RCSB.image(data.structureId) + ")");
			img.appendTo($('<div class="search-result-img-wrap"></div>').appendTo(result));

			var desc = $('<div class="search-result-description">' + ucfirst(humanize(data.structureTitle)) + "</div>");
			result.append(desc);

			title.data("pdbid", data.structureId);
			title.on("click", function(e)
			{
				if(e.which != 2)
				{
					MolView.setLayer("main");
					Loader.RCSB.loadPDBID($(this).data("pdbid"));
                    return false;
				}
			});
        }
        else if(this.db == "cod")
        {
            /*
			Search output:
			<div class="search-result">
				<div class="search-result-title"><span>title</span></div>
				<div class="search-result-description">description</div>
                <div class="search-result-codid">codid</div>
			</div>
			*/

            if(!data.codid) return;

			var result = $('<div class="search-result"></div>').appendTo("#search-layer .container");

			data.formula = formatMFormula(data.formula);
			var title_str = (data.mineral || data.commonname || data.chemname
					|| data.formula || data.codid);

			var title = $('<a class="search-result-title"><span>' + title_str + "</span></a>")
					.attr("href", "?codid=" + data.codid);
			result.append(title);
			title.textfill({ maxFontPoints: 26 });

            $('<div class="search-result-codid">' + data.codid + '</div>').appendTo(result);

			var desc = $('<div class="search-result-description search-result-description-cod"></div>').appendTo(result);

            if(data.title)
            {
                $('<div class="expandable"><div class="expandable-title"><span>Details</span></div><div class="expandable-content">'
                        + formatHTMLLinks(formatMFormula(data.title)) + "</div></div>")
                        .appendTo(desc).children(".expandable-title").on(MolView.trigger, function(e)
        		{
        			$(this).parent().toggleClass("open");
        		});
            }

            if(data.mineral) $('<p><b>Mineral name</b><br/><span>'
                    + data.mineral + "</span></p>").appendTo(desc);
            if(data.commonname) $('<p><b>Common name</b><br/><span>'
                    + data.commonname + "</span></p>").appendTo(desc);
            if(data.chemname) $('<p><b>Chemical name</b><br/><span>'
                    + data.chemname + "</span></p>").appendTo(desc);
            if(data.formula) $('<p><b>Molecular formula</b><br/><span>'
                    + formatMFormula(data.formula.replace(/-/g, "").replace(/\s/g, "")) + "</span></p>").appendTo(desc);

            title.data("codid", data.codid);
			title.data("title", title_str);
			title.on("click", function(e)
			{
				if(e.which != 2)
				{
					MolView.setLayer("main");
					Loader.COD.loadCODID($(this).data("codid"), $(this).data("title"));
                    return false;
				}
			});
        }
    }
}
