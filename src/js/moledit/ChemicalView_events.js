/*===========================================================================*/
/*                     (c) Copyright 2014, MolSoft L.L.C.                    */
/*                          ALL RIGHTS RESERVED                              */
/*                               v. 1.2.4                                    */
/*===========================================================================*/

/*
Used and modified for MolView with permission from MolSoft L.L.C.
See: http://molview.org
*/

ChemicalView.prototype.canSelect = function (ev)
{
	return (this.h_atom == -1 && this.h_bond == -1
		&& (!this.activeTool || this.activeTool.toolType != "chain")
		&& this.chem.atoms.length > 0//no select when there are no atoms
		//(allows user to create new atoms when atom is cleared)
		&& this.activeTool.toolType != "atom");//allow to draw multiple single atoms
}

ChemicalView.prototype.getMousePos = function (ev, isTouch)
{
	var rect = this.canvas.getBoundingClientRect();

	return {
		x: ((isTouch ? ev.touches[0].clientX : ev.clientX) - rect.left) * this.scaleFactor,
		y: ((isTouch ? ev.touches[0].clientY : ev.clientY) - rect.top) * this.scaleFactor,
		z: 0
	};
}

ChemicalView.prototype.getMousePosArr = function (ev)
{
	var rect = this.canvas.getBoundingClientRect();
	var res = [];
	for(var i = 0; i < ev.targetTouches.length; i++)
	{
		res.push(
		{
			x: (ev.touches[i].clientX - rect.left) * this.scaleFactor,
			y: (ev.touches[i].clientY - rect.top) * this.scaleFactor,
			z: 0
		});
	}
	return res;
}

