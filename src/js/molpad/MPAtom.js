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

function MPAtom()
{
	this.position = { x: 0, y: 0 };
	this.element = "C";
	this.charge = 0;
	this.isotope = 0;
	this.bonds = [];
}

/**
 * Data manipulation
 */

MPAtom.prototype.getPosition = function() { return this.position; }
MPAtom.prototype.setPosition = function(position) { this.position = position; }

MPAtom.prototype.getElement = function() { return this.element; }
MPAtom.prototype.setElement = function(element) { this.element = element; }

MPAtom.prototype.getCharge = function() { return this.charge; }
MPAtom.prototype.setCharge = function(charge) { this.charge = charge; }

MPAtom.prototype.getIsotope = function() { return this.isotope; }
MPAtom.prototype.setIsotope = function(isotope) { this.isotope = isotope; }

MPAtom.prototype.addBond = function(bond)
{
	this.bonds.push(bond);
}

/**
 * Render methods
 */

MPAtom.prototype.destroy = function()
{
	if(this.text) this.text.destroy();
	if(this.rect) this.rect.destroy();
}

MPAtom.prototype.renderSelectionColor = function(group)
{

}

MPAtom.prototype.renderLabel = function(group, settings)
{
	if(!(settings.drawSkeletonFormula && this.element == "C"))
	{
		this.text = new Kinetic.Text({
			x: this.position.x,
			y: this.position.y,
			text: this.element,
			fontSize: settings.fontSize,
			fontStyle: settings.fontStyle,
			fontFamily: settings.fontFamily,
			fill: JmolAtomColorsCSS[this.element]
		});

		this.text.position({
			x: this.text.position().x - this.text.getWidth() / 2,
			y: this.text.position().y - this.text.getHeight() / 2
		});

		this.rect = new Kinetic.Rect({
			x: this.text.position().x,
			y: this.text.position().y,
			width: this.text.getWidth(),
			height: this.text.getHeight(),
			fill: "#fff"
		});

		group.add(this.rect);
		group.add(this.text);
	}
}

MPAtom.prototype.renderSelectionOutline = function(group)
{

}
