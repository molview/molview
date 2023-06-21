/**
 * This file is part of MolView (http://molview.org)
 * Copyright (c) 2014-2023 Herman Bergwerf
 */

MolPad.prototype.setupGraphics = function()
{
	//create and setup canvas
	this.canvas = document.createElement("canvas");
	this.canvas.width = this.container.width() * this.devicePixelRatio;
	this.canvas.height = this.container.height() * this.devicePixelRatio;
	this.canvas.style.width = this.container.width() + "px";
	this.canvas.style.height = this.container.height() + "px";
	this.container.append(this.canvas);

	this.redrawRequest = false;
	this.matrix = [ 1, 0, 0, 1, 0, 0 ];
	this.ctx = this.canvas.getContext("2d");
	this.updated = false;//used to update only before a real redraw
	this.pendingFrame = false;//used to prevent requestAnimationFrame stacking
}

/**
 * Resize the current canvas to fit the container
 */
MolPad.prototype.resize = function()
{
	this.canvas.width = this.container.width() * this.devicePixelRatio;
	this.canvas.height = this.container.height() * this.devicePixelRatio;
	this.canvas.style.width = this.container.width() + "px";
	this.canvas.style.height = this.container.height() + "px";
	this.offset = this.container.offset();
	this.center();
}

/**
 * Mark the current drawing as invalid
 */
MolPad.prototype.requestRedraw = function()
{
	this.redrawRequest = true;
}

/**
 * Validates the current drawing
 * @return {Boolean} Indicates if a redraw will be executed
 */
MolPad.prototype.clearRedrawRequest = function()
{
	if(this.redrawRequest)
	{
		this.redrawRequest = false;
		this.redraw();
		return true;
	}
	else
	{
		return false;
	}
}

/**
 * Updates scaling of the drawing settings
 */
MolPad.prototype.update = function()
{
	var oldAtomScale = this.s.atom.scale;

	this.s.atom.miniLabel = this.getScale() <= this.s.atom.maxMiniLabelScale;
	this.s.atom.scale = this.getScale() < this.s.atom.minScale ?
			this.s.atom.minScale / this.getScale() : 1;
	this.s.bond.deltaScale = this.getScale() < this.s.bond.minDeltaScale ?
			this.s.bond.minDeltaScale / this.getScale() : 1;
	this.s.bond.scale = this.getScale() < this.s.bond.minScale ?
			this.s.bond.minScale / this.getScale() : 1;

	this.s.atom.radiusScaled = this.s.atom.radius * this.s.atom.scale;
	this.s.atom.selectionRadiusScaled = this.s.atom.selectionRadius * this.s.atom.scale;
	this.s.bond.radiusScaled = this.s.bond.radius * this.s.bond.scale;

	//if metrics are changed, atom.scale will always be amongst them
	if(this.s.atom.scale !== oldAtomScale)
	{
		this.mol.invalidateAll();
		this.mol.exec(function(atom)
		{
			atom.line = undefined;
		}, true, false);
	}
}

/**
 * Set the cursor in the container to the provided cursor
 * @param {String} type HTML cursur type
 */
MolPad.prototype.setCursor = function(type)
{
	this.container.css("cursor", type);
}

/**
 * Set font for label rendering
 * @param {String} type Font type (label settings are in MolPad.s.font[type])
 */
MolPad.prototype.setFont = function(type)
{
	//note that all fonts are scaled using the atom scale
	var font = this.s.fonts[type].fontStyle + " " +
			Math.round((this.s.fonts[type].fontSize
				* this.s.atom.scale) * 96 / 72) + "px " +
			this.s.fonts[type].fontFamily;

	if(font !== this.ctx.font)
	{
		this.ctx.font = font;
	}
}

/**
 * Draw the current scene to the canvas
 */