ChemicalView.prototype.onMouseDown = function (ev, isTouch)
{	
	var that = this;
	this.button = 0;
	
	if(isTouch && ev.targetTouches.length > 1)
	{
		//multi-touch
		this.lastPosArr = this.getMousePosArr(ev);
		return;
	}

	if(typeof ev.button != "undefined") this.button = ev.button;

	var p = this.getMousePos(ev, isTouch);

	this.newCount = 0;

	this.mode = MODE_NORMAL;

	switch(this.button)
	{
		//right
		case 2: break;
		
		//middle
		case 1:
			this.lastPos = this.endPos = p;
			break;
		
		//left
		case 0:
			this.h_atom = this.chem.findClosestAtom(this.stow(p));
			this.h_bond = -1;
			if(this.h_atom == -1)
				this.h_bond = this.chem.findClosestBond(this.stow(p));

			if(this.h_atom == -1 && this.h_bond == -1 && p.x <= this.canvas.width * 0.05)
			{

				this.lastPos = this.endPos = p;
				this.mode = MODE_ZOOM;
				return;
			}

			/* MODIFIED */
			if(this.canSelect())
			{
				this.mode = this.selectType;
				this.h_atom = -1;
				this.lastPos = this.endPos = p;
				this.lassoPath = [];
				return;
			}

			if(this.activeTool && this.activeTool.toolType == "chain")
			{
				this.mode = MODE_CHAIN;
				this.lastPos = p;
			}

			//if there is one line(atom) already
			//at.ms&M_CE means atom is selected
			if(this.h_atom != -1)
			{
				var at = this.chem.atoms[this.h_atom];
				if(this.activeTool && !(at.ms & M_CE) && this.activeTool.toolType == "atom")
				{
					this.undoPush();
					var atts = {}
					if(typeof this.activeTool.panel != "undefined") atts = this.activeTool.panel.getSearchAtts();
					this.chem.changeAtom(this.h_atom, this.activeTool.cd == null ? -1 : Elements[this.activeTool.cd], atts);
					this.changed();
				}
				else if(this.activeTool && !(at.ms & M_CE) && this.activeTool.toolType.indexOf("charge") != -1)
				{
					this.undoPush();
					
					//CUSTOM charge logic
					var atom = this.chem.atoms[this.h_atom];
					atom.ms |= M_EXPLICT_QFM;
					atom.qfm += this.activeTool.toolType.substr(7) == "add" ? 1 : -1;
					
					this.changed();
				}
				else if(this.activeTool && !(at.ms & M_CE) && this.activeTool.toolType == "bond")
				{
					this.undoPush();
					this.lastPos = p;
					this.connectToAtom = this.h_atom;
					//this.updateZoom = true;
					this.dragAtoms = this.chem.connectTo(this.h_atom, this.activeTool.ty, null, -1);
				}
				else if(this.activeTool && this.activeTool.toolType == "chain")
				{
					this.undoPush();
					this.lastPos = p;
					this.h_atom = this.chem.findClosestAtomLong(this.stow(p));
					this.connectToAtom = this.h_atom;
					//this.chem.connectTo(this.h_atom,this.activeTool.ty,null,-1);
				}
				else if(this.activeTool && !(at.ms & M_CE) && this.activeTool.toolType.substr(0, 4) == "frag")
				{
					this.undoPush();
					this.lastPos = p;
					this.connectToAtom = this.h_atom;
					//this.updateZoom = true;
					this.dragAtoms = this.chem.connectTo(this.h_atom, this.activeTool.ty, Rings[parseInt(this.activeTool.toolType.substr(5, 1))], 0);
				}
				else if(this.activeTool && this.activeTool.toolType == "eraser")
				{
					this.undoPush();
					this.chem.removeAtoms(this.getDragAtoms());
					this.h_bond = this.h_atom = -1;
					this.changed();
				}
				else
				{
					this.undoPush(true);
					this.lastPos = p;
					this.mode = MODE_DRAG_ATOMS;
					this.dragAtoms = this.getDragAtoms();
				}
				this.drawMol();
			}
			else
			{
				if(this.h_bond != -1)
				{
					if(this.activeTool && this.activeTool.toolType == "bond")
					{
						this.undoPush();
						this.chem.bondToggle(this.h_bond, this.activeTool.ty);
					}
					else if(this.activeTool && this.activeTool.toolType.substr(0, 4) == "frag")
					{
						this.undoPush();
						//this.updateZoom = true;
						this.chem.connectToBond(this.h_bond, Rings[parseInt(this.activeTool.toolType.substr(5, 1))]);
						this.changed();
					}
					else if(this.activeTool && this.activeTool.toolType == "eraser")
					{
						this.undoPush();
						this.chem.removeBonds([this.h_bond]);
						this.h_bond = this.h_atom = -1;
						this.changed();
					}
					else
					{
						this.undoPush();
						this.lastPos = p;
						this.dragAtoms = [];
						if(this.chem.bonds[this.h_bond].ms & M_CE)
						{
							this.chem.bonds.forEach(
								function (bo)
								{
									if(bo.ms & M_CE) that.dragAtoms.push(bo.fr);
									if(bo.ms & M_CE) that.dragAtoms.push(bo.to);
								}
							);
							this.mode = MODE_DRAG_ATOMS;
							this.dragAtoms = this.dragAtoms.sort(function (a, b)
							{
								return a - b;
							})
								.unique();
						}
						else
						{
							this.dragAtoms = [this.chem.bonds[this.h_bond].fr, this.chem.bonds[this.h_bond].to];
							this.mode = MODE_DRAG_ATOMS;
						}
						//this.chem.bondToggle(bo,-1);
					}
					this.drawMol();
				}
				else
				{
					if(this.activeTool.toolType.substr(0, 4) == "frag"
					|| this.activeTool.toolType == "bond"
					|| this.activeTool.toolType == "atom"
					|| this.activeTool.toolType == "chain")
					{

						var updateZoom = this.chem.atoms.length == 0 && this.dx == 0 && this.dy == 0;
						var ch = null;

						if(this.activeTool.toolType.substr(0, 4) == "frag")
						{
							ch = Rings[parseInt(this.activeTool.toolType.substr(5, 1))];
						}
						else if(this.activeTool.toolType == "bond")
						{
							ch = (new Chemical())
								.makeBond(0, this.activeTool.ty);
						}
						else if(this.activeTool.toolType == "atom" && this.activeTool.cd != null)
						{
							ch = (new Chemical())
								.makeAtom(Elements[this.activeTool.cd]);
						}
						else if(this.activeTool.toolType == "chain")
						{
							//ch = (new Chemical()).makeBond(30,this.activeTool.ty); 	  
							ch = (new Chemical())
								.makeAtom(6);
						}
						if(ch != null)
						{
							this.undoPush();
							if(updateZoom) this.updateKfc(ch, 16);
							this.chem.placeFragment(this.stow(p), ch);
							if(this.activeTool.toolType == "chain")
								this.connectToAtom = this.chem.atoms.length - 1;
							//console.log(this.chem.atoms[this.chem.findClosestAtom(this.stow(p))]);
							this.changed();
							this.drawMol();
						}
					}
				}
			}

			break;
	}
}

