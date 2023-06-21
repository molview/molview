/**
 * This file is part of MolView (http://molview.org)
 * Copyright (c) 2014-2023 Herman Bergwerf
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
				if(SearchGrid.db === "pubchem") Actions.load_more_pubchem();
				else if(SearchGrid.db === "rcsb") Actions.load_more_rcsb();
				else if(SearchGrid.db === "cod") Actions.load_more_cod();
			}
		});
	},

	/**
	 * Remove all entries from the SearchGrid
	 */
	clear: function()
	{
		$("#search-layer").scrollTop();
		$("#search-layer .container").empty().css("margin-bottom", 0);
	},

	/**
	 * Sets content database
	 * @param {String} db Database identifier
	 */
	setDatabase: function(db)
	{
		this.db = db;
		$("#action-load-more-pubchem").css("display", db === "pubchem" ? "block" : "none");
		$("#action-load-more-rcsb").css("display", db === "rcsb" ? "block" : "none");
		$("#action-load-more-cod").css("display", db === "cod" ? "block" : "none");
	},

	/**
	 * Starts loadNextSet session
	 */
	startLoading: function()
	{
		$("#action-load-more-" + this.db).addClass("load-more-progress");
	},

	/**
	 * End loadNextSet session
	 * @param {Boolean} last Indicates if this is the last set
	 */
	endLoading: function(last)
	{
		if(last)
		{
			$(".load-more").css("display", "none");
			$("#search-layer .container").css("margin-bottom", 100);
		}
		else
		{
			$("#action-load-more-" + this.db).removeClass("load-more-progress");
		}
	},

	/**
	 * Add search grid entry based on the current SearchGrid.db
	 * @param {Object} data Raw entry data
	 */
	addEntry: function(data)
	{
		if(this.db === "pubchem")
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

			var wrap = $('<div class="search-result-img-wrap"></div>');
			var img = new Image();
			img.onload = function(){ wrap.css("background-image", "none") }
			img.src = Request.PubChem.image(data.CID, result.width());
			$("<div class='search-result-img'></div>")
				.css("background-image", "url(" + img.src + ")")
				.css("-webkit-filter", "url('#pubchemImageFilter')")
				.css("-moz-filter", "url('#pubchemImageFilter')")
				.css("-ms-filter", "url('#pubchemImageFilter')")
				.css("-o-filter", "url('#pubchemImageFilter')")
				.css("filter", "url('#pubchemImageFilter')")
				.height(result.width())
				.appendTo(wrap.appendTo(result));

			result.data("cid", data.CID);
			result.data("title", ucfirst(humanize(data.Title)));
			result.on("click", function(e)
			{
				if(e.which !== 2)
				{
					MolView.pushEvent("button", "click", "pubchem search", 0);
					MolView.setLayer("main");
					Loader.PubChem.loadCID($(this).data("cid"), $(this).data("title"));
					return false;
				}
			});
		}
		else if(this.db === "rcsb")
		{
			/*
			Search output:
			<div class="search-result">
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

			var w = 500 / MolView.devicePixelRatio;
			var wrap = $('<div class="search-result-img-wrap"></div>');
			var img = new Image();
			img.onload = function(){ wrap.css("background-image", "none") }
			img.src = Request.RCSB.image(data.structureId);
			$('<div class="search-result-img"></div>')
				.css("background-image", "url(" + img.src + ")")
				.css("background-size", w > 250 ? 250 : w)
				.height(result.width())
				.appendTo(wrap.appendTo(result));

			var desc = $('<div class="search-result-description">' + ucfirst(humanize(data.structureTitle)) + "</div>");
			result.append(desc);

			title.data("pdbid", data.structureId);
			title.on("click", function(e)
			{
				if(e.which !== 2)
				{
					MolView.pushEvent("button", "click", "rcsb search", 0);
					MolView.setLayer("main");
					Loader.RCSB.loadPDBID($(this).data("pdbid"));
					return false;
				}
			});
		}
		else if(this.db === "cod")
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
				if(e.which !== 2)
				{
					MolView.pushEvent("button", "click", "cod search", 0);
					MolView.setLayer("main");
					Loader.COD.loadCODID($(this).data("codid"), $(this).data("title"));
					return false;
				}
			});
		}
	}
}