MolPad.prototype.draw = function()
{
	this.pendingFrame = false;

	if(!this.updated)
	{
		this.updated = true;
		this.update();
	}

	//recalculate where necessary
	this.mol.validateAll();

	//clear
	this.ctx.clearRect(0, 0, this.width(), this.height());

	//apply matrix
	this.ctx.save();
	this.ctx.transform(this.matrix[0], this.matrix[1], this.matrix[2],
					   this.matrix[3], this.matrix[4], this.matrix[5]);

	//draw state (hover/active)
	this.ctx.lineWidth = 2 * this.s.bond.radiusScaled;
	this.ctx.lineCap = this.s.bond.lineCap;
	for(var i = 0; i < this.mol.bonds.length; i++)
	{
		this.mol.bonds[i].drawStateColor();
	}

	this.ctx.lineWidth = 2 * this.s.atom.selectionRadiusScaled;
	this.ctx.lineCap = this.s.atom.lineCap;
	for(var i = 0; i < this.mol.atoms.length; i++)
	{
		this.mol.atoms[i].drawStateColor();
	}

	//draw bonds
	this.ctx.fillStyle = this.ctx.strokeStyle = this.s.bond.color;
	this.ctx.lineWidth = this.s.bond.width * this.s.bond.scale;
	this.ctx.lineCap = this.s.bond.lineCap;
	this.ctx.lineJoin = this.s.bond.lineJoin;
	for(var i = 0; i < this.mol.bonds.length; i++)
	{
		this.mol.bonds[i].drawBond();
	}

	//draw atoms
	this.ctx.fillStyle = this.ctx.strokeStyle = this.s.atom.color;
	for(var i = 0; i < this.mol.atoms.length; i++)
	{
		this.mol.atoms[i].drawLabel();
	}

	//run custom handler drawing function
	if(this.pointer.handler && this.pointer.handler.onDraw)
	{
		this.pointer.handler.onDraw(this);
	}

	this.ctx.restore();
}

/**
 * Redraw using requestAnimationFrame
 * requestAnimationFrame polyfill is already present in GLmol
 * @param {Boolean} update Indicates if scaling update should be performed
 */
MolPad.prototype.redraw = function(update)
{
	if(update) this.updated = false;
	if(this.pendingFrame) return;
	this.pendingFrame = true;
	requestAnimationFrame(this.draw.bind(this));
}

/**
 * Center the current scene
 */
MolPad.prototype.center = function()
{
	if(this.mol.atoms.length === 0) return;

	this.resetMatrix();

	var bbox = this.mol.getBBox();
	var sx = this.width() / bbox.width;
	var sy = this.height() / bbox.height;
	if(sx < sy)
	{
		this.scale(sx);
		this.translate(
			-bbox.x * sx,
			-bbox.y * sx + (this.height() - bbox.height * sx) / 2);
	}
	else
	{
		this.scale(sy);
		this.translate(
			-bbox.x * sy + (this.width() - bbox.width * sy) / 2,
			-bbox.y * sy);
	}

	var s = 1 - 2 * this.s.relativePadding;
	this.scaleAbsolute(s, this.width() / 2, this.height() / 2);

	this.redraw(true);
}

/**
 * Get canvas width
 * @return {Float} Canvas width
 */
MolPad.prototype.width = function()
{
	return this.canvas.width;
}

/**
 * Get canvas height
 * @return {Float} Canvas height
 */
MolPad.prototype.height = function()
{
	return this.canvas.height;
}

/**
 * Translate the scene
 * @param {Float} dx Horizontal translation
 * @param {Float} dy Vertical translation
 */
MolPad.prototype.translate = function(dx, dy)
{
	this.matrix[4] += dx;
	this.matrix[5] += dy;
}

/**
 * Scale the scene
 * @param {Float} s Scale factor
 */
MolPad.prototype.scale = function(s)
{
	this.matrix[0] *= s;
	this.matrix[3] *= s;
}

/**
 * Return current x scale
 */
MolPad.prototype.getScale = function()
{
	return this.matrix[0];
}

/**
 * Scale absolute to container using an absolute centerpoint relative to the
 * container top-left corner
 * @param {Float} s  Scale
 * @param {Float} cx Scale origin x
 * @param {Float} cy Scale origin y
 */
MolPad.prototype.scaleAbsolute = function(s, cx, cy)
{
	this.matrix[0] *= s;
	this.matrix[3] *= s;
	this.matrix[4] -= (cx - this.matrix[4]) * (s - 1);
	this.matrix[5] -= (cy - this.matrix[5]) * (s - 1);
}

/**
 * Resets the transformation matrix to its default values
 */
MolPad.prototype.resetMatrix = function()
{
	this.matrix = [ 1, 0, 0, 1, 0, 0 ];
}