ChemicalView.prototype.onMouseMove = function (ev, isTouch)
{
	if(this.button != -1)
		ev.preventDefault();
	
	var that = this;

	if(isTouch && ev.targetTouches.length > 1)
	{
		//multi-touch
		if(this.button == -1) return;
		
		var p = this.getMousePosArr(ev);

		if(p.length == this.lastPosArr.length)
			this.multiTouch(this.lastPosArr, p);

		this.lastPosArr = p;
		return;
	}

	var p = this.getMousePos(ev, isTouch);

	var h_at = this.chem.findClosestAtom(this.stow(p));

	var manhatanD = 0;

	if(this.lastPos != null)
		manhatanD = Math.max(Math.abs(p.y - this.lastPos.y), Math.abs(p.x - this.lastPos.x));

	if(this.button == 1)//mid button translate
	{
		if(manhatanD > 1)
		{
			this.dx += p.x - this.lastPos.x;
			this.dy += p.y - this.lastPos.y;
			this.updateZoom = false;
			this.drawMol();
		}
		this.lastPos = p;
		return
	}

	if(this.mode == MODE_ZOOM && Math.abs(p.y - this.lastPos.y) > 5)
	{
		var p1 = this.wtos(this.chem.centerPoint());
		this.kfc *= (p.y < this.lastPos.y) ? 1.02 : 0.98
		var p2 = this.wtos(this.chem.centerPoint());
		this.dx += p1.x - p2.x;
		this.dy += p1.y - p2.y;
		this.lastPos = p;
		this.updateZoom = false;
		this.drawMol();
		return
	}

	//drag atoms
	/* MODIFIED */
	if(this.mode == MODE_DRAG_ATOMS)
	{
		if(manhatanD <= 4) return;
		
		if(this.rotateAroundPoint != null)
		{
			var vect = vector(this.rotateAroundPoint, this.stow(p));
			
			if(vectorLength(vector(this.rotateAroundPoint, this.chem.atoms[this.h_atom])) < 0.001)
				return;//because the h_atom is the center of rotation
				
			if(vectorLength(vect) < 0.001)
				return;
				
			this.chem.rotateAtomsVector(this.dragAtoms, this.rotateAroundPoint, vect, -1);
		}
		else this.chem.moveAtoms(this.dragAtoms, this.stowd(vesub(p, this.lastPos)));

		this.lastPos = p;
		this.drawMol();
		return;
	}
	
	//rect selection
	if(this.mode == MODE_RECT_SEL)
	{
		if(manhatanD <= 4) return;
		this.endPos = p;
		this.lassoPath = [
		{
			x: Math.min(this.lastPos.x, this.endPos.x),
			y: Math.max(this.lastPos.y, this.endPos.y)
		},
		{
			x: Math.max(this.lastPos.x, this.endPos.x),
			y: Math.max(this.lastPos.y, this.endPos.y)
		},
		{
			x: Math.max(this.lastPos.x, this.endPos.x),
			y: Math.min(this.lastPos.y, this.endPos.y)
		},
		{
			x: Math.min(this.lastPos.x, this.endPos.x),
			y: Math.min(this.lastPos.y, this.endPos.y)
		}];
		this.chem.updateAtomSelection(this.lassoPath.map(function (x)
		{
			return that.stow(x);
		}));
		this.drawMol();
		return;
	}
	
	//lasso selection
	/* MODIFIED */
	if(this.mode == MODE_LASSO_SEL && this.h_atom == -1 && this.lastPos != null)
	{
		if(!this.lassoPath.length || vectorLength(vector(p, this.lassoPath[this.lassoPath.length - 1])) > 8)
		{
			this.lassoPath.push(p);
			this.chem.updateAtomSelection(this.lassoPath.map(function (x)
			{
				return that.stow(x);
			}));
			this.drawMol();
		}
		return;
	}
	
	//chain draw
	if(this.mode == MODE_CHAIN)
	{
		if(manhatanD <= 4) return;
		this.endPos = p;
		this.atomHold = -1;

		if(this.connectToAtom == -1)
			return;

		var connectTo = this.connectToAtom;
		var nbo = this.chem.atoms[connectTo].bo.length;
		var neiBo = nbo ? this.chem.atoms[connectTo].bo[0] : -1;

		var canDrawCheck = this.canDraw == null ? true : false;

		var mouseDir = vector(this.stow(this.lastPos), this.stow(p));
		var bondDir = neiBo != -1 ? vector(this.chem.atoms[neiBo], this.chem.atoms[connectTo]) : mouseDir;
		var angle = Math.acos(scmul(mouseDir, bondDir) / (vectorLength(bondDir) * vectorLength(mouseDir)));
		var closest = this.chem.findClosestAtomLong(this.stow(p));

		var d0 = vectorLength(vector(this.stow(p), this.chem.atoms[neiBo == -1 ? connectTo : neiBo]));
		var d1 = vectorLength(vector(this.stow(p), this.chem.atoms[connectTo]));
		if(this.chem.atoms.length > 1 && this.newCount == 0)
		{
			var v1;
			var v2 = vector(this.chem.atoms[connectTo], this.stow(p));
			for(var i = 0; i < this.chem.atoms[connectTo].bo.length; i++)
			{
				v1 = vector(this.chem.atoms[connectTo], this.chem.atoms[this.chem.atoms[connectTo].bo[i]]);
				if(angleBetween(v1, v2) < 60)
					return;
			}
		}
		//console.log(canDrawCheck);

		this.showStatus("Press <b>Alt</b> and move mouse to other atom to close the loop");

		if(d1 > 1.2 && d0 > 1.2 && !this.chem.hasCollisions(connectTo) && canDrawCheck)
		{
			//quickfind
			
			if(this.newCount == 0)
				this.atomHold = this.connectToAtom;
			if(ev.altKey)
			{
				if(h_at != -1 && h_at != connectTo)
				{
					var newat = clone_object(this.chem.atoms[h_at]);
					this.chem.atoms.push(newat);
					this.chem.bonds.push(
					{
						fr: connectTo,
						to: this.chem.atoms.length - 1,
						ty: 1,
						ms: 0
					});
					this.connectToAtom = this.chem.atoms.length - 1;
					this.chem.processChemical();
					this.newCount++;
					this.lastPos = p;
				}
			}
			else
			{
				this.chem.chainTo(connectTo, 1, this.stow(this.lastPos), this.stow(p));
				var at = this.chem.atoms[this.connectToAtom];
				this.connectToAtom = at.bo[at.bo.length - 1];
				this.newCount++;
				this.lastPos = p;
			}
		}
		else if(d0 > 0.6 && d0 < 1.2 && neiBo != -1 && nbo == 1)
		{
			var close;
			if(vectorLength(vector(this.chem.atoms[closest], this.stow(p))) <= 1.2 && this.chem.findShortestPath(this.connectToAtom, closest)
				.length < 2)
			{
				close = closest;
			}
			else
			{
				close = -1;
			}
			if(close != -1 && this.newCount > 0)
			{
				for(var i = 0; i < this.chem.atoms.length - close; i++)
				{
					this.chem.removeAtoms([this.connectToAtom]);
					this.h_atom = this.h_bond = -1;
					this.connectToAtom--;
					this.newCount--;
					if(this.chem.atoms.length == 0)
						this.connectToAtom = -1;
				}
				if(this.chem.atoms.length > 0 && this.newCount == 0 && this.chem.atoms[this.connectToAtom].bo.length >= 1)
				{
					this.connectToAtom = this.atomHold;
				}
				//console.log(this.connectToAtom);
			}
		}
		else if(angle > Math.PI / 2 && d0 < 0.6 && neiBo != -1 && nbo == 1 && this.newCount > 0)
		{
			this.chem.removeAtoms([this.connectToAtom]);
			this.h_atom = this.h_bond = -1;
			this.connectToAtom = neiBo;
			this.newCount--;
			if(this.chem.atoms.length == 0)
				this.connectToAtom = -1;
			this.lastPos = p;
		}
		this.drawMol();
		return;
	}

	//rotate newly added fragment 
	if(this.dragAtoms.length > 0 && this.connectToAtom != -1 && manhatanD > 5)
	{
		if(this.activeTool)
		{
			var vect = vector(this.chem.atoms[this.connectToAtom], this.stow(p));
			if(vectorLength(vect) < 0.001)
				return;

			this.h_atom = this.chem.findClosestAtom(this.stow(p));
			if(this.h_atom == this.connectToAtom)
				this.h_atom = -1;

			this.chem.rotateAtomsVector(this.dragAtoms, this.chem.atoms[this.connectToAtom], vect, this.h_atom);
		}

		this.lastPos = p;
		this.drawMol();
		return;
	}
	
	//highlight atom or bond
	var redraw = false;
	h_at = this.chem.findClosestAtom(this.stow(p));
	if(h_at != this.h_atom)
	{
		this.h_atom = h_at;
		redraw = true;
	}

	//update
	this.rotateAroundPoint = null;
	if(this.h_atom != -1 && (this.chem.atoms[this.h_atom].ms & M_CE)
		&& this.getDragAtoms().length > 1)//can't rotate one atom
	{
		var apo = this.chem.apoFromSelection(M_CE);
		if(apo.length == 1)
			this.rotateAroundPoint = {
				x: this.chem.atoms[apo[0]].x,
				y: this.chem.atoms[apo[0]].y,
				z: 0
			};
		else if(apo.length == 0)
			this.rotateAroundPoint = this.chem.centerPoint();
	}
	
	//or find closest bond
	if(h_at == -1)
	{
		var bo = this.chem.findClosestBond(this.stow(p));
		if(bo != this.h_bond)
		{
			this.h_bond = bo;
			redraw = true;
		}
	}
	else
	{
		redraw == this.h_bond != -1;
		this.h_bond = -1;
	}

	if(this.h_atom != -1)
	{
		this.showStatus("<b>Hint</b>: to change atom type press 'C','N','O',etc.. ");
	}
	else if(this.h_bond != -1)
	{
		this.showStatus("<b>Hint</b>: to change bond type press '-','=','#','u','d'");
	}
	else this.clearStatus();

	if(redraw) this.drawMol();
}

