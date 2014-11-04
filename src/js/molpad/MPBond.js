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

var MP_BOND_SINGLE = 1;
var MP_BOND_DOUBLE = 2;
var MP_BOND_TRIPLE = 3;

var MP_STEREO_UP = 1;
var MP_STEREO_DOWN = 6;

function MPBond()
{
	this.type = 0;
	this.stereo = 0;
	this.from = 0;
	this.to = 0;
}

/**
* Data manipulation
*/

MPBond.prototype.getType = function() { return this.type; }
MPBond.prototype.setType = function(type) { this.type = type; }

MPBond.prototype.getStereo = function() { return this.stereo; }
MPBond.prototype.setStereo = function(stereo) { this.stereo = stereo; }

MPBond.prototype.getFrom = function() { return this.from; }
MPBond.prototype.setFrom = function(from) { this.from = from; }

MPBond.prototype.getTo = function() { return this.to; }
MPBond.prototype.setTo = function(to) { this.to = to; }

/**
* Render methods
*/

MPBond.prototype.drawSelectionColor = function(ctx, settings)
{

}

MPBond.prototype.drawBond = function(ctx, settings, mp)
{
	var fromP = mp.molecule.atoms[this.from].getPosition();
	var toP = mp.molecule.atoms[this.to].getPosition();

	ctx.beginPath();
	ctx.moveTo(fromP.x, fromP.y + .5);//add .5 to fix blurry lines
	ctx.lineTo(toP.x, toP.y + .5);
	ctx.closePath();

	ctx.strokeStyle = settings.bondColor;
	ctx.lineWidth = settings.bondWidth / (settings.layoutRelative ?
		1 ://relative width
		mp.getScale());//constant width
	ctx.lineCap = settings.bondLineCap;
	ctx.stroke();
}

MPBond.prototype.drawSelectionOutline = function(ctx, settings)
{

}
