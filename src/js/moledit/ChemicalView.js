/*===========================================================================*/
/*                     (c) Copyright 2014, MolSoft L.L.C.                    */
/*                          ALL RIGHTS RESERVED                              */
/*                               v. 1.2.4                                    */
/*===========================================================================*/

/*
Used and modified for MolView with permission from MolSoft L.L.C.
See: http://molview.org
*/

/*
Some important changes:
- jQuery
- jMouseWheel
- jquery.hotkeys
- this.bondThicknessHalf
- this.bondStyle
- this.hoverStyle
- this.selectionStyle
- this.selectAreaFillStyle
- this.removeImplicitHydrogen
- this.deselectAll
- this.setElement(element)
- this.getSelectedAtoms
- different charge buttons
*/

function ChemicalView(parent, canvas)
{
	//use this to fix low DPI on mobile
	this.mobile = isMobile();
	this.android = navigator.userAgent.match(/Android/i);
	this.iOS = navigator.userAgent.match(/iPhone|iPad|iPod/i);
	this.touch = isTouchDevice();
	this.scaleFactor = this.mobile ? 1.5 : 1.0;

	this.bondThicknessHalf = 0.2;

	this.bondStyle = {
		width: 1.5,
		stroke: "#111111"
	};
	this.hoverStyle = {
		width: 2,
		join: "square",
		cap: "square",
		stroke: "#ff1100",
		radius: 0.3
	};
	this.selectionStyle = {
		width: 2,
		fill: "#98fb98",
		radius: 0.3
	};
	this.selectAreaStyle = {
		fill: "rgba(255, 85, 0, 0.5)"
	};

	this.drawSelectedBonds = true;
	this.onChanged = undefined;//event called when molecule is changed

	var that = this;
	this.parent = jQuery(parent);
	this.selectType = MODE_RECT_SEL;
	this.toolButtons = [];

	/*
	activeTool = {
		id,
		firstUse,
		toolType,
		cd,
		ty
	}
	*/
	this.activeTool = {
		id: "me-single",
		toolType: "bond",
		ty: 1
	};

	this.atomDislayMask = 0;

	var toolFunc = function(ev)
	{
		that.toolButtonClicked(this);
	}

	jQuery("#moledit .tool-button.mode:not(.custom)").on("mousedown", function(e)
	{
		jQuery("#moledit .tool-button:not(.custom)").not(this).removeClass("tool-button-selected");
		jQuery(this).toggleClass("tool-button-selected");
	});

	jQuery("#me-rect, #me-lasso").on("mousedown", function(e)
	{
		jQuery("#me-rect, #me-lasso").removeClass("tool-button-selected");
	});

	//chem tools
	this.addToolBond(1, "me-single", toolFunc);
	this.addToolBond(2, "me-double", toolFunc);
	this.addToolBond(3, "me-triple", toolFunc);
	this.addToolBond(4, "me-updown", toolFunc);
	this.addTool("frag-0", "me-frag-0", toolFunc);
	this.addTool("frag-1", "me-frag-1", toolFunc);
	this.addTool("frag-2", "me-frag-2", toolFunc);
	this.addTool("frag-3", "me-frag-3", toolFunc);
	this.addTool("frag-4", "me-frag-4", toolFunc);
	this.addTool("frag-5", "me-frag-5", toolFunc);
	this.addTool("chain", "me-chain", toolFunc);
	this.addTool("charge-add", "me-charge-add", toolFunc);
	this.addTool("charge-sub", "me-charge-sub", toolFunc);

	//edit tools
	this.addTool("new", "me-new", function(){ that.clearMol(); });
	this.addTool("eraser", "me-eraser", toolFunc);
	this.addTool("move", "me-move", toolFunc);
	this.addTool("undo", "me-undo", function(){ that.undo(); });
	this.addTool("redo", "me-redo", function(){ that.redo(); });

	this.addTool("rect", "me-rect", function()
	{
		that.selectType = MODE_RECT_SEL;
		that.activeTool = { id: "me-move", toolType: "move" };

		jQuery("#moledit .tool-button:not(.custom)").removeClass("tool-button-selected");
		jQuery("#me-move").addClass("tool-button-selected");
		jQuery("#me-rect").addClass("tool-button-selected");
	});
	this.addTool("lasso", "me-lasso", function()
	{
		that.selectType = MODE_LASSO_SEL;
		that.activeTool = { id: "me-move", toolType: "move" };

		jQuery("#moledit .tool-button:not(.custom)").removeClass("tool-button-selected");
		jQuery("#me-move").addClass("tool-button-selected");
		jQuery("#me-lasso").addClass("tool-button-selected");
	});
	this.addTool("deselect", "me-deselect", function()
	{
		that.deselectAll();
		that.drawMol();
	});
	this.addTool("center", "me-center", function()
	{
		that.updateZoom = true;
		that.drawMol();
	});

	//elements
	this.addToolAtom("H", "me-atom-h", toolFunc);
	this.addToolAtom("C", "me-atom-c", toolFunc);
	this.addToolAtom("N", "me-atom-n", toolFunc);
	this.addToolAtom("O", "me-atom-o", toolFunc);
	this.addToolAtom("S", "me-atom-s", toolFunc);
	this.addToolAtom("F", "me-atom-f", toolFunc);
	this.addToolAtom("Cl", "me-atom-cl", toolFunc);
	this.addToolAtom("Br", "me-atom-br", toolFunc);
	this.addToolAtom("I", "me-atom-i", toolFunc);
	this.addToolAtom("P", "me-atom-p", toolFunc);

	//setup canvas
	this.canvas = canvas;
	this.canvas.style.backgroundColor = "#ffffff";

	this.canvas.width = this.parent.width() * this.scaleFactor;
	this.canvas.height = this.parent.height() * this.scaleFactor;
	jQuery(this.canvas).css({
		"width": this.parent.width(),
		"height": this.parent.height()
	});

	this.canvas.onselectstart = function(ev)
	{
		ev.preventDefault();
		return false;
	}

	this.undoStack = [];
	this.redoStack = [];

	this.chem = new Chemical();
	this.chemIsReady = true;
	this.ctx = null;
	this.dragAtoms = [];
	this.lastPos = null;
	this.lastPosArr = [];
	this.endPos = null;
	this.lassoPath = [];
	this.h_atom = -1;
	this.h_bond = -1;
	this.rotateAroundPoint = null;
	this.connectToAtom = -1;
	this.button = -1;
	this.updateZoom = true;
	this.mode = 0;

	this.blockMouse = 0;

	if(this.touch)
	{
		this.canvas.addEventListener("touchstart", function(ev)
		{
			that.blockMouse++;
			that.onMouseDown(ev, true);
		}, false);
		window.addEventListener("touchmove", function(ev)
		{
			that.onMouseMove(ev, true);
		}, true);
		window.addEventListener("touchend", function(ev)
		{
			that.onMouseUp(ev);
		}, false);
		window.addEventListener("touchcancel", function(ev)
		{
			that.onMouseUp(ev);
		}, false);
	}

	this.canvas.addEventListener("mousedown", function(ev)
	{
		if(that.blockMouse > 0) that.blockMouse--;
		else that.onMouseDown(ev, false);
	}, false);
	window.addEventListener("mousemove", function(ev)
	{
		that.onMouseMove(ev, false);
	}, false);
	window.addEventListener("mouseup", function(ev)
	{
		that.onMouseUp(ev);
	}, false);

	jQuery(document).on("keydown", function(ev)
	{
		if(jQuery('input:focus').length === 0) that.onKeyPress(ev);
	});

	//shortcuts
	jQuery(document).bind("keydown", "ctrl+z", function(e){ e.preventDefault(); that.undo(); });
	jQuery(document).bind("keydown", "ctrl+shift+z", function(e){ e.preventDefault(); that.redo(); });
	jQuery(document).bind("keydown", "ctrl+y", function(e){ e.preventDefault(); that.redo(); });

	//zooming with mousewheel
	this.zoomSpeed = 0.08;
	this.minKFC = 5;
	this.parent.on("DOMMouseScroll mousewheel", (function(ev)
	{
		ev.preventDefault();

		var deltaY = 0;

		if(ev.originalEvent.detail)
		{
			deltaY = ev.originalEvent.detail;
		}
		else if (ev.originalEvent.wheelDelta)
		{
			deltaY = ev.originalEvent.wheelDelta / 40;
		}

		var mult = 1 + (deltaY / 3) * this.zoomSpeed;

		var cx = this.canvas.width / 2;
		var cy = this.canvas.height / 2;

		var dx = cx - this.dx;
		var dy = cy - this.dy;

		this.kfc *= mult;
		if(this.kfc < this.minKFC)
		{
			mult = this.minKFC / (this.kfc / mult);
			this.kfc = this.minKFC;
		}

		this.dx = cx - dx * mult;
		this.dy = cy - dy * mult;

		this.updateZoom = false;
		this.drawMol();
	}).bind(this));

	this.kfc = 40;
	this.dx = this.dy = 0;
}