ChemicalView.prototype.onMouseUp = function (ev)
{	
	this.clearStatus();
	if(this.dragAtoms.length > 0)
	{
		this.chem.gravitateCollisions();
		this.changed(true);
	}
	else if(this.mode == MODE_CHAIN)
	{
		this.chem.gravitateCollisions();
		if(this.chem.atoms.length == 1 || (this.newCount == 0 && this.chem.atoms[this.connectToAtom].bo.length == 0))
		{
			this.chem.removeAtoms([this.chem.atoms.length - 1]);
			this.h_atom = this.h_bond = -1;
			this.connectToAtom = -1;
		}
	}
	this.mode = MODE_NORMAL;
	this.endPos = this.lastPos = null;
	this.lastPosArr = [];
	this.lassoPath = [];
	this.dragAtoms = [];
	this.connectToAtom = -1;
	this.button = -1;
	this.drawMol();
}

ChemicalView.prototype.multiTouch = function (pp1, pp2)
{
	if(pp1.length != pp2.length || pp1.length < 2)
		return;

	var d = vemulby(veadd(vesub(pp2[0], pp1[0]), vesub(pp2[1], pp1[1])), 0.5);

	//z-rot
	//if(Math.max( Math.abs(d.x), Math.abs(d.y) ) < 5)
	
	var d1 = vectorLength(vesub(pp1[0], pp2[0]));
	var d2 = vectorLength(vesub(pp1[1], pp2[1]));

	var pc = null;
	var p1, p2;
	if(d1 < d2)
	{
		pc = vemulby(veadd(pp1[0], pp2[0]), 0.5)
		p1 = pp1[1];
		p2 = pp2[1]
	}
	else
	{
		pc = vemulby(veadd(pp1[1], pp2[1]), 0.5)
		p1 = pp1[0];
		p2 = pp2[0]
	}
	if(pc != null)
	{
		var v1 = vesub(p1, pc);
		var v2 = vesub(p2, pc);
		var angle = Math.acos(scmul(v1, v2) / (vectorLength(v1) * vectorLength(v2))) * vemulZSign(v2, v1);
		if(Math.abs(angle) > 0.001)
		{
			var atli = [];
			for(var i = 0; i < this.chem.atoms.length; i++) atli.push(i);
			this.chem.rotateAtomsAround(atli, this.stow(pc), angle);
		}
	}
	
	//zoom & translate
	d1 = vectorLength(vesub(pp1[0], pp1[1]));
	d2 = vectorLength(vesub(pp2[0], pp2[1]));

	var pc1 = vemulby(veadd(pp1[0], pp1[1]), 0.5);
	var wpc1 = this.stow(pc1);
	this.kfc *= d2 / d1;
	var pc2 = this.wtos(wpc1);

	this.dx += pc1.x - pc2.x + d.x;
	this.dy += pc1.y - pc2.y + d.y;

	// 
	this.updateZoom = false;
	this.drawMol();
}
