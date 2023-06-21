/**
 * This file is part of MolView (http://molview.org)
 * Copyright (c) 2014-2023 Herman Bergwerf
 */

/**
 * GLmol wrapper/plugin for Model.js
 * @type {Object}
 */
var GLmolPlugin = {
	ready: false,
	view: undefined,

	/**
	 * Saves current containing model data in order to prevent loading the
	 * same structure multiple times while switching between render engines
	 * @type {String}
	 */
	currentModel: "",

	/**
	 * Indicates if the protein bonds are calculated using GLmol.calculatedBonds
	 * @type {Boolean}
	 */
	bondsCalculated: false,

	init: function(cb)
	{
		if(Detector.canvas)
		{
			this.view = new GLmol("glmol", !Detector.webgl, Model.pixelMult, Model.bg.hex);

			this.view.defineRepresentation = function()
			{
				var all = this.getAllAtoms();
				if(Model.displayBU && this.protein.biomtChains !== "")
				{
					all = this.getChain(all, this.protein.biomtChains);
				}

				var all_het = this.getHetatms(all);
				var hetatm = this.removeSolvents(all_het);
				var chain = Model.chain;
				var asu = new THREE.Object3D();

				this.colorByAtom(all, {});

				if(Model.isPDB())
				{
					if(chain.color === "ss") this.colorByStructure(all, 0xcc00cc, 0x00cccc, 0xcccccc);
					else if(chain.color === "spectrum") this.colorChainbow(all);
					else if(chain.color === "chain") this.colorByChain(all, true);
					else if(chain.color === "residue") this.colorByResidue(all, GLmolAminoColors);
					else if(chain.color === "polarity") this.colorByPolarity(all, 0xcc0000, 0xcccccc);
					else if(chain.color === "bfactor") this.colorByBFactor(all);

					var do_not_smoothen = false;

					if(chain.type === "ribbon")
					{
						this.drawCartoon(asu, all, do_not_smoothen);
						this.drawCartoonNucleicAcid(asu, all);
					}
					else if(chain.type === "cylinders")
					{
						this.drawHelixAsCylinder(asu, all, 1.6);
						this.drawCartoonNucleicAcid(asu, all);
					}
					else if(chain.type === "btube")
					{
						this.drawMainchainTube(asu, all, "CA");
						this.drawMainchainTube(asu, all, "O3'");
					}
					else if(chain.type === "ctrace")
					{
						this.drawMainchainCurve(asu, all, this.curveWidth, "CA", 1);
						this.drawMainchainCurve(asu, all, this.curveWidth, "O3'", 1);
					}

					if(chain.bonds)
					{
						if(!Model.GLmol.bondsCalculated)
						{
							Model.GLmol.bondsCalculated = true;
							this.calculateBonds();
						}

						this.drawBondsAsLine(asu, all, this.lineWidth);
					}

					//this.drawNucleicAcidLadder(asu, all);
				}

				if(!(Model.displayBU && Model.isPDB()))
				{
					this.canvasVDW = false;
					this.canvasLine = false;

					if(Model.representation === "balls")
					{
						this.canvasAtomRadius = 0.4;
						this.canvasBondWidth = 0.3;
						this.drawBondsAsStick(this.modelGroup, hetatm, this.cylinderRadius / 2.0, this.cylinderRadius * 5, true, 0.3);
					}
					else if(Model.representation === "stick")
					{
						this.canvasAtomRadius = 0.3;
						this.canvasBondWidth = 0.6;
						this.drawBondsAsStick(this.modelGroup, hetatm, this.cylinderRadius, this.cylinderRadius);
					}
					else if(Model.representation === "vdw")
					{
						this.canvasVDW = true;
						this.canvasAtomRadius = 0.5;
						this.canvasBondWidth = 0.3;
						this.drawAtomsAsSphere(this.modelGroup, hetatm, this.sphereRadius);
					}
					else if(Model.representation === "wireframe")
					{
						this.canvasAtomRadius = 0.2;
						this.canvasLine = true;
						this.drawBondsAsStick(this.modelGroup, hetatm, this.cylinderRadius / 8.0, this.cylinderRadius * 8, true, 0.05);
					}
					else if(Model.representation === "line")
					{
						this.canvasAtomRadius = 0.0;
						this.canvasLine = true;
						this.drawBondsAsLine(this.modelGroup, hetatm, this.lineWidth);
					}
				}

				if(Model.isPDB())
				{
					if(Model.displayBU)
					{
						this.drawSymmetryMates2(this.modelGroup, asu, this.protein.biomtMatrices);
					}
					this.modelGroup.add(asu);
				}
			};

			Model._setRenderEngine("GLmol");
			this.ready = true;
			if(cb) cb();
			return true;
		}
		else
		{
			Messages.alert("no_canvas_support");
			return false;
		}
	},

	resize: function()
	{
		if(this.view && $("#glmol").sizeChanged())
		{
			$("#glmol").saveSize();
			this.view.resize();
		}
	},

	reset: function()
	{
		if(this.view)
		{
			this.view.zoom2D = 30;
			this.view.zoomInto(this.view.getAllAtoms());
			this.view.redraw();
		}
	},

	setRepresentation: function()
	{
		/* new representation should be stored in
		Model.representation and Model.chain
		before calling this method */
		if(this.view)
		{
			this.view.rebuildScene();
			this.view.redraw();
		}
	},

	setBackground: function(hex)
	{
		this.view.setBackground(hex);
		this.view.redraw();
	},

	loadMOL: function(mol)
	{
		if(this.currentModel === mol) return;

		if(this.view)
		{
			this.currentModel = mol;
			this.view.loadSDF(mol);
		}
	},

	loadPDB: function(pdb)
	{
		if(this.currentModel === pdb)
		{
			//make sure to overwrite current matrix
			this.view.protein.appliedMatrix = undefined;
			this.view.zoomInto(this.view.getAllAtoms());
			return;
		}

		if(this.view)
		{
			this.bondsCalculated = false;
			this.currentModel = pdb;
			this.view.loadPDB(pdb);
		}
	},

	/**
	 * Displays the BU if or the ASU based on the value of
	 * Model.displayBU
	 */
	setAssembly: function()
	{
		if(this.view)
		{
			this.view.rebuildScene();

			/* patch zoomInto
			if BU assembly is executed in the previous setAssembly,
			the protein.appliedMatrix is messed up */
			if(!Model.displayBU)
			{
				this.view.protein.appliedMatrix = undefined;
			}

			this.view.zoomInto(Model.GLmol.view.getAllAtoms());
			this.view.redraw();
		}
	},

	/**
	 * Sets the current chain coloring and updates the
	 * assosiated render output
	 * @param {String} coloring Chain coloring type
	 */
	setChainColor: function(color)
	{
		var msg = Messages.process(function()
		{
			Model.GLmol.setRepresentation.call(Model.GLmol);
			if(msg) Messages.clear();
		}, "glmol_update");
	},

	toDataURL: function()
	{
		if(this.view)
		{
			this.view.setBackground(0x000000, 0);
			this.view.draw();

			var dataURL = "";

			if(!this.view.webglFailed) dataURL = this.view.renderer.domElement.toDataURL("image/png");
			else dataURL = document.getElementById("glmol").firstChild.toDataURL("image/png");

			this.view.setBackground(Model.bg.hex);
			this.view.redraw();

			return dataURL;
		}
		else return "";
	}
};
