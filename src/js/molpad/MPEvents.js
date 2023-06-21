/**
 * This file is part of MolView (http://molview.org)
 * Copyright (c) 2014-2023 Herman Bergwerf
 */

MolPad.prototype.setupEventHandling = function()
{
	//keydown tracker
	this.keys = {
		ctrl: false
	};

	//event pointer data
	this.pointer = {
		old: {
			p: new MPPoint(),
			r: new MPPoint(),
			c: new MPPoint(),
			d: 0,
		},
		handler: undefined,
		touches: 0,
		touchGrab: false
	};

	var scope = this;

	/**
	 * Mousewheel handler
	 */

	this.container.on('DOMMouseScroll mousewheel', function(e)
	{
		e.preventDefault();

		if(e.originalEvent.detail)
		{
			scope.onScroll(e.originalEvent.detail / 3, e);
		}
		else if(e.originalEvent.wheelDelta)
		{
			scope.onScroll(e.originalEvent.wheelDelta / 120, e);
		}
	});

	/**
	 * Event pointer handlers
	 */

	this.container.on("contextmenu", function(e)
	{
		return false;
	});
	this.container.on("mousedown touchstart", function(e)
	{
		scope.onPointerDown(e);
		scope.clearRedrawRequest();
	});
	this.container.on("mousemove", function(e)
	{
		scope.onMouseMoveInContainer(e);
		scope.clearRedrawRequest();
	});
	this.container.on("mouseout", function(e)
	{
		scope.onMouseOut(e);
		scope.clearRedrawRequest();
	});
	jQuery(window).on("mousemove touchmove", function(e)
	{
		scope.onPointerMove(e);
		scope.clearRedrawRequest();
	});
	jQuery(window).on("mouseup touchend touchcancel", function(e)
	{
		scope.onPointerUp(e);
		scope.clearRedrawRequest();
	});
	jQuery(window).on("blur", function(e)
	{
		scope.onBlur(e);
	});

	/**
	 * Keyboard handlers
	 */

	if(navigator.platform.toLowerCase().indexOf("mac") >= 0)
	{
		jQuery(document).bind("keydown", "meta+z", function(e)
				{ e.preventDefault(); scope.undo(); });
		jQuery(document).bind("keydown", "meta+y", function(e)
				{ e.preventDefault(); scope.redo(); });
		jQuery(document).bind("keydown", "meta+shift+z", function(e)
				{ e.preventDefault(); scope.redo(); });
	}
	else
	{
		jQuery(document).bind("keydown", "ctrl+z", function(e)
				{ e.preventDefault(); scope.undo(); });
		jQuery(document).bind("keydown", "ctrl+y", function(e)
				{ e.preventDefault(); scope.redo(); });
		jQuery(document).bind("keydown", "ctrl+shift+z", function(e)
				{ e.preventDefault(); scope.redo(); });
	}

	jQuery(document).on("keydown", function(e)
	{
		scope.keys.ctrl = e.ctrlKey;

		if(e.keyCode === 46)//forward backspace
		{
			scope.sel.remove();
			scope.clearRedrawRequest();
		}
	});
	jQuery(document).on("keyup", function(e)
	{
		scope.keys.ctrl = e.ctrlKey;
	});
}

MolPad.prototype.onScroll = function(delta, e)
{
	var s = 1 + this.s.zoomSpeed * delta;
	if(this.matrix[0] * s < this.s.minZoom) s = this.s.minZoom / this.matrix[0];
	var p = new MPPoint().fromPointer(e);
	p.x -= this.offset.left;
	p.y -= this.offset.top;

	if(this.s.zoomType === MP_ZOOM_TO_COG)
	{
		/*
		Transform molecule center into absolute point;
		relative pointer transformations
		--------------------------------
		this.x = (this.x - mpctx.offset.left) * mpctx.devicePixelRatio;
		this.y = (this.y - mpctx.offset.top) * mpctx.devicePixelRatio;
		this.x = (this.x - mpctx.matrix[4]) / mpctx.matrix[0];
		this.y = (this.y - mpctx.matrix[5]) / mpctx.matrix[3];
		*/

		var center = new MPPoint();
		for(var i = 0; i < this.mol.atoms.length; i++)
		{
			center.add(this.mol.atoms[i].center);
		}
		center.divide(this.mol.atoms.length);

		/*
		reversed transformation to transform
		relative point into absolute pointer
		*/
		center.multiplyX(this.matrix[0]);
		center.multiplyY(this.matrix[3]);
		center.addX(this.matrix[4]);
		center.addY(this.matrix[5]);
		center.divide(this.devicePixelRatio);

		this.scaleAbsolute(s, center.x, center.y);
	}
	else
	{
		this.scaleAbsolute(s, p.x, p.y);
	}

	this.redraw(true);
}

