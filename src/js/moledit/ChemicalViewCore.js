/*===========================================================================*/
/*                     (c) Copyright 2014, MolSoft L.L.C.                    */
/*                          ALL RIGHTS RESERVED                              */
/*                               v. 1.2.4                                    */
/*===========================================================================*/

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

ChemicalView.prototype.wtos = function (p)
{
	return {
		x: p.x * this.kfc + this.dx,
		y: -p.y * this.kfc + this.dy,
		z: 0
	};
}

ChemicalView.prototype.stow = function (p)
{
	return {
		x: (p.x - this.dx) / this.kfc,
		y: (this.dy - p.y) / this.kfc,
		z: 0
	};
}

ChemicalView.prototype.stowd = function (p)
{
	return {
		x: p.x / this.kfc,
		y: -p.y / this.kfc,
		z: 0
	};
}

ChemicalView.prototype.bondRect = function (bo)
{
	var at1 = this.chem.atoms[bo.fr];
	var at2 = this.chem.atoms[bo.to];
	var dir = vectorSetLength(vector(at1, at2), this.bondThicknessHalf);
	var v = vectorSetLength(vector(at1, at2), this.bondThicknessHalf);
	v = {
		x: -v.y,
		y: v.x,
		z: 0
	};
	return [veadd(veadd(at1, v), dir), veadd(veadd(at2, v), vemulby(dir, -1)), veadd(veadd(at2, vemulby(v, -1)), vemulby(dir, -1)), veadd(veadd(at1, vemulby(v, -1)), dir)];
}

ChemicalView.prototype.atomRect = function (at, fontSize)
{
	var p = this.wtos(at);
	return {
		x: p.x - fontSize / 2,
		y: p.y - fontSize / 2,
		w: fontSize,
		h: fontSize
	}
}

ChemicalView.prototype.bondOrtho = function (atnum1, atnum2, ty, len)
{
	return this.chem.bondOrtho(atnum1, atnum2, ty, len);
}

ChemicalView.prototype.moveTo = function (p)
{
	var p1 = this.wtos(p);
	this.ctx.moveTo(p1.x, p1.y);
}

ChemicalView.prototype.lineTo = function (p)
{
	var p1 = this.wtos(p);
	this.ctx.lineTo(p1.x, p1.y);
}

ChemicalView.prototype.drawLine = function (fr, to)
{
	var p1 = this.wtos(fr);
	var p2 = this.wtos(to);
	this.ctx.moveTo(p1.x, p1.y);
	this.ctx.lineTo(p2.x, p2.y);
}

//--------------------------------------------------------------Events & Drawing-----------------------------------------------------------------

ChemicalView.prototype.onKeyPress = function (ev)
{
	var code = ev.charCode ? ev.charCode : ev.keyCode;
	var key = String.fromCharCode(code);
	if(code == 46 || code == 8)
	{
		var sel = this.chem.getSelectedAtoms(M_CE);
		if(sel.length == 0 && this.h_atom != -1)
			sel = [this.h_atom];

		if(sel.length)
		{
			this.undoPush();
			this.chem.removeAtoms(sel);
			this.changed();
			this.drawMol();
		}
	}
	else if(this.h_atom != -1)
	{
		if(key in Elements)
		{
			this.undoPush();
			this.chem.changeAtom(this.h_atom, Elements[key],
			{});
			this.changed();
			this.drawMol();
		}
	}
	else if(this.h_bond != -1)
	{
		var ty = -1,
			ms = 0;
		var bo = this.chem.bonds[this.h_bond];
		switch(code)
		{
		case 189: // -
			ty = 1;
			ms = 0;
			break;
		case 187: // =
			ty = 2;
			ms = 0;
			break;
		case 51: // #
			if(!(bo.ms & M_RNG))
			{
				ty = 3;
				ms = 0;
			}
			break;
		case 85: // up
			if(bo.ty == 1)
			{
				ty = 1;
				ms = M_BO_UP;
			}
			break;
		case 68: // dw
			if(bo.ty == 1)
			{
				ty = 1;
				ms = M_BO_DW;
			}
			break;
		}
		if(ty != -1)
		{
			this.undoPush();
			bo.ty = ty;
			bo.ms = (bo.ms & ~(M_BO_UP | M_BO_DW)) | ms;
			this.chem.processChemical();
			this.changed();
			this.drawMol();
		}
		//console.log(code);
	}
}

