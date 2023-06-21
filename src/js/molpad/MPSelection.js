/**
 * This file is part of MolView (http://molview.org)
 * Copyright (c) 2014-2023 Herman Bergwerf
 */

function MPSelection(mp)
{
	this.cache = { atoms: [], bonds: [] };
	this.mirrorSide = 1;
	this.startAngle = 0;
	this.currentAngle = 0;
	this.mp = mp;
}

MPSelection.prototype.hasCenter = function()
{
	return typeof this.center === "object";
}

/**
 * Updates the cached selection
 */
MPSelection.prototype.update = function()
{
	this.cache.atoms = [];
	this.cache.bonds = [];

	for(var i = 0; i < this.mp.mol.atoms.length; i++)
	{
		if(this.mp.mol.atoms[i].isSelected())
        {
			this.cache.atoms.push(i);
		}
	}
	for(var i = 0; i < this.mp.mol.bonds.length; i++)
	{
		if(this.mp.mol.bonds[i].isSelected())
        {
			this.cache.bonds.push(i);
		}
	}
}

/**
 * Translate selection
 * Only atoms are translated
 * @param {Float} dx Horizontal translation
 * @param {Float} dy Vertical translation
 */
MPSelection.prototype.translate = function(dx, dy)
{
	for(var i = 0; i < this.cache.atoms.length; i++)
	{
		this.mp.mol.atoms[this.cache.atoms[i]].translate(dx, dy);
	}
}

/**
 * Rotate selection using a mouse pointer
 * @param {MPPoint} pointer
 */
MPSelection.prototype.rotate = function(pointer)
{
	this.currentAngle = this.mp.mol.rotateAtoms(
			this.center, pointer, this.cache.atoms,
			this.currentAngle, this.startAngle,
			this.mp.s.rotateSteps);
}

/**
 * Mirror selection using a pointer and a line
 * @param {Object}  line
 * @param {MPPoint} pointer
 */
MPSelection.prototype.mirror = function(line, pointer)
{
    var s = pointer.lineSide(line);

    if(s !== this.mirrorSide && s !== 0)
    {
        this.mirrorSide = s;

        for(var i = 0; i < this.cache.atoms.length; i++)
        {
            this.mp.mol.atoms[this.cache.atoms[i]].mirror(line, s);
        }
    }
}

/**
 * Clear current selection
 */
MPSelection.prototype.clear = function()
{
	this.mp.mol.exec(function(obj) {
		obj.selected = false;
	}, true, true);
	this.center = undefined;
	this.update();
	this.mp.requestRedraw();
}

/**
 * Collapse current selection
 */
MPSelection.prototype.collapse = function()
{
	this.mp.mol.collapseAtoms(this.cache.atoms.slice());
}


/**
 * Remove current selection
 */
MPSelection.prototype.remove = function()
{
    while(this.cache.atoms.length > 0)
    {
        this.mp.mol.removeAtom(this.cache.atoms[0]);
    }
	while(this.cache.bonds.length > 0)
    {
        this.mp.mol.removeBond(this.cache.bonds[0]);
    }
}

/**
 * Updates selection rotationCenter
 */
MPSelection.prototype.updateRotationCenter = function()
{
	var v = [];
	for(var i = 0; i < this.cache.atoms.length; i++)
	{
		if(this.mp.mol.atoms[this.cache.atoms[i]].hasUnselectedNeighbors())
		{
			v.push(this.cache.atoms[i]);
		}
	}

	if(v.length === 1 && this.cache.atoms.length > 1)
	{
		this.center = this.mp.mol.atoms[v[0]].center;
        this.centerAtom = v[0];
	}
	else
	{
		this.center = undefined;//clear previous rotation center
	}
}