ChemicalView.prototype.resize = function()
{
	jQuery(this.canvas).css({
		"width": this.parent.width(),
		"height": this.parent.height()
	});

	this.canvas.width = this.parent.width() * this.scaleFactor;
	this.canvas.height = this.parent.height() * this.scaleFactor;

	this.updateZoom = true;
	this.drawMol();
}

ChemicalView.prototype.setElement = function(element)
{
	this.activeTool.id = "me-elements";
	this.activeTool.toolType = "atom";
	this.activeTool.cd = element;
}

ChemicalView.prototype.showStatus = function(msg)
{
}
ChemicalView.prototype.clearStatus = function()
{
}

ChemicalView.prototype.addTool = function(type, id, func)
{
	var elm = jQuery("#" + id);
	elm.data("toolType", type);
	elm.on("mousedown", func);
	return elm;
}

ChemicalView.prototype.addToolBond = function(type, id, func)
{
	var elm = this.addTool("bond", id, func);
	elm.data("ty", type);
	return elm;
}

ChemicalView.prototype.addToolAtom = function(type, id, func)
{
	var elm = this.addTool("atom", id, func);
	elm.data("cd", type);
	return elm;
}

ChemicalView.prototype.toolButtonClicked = function(button)
{
	if(button === undefined) return;

	if((this.activeTool || { id: "" }).id == button.id)
	{
		jQuery("#me-move").addClass("tool-button-selected");
		this.activeTool = { id: "me-move", toolType: "move" };
	}
	else
	{
		this.activeTool = {};
		this.activeTool.id = button.id;

		button = jQuery(button);
		this.activeTool.toolType = button.data("toolType");
		if(button.data("ty")) this.activeTool.ty = button.data("ty");
		if(button.data("cd")) this.activeTool.cd = button.data("cd");

		if(this.activeTool.toolType == "eraser")
		{
			this.undoPush();
			this.chem.removeAtoms(this.getSelectedAtoms());
			this.h_bond = this.h_atom = -1;
			this.changed();
		}
	}
}

