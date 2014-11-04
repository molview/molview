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
 * Initialize MolPad in the given container
 * @param {DOMElement} container
 */
function MolPad(container, devicePixelRatio)
{
	this.molecule = {
		atoms: [],
		bonds: []
	};

	this.tool = {
		handler: this.selectionToolHandler
	};

	this.settings = {
		layoutRelative: true,//TODO: flexlayout: lines always >= 1px and text >= 10pt
		zoomSpeed: 0.2,
		minZoom: 0.01,
		removeImplicitHydrogen: true,
		drawSkeletonFormula: false,
		relativePadding: 0.15,
		bondLength: 80,
		bondColor: "#000000",
		bondWidth: 1,
		bondLineCap: "round",
		atomLabel: {
			fontStyle: "bold",
			fontFamily: "'Open Sans', serif",
			fontSize: 12
		}
	};

	this.matrix = [ 1, 0, 0, 1, 0, 0 ];
	this.devicePixelRatio = devicePixelRatio || 1;

	this.pointer = {
		old: { x: 0, y: 0 },//old pointer position
		oldc: { x: 0, y: 0 },//old pointer center
		drag: false
	};

	this.container = jQuery(container);
	this.offset = this.container.offset();
	this.canvas = document.createElement("canvas");

	this.canvas.width = this.container.width() * this.devicePixelRatio;
	this.canvas.height = this.container.height() * this.devicePixelRatio;
	this.canvas.style.width = this.container.width() + "px";
	this.canvas.style.height = this.container.height() + "px";

	container.appendChild(this.canvas);
	this.ctx = this.canvas.getContext("2d");

	var scope = this;

	/**
	 * Event basics
	 * - pointerdown: start action
	 * - pointermove: execute action
	 * - pointerup: finish action
	 * - multipointer: dismiss action and start multitouch action
	 * - multipointer => single pointer: translate
	 */

	jQuery(container).on('DOMMouseScroll mousewheel', function(e)
	{
		e.preventDefault();

		if(e.originalEvent.detail)
		{
			scope.onScroll(e.originalEvent.detail / 3, e);
		}
		else if(e.originalEvent.wheelDelta)
		{
			scope.onScroll(e.originalEvent.wheelDelta / 120);
		}
	});

	jQuery(container).on("mousedown touchstart", function(e)
	{
		scope.onPointerDown(e);
	});

	jQuery(window).on("mousemove touchmove", function(e)
	{
		scope.onPointerMove(e);
	});

	jQuery(window).on("mouseup touchend touchcancel", function(e)
	{
		scope.onPointerUp(e);
	});
}

/**
 * Basic MolPad API
 */

MolPad.prototype.setTool = function(type, data)
{

}

MolPad.prototype.onChange = function(cb)
{

}

MolPad.prototype.removeImplicitHydrogen = function()
{

}