ChemicalView.prototype.getDragAtoms = function ()
{
	if(this.h_atom == -1) return [];
	if(this.chem.atoms[this.h_atom].ms & M_CE)
	{
		var res = [this.h_atom];
		for(var i = 0; i < this.chem.atoms.length; i++)
			if(i != this.h_atom && (this.chem.atoms[i].ms & M_CE)) res.push(i);
		return res;
	}
	else return [this.h_atom];
}

//MODIFIED version of ChemicalView.getDragAtoms (doesn't require h_atom)
ChemicalView.prototype.getSelectedAtoms = function ()
{
	var res = [];
	for(var i = 0; i < this.chem.atoms.length; i++)
		if(this.chem.atoms[i].ms & M_CE) res.push(i);
	return res;
}

ChemicalView.prototype.atomLabel = function (at)
{
	var lbl = '';
	var q = this.chem.get_qfm(at);
	var stereo = ((this.atomDislayMask & ATOM_DISPLAY_RS) && at.eo);
	if(at.cd != 6 || at.bo.length == 0 || q || stereo || (at.hasOwnProperty('atts') && count_properties(at.atts)))
	{
		lbl = ElementNames[at.cd];
		if(q)
		{
			lbl += (Math.abs(q) == 1 ? '' : Math.abs(q).toString()) + ((q < 0) ? ('-') : ('+'));
		}
		if(stereo) lbl += STEREO_LABEL[at.eo];
		if(at.hasOwnProperty('atts'))
		{
			for(var x in at.atts)
				if(at.atts.hasOwnProperty(x))
				{
					lbl += ';';
					lbl += x;
					lbl += at.atts[x];
				}
		}
	}
	return lbl;
}

ChemicalView.prototype.updateKfc = function (chem, margin)
{
	if(chem.maxx - chem.minx != 0 && chem.maxy - chem.miny != 0)
		this.kfc = Math.min(40., (this.canvas.width - margin * 2) / (chem.maxx - chem.minx), (this.canvas.height - margin * 2) / (chem.maxy - chem.miny));
	else this.kfc = 40.;

	var sw = (chem.maxx - chem.minx) * this.kfc;
	var sh = (chem.maxy - chem.miny) * this.kfc;
	this.dx = -chem.minx * this.kfc + (this.canvas.width - sw) / 2;
	this.dy = chem.maxy * this.kfc + (this.canvas.height - sh) / 2;
	this.updateZoom = false;
}

