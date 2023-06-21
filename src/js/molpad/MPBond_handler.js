/**
 * This file is part of MolView (http://molview.org)
 * Copyright (c) 2014-2023 Herman Bergwerf
 */

MPBond.prototype.getHandler = function()
{
	if(this.mp.tool.type === "bond")
	{
		return {
			scope: this,
			onPointerDown: function(e, mp)
			{
				if(mp.tool.data.type)
				{
					this.scope.setType(mp.tool.data.type === MP_BOND_TRIPLE ? MP_BOND_TRIPLE :
						(this.scope.type === MP_BOND_TRIPLE || this.scope.stereo !== MP_STEREO_NONE) ? mp.tool.data.type :
							this.scope.type === MP_BOND_SINGLE ? MP_BOND_DOUBLE : MP_BOND_SINGLE);
					this.scope.setStereo(MP_STEREO_NONE);
				}
				else if(mp.tool.data.stereo)
				{
					this.scope.setType(MP_BOND_SINGLE);

					if(this.scope.stereo === mp.tool.data.stereo)
					{
						var f = this.scope.from;
						this.scope.setFrom(this.scope.to);
						this.scope.setTo(f);
					}
					else
					{
						this.scope.setStereo(mp.tool.data.stereo);
					}
				}
			}
		};
	}
	else if(this.mp.tool.type === "fragment" && this.mp.tool.data.frag.toBond !== undefined)
	{
		return {
			scope: this,
			data: {},
			onPointerDown: function(e, mp)
			{
				var p = new MPPoint().fromRelativePointer(e, mp);
				var f = mp.mol.atoms[this.scope.from].center;
				var t = mp.mol.atoms[this.scope.to].center;
				var a = f.angleTo(t);

				//clone new fragment and transform it
				this.data.frag = MPFragments.rotate(
					MPFragments.translate(
						MPFragments.scale(
							MPFragments.clone(mp.tool.data.frag.toBond),
							mp.s.bond.length),
						f.x, f.y), f, a);

				//create and select the fragment and store the new fragment data
				var frag = mp.mol.createFragment(this.data.frag, true);

				//IMPORTANT: do not merge the other way around or the scope will be lost
				frag.atoms = mapArray(frag.atoms, mp.mol.mergeAtoms(frag.atoms[0], this.scope.from).amap);
				frag.atoms = mapArray(frag.atoms, mp.mol.mergeAtoms(frag.atoms[frag.atoms.length - 1], this.scope.to).amap);

				//resolve selection.mirrorSide
				var s = 0;
				for(var i = 0; i < frag.atoms.length; i++)
				{
					s += mp.mol.atoms[frag.atoms[i]].center.lineSide(this.scope.getLine());
				}
				mp.sel.mirrorSide = s > 0 ? 1 : -1;

				//get number collapsing atoms
				var collA = mp.mol.countCollapses(frag.atoms);

				//mirror fragment
				for(var i = 0; i < frag.atoms.length; i++)
				{
					mp.mol.atoms[frag.atoms[i]].center.mirror(
							this.scope.getLine(), -mp.sel.mirrorSide);
				}

				//get new number collapsing atoms
				var collB = mp.mol.countCollapses(frag.atoms);

				//check if new fragment is already added
				if(collA === frag.atoms.length && collB === frag.atoms.length)
				{
					this.data.lock = true;

					//deselect this
					this.scope.select(false);
					mp.mol.atoms[this.scope.from].select(false);
					mp.mol.atoms[this.scope.to].select(false);

					mp.sel.remove();
					return;
				}

				//mirror back if old number of collapsing atoms is lower
				if(collA < collB)
				{
					for(var i = 0; i < frag.atoms.length; i++)
					{
						mp.mol.atoms[frag.atoms[i]].center.mirror(
								this.scope.getLine(), mp.sel.mirrorSide);
					}

					this.data.lock = collB === frag.atoms.length;
				}
				else
				{
					mp.sel.mirrorSide = -mp.sel.mirrorSide;
					this.data.lock = collA === frag.atoms.length;
				}
			},
			onPointerMove: function(e, mp)
			{
				if(this.data.lock) return;//do not mirror fragment if mirror is useless
				var p = new MPPoint().fromRelativePointer(e, mp);
				mp.sel.mirror(this.scope.getLine(), p);
			},
			onPointerUp: function(e, mp)
			{
				mp.sel.collapse();
				mp.sel.clear();
			}
		};
	}
	else if(this.mp.tool.type === "erase")
	{
		return {
			scope: this,
			onPointerDown: function(e, mp)
			{
				if(this.scope.isSelected()) mp.sel.remove();
				else mp.mol.removeBond(this.scope.index);

				//dismiss all further calls to this handler
				mp.pointer.handler = undefined;
			}
		};
	}
	else//drag, fallback
	{
		return {
			scope: this,
			data: {},
			onPointerMove: function(e, mp)
			{
				mp.setCursor("move");
				var p = new MPPoint().fromRelativePointer(e, mp);
				var dx = p.x - mp.pointer.old.r.x;
				var dy = p.y - mp.pointer.old.r.y;

				if(Math.sqrt(dx * dx + dy * dy) > mp.s.draggingThreshold || this.data.moved)
				{
					this.data.moved = true;

					if(this.scope.isSelected() && mp.sel.cache.atoms.length > 0)
					{
						mp.sel.translate(dx, dy);
					}
					else
					{
						mp.mol.atoms[this.scope.from].translate(dx, dy);
						mp.mol.atoms[this.scope.to].translate(dx, dy);
					}

					mp.pointer.old.r = p;
				}
			},
			onPointerUp: function(e, mp)
			{
				if(!this.data.moved && oneOf(mp.tool.type, ["select", "drag"]))
				{
					var s = !this.scope.isSelected();
					this.scope.select(s);

					if(mp.sel.cache.atoms.length === 0)
					{
						mp.mol.atoms[this.scope.from].select(s);
						mp.mol.atoms[this.scope.to].select(s);
					}

					mp.sel.updateRotationCenter();
				}
				else
				{
					if(this.scope.isSelected()) mp.sel.collapse();
					else mp.mol.collapseAtoms([this.scope.from, this.scope.to], true);

					/* process possible changes to
					rotation center caused by collapsing */
					mp.sel.updateRotationCenter();
				}
			}
		};
	}
}

/**
 * Handler for mouse events
 * @param  {MPPoint} point Event origin
 * @param  {String}  type  Event type (hover || active)
 * @return {Boolean}       Indicates if event is handled by this MPBond
 */
MPBond.prototype.handle = function(point, type)
{
	if(this.line === undefined) return false;

	var r = this.mp.s.bond.radiusScaled;

	if(point.inLineBox(this.line.from, this.line.to, r))
	{
		if(point.lineDistance(this.line.from, this.line.to) <= r)
		{
			this.setDisplay(type);
			return true;
		}
	}

	this.setDisplay("normal");
	return false;
}

MPBond.prototype.handleRectSelect = function(rect)
{
	if(this.line === undefined) return;
	this.select(this.line.center.inRect(rect));
}

MPBond.prototype.handlePolygonSelect = function(polygon)
{
	if(this.line === undefined) return;
	this.select(this.line.center.inPolygon(polygon));
}
