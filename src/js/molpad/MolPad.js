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

/**
 * Initialize MolPad in the given container
 * TODO: larger touch targets on high DPI screens
 * TODO: rotate/move selection tool
 * TODO: delete selection on DEL
 * TODO: element/valence based handler actions
 * TODO: add implicit hydrogen as subset of MPAtom
 * TODO: collapse newly added implicit H atoms if !skeleton
 *
 * @param {DOMElement} container
 * @param {Float}      devicePixelRatio
 * @param {Object}     buttons
 */
function MolPad(container, devicePixelRatio, buttons)
{
	/**
	 * Settings
	 * @type {Object}
	 */
	this.settings = {
		maxStackSize: 100,
		zoomSpeed: 0.2,
		minZoom: 0.01,
		skeletonDisplay: true,
		relativePadding: 0.15,
		bond: {
			gradient: {
				from: 0.4,
				to: 0.6
			},
			hover: {
				color: "#bfb"
			},
			active: {
				color: "#8f8"
			},
			selected: {
				color: "#afa"
			},
			delta: [
				[],//no bond
				[0],//single bond
				[-3,3],//double bond
				[-4,0,4],//triple bond
				[-5,5]//wedge/hash bond
			],
			length: 55,
			lengthHydrogen: 34,
			radius: 8,
			color: "#111111",
			colored: true,
			lineCap: "round",
			lineJoin: "round",
			width: 1.5,//in px
			scale: 1,
			minScale: 1 / 1.5,
			minDeltaScale: 1 / 2.0,
			hashLineSpace: 2,
			rotateSteps: 360 / 30,//steps of 30deg, 360 / 30 = 12
			straightDev: Math.PI / 10
		},
		atom: {
			active: {
				color: "#8f8"
			},
			hover: {
				color: "#bfb"
			},
			label: {
				fontStyle: "bold",
				fontFamily: 'sans-serif',//"Open Sans", sans-serif
				fontSize: 12,//in pt
			},
			charge: {
				fontStyle: "bold",
				fontFamily: 'sans-serif',
				fontSize: 8,
				pad: 1
			},
			isotope: {
				fontStyle: "bold",
				fontFamily: 'sans-serif',
				fontSize: 8,
				pad: 1
			},
			scale: 1,
			radius: 12,//radius around atom center-line
			color: "#111111",
			colored: true,
			lineCap: "round",
			circleClamp: 15,//label width > circleClamp: atom center = line
			minAddRotateLength: 12,
			minScale: 1 / 1.5,//12 * 1 / 1.5 = 8
			maxMiniLabelScale: 1 / 5.0,
			miniLabelSize: 25,
			miniLabel: false
		},
		select: {
			fillStyle: "rgba(255, 85, 0, 0.3)",
			strokeStyle: "#ff5500",
			lineWidth: 2,
			lineCap: "round",
			lineJoin: "round"
		}
	};

	this.molecule = {
		atoms: [],
		bonds: []
	};

	this.tool = {
		type: "bond",//bond || fragment || chain || charge || erase || drag || select || atom
		data: {
			type: MP_BOND_SINGLE
		},
		tmp: {}
	};

	this.pointer = {
		old: {
			p: new MPPoint(),
			r: new MPPoint(),
			c: new MPPoint(),
			d: 0,
		},
		handler: undefined,
		targetTouchesNumber: 0,
		touchGrab: false
	};

	this.hasChanged = false;//TODO: revise
	this.valid = true;
	this.stack = [];
	this.reverseStack = [];
	this.buttons = buttons;
	this.matrix = [ 1, 0, 0, 1, 0, 0 ];
	this.devicePixelRatio = devicePixelRatio || 1;

	this.container = jQuery(container);
	this.offset = this.container.offset();
	this.canvas = document.createElement("canvas");

	this.canvas.width = this.container.width() * this.devicePixelRatio;
	this.canvas.height = this.container.height() * this.devicePixelRatio;
	this.canvas.style.width = this.container.width() + "px";
	this.canvas.style.height = this.container.height() + "px";

	container.appendChild(this.canvas);
	this.ctx = this.canvas.getContext("2d");
	this.pendingFrame = false;//used to prevent requestAnimationFrame stacking
	this.updated = false;//used to update only before a real redraw

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

	jQuery(window).on("blur", function(e)
	{
		scope.onBlur(e);
	});

	/**
	 * Keyboard shortcuts
	 */
	if(navigator.platform.toLowerCase().indexOf("mac") >= 0)
	{
		jQuery(document).bind("keydown", "meta+z", function(){ scope.undo(); });
		jQuery(document).bind("keydown", "meta+y", function(){ scope.redo(); });
		jQuery(document).bind("keydown", "meta+shift+z", function(){ scope.redo(); });
	}
	else
	{
		jQuery(document).bind("keydown", "ctrl+z", function(){ scope.undo(); });
		jQuery(document).bind("keydown", "ctrl+y", function(){ scope.redo(); });
		jQuery(document).bind("keydown", "ctrl+shift+z", function(){ scope.redo(); });
	}
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
	this.tool.type = type;
	this.tool.data = data;
}

