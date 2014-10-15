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

var Progress = {
	value: 0.0,
	steps: 0,
	opacity: 0.0,
	ready: true,

	animatedValue: 0.0,
	canvas: undefined,
	ctx: undefined,
	oldTime: 0,

	init: function()
	{
		this.canvas = document.getElementById("progress-canvas");
		if(this.canvas)
		{
			this.resize();
		}
	},

	resize: function()
	{
		if(Progress.canvas)
		{
			Progress.canvas.width = $(window).width();
			Progress.canvas.height = 3;
			Progress.ctx = Progress.canvas.getContext("2d");
		}
	},

	draw: function()
	{
    	if(Progress.canvas)
		{
			if(!(Progress.ready && Progress.opacity <= 0))
			{
				var delta = (new Date().getTime()) - Progress.oldTime;
				if(delta == 0) delta = 40;
				window.setTimeout(function()
				{
					requestAnimationFrame(Progress.draw);
				}, 40);

				if(Progress.ready)
				{
					Progress.opacity -= 1 / delta;
				}

				Progress.ctx.clearRect(0, 0, Progress.canvas.width, Progress.canvas.height);
				Progress.animatedValue += (Progress.value - Progress.animatedValue) / delta * 10;

				Progress.ctx.fillStyle = "rgba(255,0,0," + Progress.opacity + ")";
				Progress.ctx.fillRect(0, 0, Progress.canvas.width * Progress.animatedValue, Progress.canvas.height);

				Progress.oldTime = new Date().getTime();
			}
		}
	},

	reset: function(steps)
	{
		this.value = this.animatedValue = 0;
		this.steps = steps + 1;
		this.increment();
		this.opacity = 1;
		this.ready = false;

		document.title = document.title.replace(/ \[loading\]/g, "");
		document.title += " [loading]";
		this.oldTime = new Date().getTime();
		this.draw();
	},

	increment: function()
	{
		this.value += 1.0 / this.steps;
	},

	complete: function()
	{
		this.value = 1;
		this.ready = true;
		document.title = document.title.replace(/ \[loading\]/g, "");
	}
};
