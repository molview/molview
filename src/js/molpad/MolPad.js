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
function MolPad(container)
{
	this.molecule = {
		atoms: [],
		bonds: []
	};
	this.settings = {
		zoomSpeed: 0.2,
		removeImplicitHydrogen: true,
		drawSkeletonFormula: true,
		relativePadding: 0.2,
		bondLength: 100,
		fontSize: 20,
		fontStyle: "bold",
		fontFamily: "'Open Sans'"
	};
	this.pointer = {
		old: { x: 0, y: 0 },
		drag: false
	};

	this.stage = new Kinetic.Stage({
		container: container,
		width: container.offsetWidth,
		height: container.offsetHeight
	});

	this.layer = new Kinetic.Layer();
	this.stage.add(this.layer);

	this.mainGroup = new Kinetic.Group();

	this.groups = {};
	this.groups.selectionColor = new Kinetic.Group();
	this.groups.bonds = new Kinetic.Group();
	this.groups.atomLabels = new Kinetic.Group();
	this.groups.selectionOutline = new Kinetic.Group();
	this.groups.selectionArea = new Kinetic.Group();

	this.mainGroup.add(this.groups.selectionColor);
	this.mainGroup.add(this.groups.bonds);
	this.mainGroup.add(this.groups.atomLabels);
	this.mainGroup.add(this.groups.selectionOutline);
	this.mainGroup.add(this.groups.selectionArea);

	this.layer.add(this.mainGroup);

	var scope = this;

	jQuery(container).on('DOMMouseScroll mousewheel', function(e)
	{
		e.preventDefault();

		if(e.originalEvent.detail)
		{
			scope.onScroll(e.originalEvent.detail / 3);
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

/**
 * Resizes MolPad using the container dimensions
 */
MolPad.prototype.resize = function()
{
	this.stage.setWidth(this.stage.container().offsetWidth);
	this.stage.setHeight(this.stage.container().offsetHeight);
}

MolPad.prototype.getWidth = function()
{
	return this.stage.getWidth();
}

MolPad.prototype.getHeight = function()
{
	return this.stage.getHeight();
}

MolPad.prototype.clear = function()
{
	for(var i = 0; i < this.molecule.atoms.length; i++)
	{
		this.molecule.atoms[i].destroy();
	}
	for(var i = 0; i < this.molecule.bonds.length; i++)
	{
		this.molecule.bonds[i].destroy();
	}

	this.molecule = { atoms: [], bonds: [] };
}

/**
 * Load molfile into MolPad
 * Uses Ketcher chem utils
 * @param {String} mol
 */
MolPad.prototype.loadMOL = function(mol)
{
	this.clear();

	var molecule = chem.Molfile.parseCTFile(mol.split("\n"));

	//convert Ketcher data format into MolPad molecule
	var scope = this;

	molecule.atoms.each(function(i, atomData)
	{
		var atom = new MPAtom();
		atom.setPosition({
			x: atomData.pp.x * scope.settings.bondLength,
			y: atomData.pp.y * scope.settings.bondLength
		});
		atom.setElement(atomData.label);
		atom.setCharge(atomData.charge);
		atom.setIsotope(atomData.isotope);
		scope.molecule.atoms.push(atom);
	});

	molecule.bonds.each(function(i, bondData)
	{
		scope.molecule.atoms[bondData.begin].addBond(scope.molecule.bonds.length);
		scope.molecule.atoms[bondData.end].addBond(scope.molecule.bonds.length);

		var bond = new MPBond();
		bond.setType(bondData.type);
		bond.setStereo(bondData.stereo);
		bond.setFrom(bondData.begin);
		bond.setTo(bondData.end);
		scope.molecule.bonds.push(bond);
	});

	if(this.settings.removeImplicitHydrogen)
	{
		this.removeImplicitHydrogen();
	}

	this.center();
}

MolPad.prototype.getMOL = function()
{
	return new chem.MolfileSaver().saveMolecule(this.getKetcherData());
}

MolPad.prototype.getSMILES = function()
{
	if(this.molecule.atoms.length == 0) throw new Error("No atoms found");
 	return new chem.SmilesSaver().saveMolecule(this.getKetcherData());
}

MolPad.prototype.center = function()
{
	var bbox = this.getBBox();

	var layerScale = 1 - 2 * this.settings.relativePadding;
	this.layer.scale({ x: layerScale, y: layerScale });
	this.layer.offsetX(-this.settings.relativePadding * this.getWidth() / layerScale);
	this.layer.offsetY(-this.settings.relativePadding * this.getHeight() / layerScale);

	var sx = this.stage.getWidth() / bbox.width;
	var sy = this.stage.getHeight() / bbox.height;
	if(sx < sy)
	{
		this.mainGroup.setScale({ x: sx, y: sx });
		this.mainGroup.offsetX(bbox.x);
		this.mainGroup.offsetY(bbox.y - (this.getHeight() / sx - bbox.height) / 2);
	}
	else
	{
		this.mainGroup.setScale({ x: sy, y: sy });
		this.mainGroup.offsetY(bbox.y);
		this.mainGroup.offsetX(bbox.x - (this.getWidth() / sy - bbox.width) / 2);
	}

	this.update();
}

MolPad.prototype.move = function(x, y)
{
	this.layer.position({
		x: this.layer.position().x + x / this.stage.getScaleX(),
		y: this.layer.position().y + y / this.stage.getScaleX()
	});
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

MolPad.prototype.setTool = function(type, data)
{

}

MolPad.prototype.onChange = function(cb)
{

}

MolPad.prototype.removeImplicitHydrogen = function()
{

}

MolPad.prototype.toDataURL = function(cb)
{
	this.stage.toDataURL({ callback: cb });
}

/**
 * 'Private' methods
 */

MolPad.prototype.draw = function()
{
	this.stage.draw();
}

MolPad.prototype.redraw = function()
{
	requestAnimationFrame(this.draw.bind(this));
}

MolPad.prototype.update = function()
{
	for(var i = 0; i < this.molecule.atoms.length; i++)
	{
		this.molecule.atoms[i].renderSelectionColor(this.groups.selectionColor, this.settings);
		this.molecule.atoms[i].renderLabel(this.groups.atomLabels, this.settings);
		this.molecule.atoms[i].renderSelectionOutline(this.groups.selectionOutline, this.settings);
	}
	for(var i = 0; i < this.molecule.bonds.length; i++)
	{
		this.molecule.bonds[i].renderSelectionColor(this.groups.selectionColor, this.settings);
		this.molecule.bonds[i].renderBond(this.groups.bonds, this.settings, this.molecule.atoms);
		this.molecule.bonds[i].renderSelectionOutline(this.groups.selectionOutline, this.settings);
	}

	this.redraw();
}

MolPad.prototype.getKetcherData = function()
{
	var molecule = new chem.Struct();

	for(var i = 0; i < this.molecule.atoms.length; i++)
	{
		var pp = this.molecule.atoms[i].getPosition();
		molecule.atoms.add(new chem.Struct.Atom({
			pp: {
				x: pp.x / this.settings.bondLength,
				y: pp.y / this.settings.bondLength
			},
			label: this.molecule.atoms[i].getElement(),
			charge: this.molecule.atoms[i].getCharge(),
			isotope: this.molecule.atoms[i].getIsotope()
		}));
	}
	for(var i = 0; i < this.molecule.bonds.length; i++)
	{
		molecule.bonds.add(new chem.Struct.Bond({
			type: this.molecule.bonds[i].getType(),
			stereo: this.molecule.bonds[i].getStereo(),
			begin: this.molecule.bonds[i].getFrom(),
			end: this.molecule.bonds[i].getTo()
		}));
	}

	molecule.initHalfBonds();
	molecule.initNeighbors();
	molecule.markFragments();

	return molecule;
}
