/**
 * This file is part of MolView (http://molview.org)
 * Copyright (c) 2014-2023 Herman Bergwerf
 */

/**
 * ChemDoodle Web wrapper/plugin for Model.js
 * @type {Object}
 */
var CDWPlugin = {
	ready: false,
	view: undefined,
	molecule: undefined,

	/**
	* Saves current containing model data in order to prevent loading the
	* same structure multiple times while switching between render engines
	* @type {String}
	*/
	currentModel: "",

	init: function(cb)
	{
		if(ChemDoodle === undefined) return;

		if(Detector.webgl)
		{
			this.view = new ChemDoodle.TransformCanvas3D("chemdoodle-canvas", $("#model").width() * Model.pixelMult, $("#model").height() * Model.pixelMult);
			$("#chemdoodle-canvas").css({ width: $("#model").width(), height: $("#model").height() });
			this.view.specs.macromolecules_ribbonCartoonize = this.view.specs.proteins_ribbonCartoonize = true;
			this.view.specs.backgroundColor = Model.bg.html;
			this.view.specs.crystals_unitCellColor = Model.fg.html;
			Model._setRenderEngine("CDW");
			this.ready = true;
			if(cb) cb();
			return true;
		}
		else
		{
			Messages.alert("no_webgl_support");
			return false;
		}
	},

	resize: function()
	{
		if(this.view && $("#chemdoodle").sizeChanged())
		{
			$("#chemdoodle").saveSize();
			this.view.resize( $("#model").width() * Model.pixelMult, $("#model").height() * Model.pixelMult);
			$("#chemdoodle-canvas").css({ width: $("#model").width(), height: $("#model").height() });
			if(this.molecule !== undefined) this.view.loadMolecule(this.molecule);
		}
	},

	reset: function()
	{
		if(this.view)
		{
			this.view.rotationMatrix =
			[1, 0, 0, 0,
			 0, 1, 0, 0,
			 0, 0, 1, 0,
			 0, 0, 0, 1];
			this.view.repaint();
		}
	},

	setRepresentation: function()
	{
		var m = Model.representation;
		if(m === "balls") m = "Ball and Stick";
		else if(m === "stick") m = "Stick";
		else if(m === "vdw") m = "van der Waals Spheres";
		else if(m === "wireframe") m = "Wireframe";
		else if(m === "line") m = "Line";

		this.view.specs.set3DRepresentation(m);

		if(m === "Ball and Stick")
		{
			this.view.specs.bonds_cylinderDiameter_3D = 0.2;
		}

		this.view.specs.backgroundColor = Model.bg.html;
		this.view.specs.crystals_unitCellColor = Model.fg.html;
		this.view.specs.bonds_useJMOLColors = true;

		if(Model.isPDB())
		{
			if(Model.chain.type !== "ribbon" || Model.chain.bonds)
			{
				Messages.alert("no_chemdoodle_chain_type");
			}
			if(Model.chain.color === "bfactor")
			{
				Messages.alert("no_chemdoodle_chain_color");
			}

			this.view.specs.macro_colorByChain = Model.chain.color === "chain";

			if(Model.chain.color === "spectrum")
			{
				this.view.specs.proteins_residueColor = "rainbow";
			}
			else if(Model.chain.color === "residue")
			{
				this.view.specs.proteins_residueColor = "amino";
			}
			else if(Model.chain.color === "polarity")
			{
				this.view.specs.proteins_residueColor = "polarity";
			}
			else
			{
				this.view.specs.proteins_residueColor = "none";
			}
		}

		this.view.repaint();
	},

	setBackground: function(rgb, htmlColor, htmlFgColor)
	{
		this.view.specs.backgroundColor = htmlColor;
		this.view.specs.crystals_unitCellColor = htmlFgColor;
		this.view.gl.clearColor(rgb[0] / 255, rgb[1] / 255, rgb[2] / 255, 1);
		this.view.repaint();
	},

	loadMOL: function(mol)
	{
		if(this.currentModel === mol) return;

		if(this.view)
		{
			this.currentModel = mol;

			this.molecule = ChemDoodle.readMOL(mol, 1);
			this.view.specs.projectionPerspective_3D = true;
			this.view.specs.compass_display = false;
			this.view.loadMolecule(this.molecule);
		}
	},

	loadPDB: function(pdb)
	{
		if(this.currentModel === pdb) return;

		if(this.view)
		{
			this.currentModel = pdb;

			this.molecule = ChemDoodle.readPDB(pdb);
			this.view.specs.projectionPerspective_3D = true;
			this.view.specs.compass_display = false;
			this.view.loadMolecule(this.molecule);
		}
	},

	loadCIF: function(cif, cell)
	{
		if(this.currentModel === cif + cell) return;

		if(this.view)
		{
			this.currentModel = cif + cell;

			cell = cell || [1, 1, 1];
			this.view.specs.crystals_displayUnitCell = cell.reduce(function(a, b){ return a * b; }) === 1;
			this.view.specs.projectionPerspective_3D = false;
			this.view.specs.compass_display = true;
			this.molecule = ChemDoodle.readCIF(cif, cell[0], cell[1], cell[2]);
			this.view.loadMolecule(this.molecule);
		}
	},

	toDataURL: function()
	{
		if(this.view)
		{
			this.view.gl.clearColor(0, 0, 0, 0);
			this.view.repaint();
			var dataURL = this.view.gl.canvas.toDataURL("image/png");
			this.view.gl.clearColor(Model.bg.rgb[0] / 255, Model.bg.rgb[1] / 255, Model.bg.rgb[2] / 255, 1);
			return dataURL;
		}
		else return "";
	}
};
