/*!
MolView v2.2 (http://molview.org)
Copyright (c) 2014, Herman Bergwerf
ALL RIGHTS RESERVED
*/
"use strict";

$.fn.swipeable = function()
{
	var threshold = 10;
	var parent = this;
	var inner = this.children(".inner");
	var ox = 0, sx = 0;
	var left = 0;
	var hold = false;
	
	function resize()
	{
	}
	
	function down(e, x, y)
	{
		console.log("Swipeable down");
		//e.preventDefault();
		ox = sx = x;
		hold = true;
	}
	
	function drag(e, x, y)
	{
		if(hold)
		{
			e.preventDefault();
			left += x - ox;
			inner.css("left", left);
			ox = x;
			console.log("Swipeable drag", left);
		}
	}
	
	function up(e, x, y)
	{
		console.log("Swipeable up");
		if(Math.abs(left - sx) > threshold)
			e.preventDefault();
		hold = false;
	}
	
    $(window).on("resize", resize);
	if(isTouchDevice())
	{
		this.on("touchstart", function(e)
		{
			down(e, e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY)
		});
		$(window).on("touchend", function(e)
		{
			up(e, e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY)
		});
		$(window).on("touchmove", function(e)
		{
			drag(e, e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY)
		});
		$(window).on("touchcancel", function(e)
		{
			up(e, e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY)
		});
	}
	else
	{
		this.on("mousedown", function(e)
		{
			console.log(e);
			down(e, e.pageX, e.pageY);
		});
		$(window).on("mousemove", function(e)
		{
			drag(e, e.pageX, e.pageY);
		});
		$(window).on("mouseup", function(e)
		{
			up(e, e.pageX, e.pageY);
		});
	}
};