MolPad.prototype.onPointerDown = function(e)
{
	/* if(e.target !== this.canvas && this.pointer.handler === undefined ||
			(e.type === "touchstart" && this.pointer.handler === undefined && e.originalEvent.targetTouches.length > 1))
	{
		return;
	} */

	e.preventDefault();
	e.stopImmediatePropagation();

	var oe = e.originalEvent;

	/*
	If this is a mouse event and there are no touches registered:
		make sure touch grabbing is disabled
	If touch grabbing is disabled and this is a mouse event:
		Abort handler
	 */
	if(e.type === "mousedown")
	{
		if(this.pointer.touches === 0)
		{
			this.pointer.touchGrab = false;
		}
		else if(this.pointer.touchGrab)
		{
			return;
		}
	}
	else if(e.type === "touchstart")
	{
		this.pointer.touchGrab = true;
		this.pointer.touches = oe.targetTouches.length || 1;
	}

	//retrieve event data
	this.pointer.old.p.fromPointer(e);
	this.pointer.old.r.fromRelativePointer(e, this);
	this.pointer.handler = undefined;

	//clear selection if the current tool is not erase, select or drag
	if(!oneOf(this.tool.type, ["erase", "select", "drag"]))
	{
		this.sel.clear();
	}

	//check if there are multiple touches in this event
	if(oe.targetTouches && oe.targetTouches.length > 1)
	{
		//simulate pointer up for old single pointer handler in order
		//to dismiss the old handler properly
		if(this.pointer.handler && this.pointer.handler.onPointerUp)
		{
			this.pointer.handler.onPointerUp(e, this);
		}
		//undo single pointer changes
		if(this.mol.isChanged())
		{
			//reload the copy: the molecule has been changed but it's copy has
			//not yet been updated (reset event display is not necessary since
			//a clean new molecule is loaded)
			this.mol.loadPlainData(this.mol.copy);
		}
		else
		{
			this.resetEventDisplay();
		}
		//update multitouch event data
		this.pointer.old.c.fromMultiTouchCenter(e);
		this.pointer.old.d = getMultiTouchDelta(e);
		this.pointer.handler = this.multiTouchHandler;
	}
	else if(e.which === 1 || (oe.targetTouches && oe.targetTouches.length === 1))
	{
		//redefine handler and execute onPointerDown
		this.handleEvent(this.pointer.old.r, "active", function(obj)
		{
			this.pointer.handler = obj.getHandler(this);
		});
		if(this.pointer.handler === undefined)
		{
			this.pointer.handler = this.getHandler();
		}
	}
	else if(e.which === 2 || e.which === 3)
	{
		this.pointer.handler = this.mouseDragHandler;
	}

	if(this.pointer.handler && this.pointer.handler.onPointerDown)
	{
		this.pointer.handler.onPointerDown(e, this);
	}
}

MolPad.prototype.onMouseMoveInContainer = function(e)
{
	//dimiss mouse events if touch is active
	if(this.pointer.touchGrab)
	{
		return;
	}
	else if(this.pointer.handler === undefined)
	{
		this.hoverHandler.onPointerMove(e, this);
	}
}

MolPad.prototype.onMouseOut = function(e)
{
	if(this.pointer.handler === undefined)
	{
		this.resetEventDisplay();
		this.setCursor("default");
	}
}

