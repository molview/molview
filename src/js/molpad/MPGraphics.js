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

MolPad.prototype.resize = function()
{
	this.canvas.width = this.container.width() * this.devicePixelRatio;
	this.canvas.height = this.container.height() * this.devicePixelRatio;
	this.canvas.style.width = this.container.width() + "px";
	this.canvas.style.height = this.container.height() + "px";
	this.offset = this.container.offset();
	this.center();
}

MolPad.prototype.draw = function()
{
	//clear
	this.ctx.clearRect(0, 0, this.width(), this.height());

	//apply matrix
	this.ctx.save();
	this.ctx.transform(this.matrix[0], this.matrix[1], this.matrix[2],
					   this.matrix[3], this.matrix[4], this.matrix[5]);

	//draw selection
	for(var i = 0; i < this.molecule.atoms.length; i++)
	{
		this.molecule.atoms[i].drawSelectionColor(this.ctx, this.settings);
	}
	for(var i = 0; i < this.molecule.bonds.length; i++)
	{
		this.molecule.bonds[i].drawSelectionColor(this.ctx, this.settings, this.molecule.atoms);
	}

	//draw bonds
	for(var i = 0; i < this.molecule.bonds.length; i++)
	{
		this.molecule.bonds[i].drawBond(this.ctx, this.settings, this);
	}

	//draw atoms
	for(var i = 0; i < this.molecule.atoms.length; i++)
	{
		this.molecule.atoms[i].drawLabel(this.ctx, this.settings, this);
	}

	//draw selection outline
	for(var i = 0; i < this.molecule.atoms.length; i++)
	{
		this.molecule.atoms[i].drawSelectionOutline(this.ctx, this.settings);
	}
	for(var i = 0; i < this.molecule.bonds.length; i++)
	{
		this.molecule.bonds[i].drawSelectionOutline(this.ctx, this.settings);
	}

	//draw selection tool

	this.ctx.restore();
}

MolPad.prototype.redraw = function()
{
	requestAnimationFrame(this.draw.bind(this));
}

MolPad.prototype.center = function()
{
	var bbox = this.getBBox();

	this.resetMatrix();

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

	var s = 1 - 2 * this.settings.relativePadding;
	this.scaleAbsolute(s, this.width() / 2, this.height() / 2);

	this.redraw();
}

MolPad.prototype.getBBox = function()
{
	var bottomLeft = undefined, topRight = undefined;

	for(var i = 0; i < this.molecule.atoms.length; i++)
	{
		var p = this.molecule.atoms[i].getPosition();

		if(bottomLeft == undefined)
		{
			bottomLeft = { x: p.x, y: p.y };
		}
		else
		{
			if(bottomLeft.x > p.x) bottomLeft.x = p.x;
			if(bottomLeft.y > p.y) bottomLeft.y = p.y;
		}

		if(topRight == undefined)
		{
			topRight = { x: p.x, y: p.y };
		}
		else
		{
			if(topRight.x < p.x) topRight.x = p.x;
			if(topRight.y < p.y) topRight.y = p.y;
		}
	}

	return {
		x: bottomLeft.x,
		y: bottomLeft.y,
		width: topRight.x - bottomLeft.x,
		height: topRight.y - bottomLeft.y
	};
}

MolPad.prototype.width = function()
{
	return this.canvas.width;
}

MolPad.prototype.height = function()
{
	return this.canvas.height;
}

MolPad.prototype.translate = function(dx, dy)
{
	this.matrix[4] += dx;
	this.matrix[5] += dy;
}

MolPad.prototype.scale = function(s)
{
	this.matrix[0] *= s;
	this.matrix[3] *= s;
}

MolPad.prototype.getScale = function()
{
	return this.matrix[0];
}

MolPad.prototype.scaleAbsolute = function(s, cx, cy)
{
	this.matrix[0] *= s;
	this.matrix[3] *= s;
	this.matrix[4] -= (cx - this.matrix[4]) * (s - 1);
	this.matrix[5] -= (cy - this.matrix[5]) * (s - 1);
}

MolPad.prototype.resetMatrix = function()
{
	this.matrix = [ 1, 0, 0, 1, 0, 0 ];
}