ChemicalView.prototype.drawMol = function()
{
	var fontSize = 14 * this.scaleFactor;

	if(!this.chemIsReady) return;

	this.ctx = this.canvas.getContext("2d");
	this.ctx.font = "bold " + fontSize + "px Arial";
	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

	if(this.updateZoom)
		this.updateKfc(this.chem, 16);

	/* selected bonds */
	for(var i = 0; i < this.chem.bonds.length; i++)
	{
		var bo = this.chem.bonds[i];
		if(bo.ms & (M_CE /*|M_AR*/ ))
		{
			this.ctx.beginPath();

			this.ctx.lineWidth = this.selectionStyle.width;
			this.ctx.strokeStyle = this.selectionStyle.stroke;
			this.ctx.fillStyle = this.selectionStyle.fill;
			this.ctx.lineJoin = this.selectionStyle.join;
			this.ctx.lineCap = this.selectionStyle.cap;

			var poly = this.bondRect(bo);
			for(var k = 0; k < poly.length; k++)
			{
				if(k == 0) this.lineTo(poly[k], poly[(k + 1) % poly.length]);
				else this.lineTo(poly[k], poly[(k + 1) % poly.length]);
			}

			this.ctx.closePath();
			if(this.selectionStyle.fill) this.ctx.fill();
			if(this.selectionStyle.stroke) this.ctx.stroke();
		}
	}

	/* selected atoms */
	for(var i = 0; i < this.chem.atoms.length; i++)
	{
		var at = this.chem.atoms[i];
		var p1 = this.wtos(at);

		/* selection */
		if(at.ms & M_CE)
		{
			this.ctx.lineWidth = this.selectionStyle.width;
			this.ctx.strokeStyle = this.selectionStyle.stroke;
			this.ctx.fillStyle = this.selectionStyle.fill;
			this.ctx.beginPath();
			this.ctx.arc(p1.x, p1.y, this.selectionStyle.radius * this.kfc, 0, 2 * Math.PI);
			if(this.selectionStyle.fill) this.ctx.fill();
			if(this.selectionStyle.stroke) this.ctx.stroke();
		}
	}

	/* atoms */
	for(var i = 0; i < this.chem.atoms.length; i++)
	{
		var at = this.chem.atoms[i];
		var p1 = this.wtos(at);

		/* atom label */
		var lbl;
		this.ctx.textBaseline = "middle";
		this.ctx.textAlign = "center";
		if((lbl = this.atomLabel(at)).length)
		{
			var color = JmolAtomColorsCSS[ElementNames[at.cd]];
			if(typeof color == "undefined") color = "#000000";
			this.ctx.strokeStyle = color;
			this.ctx.fillStyle = color;
			this.ctx.fillText(lbl, p1.x, p1.y);
		}

		/* hover */
		if(this.h_atom == i)
		{
			this.ctx.lineWidth = this.hoverStyle.width;
			this.ctx.strokeStyle = this.hoverStyle.stroke;
			this.ctx.fillStyle = this.hoverStyle.fill;
			this.ctx.beginPath();
			this.ctx.arc(p1.x, p1.y, this.hoverStyle.radius * this.kfc, 0, 2 * Math.PI);
			if(this.hoverStyle.fill) this.ctx.fill();
			if(this.hoverStyle.stroke) this.ctx.stroke();
		}
	}

	/* bonds */
	this.ctx.lineWidth = this.bondStyle.width;
	this.ctx.strokeStyle = this.bondStyle.stroke;
	this.ctx.fillStyle = "#000000"
	this.ctx.beginPath();
	for(var i = 0; i < this.chem.bonds.length; i++)
	{
		var bo = this.chem.bonds[i];
		var fr = xyz(this.chem.atoms[bo.fr]);
		var to = xyz(this.chem.atoms[bo.to]);
		var dir;

		if(this.atomLabel(this.chem.atoms[bo.fr])
			.length)
		{
			dir = vectorSetLength(vector(fr, to), 0.75 * fontSize / this.kfc);
			fr = veadd(fr, dir);
		}
		if(this.atomLabel(this.chem.atoms[bo.to])
			.length)
		{
			dir = vectorSetLength(vector(to, fr), 0.75 * fontSize / this.kfc);
			to = veadd(to, dir);
		}

		switch(bo.ty)
		{
			case 2:
				var v = this.bondOrtho(bo.fr, bo.to, bo.ty, 0.25);

				if(this.chem.atoms[bo.fr].bo.length == 1 || this.chem.atoms[bo.to].bo.length == 1)
				{
					this.drawLine(veadd(fr, vemulby(v, -0.5)), veadd(to, vemulby(v, -0.5)));
					this.drawLine(veadd(fr, vemulby(v, 0.5)), veadd(to, vemulby(v, 0.5)));
				}
				else
				{
					this.drawLine(fr, to);
					var shift = vectorSetLength(vector(fr, to), 0.2);
					this.drawLine(veadd(veadd(fr, v), shift), veadd(veadd(to, v), vemulby(shift, -1)));
				}

				break;

			case 3:

				this.drawLine(fr, to);
				var v = this.bondOrtho(bo.fr, bo.to, bo.ty, 0.15);
				var shift = vectorSetLength(vector(fr, to), 0.2);
				this.drawLine(veadd(veadd(fr, v), shift), veadd(veadd(to, v), vemulby(shift, -1)));
				v = vemulby(v, -1);
				this.drawLine(veadd(veadd(fr, v), shift), veadd(veadd(to, v), vemulby(shift, -1)));

				break;

			default:

				if(bo.ms & M_BO_UP)
				{
					this.ctx.closePath();
					this.ctx.stroke();

					var v = this.bondOrtho(bo.fr, bo.to, 3, 0.20);
					this.ctx.beginPath();
					this.moveTo(fr);
					this.lineTo(veadd(to, v));
					this.lineTo(veadd(to, vemulby(v, -1)));
					this.lineTo(fr);
					this.ctx.closePath();
					this.ctx.fill();

					this.ctx.beginPath();
				}
				else if(bo.ms & M_BO_DW)
				{
					var bov = vector(fr, to);
					var len = vectorLength(bov);
					var nsteps = Math.round((this.kfc / 17.5) * (5 * (len / 1.2)));
					var step = len / nsteps;
					var vstep = vectorSetLength(vector(to, fr), step);
					var v = this.bondOrtho(bo.fr, bo.to, 3, 0.20);
					var pp = xyz(to);
					for(var k = 0; k < nsteps; k++)
					{
						var aa = vemulby(v, (1. - k / nsteps));
						this.drawLine(veadd(pp, vemulby(aa, 0.9)), veadd(pp, vemulby(aa, -0.9)));
						pp = veadd(pp, vstep);
					}
				}
				else this.drawLine(fr, to);

				break;
		}

	}
	this.ctx.closePath();
	this.ctx.stroke();

	/* hovered bond */
	if(this.h_bond != -1)
	{
		this.ctx.beginPath();

		this.ctx.lineWidth = this.hoverStyle.width;
		this.ctx.strokeStyle = this.hoverStyle.stroke;
		this.ctx.fillStyle = this.hoverStyle.fill;
		this.ctx.lineJoin = this.hoverStyle.join;
		this.ctx.lineCap = this.hoverStyle.cap;

		var bo = this.chem.bonds[this.h_bond];
		var poly = this.bondRect(bo);
		for(var k = 0; k < poly.length; k++)
		{
			if(k == 0) this.lineTo(poly[k], poly[(k + 1) % poly.length]);
			else this.lineTo(poly[k], poly[(k + 1) % poly.length]);
		}

		this.ctx.closePath();
		if(this.hoverStyle.fill) this.ctx.fill();
		if(this.hoverStyle.stroke) this.ctx.stroke();
	}

	/* rotateAroundPoint: don't draw rotateAroundPoint
	when eraser is active or when <2 atoms are selected */
	if(this.rotateAroundPoint != null
		&& (!this.activeTool || this.activeTool.toolType != "eraser"))
	{
		var p = this.wtos(this.rotateAroundPoint);
		this.ctx.drawImage(rotateAroundImage, p.x - rotateAroundImage.width / 2, p.y - rotateAroundImage.height / 2);
	}

	/* chain length number */
	if(this.mode == MODE_CHAIN && this.chem.atoms[this.connectToAtom] != null && this.chem.atoms[this.connectToAtom].bo[0] >= 0)
	{
		//var lastToM = vector(this.wtos(this.chem.atoms[this.connectToAtom]),this.lastPos);
		var diff = this.chem.atoms.length - this.newCount;
		var dX = 0.25 * (vector(this.wtos(this.chem.atoms[this.chem.atoms[this.connectToAtom].bo[0]]), this.wtos(this.chem.atoms[this.connectToAtom]))
			.x);
		var dY = 0.25 * (vector(this.wtos(this.chem.atoms[this.chem.atoms[this.connectToAtom].bo[0]]), this.wtos(this.chem.atoms[this.connectToAtom]))
			.y);
		this.ctx.fillStyle = "#000000";
		this.ctx.fillText(this.chem.atoms.length - diff, this.wtos(this.chem.atoms[this.connectToAtom])
			.x + dX, this.wtos(this.chem.atoms[this.connectToAtom])
			.y + dY);
	}

	/* draw lasso path */
	if(this.lassoPath.length > 0)
	{
		this.ctx.fillStyle = this.selectAreaStyle.fill;
		this.ctx.beginPath();
		for(var i = 0; i < this.lassoPath.length; i++)
		{
			if(!i) this.ctx.moveTo(this.lassoPath[i].x, this.lassoPath[i].y);
			this.ctx.lineTo(this.lassoPath[(i + 1) % this.lassoPath.length].x, this.lassoPath[(i + 1) % this.lassoPath.length].y);

		}
		this.ctx.closePath();
		this.ctx.fill();
	}
}

var Rings = [
	(new Chemical())
	.makeRing(6, true), (new Chemical())
	.makeRing(3, false), (new Chemical())
	.makeRing(4, false), (new Chemical())
	.makeRing(5, false), (new Chemical())
	.makeRing(6, false), (new Chemical())
	.makeRing(7, false)
];