MolPad.prototype.onPointerMove = function(e)
{
	//dimiss mouse events if touch is active
	if(e.type === "mousemove" && this.pointer.touchGrab)
	{
		return;
	}
	else if(this.pointer.handler && this.pointer.handler.onPointerMove)
	{
		e.preventDefault();
		this.pointer.handler.onPointerMove(e, this);
	}
}

MolPad.prototype.onPointerUp = function(e)
{
	//dimiss mouse events if touch is active
	if(e.type === "mouseup" && this.pointer.touchGrab)
	{
		return;
	}

	var oe = e.originalEvent;

	if(this.pointer.handler)
	{
		if(this.pointer.handler.onPointerUp)
		{
			this.pointer.handler.onPointerUp(e, this);
		}

		if(this.pointer.handler.scope)
		{
			this.setCursor("pointer");
			this.resetEventDisplay();
			this.pointer.handler.scope.setDisplay(
					e.type === "mouseup" ? "hover" : "normal");
		}
		else
		{
			this.setCursor("default");
		}
	}
	else
	{
		this.setCursor("default");
	}

	//only one multi-touch pointer left: switch to dragHandler
	if(oe.targetTouches)
	{
		if(oe.targetTouches.length > 1)
		{
			//update multitouch event data
			this.pointer.old.d = getMultiTouchDelta(e);
			this.pointer.old.c = new MPPoint().fromMultiTouchCenter(e);
		}
		else if(oe.targetTouches.length === 1)
		{
			//reset old pointer for smooth multi to single transition
			this.pointer.old.p = new MPPoint().fromPointer(e);
			this.pointer.old.r.fromRelativePointer(e, this);

			if(this.pointer.handler !== undefined)
			{
				this.pointer.handler = this.mouseDragHandler;
			}
		}
		else
		{
			this.pointer.handler = undefined;
			this.mol.updateCopy();
		}
	}
	else
	{
		this.pointer.handler = undefined;
		this.mol.updateCopy();
	}
}

MolPad.prototype.onBlur = function(e)
{
	this.keys.ctrl = false;
	this.dismissHandler();
}

/**
 * Template function for handling simple events
 * @param {MPPoint}  point    Event origin
 * @param {String}   type     Trigger type: hover || active
 * @param {Function} callback Callback for hits
 */
MolPad.prototype.handleEvent = function(point, type, callback)
{
	var completed = false;
	for(var i = 0; i < this.mol.atoms.length; i++)
	{
		if(completed)
		{
			this.mol.atoms[i].setDisplay("normal");
		}
		else if(this.mol.atoms[i].handle(point, type))
		{
			completed = true;
			callback.call(this, this.mol.atoms[i]);
		}
	}
	for(var i = 0; i < this.mol.bonds.length; i++)
	{
		if(completed)
		{
			this.mol.bonds[i].setDisplay("normal");
		}
		else if(this.mol.bonds[i].handle(point, type))
		{
			completed = true;
			callback.call(this, this.mol.bonds[i]);
		}
	}
}

/**
 * Resets the current handler
 * This will terminate the active handler
 * instead of finishing the current action
 */
MolPad.prototype.dismissHandler = function()
{
	this.resetEventDisplay();
	this.sel.clear();
	this.setCursor("default");
	this.pointer.touches = 0;
	this.pointer.handler = undefined;
	this.clearRedrawRequest();
	this.mol.updateCopy();
}

/**
 * Resets display to normal for all atoms and bonds
 */
MolPad.prototype.resetEventDisplay = function()
{
	this.mol.exec(function(obj) {
		obj.setDisplay("normal");
	}, true, true);
}

/**
 * Event handlers
 */

MolPad.prototype.hoverHandler = {
	onPointerMove: function(e, mp)
	{
		mp.setCursor("default");
		var p = new MPPoint().fromRelativePointer(e, mp);

		mp.handleEvent(p, "hover", function(obj)
		{
			mp.setCursor("pointer");
		});
	}
}

