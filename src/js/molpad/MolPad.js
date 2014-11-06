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
 * TODO: draw data caching
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
		defaultHandler: this.selectionToolHandler
	};

	this.settings = {
		fast: false,
		zoomSpeed: 0.2,
		minZoom: 0.01,
		removeImplicitHydrogen: true,
		drawSkeletonFormula: true,
		relativePadding: 0.15,
		bond: {
			active: {
				radius: 8,
				color: "#8f8",
				lineCap: "round"
			},
			hover: {
				radius: 8,
				color: "#bfb",
				lineCap: "round"
			},
			delta: [
				[],//no bond
				[0],//single bond
				[-3,3],//double bond
				[-4,0,4],//triple bond
				[-5,5]//wedge/hash bond
			],
			length: 55,
			color: "#111111",
			lineCap: "round",
			width: 1.5,//in px
			maxScale: 1.0,
			hashLineSpace: 2
		},
		atom: {
			active: {
				radius: 12,
				color: "#8f8",
				lineCap: "round"
			},
			hover: {
				radius: 12,
				color: "#bfb",
				lineCap: "round"
			},
			label: {
				fontStyle: "bold",
				fontFamily: "'Open Sans', serif",
				fontSize: 12,//in pt
			},
			radius: 10,//radius around atom center-line
			circleClamp: 15,//label width > circleClamp: atom center = line
			maxScale: 1 / 1.5//12 * 1 / 1.5 = 8
		},
		selection: {
			bg: "rgba(255, 85, 0, 0.5)"
		}
	};

	this.matrix = [ 1, 0, 0, 1, 0, 0 ];
	this.devicePixelRatio = devicePixelRatio || 1;

	this.pointer = {
		old: { x: 0, y: 0 },//old pointer position
		oldc: { x: 0, y: 0 },//old pointer center
		oldr: { x: 0, y: 0 },//old real pointer
		handler: undefined
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
	 *
	 * TODO: revise mouse events on touchscreen (touchgrabbing?)
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
		e.preventDefault();
		scope.onPointerDown(e);
	});

	jQuery(container).on("mousemove", function(e)
	{
		scope.onMouseMoveInContainer(e);
	});

	jQuery(container).on("mouseout", function(e)
	{
		scope.onMouseOut(e);
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

MolPad.prototype.forAllObjects = function(func)
{
	for(var i = 0; i < this.molecule.atoms.length; i++)
	{
		if(func.call(this, this.molecule.atoms[i])) return;
	}
	for(var i = 0; i < this.molecule.bonds.length; i++)
	{
		if(func.call(this, this.molecule.bonds[i])) return;
	}
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