ChemicalView.prototype.changed = function(not_changed)
{
	if(this.onChanged !== undefined && !not_changed)
		this.onChanged();

	if(this.undoStack.length > 0)
		 jQuery("#me-undo").removeClass("tool-button-disabled");
	else jQuery("#me-undo").addClass("tool-button-disabled");

	if(this.redoStack.length > 0)
		 jQuery("#me-redo").removeClass("tool-button-disabled");
	else jQuery("#me-redo").addClass("tool-button-disabled");
}

ChemicalView.prototype.isEmpty = function()
{
	return this.chem.atoms.length == 0;
}

ChemicalView.prototype.undoPush = function (not_changed)
{
	this.undoStack.push(clone_object(this.chem));
	this.changed(not_changed);
}

ChemicalView.prototype.loadMOL = function(mol)
{
	this.undoPush();

	this.chem = new Chemical().parseMol(mol);
	this.last_atom_length = this.chem.atoms.length;

	this.updateZoom = true;
	this.drawMol();
}

ChemicalView.prototype.getMOL = function()
{
	return this.chem.toMol();
}

ChemicalView.prototype.clearMol = function()
{
	this.undoPush();
	this.chem = new Chemical();
	this.drawMol();
	this.changed();
}

ChemicalView.prototype.undo = function()
{
	if(this.undoStack.length > 0)
	{
		this.redoStack.push(clone_object(this.chem));
		this.chem = this.undoStack.pop();
		this.h_atom = this.h_bond = -1;
		this.drawMol();
		this.changed();
	}
}

