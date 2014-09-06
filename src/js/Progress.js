/**
 * This file is part of MolView (http://molview.org)
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

var Progress = {
	value: 0.0,//0.0 - 1.0
	steps: 0,
	bar: undefined,
	part: undefined,

	init: function()
	{
		this.bar = $("#progress");
		this.part = $("#progress > .progress-part");
	},

	setValue: function(val)
	{
		if(this.steps == 0) return;
		if(val > 1) val = 1;
		//var delta = val - this.value;
		this.value = val;
		this.part.stop().animate({"width": "" + (this.value * 100) + "%"}, 800, "swing");
	},

	clear: function()
	{
		this.value = 0;
		this.part.stop().css({ "width": 0, "opacity": 1 });
	},

	add: function(val)
	{
		this.setValue(this.value + val);
	},

	setSteps: function(s)
	{
		this.steps = s + 1;
		this.increment();
		document.title = document.title.replace(/ \[loading\]/g, "");
		document.title += " [loading]";
	},

	increment: function()
	{
		this.add(1.0 / this.steps);
	},

	hide: function()
	{
		Progress.part.animate({
			"opacity": 0
		}, 1000, "swing", function()
		{
			Progress.part.css("width", 0);
		});
	},

	alert: function()
	{
		document.title = document.title.replace(/ \[loading\]/g, "");
	},

	complete: function()
	{
		this.setValue(1);
		this.hide();
		document.title = document.title.replace(/ \[loading\]/g, "");
	}
};
