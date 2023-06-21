/**
 * This file is part of MolView (http://molview.org)
 * Copyright (c) 2014-2023 Herman Bergwerf
 */

var JmolScripts = {
	basicSettings: "",
	select: {
		molecules: "select *; select remove protein or nucleic;",
		macromolecules: "select protein or nucleic;"
	},
	mol: {
		balls: "wireframe 0.09; spacefill 25%;",
		stick: "wireframe 0.4; spacefill 0;",
		vdw: "spacefill 100%;",
		wireframe: "wireframe 0.03; spacefill 0.08;",
		line: "wireframe on; spacefill off;",
	},
	pdb: {
		none: "wireframe only; wireframe off;",
		ribbon: "ribbon only;",
		ctrace: "backbone only;",
		bonds: "wireframe on;",

		ss: "color atoms cpk;\
color ribbon [xcccccc]; color backbone [xcccccc];\
select helix; color ribbon [xcc00cc]; color backbone [xcc00cc];\
select sheet; color ribbon [x00cccc]; color backbone [x00cccc];\
select nucleic; color ribbon red; color backbone red;",
		spectrum: "color atoms group; color ribbon group; color backbone group;",
		chain: "color atoms chain; color ribbon chain; color backbone chain;",
		residue: "color atoms amino; color ribbon amino; color backbone amino;",
		polarity: "color [xcccccc]; color ribbon [xcccccc]; select polar; color ribbon [xcc0000]; color [xcc0000];",
		bfactor: "color atoms cpk; color ribbons relativeTemperature; color backbone fixedTemperature;",

		hideSolvents: "display not solvent;"
	},
	resetLabels: "select *; hover off; color measures magenta; font measure 18;",
	clearMeasures: 'measure off; measure delete;',
	clearMolecule: 'isosurface off; echo ""; label ""; select formalCharge <> 0; label %C; select *; dipole bond delete; dipole molecular delete; color cpk;'
};

/**
 * JSmol wrapper/plugin for Model.js
 * @type {Object}
 */
var JSmolPlugin = {
	/**
	 * Indicates if JSmol is loaded
	 * @type {Boolean}
	 */
	ready: false,

	/**
	 * Callback called once constructor is finished
	 * @type {Function}
	 */
	readyCB: undefined,


	/**
	 * Indicates if High Quality is enabled
	 * High Quality includes:
	 * - anti aliasing
	 * - higher platform speed
	 * - protein ribbon rims
	 *
	 * @type {Boolean}
	 */
	hq: true,

	/**
	 * Jmol picking mode
	 * @type {String}
	 */
	picking: "OFF",

	/**
	* Saves current containing model data in order to prevent loading the
	* same structure multiple times while switching between render engines
	* @type {String}
	*/
	currentModel: "",

	init: function(cb)
	{
		if(Jmol === undefined) return;
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
					script: 'unbind _setMeasure; unbind "MIDDLE DRAG" "_rotateZorZoom"; bind "MIDDLE DRAG" "_translate";\
frank off; set specular off;\
background ' + Model.bg.jmol + '; color label ' + Model.bg.jmol + ';\
background echo ' + Model.bg.jmol + '; color echo ' + Model.bg.jmol + ';\
set antialiasDisplay true; set disablePopupMenu true; set showunitcelldetails false;\
set hoverDelay 0.001; hover off; font measure 18; font echo 18 serif bold; set echo top left;\
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
		if(message === "done")
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
			Model.JSmol.clean();
			Model.JSmol.scriptWaitOutput("reset;");

			if(Model.isCIF())
			{
				Model.JSmol.scriptWaitOutput("rotate best;");
			}
		}
	},

	setRepresentation: function()
	{
		if(this.ready)
		{
			this.scriptWaitOutput(JmolScripts.select.molecules);
			this.scriptWaitOutput(JmolScripts.mol[Model.representation]);

			if(Model.isPDB())
			{
				var chainType = Model.chain.type;

				if(!oneOf(chainType, ["ribbon", "ctrace", "none"]))
				{
					chainType = "ribbon";//fallback type
					Messages.alert("no_jmol_chain_type");
				}

				this.scriptWaitOutput(JmolScripts.select.macromolecules);
				this.scriptWaitOutput(JmolScripts.pdb[chainType]);
				if(Model.chain.bonds) this.scriptWaitOutput(JmolScripts.pdb.bonds);
				this.scriptWaitOutput(JmolScripts.pdb[Model.chain.color]);
				this.scriptWaitOutput(JmolScripts.pdb.hideSolvents);
			}

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
		if(this.currentModel === mol) return false;

		if(this.ready)
		{
			this.currentModel = mol;

			this._setMeasure("OFF");

			JSmol._loadMolData(mol);
			this.setRepresentation(Model.representation);

			return true;
		}
	},

	loadPDB: function(pdb)
	{
		if(this.currentModel === pdb) return false;

		if(this.ready)
		{
			this.currentModel = pdb;

			this._setMeasure("OFF");

			this.scriptWaitOutput("set defaultLattice {0 0 0};");
			this.scriptWaitOutput("set showUnitcell false;");

			JSmol.__loadModel(pdb);
			this.setRepresentation(Model.representation);

			return true;
		}
	},

	loadCIF: function(cif, cell)
	{
		if(this.currentModel === cif + cell) return false;

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
		$("#action-jmol-hq").removeClass("checked");
		if(hq) $("#action-jmol-hq").addClass("checked");

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
				+ (measure && hq ? 2 : hq ? 4 : 1) + "; set ribbonBorder "
				+ (hq && !measure ? "on" : "off"));
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
		if(Model.isPDB()) return;

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
		if(Model.isPDB()) return;

		MolView.makeModelVisible();
		Model.JSmol.safeCallback(function()
		{
			Model.JSmol._setMeasure("OFF");
			Model.JSmol.calculatePartialCharge();
			Model.JSmol.script("font label 18; color label magenta; label %-8.4[partialcharge]; hover off;");
		}, "jmol_calculation");
	},

	displayDipoles: function()
	{
		//exit when macromolecule
		if(Model.isPDB()) return;

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
		if(Model.isPDB()) return;

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
		if(Model.isPDB()) return;

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
		if(this.picking === type.toLowerCase()) return;

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
		if(this.picking === type.toLowerCase()) return;

		this.picking = type.toLowerCase();
		$(".jmol-picking").removeClass("checked");

		if(this.picking === "off")
		{
			Model.JSmol.scriptWaitOutput("set picking off;");

			if(!noQualityRestore)
			{
				Model.JSmol._setQuality(Model.JSmol.hq);
			}
		}
		else
		{
			$("#action-jmol-measure-" + this.picking).addClass("checked");

			//JSmol.setQuality will disable picking again
			Model.JSmol._setQuality(Model.JSmol.hq, true);
			Model.JSmol.scriptWaitOutput("set picking off; set picking on; set pickingStyle MEASURE ON; set picking MEASURE " + type + ";");
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
};