MolPad.prototype.onChange = function(cb)
{
	this.changeCallback = cb;
}

MolPad.prototype.clear = function(cb)
{
	this.saveToStack();
	this.molecule = { atoms: [], bonds: [] };
	this.redraw();
}

MolPad.prototype.changed = function()
{
	this.hasChanged = true;
	if(this.changeCallback)
	{
		this.changeCallback();
	}
}

MolPad.prototype.saveToStack = function()
{
	this.stack.push(this.getPlainData());
	if(this.stack.length > this.settings.maxStackSize) this.stack.shift();
	jQuery(this.buttons.undo).removeClass("tool-button-disabled");
	this.changed();//assumption since saveToStack should only be called before changes
}

MolPad.prototype.undo = function(noRedo)
{
	this.dismissHandler();
	
	if(this.stack.length > 0)
	{
		if(!noRedo)
		{
			this.reverseStack.push(this.getPlainData());
			jQuery(this.buttons.redo).removeClass("tool-button-disabled");
		}

		this.loadPlainData(this.stack.pop());
	}

	if(this.stack.length == 0)
	{
		jQuery(this.buttons.undo).addClass("tool-button-disabled");
	}

	this.changed();
}

MolPad.prototype.redo = function()
{
	this.dismissHandler();

	if(this.reverseStack.length > 0)
	{
		this.saveToStack();
		this.loadPlainData(this.reverseStack.pop());
		this.changed();
	}

	if(this.reverseStack.length == 0)
	{
		jQuery(this.buttons.redo).addClass("tool-button-disabled");
	}
}

MolPad.prototype.displaySkeleton = function(yes)
{
	if(yes == this.settings.skeletonDisplay) return;

	this.dismissHandler();

	if(yes)
	{
		//so all new invisible carbons are invalidated
		this.settings.skeletonDisplay = true;
	}
	for(var i = 0; i < this.molecule.atoms.length; i++)
	{
		if(!this.molecule.atoms[i].isVisible())
		{
			this.molecule.atoms[i].invalidate(false);
		}
	}
	if(!yes)
	{
		//so all invisible carbon atoms are inavalidated before becoming visibile
		this.settings.skeletonDisplay = false;
	}

	if(yes) this.removeImplicitHydrogen();
	else this.addImplicitHydrogen();

	this.validate();
}

MolPad.prototype.setColored = function(yes)
{
	this.settings.atom.colored = this.settings.bond.colored = yes;
	this.settings.atom.isotope.fontStyle = this.settings.atom.label.fontStyle =
			this.settings.atom.charge.fontStyle = yes ? "bold" : "normal";
	this.redraw(true);
}

MolPad.prototype.toDataURL = function()
{
	return this.canvas.toDataURL("image/png");
}