ChemicalView.prototype.undoSimple = function()
{
	if(this.undoStack.length > 0)
	{
		this.chem = this.undoStack.pop();
		this.h_atom = this.h_bond = -1;
	}
}

ChemicalView.prototype.redo = function()
{
	if(this.redoStack.length > 0)
	{
		this.undoStack.push(clone_object(this.chem));
		this.chem = this.redoStack.pop();
		this.drawMol();
		this.changed();
	}
}

ChemicalView.prototype.removeImplicitHydrogen = function()
{
	var implicit_h = [];

	function getBond(a, b)
	{
		for(var i = 0; i < this.chem.bonds.length; i++)
		{
			if((this.chem.bonds[i].fr == a && this.chem.bonds[i].to == b)
			|| (this.chem.bonds[i].fr == b && this.chem.bonds[i].to == a))
				return this.chem.bonds[i];
		}
	}

	function isInRing(a)
	{
		for(var i = 0; i < this.chem.rings.length; i++)
		{
			if(this.chem.rings[i].indexOf(a) != -1 && this.chem.rings[i].length < Number.MAX_VALUE) return true;
		}
        return false;
	}

	for(var i = 0; i < this.chem.bonds.length; i++)
	{
		/*
		Implicit atom rules
		- Hydrogen connected to Carbon
		- Single bond (normal)
		- Carbon doesn't have up/down bonds
		- Carbon not double connected to non carbon OR carbon is in ring
		*/

		var bond = this.chem.bonds[i];
		var hydrogen = this.chem.atoms[bond.fr].cd == 1 ? bond.fr : this.chem.atoms[bond.to].cd == 1 ? bond.to : -1;
		var carbon   = this.chem.atoms[bond.fr].cd == 6 ? bond.fr : this.chem.atoms[bond.to].cd == 6 ? bond.to : -1;

		if(hydrogen != -1 && carbon != -1 && !(bond.ms & M_BO_UP || bond.ms & M_BO_DW))//HC, single bond
		{
			var double_to_non_hc = false;
			var updown = false
			var cab = this.chem.atoms[carbon];
			for(var b = 0; b < cab.bo.length; b++)
			{
				var bo = getBond.call(this, carbon, cab.bo[b]);
				if(this.chem.atoms[cab.bo[b]].cd != 6 && this.chem.atoms[cab.bo[b]].cd != 1 && bo.ty != 1) double_to_non_hc = true;
				if(bo.ms & M_BO_UP || bo.ms & M_BO_DW) updown = true;
			}
			if((double_to_non_hc && !isInRing.call(this, carbon)) || updown) continue;

			if(this.chem.atoms[bond.fr].cd == 1)
				implicit_h.push(bond.fr);
			else implicit_h.push(bond.to);
		}
	}

	this.undoPush();

	this.chem.removeAtoms(implicit_h);

	this.h_bond = this.h_atom = -1;
	this.updateZoom = true;
	this.drawMol();
}

ChemicalView.prototype.deselectAll = function()
{
	for(var i = 0; i < this.chem.atoms.length; i++)
	{
		this.chem.atoms[i].ms &= ~M_CE;
	}
	for(var i = 0; i < this.chem.bonds.length; i++)
	{
		this.chem.bonds[i].ms &= ~M_CE;
	}
}
