/**
 * This file is part of MolView (http://molview.org)
 * Copyright (c) 2014-2023 Herman Bergwerf
 */

/**
 * Progress bar wrapper
 * @type {Object}
 */
var Progress = {
	/**
	 * Progress value from 0.0 to 1.0
	 * @type {Float}
	 */
	value: 0.0,

	/**
	 * Progress steps, used to increment Progress
	 * @type {Integer}
	 */
	steps: 0,

	/**
	 * Time in milis in the previous redraw
	 * Used to animate the Progress bar
	 * @type {Float}
	 */
	oldTime: 0.0,

	/**
	 * Progress bar animated value from 0.0 to 1.0
	 * Used for Progress bar increment animation
	 * @type {Number}
	 */
	animValue: 0.0,

	/**
	 * Delta value divider per second
	 * 2.0s: animValue += (value - animValue) / (valueAnimSpeed / 1.0)
	 * 1.0s: animValue += (value - animValue) / (valueAnimSpeed / 1.0)
	 * 0.5s: animValue += (value - animValue) / (valueAnimSpeed / 0.5)
	 * 0.1s: animValue += (value - animValue) / (valueAnimSpeed / 0.1)
	 * @type {Float}
	 */
	valueAnimDev: 0.2,

	/**
	* Progress bar opacity, used for fade-out animation
	* @type {Float}
	*/
	opacity: 0.0,

	/**
	 * Ammount of opacity to animate in 1 second
	 * @type {Float}
	 */
	opacityAnimSpeed: 1.0,

	/**
	 * Indicates if Progress is ready and the fade-out animation can start
	 * @type {Boolean}
	 */
	ready: true,

	/**
	 * Indicates if all Progress bar animations are ready
	 * @type {Boolean}
	 */
	animReady: true,

	/**
	 * Indicates if the Progress bar anmiation values should be reset in the
	 * next redraw
	 * @type {Boolean}
	 */
	resetAnim: false,

	/**
	 * Reference to the Progress bar DOM canvas element
	 * @type {HTMLCanvasElement}
	 */
	canvas: undefined,

	/**
	 * Reference to the Progress.canvas 2D context
	 * @type {CanvasRenderingContext2D}
	 */
	ctx: undefined,

	/**
	 * Initializes the Progress bar
	 * Fires redraw cycle
	 */
	init: function()
	{
		this.canvas = document.getElementById("progress-canvas");

		if(this.canvas)
		{
			this.ctx = this.canvas.getContext('2d');
			this.resize();
			this.draw();
		}
	},

	/**
	 * Resizes Progress.canvas to fit the new window.width
	 * Resets Progress.ctx
	 */
	resize: function()
	{
		if(Progress.canvas)
		{
			Progress.canvas.width = $(window).width();
			Progress.canvas.height = 3;
		}
	},

	/**
	 * Redraws Progress bar if Progress.canvas is defined
	 * Reset animation values if Progress.resetAnim
	 * @param {Float} time Unix time
	 */
	draw: function(time)
	{
    	if(Progress.canvas)
		{
			if(Progress.resetAnim)
			{
				Progress.resetAnim = false;
				Progress.animReady = false;
				Progress.oldTime = time;
				Progress.animValue = 0;
				Progress.opacity = 1;
				Progress.ctx.clearRect(0, 0, Progress.canvas.width, Progress.canvas.height);
			}

			if(!Progress.animReady)
			{
				var delta = ((time - Progress.oldTime) / 1000) || 0.001;
				if(delta > 0.1) delta = 0.1;//clamp animation speed
				Progress.oldTime = time;
				Progress.animValue += (Progress.value - Progress.animValue) / (Progress.valueAnimDev / delta);
				if(Progress.animValue > Progress.value) Progress.animValue = Progress.value;

				Progress.ctx.beginPath();

				if(Progress.ready)
				{
					Progress.opacity -= Progress.opacityAnimSpeed * delta;
					Progress.ctx.clearRect(0, 0, Progress.canvas.width, Progress.canvas.height);

					if(Progress.opacity <= 0)
					{
						Progress.animReady = true;
					}
					else
					{
						Progress.ctx.fillStyle = "rgba(255,0,0," + Progress.opacity + ")";
						Progress.ctx.fillRect(0, 0, Progress.canvas.width * Progress.animValue, Progress.canvas.height);
					}
				}
				else
				{
					Progress.ctx.fillStyle = "rgb(255,0,0)";
					Progress.ctx.fillRect(0, 0, Progress.canvas.width * Progress.animValue, Progress.canvas.height);
				}
			}

			requestAnimationFrame(Progress.draw);
		}
	},

	/**
	 * Reset Progress bar and increment one step
	 * @param {Integer} steps       New ammount of increment steps
	 * @param {Boolean} retainTitle Do not add " [loading]" to document.title
	 */
	reset: function(steps, retainTitle)
	{
		this.steps = steps + 1;
		this.value = 0;
		this.increment();
		this.ready = false;

		if(!retainTitle)
		{
			document.title = document.title.replace(/ \[loading\]/g, "");
			document.title += " [loading]";
		}

		this.resetAnim = true;
	},

	/**
	 * Increment Progress bar one step
	 */
	increment: function()
	{
		this.value += 1.0 / this.steps;
	},

	/**
	 * Complete Progress bar animation
	 */
	complete: function()
	{
		this.value = 1;
		this.ready = true;
		document.title = document.title.replace(/ \[loading\]/g, "");
	}
};