MolPad.prototype.mouseDragHandler = {
	data: {},
	onPointerMove: function(e, mp)
	{
		mp.setCursor("move");
		var p = new MPPoint().fromPointer(e);
		this.data.moved = true;

		if(p.equals(mp.pointer.old)) return;
		mp.translate((p.x - mp.pointer.old.p.x) * mp.devicePixelRatio,
					 (p.y - mp.pointer.old.p.y) * mp.devicePixelRatio);

		mp.pointer.old.p = p;
		mp.requestRedraw();
	},
	onPointerUp: function(e, mp)
	{
		if(!this.data.moved)
		{
			mp.sel.clear();
		}

		mp.setCursor("default");
	}
}

MolPad.prototype.multiTouchHandler = {
	onPointerMove: function(e, mp)
	{
		if(e.originalEvent.targetTouches.length <= 1)
		{
			mp.dismissHandler();
			return;
		}

		var c = new MPPoint().fromMultiTouchCenter(e);
		var d = getMultiTouchDelta(e);

		mp.translate((c.x - mp.pointer.old.c.x) * mp.devicePixelRatio,
					 (c.y - mp.pointer.old.c.y) * mp.devicePixelRatio);

		mp.scaleAbsolute(d / mp.pointer.old.d,
			(c.x - mp.offset.left) * mp.devicePixelRatio,
			(c.y - mp.offset.top) * mp.devicePixelRatio);

		//update event data
		mp.pointer.old.c = c;
		mp.pointer.old.d = d;
		mp.pointer.old.p.fromPointer(e);//for smooth transition to mouseDragHandler
		mp.redraw(true);
	}
}

MolPad.prototype.selectionToolHandler = {
	data: {},
	onDraw: function(mp)
	{
		mp.ctx.fillStyle = mp.s.select.fillStyle;
		mp.ctx.strokeStyle = mp.s.select.strokeStyle;
		mp.ctx.lineWidth = mp.s.select.lineWidth / mp.getScale();
		mp.ctx.lineCap = mp.s.select.lineCap;
		mp.ctx.lineJoin = mp.s.select.lineJoin;
		mp.ctx.setLineDash([
			2 / mp.getScale(),
			5 / mp.getScale()
		]);

		mp.ctx.beginPath();

		if(mp.tool.data.type === "rect" && this.data.rect)
		{
			mp.ctx.rect(this.data.rect.x, this.data.rect.y,
						this.data.rect.width, this.data.rect.height);

			mp.ctx.fill();
			mp.ctx.stroke();
		}
		else if(mp.tool.data.type === "lasso" && this.data.points)//lasso
		{
			for(var i = 0; i < this.data.points.length; i++)
			{
				if(i === 0) mp.ctx.moveTo(this.data.points[i].x, this.data.points[i].y);
				else mp.ctx.lineTo(this.data.points[i].x, this.data.points[i].y);
			}

			mp.ctx.mozFillRule = "evenodd";
			mp.ctx.msFillRule = "evenodd";
			mp.ctx.fillRule = "evenodd";
			mp.ctx.fill("evenodd");
			mp.ctx.stroke();
		}
	},
	onPointerDown: function(e, mp)
	{
		mp.setCursor("pointer");
		this.data = {};
		var p = new MPPoint().fromRelativePointer(e, mp);

		if(!mp.keys.ctrl)
		{
			mp.sel.clear();
			this.data.selAdd = { atoms: [], bonds: [] };
		}
		else
		{
			this.data.selAdd = {
				atoms: mp.sel.cache.atoms.slice(),
				bonds: mp.sel.cache.bonds.slice()
			};
		}

		if(mp.tool.data.type === "rect")
		{
			this.data.rect = {
				x: p.x,
				y: p.y,
				width: 0,
				height: 0
			};
		}
		else//lasso
		{
			this.data.points = [p.clone()];
		}
	},
	onPointerMove: function(e, mp)
	{
		mp.setCursor("default");
		var p = new MPPoint().fromRelativePointer(e, mp);

		if(mp.tool.data.type === "rect")
		{
			this.data.rect.width = p.x - this.data.rect.x;
			this.data.rect.height = p.y - this.data.rect.y;

			//refresh selection
			var rect = this.data.rect;
			mp.mol.exec(function(obj) {
				obj.handleRectSelect(rect);
			}, true, true);
		}
		else//lasso
		{
			this.data.points.push(p);

			//refresh selection
			var polygon = this.data.points;
			mp.mol.exec(function(obj) {
				obj.handlePolygonSelect(polygon);
			}, true, true);
		}

		//select additional atoms/bonds
		for(var i = 0; i < this.data.selAdd.atoms.length; i++)
		{
			mp.mol.atoms[this.data.selAdd.atoms[i]].select(true);
		}
		for(var i = 0; i < this.data.selAdd.bonds.length; i++)
		{
			mp.mol.bonds[this.data.selAdd.bonds[i]].select(true);
		}

		mp.requestRedraw();
	},
	onPointerUp: function(e, mp)
	{
		mp.sel.updateRotationCenter();
		mp.requestRedraw();
	}
}

