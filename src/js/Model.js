/**
 * This file is part of MolView (http://molview.org)
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

var JmolScripts = {
	Ball_and_Stick: "select *; wireframe 0.09; spacefill 28%;",
	Stick: "select *; wireframe 0.3; spacefill 0;",
	van_der_Waals_Spheres: "select *; spacefill 100%;",
	Wireframe: "select *; wireframe 0.03; spacefill 0.08;",
	Line: "select *; wireframe on; spacefill off;",
	Macromolecules: "select protein or nucleic; ribbon only; color ribbons structure; display not solvent;",
	resetLabels: "hover off; color measures magenta; font measure 18;",
	clearMeasures: 'measure off; measure delete;',
	clearMolecule: 'isosurface off; echo ""; label ""; select formalCharge <> 0; label %C; select *; dipole bond delete; dipole molecular delete; color cpk;'
};

var Model = {
	data: {
		mol: "",
		pdb: "",
		cif: "",
		current: "MOL",//MOL || PDB || CIF
	},

	engine: null,//"GLmol", "JSmol", "CDW"
	representation: "balls",//balls || stick || vdw || wireframe || line
	bg: {
		colorName: "black",
		hex: 0x000000,
		rgb: [0,0,0],//byte based
		jmol: "[0,0,0]",
		html: "rgb(0,0,0)"
	},

	/**
	 * Initializes 3D model view
	 * @param  {Function} cb  Called when intialization is ready
	 * @param  {String}   rnd Initail render engine
	 */
	init: function(cb, rnd)
	{
		if(MolView.loadDefault)
			this.data.mol = (defaultMol3D || "");

		this.setRenderEngine(rnd || "GLmol", cb);
	},

	/**
	 * @return {Boolean} True if current render engine is GLmol
	 */
	isGLmol: function()
	{
		return Model.engine == "GLmol";
	},

	/**
	* @return {Boolean} True if current render engine is JSmol
	*/
	isJSmol: function()
	{
		return Model.engine == "JSmol";
	},

	/**
	* @return {Boolean} True if current render engine is ChemDoodle Web
	*/
	isCDW: function()
	{
		return Model.engine == "CDW";
	},

	/**
	 * Resizes 3D canvas in order to fit the current #model area
	 */
	resize: function()
	{
		if(this.isGLmol()) this.GLmol.resize();
		else if(this.isJSmol()) this.JSmol.resize();
		else if(this.isCDW()) this.CDW.resize();
	},

	/**
	 * Resets model position, rotation and scaling back to default
	 */
	reset: function()
	{
		if(this.isGLmol()) this.GLmol.reset();
		else if(this.isJSmol()) this.JSmol.reset();
		else if(this.isCDW()) this.CDW.reset();
	},

	/**
	 * Sets the current 3D render engine
	 * Initializes the engine if not initialized already
	 * @param  {String}   engine Render engine id
	 * @param  {Function} cb     Called when new render engine is loaded
	 * @return {Boolean}         False if $engine == Model.engine
	 */
	setRenderEngine: function(engine, cb)
	{
		if(this.engine == engine)
		{
			if(cb) cb();
			return;
		}

		if(engine == "GLmol")
		{
			if(this.data.current == "CIF")
			{
				Messages.alert("no_glmol_crystals");
				return;
			}
			else if(this.GLmol.ready)
			{
				this._setRenderEngine(engine);
				if(cb) cb();
			}
			else if(!this.GLmol.init(cb)) return;
		}
		else if(engine == "JSmol")
		{
			if(this.JSmol.ready)
			{
				this._setRenderEngine(engine);
				if(cb) cb();
			}
			else if(!this.JSmol.init(cb)) return;
		}
		else if(engine == "CDW")
		{
			if(this.CDW.ready)
			{
				this._setRenderEngine(engine);
				if(cb) cb();
			}
			else if(!this.CDW.init(cb)) return;
		}

		$("#engine-glmol").removeClass("checked");
		$("#engine-jmol").removeClass("checked");
		$("#engine-cdw").removeClass("checked");
		$("#engine-" + (engine == "GLmol" ?
			"glmol" : (engine == "JSmol" ?
				"jmol" : (engine == "CDW" ?
					"cdw" : "")))).addClass("checked");
	},

	/**
	 * Inside function to set the render engine
	 * You should never call this function directly since it assumes the
	 * target engine is already initialized
	 * @param {String} engine Render engine id
	 */
	_setRenderEngine: function(engine)
	{
		$("#glmol").css("display", (engine == "GLmol") ? "block" : "none");
		$("#jsmol").css("display", (engine == "JSmol") ? "block" : "none");
		$("#chemdoodle").css("display", (engine == "CDW") ? "block" : "none");

		this.engine = engine;
		this.resize();

		if(this.isGLmol()) this.GLmol.setBackground(this.bg.hex);
		else if(this.isJSmol()) this.JSmol.setBackground(this.bg.rgb);
		else if(this.isCDW()) this.CDW.setBackground(this.bg.rgb, this.bg.html);

		/* if loadContent returns true, the render engine
		has updated the representation already */
		if(!this.loadContent())
		{
			if(this.isGLmol()) this.GLmol.setRepresentation();
			else if(this.isJSmol()) this.JSmol.setRepresentation(this.representation);
			else if(this.isCDW()) this.CDW.setRepresentation(this.representation);
		}
	},

	/**
	 * Sets the 3D model molecular representation
	 * @param {String} mode Representation mode
	 */
	setRepresentation: function(mode)
	{
		$(".r-mode").removeClass("checked");
		if(mode == "balls") $("#model-balls").addClass("checked");
		else if(mode == "stick") $("#model-stick").addClass("checked");
		else if(mode == "vdw") $("#model-vdw").addClass("checked");
		else if(mode == "wireframe") $("#model-wireframe").addClass("checked");
		else if(mode == "line") $("#model-line").addClass("checked");

		this.representation = mode;

		window.setTimeout((function()
		{
			if(this.isGLmol()) this.GLmol.setRepresentation();
			else if(this.isJSmol()) this.JSmol.setRepresentation(this.representation);
			else if(this.isCDW()) this.CDW.setRepresentation(this.representation);
		}).bind(this), 300);
	},

	/**
	 * Sets the 3D model background color
	 * @param {String} color Color name
	 */
	setBackground: function(color)
	{
		this.bg.colorName = color;
		this.bg.hex = color != "white" ? color != "grey" ? 0x000000 : 0xcccccc : 0xffffff;
		this.bg.rgb = [this.bg.hex >> 16, this.bg.hex >> 8 & 0xFF, this.bg.hex & 0xFF];
		this.bg.jmol = "[" + this.bg.rgb.join() + "]";
		this.bg.html = "rgb(" + this.bg.rgb.join() + ")";

		$(".model-bg").removeClass("checked");
		$("#model-bg-" + color).addClass("checked");
		$("#model").css("background", this.bg.html);

		if(this.isGLmol()) return this.GLmol.setBackground(this.bg.hex);
		else if(this.isJSmol()) return this.JSmol.setBackground(this.bg.jmol);
		else if(this.isCDW()) return this.CDW.setBackground(this.bg.rgb, this.bg.html);
	},

	/**
	 * Loads the current 3D data into the current render engine
	 */
	loadContent: function()
	{
		     if(this.data.current == "MOL") return this._loadMOL(this.data.mol);
		else if(this.data.current == "PDB") return this._loadPDB(this.data.pdb);
		else if(this.data.current == "CIF") return this._loadCIF(this.data.cif);
		else return false;
	},

	/**
	 * Loads a Molfile into the 3D engine
	 * Updates Model metadata and UI
	 * @param {String} mol Molfile
	 */
	loadMOL: function(mol)
	{
		this.data.current = "MOL";
		this.data.mol = mol;
		$("#save-local-3d").text("MOL file");
		$(".jmol-script").removeClass("disabled");

		this._loadMOL(mol);
	},

	/**
	 * Loads a Molfile into the 3D engine
	 * This method does not update the UI or the Model metadata
	 * @param {String} mol Molfile
	 */
	_loadMOL: function(mol)
	{
		if(this.isGLmol()) return this.GLmol.loadMOL(mol);
		else if(this.isJSmol()) return this.JSmol.loadMOL(mol);
		else if(this.isCDW()) return this.CDW.loadMOL(mol);
	},

	/**
	* Loads a PDB file into the 3D engine
	* Updates Model metadata and UI
	* @param {String}  pdb       PDB file
	*/
	loadPDB: function(pdb)
	{
		this.data.current = "PDB";
		this.data.pdb = pdb;
		$("#save-local-3d").text("PDB file");
		$(".jmol-script").addClass("disabled");

		this._loadPDB(pdb);
	},

	/**
	* Saves a PDB file and but does not load it
	* Updates Model metadata and UI
	* @param {String}  pdb       PDB file
	*/
	preloadPDB: function(pdb, noDisplay)
	{
		this.data.current = "PDB";
		this.data.pdb = pdb;
		$("#save-local-3d").text("PDB file");
		$(".jmol-script").addClass("disabled");
	},

	/**
	* Loads a PDB file into the 3D engine
	* This method does not update the UI or the Model metadata
	* @param {String} pdb PDB file
	*/
	_loadPDB: function(pdb)
	{
		if(this.isGLmol()) return this.GLmol.loadPDB(pdb);
		else if(this.isJSmol()) return this.JSmol.loadPDB(pdb);
		else if(this.isCDW()) return this.CDW.loadPDB(pdb);
	},

	/**
	* Loads a CIF file into the 3D engine
	* Updates Model metadata and UI
	* @param {String}   cif  CIF file
	* @param {Array}    cell Crystal cell dimensions
	* @param {Function} cb   Called when CIF is loaded (used to handle mobile JSmol delay)
	*/
	loadCIF: function(cif, cell, cb)
	{
		this.data.current = "CIF";
		this.data.cif = cif;
		$("#save-local-3d").text("CIF file");
		$(".jmol-script").removeClass("disabled");
		$(".jmol-calc").addClass("disabled");

		this._loadCIF(cif, cell, cb);
	},

	/**
	* Loads a CIF file into the 3D engine
	* This method does not update the UI or the Model metadata
	* This method picks the most suitable crystal render engine
	* (CDW if WebGL is available, else JSmol)
	* @param {String}   cif  CIF file
	* @param {Array}    cell Crystal cell dimensions
	* @param {Function} cb   Called when CIF is loaded (used to handle mobile JSmol delay)
	*/
	_loadCIF: function(cif, cell, cb)
	{
		cell = cell || [1, 1, 1];
		if(this.isGLmol())
		{
			if(Detector.webgl)//use ChemDoodle
			{
				this.setRenderEngine("CDW", function()
				{
					Model.CDW.loadCIF(Model.data.cif, cell);
					if(cb) cb();
				});
			}
			else//use Jmol
			{
				this.setRenderEngine("JSmol", function()
				{
					Model.JSmol.loadCIF(Model.data.cif, cell);
					if(cb) cb();
				});
			}
		}
		else if(this.isJSmol())
		{
			this.JSmol.loadCIF(cif, cell);
			if(cb) cb();
		}
		else if(this.isCDW())
		{
			if(Detector.webgl)
			{
				this.CDW.loadCIF(cif, cell);
				if(cb) cb();
			}
			else//use Jmol
			{
				this.setRenderEngine("JSmol", function()
				{
					Model.JSmol.loadCIF(Model.data.cif, cell);
					if(cb) cb();
				});
			}
		}
	},

	/**
	 * @return {String} DataURL containing an image of the current 3D model
	 */
	toDataURL: function()
	{
		var dataURL = "";

		if(this.isGLmol()) dataURL = this.GLmol.toDataURL();
		else if(this.isJSmol()) dataURL = this.JSmol.toDataURL();
		else if(this.isCDW()) dataURL = this.CDW.toDataURL();

		return dataURL;
	},

	/**
	 * @return {Blob} Blob containing the current 3D model data
	 */
	getDataBlob: function()
	{
		var blob;
		     if(this.data.current == "MOL") blob =  new Blob([ this.data.mol ], { type: "chemical/x-mdl-molfile" });
		else if(this.data.current == "PDB") blob =  new Blob([ this.data.pdb ], { type: "chemical/x-pdb" });
		else if(this.data.current == "CIF") blob =  new Blob([ this.data.cif ], { type: "chemical/x-cif" });
		return blob;
	},

	/**
	 * @return {String} Uppercase file extension for the current 3D model
	 */
	getDataExstension: function()
	{
		return Model.data.current;
	},

	GLmol:
	{
		ready: false,
		view: undefined,
		loadBioAssembly: false,
		chain: {
			type: "ribbon",//ribbon || cylinders || btube || ctrace
			bonds: false,
			color: "ss",//ss || spectrum || chain || bfactor || polarity
		},

		/*
		Saves current containing model data in order to prevent loading the
		same structure multiple times while switching between render engines
		*/
		currentModel: "",

		init: function(cb)
		{
			if(Detector.canvas)
			{
				this.view = new GLmol("glmol", !Detector.webgl, MolView.mobile ? 1.5 : 1.0);

				this.view.defineRepresentation = function()
				{
					var all = this.getAllAtoms();
					if(Model.GLmol.loadBioAssembly && this.protein.biomtChains != "") all = this.getChain(all, this.protein.biomtChains);
					var all_het = this.getHetatms(all);
					var hetatm = this.removeSolvents(all_het);
					var chain = Model.GLmol.chain;
					var asu = new THREE.Object3D();

					this.colorByAtom(all, {});
					if(chain.color == "ss") this.colorByStructure(all, 0xcc00cc, 0x00cccc);
					else if(chain.color == "spectrum") this.colorChainbow(all);
					else if(chain.color == "chain") this.colorByChain(all);
					else if(chain.color == "bfactor") this.colorByBFactor(all);
					else if(chain.color == "polarity") this.colorByPolarity(all, 0xcc0000, 0xcccccc);

					if(Model.data.current == "PDB")
					{
						var do_not_smoothen = false;

						if(chain.type == "ribbon")
						{
							this.drawCartoon(asu, all, do_not_smoothen);
							this.drawCartoonNucleicAcid(asu, all);
						}
						else if(chain.type == "cylinders")
						{
							this.drawHelixAsCylinder(asu, all, 1.6);
							this.drawCartoonNucleicAcid(asu, all);
						}
						else if(chain.type == "btube")
						{
							this.drawMainchainTube(asu, all, "CA");
							this.drawMainchainTube(asu, all, "O3'");
						}
						else if(chain.type == "ctrace")
						{
							this.drawMainchainCurve(asu, all, this.curveWidth, "CA", 1);
							this.drawMainchainCurve(asu, all, this.curveWidth, "O3'", 1);
						}

						if(chain.bonds)
						{
							this.drawBondsAsLine(asu, all, this.lineWidth);
						}
					}

					var target = this.modelGroup;
					this.canvasVDW = false;
					this.canvasLine = false;

					if(!Model.GLmol.loadBioAssembly)
					{
						if(Model.representation == "balls")
						{
							this.canvasAtomRadius = 0.4;
							this.canvasBondWidth = 0.3;
							this.drawBondsAsStick(target, hetatm, this.cylinderRadius / 2.0, this.cylinderRadius * 5, true, true, 0.3);
						}
						else if(Model.representation == "stick")
						{
							this.canvasAtomRadius = 0.3;
							this.canvasBondWidth = 0.6;
							this.drawBondsAsStick(target, hetatm, this.cylinderRadius, this.cylinderRadius, true);
						}
						else if(Model.representation == "vdw")
						{
							this.canvasVDW = true;
							this.canvasAtomRadius = 0.5;
							this.canvasBondWidth = 0.3;
							this.drawAtomsAsSphere(target, hetatm, this.sphereRadius);
						}
						else if(Model.representation == "wireframe")
						{
							this.canvasAtomRadius = 0.2;
							this.canvasLine = true;
							this.drawBondsAsStick(target, hetatm, this.cylinderRadius / 8.0, this.cylinderRadius * 8, true, true, 0.05);
						}
						else if(Model.representation == "line")
						{
							this.canvasAtomRadius = 0.0;
							this.canvasLine = true;
							this.drawBondsAsLine(target, hetatm, 1);
						}
					}

					if(Model.GLmol.loadBioAssembly) this.drawSymmetryMates2(this.modelGroup, asu, this.protein.biomtMatrices);
					if(Model.data.current == "PDB") this.modelGroup.add(asu);
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
			if(this.view !== undefined)
			{
				this.view.zoom2D = 30;
				this.view.zoomInto(this.view.getAllAtoms());
				this.view.show();
			}
		},

		setRepresentation: function()
		{
			/* new representation must be stored in
			Model.representation before calling this method */
			if(this.view !== undefined)
			{
				this.view.rebuildScene();
				this.view.show();
			}
		},

		setBackground: function(hex)
		{
			this.view.setBackground(hex);
			this.view.show();
		},

		loadMOL: function(mol)
		{
			if(this.currentModel == mol) return;

			if(this.view !== undefined)
			{
				this.currentModel = mol;

				this.loadBioAssembly = false;
				$("#bio-assembly").removeClass("checked");
				this.view.loadSDF(mol);
			}
		},

		loadPDB: function(pdb)
		{
			if(this.currentModel == pdb) return;

			if(this.view !== undefined)
			{
				this.currentModel = pdb;

				this.loadBioAssembly = false;
				$("#bio-assembly").removeClass("checked");
				this.view.loadPDB(pdb);
			}
		},

		/**
		 * Sets the current bio-assembly switch and updates the
		 * assosiated render output
	 	* @param {Boolean} enable Indicates if bio-assembly should be enabled
		 */
		setBioAssembly: function(enable)
		{
			if(Model.engine == "GLmol" && Model.data.current == "PDB")
			{
				this.loadBioAssembly = enable;
				if(this.loadBioAssembly) $("#bio-assembly").addClass("checked");
				else $("#bio-assembly").removeClass("checked");

				Messages.process(function()
				{
					if(Model.GLmol.loadBioAssembly)
					{
						Model.GLmol.view.rebuildScene();
						Model.GLmol.view.zoomInto(Model.GLmol.view.getAllAtoms());
						Model.GLmol.view.show();
					}
					else
					{
						Model.GLmol.view.loadPDB(Model.data.pdb);//in order to re-center asymmetric unit
					}

					Messages.clear();
				}, "glmol_update");
			}
		},

		/**
		 * Sets the current chain representation and updates the
		 * assosiated render output
		 * @param {String}  type   Chain representation type
		 * @param {Boolean} enable Indicates if type should be enabled
		 */
		setChainType: function(type, enable)
		{
			$(".glmol-chain").removeClass("checked");
			if(enable) $("#glmol-chain-" + type).addClass("checked");

			this.chain.type = (enable ? type : "none");

			if(Model.engine == "GLmol")
			{
				var msg = Messages.process(function()
				{
					Model.GLmol.setRepresentation.call(Model.GLmol);
					if(msg) Messages.clear();
				}, "glmol_update");
			}
		},

		/**
		 * Sets chain.bonds and updates the
	 	* assosiated render output
		 * @param {Boolean} enable Indicates if chain.bonds should be enabled
		 */
		setChainBonds: function(enable)
		{
			if(enable) $("#glmol-chain-bonds").addClass("checked");
			else $("#glmol-chain-bonds").removeClass("checked");

			this.chain.bonds = enable;

			if(Model.engine == "GLmol")
			{
				var msg = Messages.process(function()
				{
					Model.GLmol.setRepresentation.call(Model.GLmol);
					if(msg) Messages.clear();
				}, "glmol_update");
			}
		},

		/**
		* Sets the current chain coloring and updates the
		* assosiated render output
		* @param {String} coloring Chain coloring type
		*/
		setChainColor: function(color)
		{
			$(".glmol-color").removeClass("checked");
			$("#glmol-color-" + color).addClass("checked");

			this.chain.color = color;
			if(Model.engine == "GLmol")
			{
				var msg = Messages.process(function()
				{
					Model.GLmol.setRepresentation.call(Model.GLmol);
					if(msg) Messages.clear();
				}, "glmol_update");
			}
		},

		toDataURL: function()
		{
			if(this.view !== undefined)
			{
				this.view.setBackground(0x000000, 0);
				this.view.show();

				var dataURL = "";

				if(!this.view.webglFailed) dataURL = this.view.renderer.domElement.toDataURL("image/png");
				else dataURL = document.getElementById("glmol").firstChild.toDataURL("image/png");

				this.view.setBackground(Model.bg.hex);
				this.view.show();

				return dataURL;
			}
			else return "";
		}
	},

	JSmol:
	{
		ready: false,
		readyCB: undefined,//only used in constructor
		hq: true,//high quality
		picking: "OFF",

		/*
		Saves current containing model data in order to prevent loading the
		same structure multiple times while switching between render engines
		*/
		currentModel: "",

		init: function(cb)
		{
			if(Jmol == undefined) return;
			delete Jmol._tracker;

			if(Detector.canvas)
			{
				this.readyCB = cb;

				Messages.process(function()
				{
					Jmol.setDocument(false);
					Jmol.getApplet("JSmol", {
						width: $("#model").width(),
						height: $("#model").height(),
						debug: false,
						showfrank: false,
						disableJ2SLoadMonitor: true,
						disableInitialConsole: true,
						allowJavaScript: true,
						use: "HTML5",
						j2sPath: MolView.JMOL_J2S_PATH,
						script: 'unbind "MIDDLE DRAG" "_rotateZorZoom"; bind "MIDDLE DRAG" "_translate";\
frank off; set specular off;\
background ' + Model.bg.jmol + '; color label ' + Model.bg.jmol + ';\
background echo ' + Model.bg.jmol + '; color echo ' + Model.bg.jmol + ';\
set echo top left; font echo 18 serif bold;\
set antialiasDisplay true; set disablePopupMenu true; set showunitcelldetails false;\
set hoverDelay 0.001; hover off; font measure 18;\
set MessageCallback "Model.JSmol.MessageCallback";\
set MinimizationCallback "Model.JSmol.MinimizationCallback";',
						readyFunction: Model.JSmol.ReadyCallback.bind(Model.JSmol),
						console: "none"
					});
					$("#jsmol").html(Jmol.getAppletHtml(JSmol));
				}, "init_jmol");

				return true;
			}
			else
			{
				Messages.alert("no_canvas_support");
				return false;
			}
		},

		/**
		 * Called by JSmol when initialization is ready
		 */
		ReadyCallback: function()
		{
			this.ready = true;
			this.setQuality(this.hq);

			Model._setRenderEngine("JSmol");
			Messages.clear();
			if(this.readyCB) this.readyCB();
		},

		/**
		* JSmol message callback
		*/
		MessageCallback: function(jsmolObject, message)
		{
			if(message.toLowerCase().indexOf("initial mmff e") > -1
			&& message.toLowerCase().indexOf("max steps = 0") > -1)
			{
				var array = message.split(/ +/);
				Model.JSmol.print("Energy = " + array[5] + " kJ");
			}
		},

		/**
		 * JSmol minimization callback
		 */
		MinimizationCallback: function(jsmolObject, message)
		{
			if(message == "done")
			{
				//restore quality settings
				Model.JSmol._setQuality(Model.JSmol.hq);
				Messages.clear();
			}
		},

		/**
		 * Executes Jmol script
		 * Updates render output live
		 * @param  {String} script Jmol commands
		 */
		script: function(script)
		{
			if(this.ready)
			{
				Jmol.script(JSmol, script);
			}
		},

		/**
		* Executes Jmol script
		* Updates render output once scrit is ready
		* @param  {String} script Jmol commands
		*/
		scriptWaitOutput: function(script)
		{
			if(this.ready)
			{
				Jmol.scriptWaitOutput(JSmol, script);
			}
		},

		/**
		 * Prints $msg to the top-left corner of the render output
		 * @param  {String} msg Message
		 */
		print: function(msg)
		{
			if(this.ready)
			{
				Model.JSmol.script('echo "' + msg + '";');
			}
		},

		resize: function()
		{
			if(this.ready && $("#jsmol").sizeChanged())
			{
				$("#jsmol").saveSize();
				Jmol.resizeApplet(JSmol, [ $("#model").width(), $("#model").height() ]);
			}
		},

		reset: function()
		{
			if(this.ready)
			{
				Model.JSmol.script("reset; rotate best;");
			}
		},

		setRepresentation: function(res)
		{
			if(this.ready)
			{
				var script = "";

				if(res == "balls")
					script += JmolScripts.Ball_and_Stick;
				else if(res == "stick")
					script += JmolScripts.Stick;
				else if(res == "vdw")
					script += JmolScripts.van_der_Waals_Spheres;
				else if(res == "wireframe")
					script += JmolScripts.Wireframe;
				else if(res == "line")
					script += JmolScripts.Line;

				if(Model.data.current == "PDB") script += JmolScripts.Macromolecules;

				this.scriptWaitOutput(script);
				this.scriptWaitOutput(JmolScripts.resetLabels);
			}
		},

		setBackground: function(color)
		{
			if(this.ready)
			{
				Model.JSmol.scriptWaitOutput("\
					background " + color + "; color label " + color + ";\
					background echo " + color + "; color echo " + color + ";\
					set echo top left; font echo 18 serif bold; refresh;");
			}
		},

		loadMOL: function(mol)
		{
			if(this.currentModel == mol) return false;

			if(this.ready)
			{
				this.currentModel = mol;

				this._setMeasure("OFF");

				JSmol._loadMolData(mol);
				this.setRepresentation(Model.representation);
				this.scriptWaitOutput("rotate best;");

				return true;
			}
		},

		loadPDB: function(pdb)
		{
			if(this.currentModel == pdb) return false;

			if(this.ready)
			{
				this.currentModel = pdb;

				this._setMeasure("OFF");

				this.scriptWaitOutput("set defaultLattice {0 0 0};");
				this.scriptWaitOutput("set showUnitcell false;");

				JSmol.__loadModel(pdb);
				this.setRepresentation(Model.representation);
				this.script("rotate best;");

				return true;
			}
		},

		loadCIF: function(cif, cell)
		{
			if(this.currentModel == cif + cell) return false;

			if(this.ready)
			{
				this.currentModel = cif + cell;

				this._setMeasure("OFF");

				cell = cell || [1, 1, 1];
				this.scriptWaitOutput("set defaultLattice {" + cell.join(" ") + "};");

				JSmol.__loadModel(cif);
				this.scriptWaitOutput("set showUnitcell " + (cell.reduce(function(a, b){ return a * b; }) > 1 ? "false" : "true"));

				this.setRepresentation(Model.representation);
				this.scriptWaitOutput("rotate best;");

				return true;
			}
		},

		/**
		 * Set JSmol render quality (uses Jmol platformSpeed and antialiasDisplay)
		 * Updates Model metadata and UI
		 * @param {Boolean} hq      Enable High Quality
		 * @param {Boolean} measure Enable Measurement Quality [optional]
		 */
		setQuality: function(hq, measure)
		{
			$("#jmol-hq").removeClass("checked");
			if(hq) $("#jmol-hq").addClass("checked");

			this.hq = hq;
			this._setMeasure("OFF", true);
			this._setQuality(hq, measure);
		},

		/**
		 * Set JSmol render quality (uses Jmol platformSpeed and antialiasDisplay)
		 * @param {Boolean} hq      Enable High Quality
		 * @param {Boolean} measure Enable Measurement Quality [optional]
		 */
		_setQuality: function(hq, measure)
		{
			this.scriptWaitOutput("set antialiasDisplay " +
					(hq && !measure ? "true" : "false") + "; set platformSpeed "
					+ (measure && hq ? 2 : hq ? 4 : 1 + ";"));
		},

		/**
		 * Wrapper method for executing Jmol scripts from the menu
		 * This method makes sure JSmol is initialized before executing
		 * the script
		 * @param {Function} cb   Called when JSmol is ready
		 * @param {String}   what Message id
		 * @param {Boolean}  repressMessageClear
		 */
		safeCallback: function(cb, what, repressMessageClear)
		{
			Model.setRenderEngine("JSmol", function()
			{
				Messages.process(function()
				{
					cb();
					if(!repressMessageClear)
					{
						Messages.clear();
					}
				}, what);
			});
		},

		/**
		 * Restores the initial 3D model
		 */
		clean: function()
		{
			this.script(JmolScripts.clearMeasures);
			this.script(JmolScripts.clearMolecule);
			this.script(JmolScripts.resetLabels);
			this.setMeasure("OFF");
		},

		calculatePartialCharge: function()
		{
			if(this.ready)
			{
				if(!(parseFloat("" + Jmol.evaluate(JSmol, "{*}.partialcharge.max")) > 0))
				{
					var info = Jmol.getPropertyAsArray(JSmol, "moleculeInfo.mf")[0];
					if(info.indexOf("H 1 F 1") > -1)
						this.scriptWaitOutput("{fluorine and connected(1,hydrogen)}.partialCharge = '-0.47';{hydrogen and connected(1,fluorine)}.partialCharge = '0.47';");
					if(info.indexOf("H 1 Cl 1") > -1)
						this.scriptWaitOutput("{chlorine and connected(1,hydrogen)}.partialCharge = '-0.46';{hydrogen and connected(1,chlorine)}.partialCharge = '0.46';");
					if (info.indexOf("H 1 Br 1") > -1)
						this.scriptWaitOutput("{bromine and connected(1,hydrogen)}.partialCharge = '-0.42';{hydrogen and connected(1,bromine)}.partialCharge = '0.42';");
					if (info.indexOf("H 1 I 1") > -1)
						this.scriptWaitOutput("{iodine and connected(1,hydrogen)}.partialCharge = '-0.37';{hydrogen and connected(1,iodine)}.partialCharge = '0.37';");

					this.scriptWaitOutput("select *; calculate partialcharge;");
				}
			}
		},

		loadMEPSurface: function(translucent)
		{
			//exit when macromolecule
			if(Model.data.current == "PDB") return;

			MolView.makeModelVisible();
			Model.JSmol.safeCallback(function()
			{
				Model.JSmol._setMeasure("OFF");
				Model.JSmol.calculatePartialCharge();
				Model.JSmol.script("isosurface vdw resolution 0 color range -.07 .07 map mep " + (translucent ? "translucent" : "opaque") + ";");
				Model.JSmol.script(JmolScripts.resetLabels);
			}, "jmol_calculation");
		},

		displayCharge: function()
		{
			//exit when macromolecule
			if(Model.data.current == "PDB") return;

			MolView.makeModelVisible();
			Model.JSmol.safeCallback(function()
			{
				Model.JSmol._setMeasure("OFF");
				Model.JSmol.calculatePartialCharge();
				Model.JSmol.script("label %-8.4[partialcharge]; hover off;");
			}, "jmol_calculation");
		},

		displayDipoles: function()
		{
			//exit when macromolecule
			if(Model.data.current == "PDB") return;

			MolView.makeModelVisible();
			Model.JSmol.safeCallback(function()
			{
				Model.JSmol._setMeasure("OFF");
				Model.JSmol.calculatePartialCharge();
				Model.JSmol.script("dipole bonds on; dipole calculate bonds; hover off;");
			}, "jmol_calculation");
		},

		displayNetDipole: function()
		{
			//exit when macromolecule
			if(Model.data.current == "PDB") return;

			MolView.makeModelVisible();
			Model.JSmol.safeCallback(function()
			{
				Model.JSmol._setMeasure("OFF");
				Model.JSmol.calculatePartialCharge();
				Model.JSmol.script("dipole molecular on; dipole calculate molecular; hover off;");
			}, "jmol_calculation");
		},

		calculateEnergyMinimization: function()
		{
			//exit when macromolecule
			if(Model.data.current == "PDB") return;

			MolView.makeModelVisible();
			Model.JSmol.safeCallback(function()
			{
				Model.JSmol.setQuality(Model.JSmol.hq, true);//calls setMeasure("OFF")
				Model.JSmol.script(JmolScripts.clearMolecule);
				Model.JSmol.script(JmolScripts.resetLabels);
				Model.JSmol.script("minimize;");
			}, "jmol_calculation", true);
		},

		/**
		 * Wrapper for _setMeasure (ensures JSmol context)
		 * @param {String}  type Picking type (distance || angle || torsion)
		 *                       or OFF to disable picking
		 * @param {Boolean} noQualityRestore
		 */
		setMeasure: function(type, noQualityRestore)
		{
			if(this.picking == type.toLowerCase()) return;

			Model.JSmol.safeCallback(function()
			{
				Model.JSmol._setMeasure(type, noQualityRestore)
			});
		},

		/**
		 * Enables or disables JSmol picking
		 * @param {String}  type Picking type (distance || angle || torsion)
		 *                       or off to disable picking
		 * @param {Boolean} noQualityRestore
		 */
		_setMeasure: function(type, noQualityRestore)
		{
			if(this.picking == type.toLowerCase()) return;

			this.picking = type.toLowerCase();
			$(".jmol-picking").removeClass("checked");

			if(this.picking == "off")
			{
				Model.JSmol.scriptWaitOutput("set picking off;");

				if(!noQualityRestore)
				{
					Model.JSmol._setQuality(Model.JSmol.hq);
				}
			}
			else
			{
				$("#measure-" + this.picking).addClass("checked");

				//JSmol.setQuality will disable picking again
				Model.JSmol._setQuality(Model.JSmol.hq, true);
				Model.JSmol.scriptWaitOutput("set picking off; set picking on; set pickingstyle MEASURE; set picking MEASURE " + type + ";");
			}
		},

		toDataURL: function()
		{
			if(this.ready)
			{
				return document.getElementById("JSmol_canvas2d").toDataURL("image/png");
			}
			else return "";
		}
	},

	CDW:
	{
		ready: false,
		view: undefined,
		molecule: undefined,

		/*
		Saves current containing model data in order to prevent loading the
		same structure multiple times while switching between render engines
		*/
		currentModel: "",

		init: function(cb)
		{
			if(ChemDoodle == undefined) return;

			if(Detector.webgl)
			{
				this.view = new ChemDoodle.TransformCanvas3D("chemdoodle-canvas", $("#model").width(), $("#model").height());
				this.view.specs.backgroundColor = Model.bg.html;
				this.view.specs.crystals_unitCellColor = Model.bg.html;
				this.view.specs.macromolecules_ribbonCartoonize = true;
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
				this.view.resize($("#model").width(), $("#model").height());
				if(this.molecule !== undefined) this.view.loadMolecule(this.molecule);
			}
		},

		reset: function()
		{
			if(this.view !== undefined)
			{
				this.view.rotationMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
				this.view.repaint();
			}
		},

		setRepresentation: function(res)
		{
			if(res == "balls") res = "Ball and Stick";
			else if(res == "stick") res = "Stick";
			else if(res == "vdw") res = "van der Waals Spheres";
			else if(res == "wireframe") res = "Wireframe";
			else if(res == "line") res = "Line";

			this.view.specs.set3DRepresentation(res);

			/* if(res == "Wireframe")
			{
				this.view.specs.bonds_renderAsLines_3D = true;
			} */

			this.view.specs.backgroundColor = Model.bg.html;
			this.view.specs.crystals_unitCellColor = Model.bg.html;
			this.view.specs.bonds_useJMOLColors = true;
			if(res == "Ball and Stick") this.view.specs.bonds_cylinderDiameter_3D = 0.2;

			this.view.repaint();
		},

		setBackground: function(rgb, htmlColor)
		{
			this.view.specs.backgroundColor = htmlColor;
			this.view.specs.crystals_unitCellColor = htmlColor;
			this.view.gl.clearColor(rgb[0] / 255, rgb[1] / 255, rgb[2] / 255, 1);
			this.view.repaint();
		},

		loadMOL: function(mol)
		{
			if(this.currentModel == mol) return;

			if(this.view !== undefined)
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
			if(this.currentModel == pdb) return;

			if(this.view !== undefined)
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
			if(this.currentModel == cif + cell) return;

			if(this.view !== undefined)
			{
				this.currentModel = cif + cell;

				cell = cell || [1, 1, 1];
				this.view.specs.crystals_displayUnitCell = cell.reduce(function(a, b){ return a * b; }) == 1;
				this.view.specs.projectionPerspective_3D = false;
				this.view.specs.compass_display = true;
				this.molecule = ChemDoodle.readCIF(cif, cell[0], cell[1], cell[2]);
				this.view.loadMolecule(this.molecule);
			}
		},

		toDataURL: function()
		{
			if(this.view !== undefined)
			{
				this.view.gl.clearColor(0, 0, 0, 0);
				this.view.repaint();
				var dataURL = this.view.gl.canvas.toDataURL("image/png");
				this.view.gl.clearColor(Model.bg.rgb[0] / 255, Model.bg.rgb[1] / 255, Model.bg.rgb[2] / 255, 1);
				return dataURL;
			}
			else return "";
		}
	}
}
