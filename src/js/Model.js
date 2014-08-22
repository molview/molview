/*!
MolView v2.2 (http://molview.org)
Copyright (c) 2014, Herman Bergwerf
ALL RIGHTS RESERVED
*/

var JmolScripts = {
	Ball_and_Stick: "select *; wireframe 0.09; spacefill 28%;",
	Stick: "select *; wireframe 0.3; spacefill 0;",
	van_der_Waals_Spheres: "select *; spacefill 100%;",
	Wireframe: "select *; wireframe 0.03; spacefill 0.08;",
	Line: "select *; wireframe on; spacefill off;",
	Macromolecules: "select protein or nucleic; ribbon only; color ribbons structure; display not solvent;",
	resetLabels: "hover off; color measures magenta; font measure 18;",
	clearChargeDisplay: 'measure off; measure delete; mo off; isosurface off; echo ""; label ""; select formalCharge <> 0; label %C; select *; dipole bond delete; dipole molecular delete; color cpk;'
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
	background: "black",

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
	 * Resizes 3D canvas in order to fit the current #model area
	 */
	resize: function()
	{
		if(this.engine == "GLmol") this.GLmol.resize();
		else if(this.engine == "JSmol") this.JSmol.resize();
		else if(this.engine == "CDW") this.CDW.resize();
	},

	/**
	 * Resets model position, rotation and scaling back to default
	 */
	reset: function()
	{
		if(this.engine == "GLmol") this.GLmol.reset();
		else if(this.engine == "JSmol") this.JSmol.reset();
		else if(this.engine == "CDW") this.CDW.reset();
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

		if(this.isGLmol()) this.GLmol.setBackground(this.background);
		else if(this.isJSmol()) this.JSmol.setBackground(this.background);
		else if(this.isCDW()) this.CDW.setBackground(this.background);

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
		$(".model-bg").removeClass("checked");
		$("#model-bg-" + color).addClass("checked");
		$("#model").css("background", color);

		this.background = color;

		if(this.isGLmol()) return this.GLmol.setBackground(this.background);
		else if(this.isJSmol()) return this.JSmol.setBackground(this.background);
		else if(this.isCDW()) return this.CDW.setBackground(this.background);
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
	* @param {Boolean} noDisplay If True, the PDB file is NOT displayed
	*/
	loadPDB: function(pdb, noDisplay)
	{
		this.data.current = "PDB";
		this.data.pdb = pdb;
		$("#save-local-3d").text("PDB file");
		$(".jmol-script").addClass("disabled");

		if(noDisplay) return;

		this._loadPDB(pdb);
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
	* Loads a CID file into the 3D engine
	* Updates Model metadata and UI
	* @param {String} cif  CIF file
	* @param {Array}  cell Crystal cell dimensions
	*/
	loadCIF: function(cif, cell)
	{
		this.data.current = "CIF";
		this.data.cif = cif;
		$("#save-local-3d").text("CIF file");
		$(".jmol-script").removeClass("disabled");

		this._loadCIF(cif, cell);
	},

	/**
	* Loads a CIF file into the 3D engine
	* This method does not update the UI or the Model metadata
	* This method picks the most suitable crystal render engine
	* (CDW if WebGL is available, else JSmol)
	* @param {String} cif  CIF file
	* @param {Array}  cell Crystal cell dimensions
	*/
	_loadCIF: function(cif, cell)
	{
		cell = cell || [1, 1, 1];
		if(this.isGLmol())
		{
			if(Detector.webgl)//use ChemDoodle
			{
				this.setRenderEngine("CDW", function()
				{
					Model.CDW.loadCIF(Model.data.cif, cell);
				});
			}
			else//use Jmol
			{
				this.setRenderEngine("JSmol", function()
				{
					Model.JSmol.loadCIF(Model.data.cif, cell);
				});
			}
		}
		else if(this.isJSmol())
		{
			this.JSmol.loadCIF(cif, cell);
		}
		else if(this.isCDW())
		{
			if(Detector.webgl)
			{
				this.CDW.loadCIF(cif, cell);
			}
			else//use Jmol
			{
				this.setRenderEngine("JSmol", function()
				{
					Model.JSmol.loadCIF(Model.data.cif, cell);
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
		canvas: undefined,
		container: undefined,
		loadBioAssembly: false,
		chain: {
			representation: "ribbon",//ribbon || cylinders || trace || tube || bonds
			coloring: "ss",//ss || spectrum || chain || bfactor || polarity
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
				this.view = new GLmol("glmol", true, !Detector.webgl, MolView.mobile ? 1.5 : 1.0);
				this.view.loadMoleculeStr(false, "");

				this.container = $("#glmol");
				this.canvas = this.container.children("canvas").first();
				this.canvas.css("width", this.container.width());

				this.view.defineRepresentation = function()
				{
					var all = this.getAllAtoms();
					if(Model.GLmol.loadBioAssembly && this.protein.biomtChains != "") all = this.getChain(all, this.protein.biomtChains);
					var all_het = this.getHetatms(all);
					var hetatm = this.removeSolvents(all_het);
					var chain = Model.GLmol.chain;

					this.colorByAtom(all, {});
					if(chain.coloring == "ss") this.colorByStructure(all, 0xcc00cc, 0x00cccc);
					else if(chain.coloring == "spectrum") this.colorChainbow(all);
					else if(chain.coloring == "chain") this.colorByChain(all);
					else if(chain.coloring == "bfactor") this.colorByBFactor(all);
					else if(chain.coloring == "polarity") this.colorByPolarity(all, 0xcc0000, 0xcccccc);

					if(Model.data.current == "PDB")
					{
						var asu = new THREE.Object3D();
						var do_not_smoothen = false;
						if(chain.representation == "ribbon")
						{
							this.drawCartoon(asu, all, do_not_smoothen);
							this.drawCartoonNucleicAcid(asu, all);
						}
						else if(chain.representation == "cylinders")
						{
							this.drawHelixAsCylinder(asu, all, 1.6);
							this.drawCartoonNucleicAcid(asu, all);
						}
						else if(chain.representation == "trace")
						{
							this.drawMainchainCurve(asu, all, this.curveWidth, "CA", 1);
							this.drawMainchainCurve(asu, all, this.curveWidth, "O3'", 1);
						}
						else if(chain.representation == "tube")
						{
							this.drawMainchainTube(asu, all, "CA");
							this.drawMainchainTube(asu, all, "O3'");
						}
						else if(chain.representation == "bonds")
						{
							this.drawBondsAsLine(asu, all, this.lineWidth);
						}
					}

					var target = this.modelGroup;
					this.canvasVDW = false;

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
							this.canvasBondWidth = 0.1;
							this.drawBondsAsStick(target, hetatm, this.cylinderRadius / 8.0, this.cylinderRadius * 8, true, true, 0.05);
						}
						else if(Model.representation == "line")
						{
							this.canvasAtomRadius = 0.05;
							this.canvasBondWidth = 0.1;
							this.drawBondsAsLine(target, hetatm, 1);
						}
					}

					if(Model.GLmol.loadBioAssembly) this.drawSymmetryMates2(this.modelGroup, asu, this.protein.biomtMatrices);
					this.modelGroup.add(asu);
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
			if(this.view !== undefined)
			{
				if(this.canvas !== undefined && this.container !== undefined)
					this.canvas.css("width", this.container.width());
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

		setBackground: function(color)
		{
			this.view.setBackground(color == "white" ? 0xffffff : 0x000000);
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
				this.view.loadMoleculeStr(false, mol);
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
				this.view.loadMoleculeStr(false, pdb);
			}
		},

		/**
		 * Toggles the current bio-assembly switch and updates the
		 * assosiated render output
		 */
		toggleBioAssembly: function()
		{
			if(Model.engine == "GLmol" && Model.data.current == "PDB")
			{
				this.loadBioAssembly = !this.loadBioAssembly;
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
					else Model.GLmol.view.loadMoleculeStr(false, Model.data.pdb);//in order to center macromolecule

					Messages.hide();
				}, "glmol_update");
			}
		},

		/**
		 * Sets the current chain representation
		 * @param {String} representation Chain representation type
		 */
		setChainRepresentation: function(representation)
		{
			$(".glmol-chain").removeClass("checked");
			$("#glmol-chain-" + representation).addClass("checked");

			this.chain.representation = representation;
			if(Model.engine == "GLmol") Messages.process(function()
			{
				Model.GLmol.setRepresentation.call(Model.GLmol);
				Messages.hide();
			}, "glmol_update");
		},

		/**
		* Sets the current chain coloring
		* @param {String} coloring Chain coloring type
		*/
		setChainColoring: function(coloring)
		{
			$(".glmol-color").removeClass("checked");
			$("#glmol-color-" + coloring).addClass("checked");

			this.chain.coloring = coloring;
			if(Model.engine == "GLmol") Messages.process(function()
			{
				Model.GLmol.setRepresentation.call(Model.GLmol);
				Messages.hide();
			}, "glmol_update");
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

				this.view.setBackground(Model.background == "white" ? 0xffffff : 0x000000);
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
		platformSpeed: 4,
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
					Jmol.setDocument(0);
					Jmol.getApplet("JSmol", {
						width: $("#model").width(),
						height: $("#model").height(),
						debug: false,
						showfrank: false,
						disableJ2SLoadMonitor: true,
						disableInitialConsole: true,
						use: "HTML5",
						j2sPath: MolView.JMOL_J2S_PATH,
						script: 'frank off; background ' + Model.background + '; unbind "MIDDLE DRAG" "_rotateZorZoom"; bind "MIDDLE DRAG" "_translate"; set antialiasDisplay true; set disablePopupMenu true; set showunitcelldetails false; set hoverDelay 0.001; hover off; font measure 18; set MessageCallback "Model.JSmol.onMessage";',
						readyFunction: Model.JSmol.onReady.bind(Model.JSmol),
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
		onReady: function()
		{
			this.ready = true;
			this.setPlatformSpeed(this.platformSpeed);
			var scope = this;

			Model._setRenderEngine("JSmol");
			Messages.hide();
			if(scope.readyCB) scope.readyCB();
		},

		/**
		 * JSmol message callback
		 */
		onMessage: function(a, b, c)
		{
			if(b.toLowerCase().indexOf("initial mmff e") > -1 && b.toLowerCase().indexOf("max steps = 0") > -1)
			{
				var array = b.split(/ +/);
				Model.JSmol.print("Energy = " + array[5] + " kJ");
			}
			return null;
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
				Model.JSmol.script('set echo top left; background echo black; font echo 18 serif bold; color echo white; echo "' + msg + '";');
			}
		},

		resize: function()
		{
			if(this.ready)
			{
				Jmol.resizeApplet(JSmol, [ $("#model").width(), $("#model").height() ]);
			}
		},

		reset: function()
		{
			if(this.ready)
			{
				Model.JSmol.script("reset;");
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
				Model.JSmol.scriptWaitOutput("background " + color + "; refresh;");
		},

		loadMOL: function(mol)
		{
			if(this.currentModel == mol) return;

			if(this.ready)
			{
				this.currentModel = mol;

				JSmol._loadMolData(mol);
				this.setRepresentation(Model.representation);
				this.setPicking(this.picking);
				this.scriptWaitOutput("rotate best");

				return true;
			}
		},

		loadPDB: function(pdb)
		{
			if(this.currentModel == pdb) return;

			if(this.ready)
			{
				this.currentModel = pdb;

				this.scriptWaitOutput("set defaultLattice {0 0 0};");
				this.scriptWaitOutput("set showUnitcell false;");
				this.scriptWaitOutput("set picking off;");
				this._setPlatformSpeed(Model.JSmol.platformSpeed);

				JSmol.__loadModel(pdb);
				this.setRepresentation(Model.representation);
				this.script("rotate best");

				return true;
			}
		},

		loadCIF: function(cif, cell)
		{
			if(this.currentModel == cif + cell) return;

			if(this.ready)
			{
				this.currentModel = cif + cell;

				cell = cell || [1, 1, 1];
				this.scriptWaitOutput("set defaultLattice {" + cell.join(" ") + "};");

				JSmol.__loadModel(cif);
				this.scriptWaitOutput("set showUnitcell " + (cell.reduce(function(a, b){ return a * b; }) > 1 ? "false" : "true"));

				this.setRepresentation(Model.representation);
				this.setPicking(this.picking);
				this.scriptWaitOutput("rotate best");

				return true;
			}
		},

		/**
		 * Set JSmol render quality (called platform speed by Jmol)
		 * Updates Model metadata and UI
		 * @param {Integer} i Platform speed (1-8)
		 */
		setPlatformSpeed: function(i)
		{
			$(".jmol-rnd").removeClass("checked");
			$("#jmol-render-" + (i == 1 ? "minimal" : i == 4 ? "normal" : "all")).addClass("checked");

			this.platformSpeed = i;
			this._setPlatformSpeed(i);
		},

		/**
		 * Inside method to apply the specified Jmol platformSpeed
		 * @param {Integer} i Platform speed (1-8)
		 */
		_setPlatformSpeed: function(i)
		{
			this.scriptWaitOutput("set antialiasDisplay " + (i <= 2 ? "false" : "true") + "; set platformSpeed " + i + ";");
			this.scriptWaitOutput(JmolScripts.resetLabels);
		},

		/**
		 * Wrapper method for executing Jmol scripts from the menu
		 * This method makes sure JSmol is initialized before executing
		 * the script
		 * @param {Function} cb   Called when JSmol is ready
		 * @param {String}   what Message id
		 * @param {Boolean}  show Indicates if a message should be displayed
		 */
		safeCallback: function(cb, what, show)
		{
			Model.setRenderEngine("JSmol", function()
			{
				if(show)
				{
					Messages.process(function()
					{
						cb();
						Messages.hide();
					}, what);
				}
				else window.setTimeout(cb, 100);
			});
		},

		/**
		 * Restores the initial 3D model
		 */
		clean: function()
		{
			this.script(JmolScripts.clearChargeDisplay);
			this.script(JmolScripts.resetLabels);
		},

		calculatePartialCharge: function()
		{
			if(this.ready)
			{
				var info = Jmol.getPropertyAsArray(JSmol, "moleculeInfo.mf")[0];
				if(info.indexOf("H 1 F 1") > -1)
					Jmol.script(JSmol, "{fluorine and connected(1,hydrogen)}.partialCharge = '-0.47';{hydrogen and connected(1,fluorine)}.partialCharge = '0.47';");
				if(info.indexOf("H 1 Cl 1") > -1)
					Jmol.script(JSmol, "{chlorine and connected(1,hydrogen)}.partialCharge = '-0.46';{hydrogen and connected(1,chlorine)}.partialCharge = '0.46';");
				if (info.indexOf("H 1 Br 1") > -1)
					Jmol.script(JSmol, "{bromine and connected(1,hydrogen)}.partialCharge = '-0.42';{hydrogen and connected(1,bromine)}.partialCharge = '0.42';");
				if (info.indexOf("H 1 I 1") > -1)
					Jmol.script(JSmol, "{iodine and connected(1,hydrogen)}.partialCharge = '-0.37';{hydrogen and connected(1,iodine)}.partialCharge = '0.37';");

				Jmol.script(JSmol, "select *; calculate partialcharge;");
			}
		},

		loadMEPSurface: function(translucent)
		{
			//exit when macromolecule
			if(Model.data.current == "PDB") return;

			MolView.makeModelVisible();

			Model.JSmol.safeCallback(function()
			{
				Model.JSmol.calculatePartialCharge();
				Model.JSmol.script("isosurface vdw resolution 0 color range -.07 .07 map mep " + (translucent ? "translucent" : "opaque") + ";");
				Model.JSmol.script(JmolScripts.resetLabels);
			}, "jmol_calculation", true);
		},

		displayCharge: function()
		{
			//exit when macromolecule
			if(Model.data.current == "PDB") return;

			MolView.makeModelVisible();

			var charge_calculated = Model.JSmol.ready ? parseFloat("" + Jmol.evaluate(JSmol, "{*}.partialcharge.max")) > 0 : false;

			Model.JSmol.safeCallback(function()
			{
				if(!charge_calculated) Model.JSmol.calculatePartialCharge();
				Model.JSmol.script("color {*} partialCharge; color label black; background label white; label %-8.4[partialcharge]; hover off;");
			}, "jmol_calculation", !charge_calculated);
		},

		displayDipoles: function()
		{
			//exit when macromolecule
			if(Model.data.current == "PDB") return;

			MolView.makeModelVisible();

			var charge_calculated = Model.JSmol.ready ? parseFloat("" + Jmol.evaluate(JSmol, "{*}.partialcharge.max")) > 0 : false;

			Model.JSmol.safeCallback(function()
			{
				if(!charge_calculated) Model.JSmol.calculatePartialCharge();
				Model.JSmol.script("dipole bonds on; dipole calculate bonds; hover off;");
			}, "jmol_calculation", !charge_calculated);
		},

		displayNetDipole: function()
		{
			//exit when macromolecule
			if(Model.data.current == "PDB") return;

			MolView.makeModelVisible();

			var charge_calculated = Model.JSmol.ready ? parseFloat("" + Jmol.evaluate(JSmol, "{*}.partialcharge.max")) > 0 : false;

			Model.JSmol.safeCallback(function()
			{
				if(!charge_calculated) Model.JSmol.calculatePartialCharge();
				Model.JSmol.script("dipole molecular on; dipole calculate molecular; hover off;");
			}, "jmol_calculation", !charge_calculated);
		},

		calculateEnergyMinimization: function()
		{
			//exit when macromolecule
			if(Model.data.current == "PDB") return;

			MolView.makeModelVisible();

			Model.JSmol.safeCallback(function()
			{
				Model.JSmol.script("minimize;");
			}, "jmol_calculation", false);
		},

		/**
		 * Enables or disables JSmol picking
		 * @param {String} type Picking type (distance || angle || torsion)
		 *                      or OFF to disable picking
		 */
		setPicking: function(type)
		{
			this.picking = type;
			Model.JSmol.safeCallback(function()
			{
				if(type == "OFF")
				{
					Model.JSmol.scriptWaitOutput("set picking off;");
					Model.JSmol._setPlatformSpeed(Model.JSmol.platformSpeed);
				}
				else
				{
					Model.JSmol._setPlatformSpeed(2);
					Model.JSmol.scriptWaitOutput("set picking off; set picking on; set pickingstyle MEASURE; set picking MEASURE " + type + ";");
					Model.JSmol.scriptWaitOutput(JmolScripts.resetLabels);
				}
			}, "jmol_calculation", false);
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
				this.view.specs.backgroundColor = (Model.background == "white" ? "#ffffff" : "#000000");
				this.view.specs.crystals_unitCellColor = (Model.background != "white" ? "#ffffff" : "#000000");
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
			if(this.view !== undefined)
			{
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
			if(res == "stick") res = "Stick";
			if(res == "vdw") res = "van der Waals Spheres";
			if(res == "wireframe") res = "Wireframe";
			if(res == "line") res = "Line";

			this.view.specs.set3DRepresentation(res);
			this.view.specs.backgroundColor = (Model.background == "white" ? "#ffffff" : "#000000");
			this.view.specs.crystals_unitCellColor = (Model.background != "white" ? "#ffffff" : "#000000");
			this.view.specs.bonds_useJMOLColors = true;
			if(res == "Ball and Stick") this.view.specs.bonds_cylinderDiameter_3D = 0.2;

			this.view.repaint();
		},

		setBackground: function(color)
		{
			this.view.specs.backgroundColor = (color == "white" ? "#ffffff" : "#000000");
			this.view.specs.crystals_unitCellColor = (Model.background != "white" ? "#ffffff" : "#000000");
			if(color == "white") this.view.gl.clearColor(255, 255, 255, 255);
			else this.view.gl.clearColor(0, 0, 0, 255);
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

				if(Model.background == "white") this.view.gl.clearColor(255, 255, 255, 255);
				else this.view.gl.clearColor(0, 0, 0, 255);

				return dataURL;
			}
			else return "";
		}
	}
}