MolPad.prototype.getHandler = function()
{
	if(this.tool.type === "atom")
	{
		return {
			onPointerDown: function(e, mp)
			{
				var p = new MPPoint().fromRelativePointer(e, mp);
				var atom = new MPAtom(mp, {
					i: mp.mol.atoms.length,
					x: p.x,
					y: p.y,
					element: mp.tool.data.element
				});
				mp.mol.atoms.push(atom);
				mp.pointer.handler.scope = atom;
			}
		};
	}
	else if(this.tool.type === "bond")
	{
		return {
			onPointerDown: function(e, mp)
			{
				var p = new MPPoint().fromRelativePointer(e, mp);

				var atom1 = new MPAtom(mp, {
					i: mp.mol.atoms.length,
					x: p.x - mp.s.bond.length / 2,
					y: p.y,
					element: "C",
					selected: true
				});
				mp.mol.atoms.push(atom1);

				var atom2 = new MPAtom(mp, {
					i: mp.mol.atoms.length,
					x: p.x + mp.s.bond.length / 2,
					y: p.y,
					element: "C",
					selected: true
				});
				mp.mol.atoms.push(atom2);

				var bond = new MPBond(mp, {
					i: mp.mol.bonds.length,
					from: atom1.index,
					to: atom2.index,
					type: mp.tool.data.type,
					stereo: mp.tool.data.stereo,
					selected: true
				});
				mp.mol.bonds.push(bond);

				atom1.addBond(bond.index);
				atom2.addBond(bond.index);

				mp.pointer.handler.scope = bond;

				mp.sel.update();
				mp.sel.center = p.clone();
				//this will cause the pointer to sel center line to be
				//perpendicular to the newly created bond
				mp.sel.currentAngle = mp.sel.startAngle = .5 * Math.PI;
			},
			onPointerMove: function(e, mp)
			{
				var p = new MPPoint().fromRelativePointer(e, mp);
				mp.sel.rotate(p);
			},
			onPointerUp: function(e, mp)
			{
				mp.sel.clear();
			}
		};
	}
	else if(this.tool.type === "fragment")
	{
		return {
			onPointerDown: function(e, mp)
			{
				var p = new MPPoint().fromRelativePointer(e, mp);

				var frag = MPFragments.translate(
						MPFragments.scale(MPFragments.clone(mp.tool.data.frag.full),
							mp.s.bond.length),
							p.x, p.y);

				mp.mol.createFragment(frag, true);

				mp.sel.center = p.clone();
				mp.sel.currentAngle = mp.sel.startAngle = 0;
			},
			onPointerMove: function(e, mp)
			{
				var p = new MPPoint().fromRelativePointer(e, mp);
				mp.sel.rotate(p);
			},
			onPointerUp: function(e, mp)
			{
				mp.sel.clear();
			}
		};
	}
	else if(this.tool.type === "chain")
	{
		return {
			onPointerDown: function(e, mp)
			{
				var p = new MPPoint().fromRelativePointer(e, mp);

				var atom = new MPAtom(mp, {
					i: mp.mol.atoms.length,
					x: p.x, y: p.y,
					element: "C"
				});
				mp.mol.atoms.push(atom);
				mp.pointer.handler = atom.getHandler();
			}
		};
	}
	else if(this.tool.type === "select")
	{
		return this.selectionToolHandler;
	}
	else
	{
		return this.mouseDragHandler;
	}
}
