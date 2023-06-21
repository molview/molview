/**
 * This file is part of MolView (http://molview.org)
 * Copyright (c) 2014-2023 Herman Bergwerf
 */

/**
 * 3D model wrapper
 * @type {Object}
 */
var Model = {
	data: {
		mol: "",
		pdb: "",
		cif: "",
		current: "MOL",//MOL || PDB || CIF
	},

	representation: "balls",//balls || stick || vdw || wireframe || line
	displayBU: false,//display Biological Unit (BU) or Asymmetric Unit (ASU)
	chain: {
		type: "ribbon",
		bonds: false,
		color: "ss",
	},
	bg: {
		colorName: "black",
		hex: 0x000000,
		rgb: [0,0,0],//byte based
		jmol: "[0,0,0]",
		html: "rgb(0,0,0)"
	},
	fg: {
		html: "rgb(255,255,255)"
	},

	engine: undefined,//"GLmol", "JSmol", "CDW"
	GLmol: GLmolPlugin,
	JSmol: JSmolPlugin,
	CDW: CDWPlugin,

	pixelMult: 1,

	/**
	 * Initializes 3D model view
	 * @param  {Function} cb  Called when intialization is ready
	 * @param  {String}   rnd Initail render engine
	 */
	init: function(cb, rnd)
	{
		this.pixelMult = MolView.devicePixelRatio;

		this.setBackground(Preferences.get("model", "background", "black"));

		if(this.GLmol && this.JSmol && this.CDW)//all plugins are loaded
		{
			if(MolView.loadDefault)
			{
				this.data.mol = (defaultMol3D || "");
			}

			this.setRenderEngine(rnd || "GLmol", cb);
		}
		else throw new Error("Not all Model plugins are loaded");
	},

	/**
	 * Preload Model settings from query object
	 * @param {Object} query Query object
	 * @param {String} rnd   Temporary renderer string
	 */
	preloadQuery: function(query, rnd)
	{
		var scope = this;
		$.each(query, function(key, value)
		{
			if(key === "mode")
			{
				if(oneOf(value, ["balls", "stick", "vdw", "wireframe", "line"]))
				{
					$(".r-mode").removeClass("checked");
					$("#action-model-" + value).addClass("checked");
					scope.representation = value;
				}
			}
			else if(key === "chainType")
			{
				if(oneOf(value, ["ribbon", "cylinders", "btube", "ctrace"]))
				{
					$(".chain-type").removeClass("checked");
					$("#action-chain-type-" + value).addClass("checked");
					scope.chain.type = value;
				}

				if(value === "bonds")
				{
					$(".chain-type").removeClass("checked");
					scope.chain.type = "none";
					scope.chain.bonds = true;
				}
			}
			else if(key === "chainBonds")
			{
				scope.chain.bonds = true;
			}
			else if(key === "chainColor")
			{
				if(oneOf(value, ["ss", "spectrum", "chain", "residue", "polarity", "bfactor"]))
				{
					$(".chain-color").removeClass("checked");
					$("#action-chain-color-" + value).addClass("checked");
					scope.chain.color = value;
				}
			}
		});
	},

	/**
	 * @return {Boolean} True if current render engine is GLmol
	 */
	isGLmol: function()
	{
		return Model.engine === "GLmol";
	},

	/**
	 * @return {Boolean} True if current render engine is JSmol
	 */
	isJSmol: function()
	{
		return Model.engine === "JSmol";
	},

	/**
	 * @return {Boolean} True if current render engine is ChemDoodle Web
	 */
	isCDW: function()
	{
		return Model.engine === "CDW";
	},

	/**
	 * @return {Boolean} True if current model is loaded from a Molfile
	 */
	isMOL: function()
	{
		return Model.data.current === "MOL";
	},

	/**
	 * @return {Boolean} True if current model is loaded from a PDB file
	 */
	isPDB: function()
	{
		return Model.data.current === "PDB";
	},

	/**
	 * @return {Boolean} True if current model is loaded from a CIF file
	 */
	isCIF: function()
	{
		return Model.data.current === "CIF";
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
	 * @return {Boolean}         False if $engine === Model.engine
	 */
	setRenderEngine: function(engine, cb)
	{
		if(this.engine === engine)
		{
			if(cb) cb();
			return;
		}

		if(engine === "GLmol")
		{
			if(this.isCIF())
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
		else if(engine === "JSmol")
		{
			if(this.JSmol.ready)
			{
				this._setRenderEngine(engine);
				if(cb) cb();
			}
			else if(!this.JSmol.init(cb)) return;
		}
		else if(engine === "CDW")
		{
			if(this.CDW.ready)
			{
				this._setRenderEngine(engine);
				if(cb) cb();
			}
			else if(!this.CDW.init(cb)) return;
		}

		$("#action-engine-glmol").removeClass("checked");
		$("#action-engine-jmol").removeClass("checked");
		$("#action-engine-cdw").removeClass("checked");
		$("#action-engine-" + (engine === "GLmol" ?
			"glmol" : (engine === "JSmol" ?
				"jmol" : (engine === "CDW" ?
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
		$("#glmol").css("display", (engine === "GLmol") ? "block" : "none");
		$("#jsmol").css("display", (engine === "JSmol") ? "block" : "none");
		$("#chemdoodle").css("display", (engine === "CDW") ? "block" : "none");

		this.engine = engine;
		this.resize();

		if(this.isGLmol()) this.GLmol.setBackground(this.bg.hex);
		else if(this.isJSmol()) this.JSmol.setBackground(this.bg.jmol);
		else if(this.isCDW()) this.CDW.setBackground(this.bg.rgb, this.bg.html, this.fg.html);

		/* if loadContent returns true, the render engine
		has updated the representation already */
		if(!this.loadContent())
		{
			if(this.isGLmol()) this.GLmol.setRepresentation();
			else if(this.isJSmol()) this.JSmol.setRepresentation();
			else if(this.isCDW()) this.CDW.setRepresentation();
		}
	},

	/**
	 * Sets the molecular representation
	 * @param {String} mode Representation mode
	 */
	setRepresentation: function(mode)
	{
		if(!oneOf(mode, ["balls", "stick", "vdw", "wireframe", "line"]))
			return;

		$(".r-mode").removeClass("checked");
		$("#action-model-" + mode).addClass("checked");

		this.representation = mode;

		window.setTimeout((function()
		{
			if(this.isGLmol()) this.GLmol.setRepresentation();
			else if(this.isJSmol()) this.JSmol.setRepresentation();
			else if(this.isCDW()) this.CDW.setRepresentation();
		}).bind(this), 300);
	},

	/**
	 * Sets the protein chain representation type
	 * @param {String}  type  One of: ribbon, cylinders, btube, ctrace, none
	 * @param {Boolean} force Set Chain type even if !Model.isPDB()
	 */
	setChainType: function(type, force)
	{
		if(!oneOf(type, ["ribbon", "cylinders", "btube", "ctrace"]))
			return;

		if(this.isPDB() || force)
		{
			if(this.isGLmol()
			|| (this.isJSmol() && oneOf(type, ["ribbon", "ctrace", "none"]))
			|| (this.isCDW() && type === "ribbon"))
			{
				$(".chain-type").removeClass("checked");
				$("#action-chain-type-" + type).addClass("checked");
				this.chain.type = type;

				var shown = Messages.process(function()
				{
					if(Model.isGLmol()) Model.GLmol.setRepresentation();
					else Model.JSmol.setRepresentation();
					if(shown) Messages.clear();
				}, "model_update");
			}
			else
			{
				Messages.alert(oneOf(type, ["ribbon", "ctrace", "none"])
						? "glmol_and_jmol_only" : "glmol_only");
			}
		}
		else
		{
			Messages.alert("no_protein");
		}
	},

	/**
	 * Sets whether all protein chain bonds are displayed
	 * @param {Boolean} on
	 * @param {Boolean} force Set Chain type even if !Model.isPDB()
	 */
	setChainBonds: function(on, force)
	{
		if(this.isPDB() || force)
		{
			if(this.isGLmol() || this.isJSmol()
			|| (this.isCDW() && !on))
			{
				$("#action-chain-type-bonds").toggleClass("checked", on);
				this.chain.bonds = on;

				var shown = Messages.process(function()
				{
					if(Model.isGLmol()) Model.GLmol.setRepresentation();
					else Model.JSmol.setRepresentation();
					if(shown) Messages.clear();
				}, "model_update");
			}
			else
			{
				Messages.alert("glmol_and_jmol_only");
			}
		}
		else
		{
			Messages.alert("no_protein");
		}
	},

	/**
	 * Sets the protein chain coloring type
	 * @param {String}  color One of: ss, spectrum, chain, residue, polarity, bfactor
	 * @param {Boolean} force Set Chain type even if !Model.isPDB()
	 */
	setChainColor: function(color, force)
	{
		if(this.isPDB() || force)
		{
			if(this.isGLmol() || this.isJSmol()
			|| (this.isCDW() && color !== "bfactor"))
			{
				$(".chain-color").removeClass("checked");
				$("#action-chain-color-" + color).addClass("checked");
				this.chain.color = color;

				var shown = Messages.process(function()
				{
					if(Model.isGLmol()) Model.GLmol.setRepresentation();
					else if(Model.isJSmol()) Model.JSmol.setRepresentation();
					else Model.CDW.setRepresentation();
					if(shown) Messages.clear();
				}, "model_update");
			}
			else
			{
				Messages.alert("glmol_and_jmol_only");
			}
		}
		else
		{
			Messages.alert("no_protein");
		}
	},

	/**
	 * Sets the 3D model background color
	 * @param {String} color Color name
	 */
	setBackground: function(color)
	{
		Preferences.set("model", "background", color);

		this.bg.colorName = color;
		this.bg.hex = color !== "white" ? color !== "gray" ? 0x000000 : 0xcccccc : 0xffffff;
		this.bg.rgb = [this.bg.hex >> 16, this.bg.hex >> 8 & 0xFF, this.bg.hex & 0xFF];
		this.bg.jmol = "[" + this.bg.rgb.join() + "]";
		this.bg.html = "rgb(" + this.bg.rgb.join() + ")";
		this.fg.html = "rgb(" + (255 - this.bg.rgb[0]) + ","
							  + (255 - this.bg.rgb[0]) + ","
							  + (255 - this.bg.rgb[0]) + ")";

		$(".model-bg").removeClass("checked");
		$("#action-model-bg-" + color).addClass("checked");
		$("#model").css("background", this.bg.html);

		if(this.isGLmol()) return this.GLmol.setBackground(this.bg.hex);
		else if(this.isJSmol()) return this.JSmol.setBackground(this.bg.jmol);
		else if(this.isCDW()) return this.CDW.setBackground(this.bg.rgb, this.bg.html, this.fg.html);
	},

	/**
	 * Sets whether the Biological Unit (BU) or the Asymmetric Unit (ASU)
	 * of a PDB file are rendered (currently only available in GLmol)
	 * @param {Boolean} on
	 */
	setBioAssembly: function(on)
	{
		if(this.isGLmol())
		{
			if(this.isPDB())
			{
				$("#action-bio-assembly").text(on ? "Show assymetic unit" : "Show bio assembly");
				this.displayBU = on;

				var shown = Messages.process(function()
				{
					Model.GLmol.setAssembly(on);
					if(shown) Messages.clear();
				}, "model_update");
			}
			else
			{
				Messages.alert("no_protein");
			}
		}
		else
		{
			Messages.alert("glmol_only");
		}
	},

	/**
	 * Loads the current 3D data into the current render engine
	 */
	loadContent: function()
	{
		     if(this.isMOL()) return this._loadMOL(this.data.mol);
		else if(this.isPDB()) return this._loadPDB(this.data.pdb);
		else if(this.isCIF()) return this._loadCIF(this.data.cif);
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
		$("#action-export-model").text("MOL file");
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
		$("#action-export-model").text("PDB file");
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
		$("#action-export-model").text("PDB file");
		$(".jmol-script").addClass("disabled");
	},

	/**
	 * Loads a PDB file into the 3D engine
	 * This method does not update the UI or the Model metadata
	 * @param {String} pdb PDB file
	 */
	_loadPDB: function(pdb)
	{
		/* always disable BU when loading a PDB file into a render engine
		in order to prevent unwanted CPU load */
		this.displayBU = false;
		$("#action-bio-assembly").text("Show bio assembly");

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
		$("#action-export-model").text("CIF file");
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
	getImageDataURL: function()
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
	getFileBlob: function()
	{
		var blob;
		     if(this.isMOL()) blob =  new Blob([ this.data.mol ], { type: "chemical/x-mdl-molfile" });
		else if(this.isPDB()) blob =  new Blob([ this.data.pdb ], { type: "chemical/x-pdb" });
		else if(this.isCIF()) blob =  new Blob([ this.data.cif ], { type: "chemical/x-cif" });
		return blob;
	},

	/**
	 * @return {String} Uppercase file extension for the current 3D model
	 */
	getFileExstension: function()
	{
		return Model.data.current;
	},
}
