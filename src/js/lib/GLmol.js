/*
GLmol - Molecular Viewer on WebGL/Javascript(0.47)
(C) Copyright 2011-2012, biochem_fan
	License: dual license of MIT or LGPL3

Contributors:
	Robert Hanson for parseXYZ, deferred instantiation

This program uses
	Three.js
		https://github.com/mrdoob/three.js
		Copyright(c) 2010-2012 three.js Authors.  All rights reserved.
	jQuery
		http://jquery.org/
		Copyright(c) 2011 John Resig
*/

/*
Modifications:
- Jmol coloring
- vdwRadii from iView
- devicePixelRatio support
- Mobile multi touch scaling
- Renamed API methods
- redraw using requestAnimationFrame
- Fallback
  - zoom2D: 2D scale/zoom factor
  - canvasAtomRadius: default atom radius
  - canvasBondWidth: fallback bond width
  - canvasVDW: indicates if GLmolVDWRadii should be used rather than canvasAtomRadius
*/

/**
 * requestAnimationFrame polyfill by Erik Möller
 * fixes from Paul Irish and Tino Zijdel
 * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
 * http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
 */
(function() {
	var lastTime = 0;
	var vendors = ['ms', 'moz', 'webkit', 'o'];
	for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
								|| window[vendors[x]+'CancelRequestAnimationFrame'];
	}

	if (!window.requestAnimationFrame)
		window.requestAnimationFrame = function(callback, element) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(function() { callback(currTime + timeToCall); },
			timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};

	if (!window.cancelAnimationFrame)
		window.cancelAnimationFrame = function(id) {
			clearTimeout(id);
		};
}());

var TV3 = THREE.Vector3,
	TF3 = THREE.Face3,
	TCo = THREE.Color;

THREE.Geometry.prototype.colorAll = function(color)
{
	for(var i = 0; i < this.faces.length; i++)
	{
		this.faces[i].color = color;
	}
};

THREE.Matrix4.prototype.isIdentity = function()
{
	for(var i = 0; i < 4; i++)
	{
		for(var j = 0; j < 4; j++)
		{
			if(this.elements[i * 4 + j] !=(i == j) ? 1 : 0)
			{
				return false;
			}
		}
	}
	return true;
};

var GLmolElementColors = {
	"D": 0xFFFFC0, "H": 0xFFFFFF,"He": 0xD9FFFF,"Li": 0xCC80FF,"Be": 0xC2FF00,
	"B": 0xFFB5B5,"C": 0x909090,"N": 0x3050F8,"O": 0xFF0D0D,
	"F": 0x90E050,"Ne": 0xB3E3F5,"Na": 0xAB5CF2,"Mg": 0x8AFF00,
	"Al": 0xBFA6A6,"Si": 0xF0C8A0,"P": 0xFF8000,"S": 0xFFFF30,
	"Cl": 0x1FF01F,"Ar": 0x80D1E3,"K": 0x8F40D4,"Ca": 0x3DFF00,
	"Sc": 0xE6E6E6,"Ti": 0xBFC2C7,"V": 0xA6A6AB,"Cr": 0x8A99C7,
	"Mn": 0x9C7AC7,"Fe": 0xE06633,"Co": 0xF090A0,"Ni": 0x50D050,
	"Cu": 0xC88033,"Zn": 0x7D80B0,"Ga": 0xC28F8F,"Ge": 0x668F8F,
	"As": 0xBD80E3,"Se": 0xFFA100,"Br": 0xA62929,"Kr": 0x5CB8D1,
	"Rb": 0x702EB0,"Sr": 0x00FF00,"Y": 0x94FFFF,"Zr": 0x94E0E0,
	"Nb": 0x73C2C9,"Mo": 0x54B5B5,"Tc": 0x3B9E9E,"Ru": 0x248F8F,
	"Rh": 0x0A7D8C,"Pd": 0x006985,"Ag": 0xC0C0C0,"Cd": 0xFFD98F,
	"In": 0xA67573,"Sn": 0x668080,"Sb": 0x9E63B5,"Te": 0xD47A00,
	"I": 0x940094,"Xe": 0x429EB0,"Cs": 0x57178F,"Ba": 0x00C900,
	"La": 0x70D4FF,"Ce": 0xFFFFC7,"Pr": 0xD9FFC7,"Nd": 0xC7FFC7,
	"Pm": 0xA3FFC7,"Sm": 0x8FFFC7,"Eu": 0x61FFC7,"Gd": 0x45FFC7,
	"Tb": 0x30FFC7,"Dy": 0x1FFFC7,"Ho": 0x00FF9C,"Er": 0x00E675,
	"Tm": 0x00D452,"Yb": 0x00BF38,"Lu": 0x00AB24,"Hf": 0x4DC2FF,
	"Ta": 0x4DA6FF,"W": 0x2194D6,"Re": 0x267DAB,"Os": 0x266696,
	"Ir": 0x175487,"Pt": 0xD0D0E0,"Au": 0xFFD123,"Hg": 0xB8B8D0,
	"Tl": 0xA6544D,"Pb": 0x575961,"Bi": 0x9E4FB5,"Po": 0xAB5C00,
	"At": 0x754F45,"Rn": 0x428296,"Fr": 0x420066,"Ra": 0x007D00,
	"Ac": 0x70ABFA,"Th": 0x00BAFF,"Pa": 0x00A1FF,"U": 0x008FFF,
	"Np": 0x0080FF,"Pu": 0x006BFF,"Am": 0x545CF2,"Cm": 0x785CE3,
	"Bk": 0x8A4FE3,"Cf": 0xA136D4,"Es": 0xB31FD4,"Fm": 0xB31FBA,
	"Md": 0xB30DA6,"No": 0xBD0D87,"Lr": 0xC70066,"Rf": 0xCC0059,
	"Db": 0xD1004F,"Sg": 0xD90045,"Bh": 0xE00038,"Hs": 0xE6002E,
	"Mt": 0xEB0026
};
//Hu, S.Z.; Zhou, Z.H.; Tsai, K.R. Acta Phys.-Chim. Sin., 2003, 19:1073.
var GLmolVDWRadii = {
	"H":1.08,"HE":1.34,"LI":1.75,"BE":2.05,"B":1.47,"C":1.49,"N":1.41,"O":1.4,
	"F":1.39,"NE":1.68,"NA":1.84,"MG":2.05,"AL":2.11,"SI":2.07,"P":1.92,"S":1.82,
	"CL":1.83,"AR":1.93,"K":2.05,"CA":2.21,"SC":2.16,"TI":1.87,"V":1.79,"CR":1.89,
	"MN":1.97,"FE":1.94,"CO":1.92,"NI":1.84,"CU":1.86,"ZN":2.1,"GA":2.08,"GE":2.15,
	"AS":2.06,"SE":1.93,"BR":1.98,"KR":2.12,"RB":2.16,"SR":2.24,"Y":2.19,"ZR":1.86,
	"NB":2.07,"MO":2.09,"TC":2.09,"RU":2.07,"RH":1.95,"PD":2.02,"AG":2.03,"CD":2.3,
	"IN":2.36,"SN":2.33,"SB":2.25,"TE":2.23,"I":2.23,"XE":2.21,"CS":2.22,"BA":2.51,
	"LA":2.4,"CE":2.35,"PR":2.39,"ND":2.29,"PM":2.36,"SM":2.29,"EU":2.33,"GD":2.37,
	"TB":2.21,"DY":2.29,"HO":2.16,"ER":2.35,"TM":2.27,"YB":2.42,"LU":2.21,"HF":2.12,
	"TA":2.17,"W":2.1,"RE":2.17,"OS":2.16,"IR":2.02,"PT":2.09,"AU":2.17,"HG":2.09,
	"TL":2.35,"PB":2.32,"BI":2.43,"PO":2.29,"AT":2.36,"RN":2.43,"FR":2.56,"RA":2.43,
	"AC":2.6,"TH":2.37,"PA":2.43,"U":2.4,"NP":2.21,"PU":2.56,"AM":2.56,
	"CM":2.56,"BK":2.56,"CF":2.56,"ES":2.56,"FM":2.56
};

var GLmolAminoColors = {
	ALA: 0xC8C8C8,
	ARG: 0x145AFF,
	ASN: 0x00DCDC,
	ASP: 0xE60A0A,
	CYS: 0xE6E600,
	GLN: 0x00DCDC,
	GLU: 0xE60A0A,
	GLY: 0xEBEBEB,
	HIS: 0x8282D2,
	ILE: 0x0F820F,
	LEU: 0x0F820F,
	LYS: 0x145AFF,
	MET: 0xE6E600,
	PHE: 0x3232AA,
	PRO: 0xDC9682,
	SER: 0xFA9600,
	THR: 0xFA9600,
	TRP: 0xB45AB4,
	TYR: 0x3232AA,
	VAL: 0x0F820F,
	ASX: 0xFF69B4,
	GLX: 0xFF69B4
};

var polarResidues = ['ARG', 'HIS', 'LYS', 'ASP', 'GLU', 'SER', 'THR', 'ASN', 'GLN', 'CYS'];
var nonPolarResidues = ['GLY', 'PRO', 'ALA', 'VAL', 'LEU', 'ILE', 'MET', 'PHE', 'TYR', 'TRP'];

var GLmol = (function()
{
	/**
	 * Calls GLmol constructor
	 * @param {String}  id
	 * @param {Boolean} webGL
	 * @param {Float}   devicePixelRatio
	 * @param {Object}  bg
	 */
	function GLmol(id, webGL, devicePixelRatio, bg)
	{
		this.create(id, webGL, devicePixelRatio, bg);
		return true;
	}

	/**
	 * GLmol constructor
	 * @param {String}  id
	 * @param {Boolean} webGL
	 * @param {Float}   devicePixelRatio
	 * @param {Object}  bg
	 */
	GLmol.prototype.create = function(id, webGL, devicePixelRatio, bg)
	{
		this.nucleotides = ['  G', '  A', '  T', '  C', '  U', ' DG', ' DA', ' DT', ' DC', ' DU'];

		this.id = id;
		this.devicePixelRatio = devicePixelRatio;

		this.container = jQuery('#' + this.id);
		this.WIDTH = this.container.width() * this.devicePixelRatio;
		this.HEIGHT = this.container.height() * this.devicePixelRatio;
		this.ASPECT = this.WIDTH / this.HEIGHT;
		this.NEAR = 1, FAR = 800;
		this.CAMERA_Z = -150;
		this.webglFailed = true;

		try
		{
			if(webGL) throw new Error("WebGL disabled");

			this.renderer = new THREE.WebGLRenderer({
				antialias: true,
				alpha: true
			});
			this.renderer.sortObjects = false;//might improve performance

			var r = bg >> 16; r /= 255;
			var g = bg >> 8 & 0xFF; g /= 255;
			var b = bg & 0xFF; b /= 255;
			this.renderer.setClearColor({r:r,g:g,b:b}, 1.0);

			this.eventTarget = this.renderer.domElement;
			this.container.append(this.renderer.domElement);
			this.renderer.setSize(this.WIDTH, this.HEIGHT);
			jQuery(this.renderer.domElement).css({
				width: this.container.width(),
				height: this.container.height()
			});

			this.webglFailed = false;
		}
		catch(e)
		{
			this.canvas2d = jQuery('<canvas></canvas');
			this.container.append(this.canvas2d);
			this.eventTarget = this.canvas2d;

			this.canvas2d[0].height = this.HEIGHT;
			this.canvas2d[0].width = this.WIDTH;
			jQuery(this.canvas2d).css({
				width: this.container.width(),
				height: this.container.height()
			});
		}

		//temporary values: will be updated anyway
		this.camera = new THREE.PerspectiveCamera(20, this.ASPECT, 1, 800);
		this.camera.position = new TV3(0, 0, this.CAMERA_Z);
		this.camera.lookAt(new TV3(0, 0, 0));
		this.perspectiveCamera = this.camera;
		this.orthoscopicCamera = new THREE.OrthographicCamera();
		this.orthoscopicCamera.position.z = this.CAMERA_Z;
		this.orthoscopicCamera.lookAt(new TV3(0, 0, 0));

		this.scene = null;
		this.rotationGroup = null;//parent of modelGroup
		this.modelGroup = null;//child of rotationGroup
		this.framePending = false;//used to protect requestAnimationFrame stacking

		this.bgColor = bg;
		this.bgAlpha = 1;
		this.fov = 20;
		this.fogStart = 0.4;

		//relative to the center of rotationGroup
		this.slabNear = -50;
		this.slabFar = +50;

		//default dimensions and quality values
		this.sphereRadius = 1.5;
		this.cylinderRadius = 0.4;
		this.lineWidth = 1.5 * this.devicePixelRatio;
		this.curveWidth = 3 * this.devicePixelRatio;
		this.defaultColor = 0xCCCCCC;
		this.sphereQuality = 16;//16
		this.cylinderQuality = 16;//8
		this.axisDIV = 5;//3 still gives acceptable quality
		this.strandDIV = 6;
		this.nucleicAcidStrandDIV = 4;
		this.tubeDIV = 8;
		this.coilWidth = 0.3;
		this.helixSheetWidth = 1.3;
		this.nucleicAcidWidth = 0.8;
		this.thickness = 0.2;

		//event variables
		this.cq = new THREE.Quaternion(1, 0, 0, 0);
		this.dq = new THREE.Quaternion(1, 0, 0, 0);
		this.isDragging = false;
		this.mouseStartX = 0;
		this.mouseStartY = 0;

		//2D canvas fallback
		this.zoom2D = 30;
		this.canvasAtomRadius = 0.5;
		this.canvasBondWidth = 0.3;
		this.canvasVDW = false;//draw atoms with r=GLmolVDWRadii
		this.canvasLine = false;//draw lines
		this.canvasdrawStack = [];
		this.canvasDetail = 24;//arc segments

		//multi touch parameters
		this.multiTouch = false;
		this.multiTouchD = 0;

		this.currentModelPos = 0;
		this.cz = 0;

		this.protein = {
			sheet: [],
			helix: [],
			biomtChains: '',
			biomtMatrices: [],
			symMat: [],
			pdbID: '',
			title: ''
		};
		this.atoms = [];

		/**
		 * Bind events
		 */

		this.container.on('DOMMouseScroll mousewheel', this.onScroll.bind(this));
		this.container.on('mousedown touchstart', this.onPointerDown.bind(this));
		jQuery(window).on('mousemove touchmove', this.onPointerMove.bind(this));
		jQuery(window).on('mouseup touchend touchcancel', this.onPointerUp.bind(this));

		/*
		Fix pointer loss in iframes but break cross-domain iframes
		if(parent != window)
		{
			jQuery(parent).bind('mousemove touchmove', this.onPointerMove.bind(this));
			jQuery(parent).bind('mouseup touchend touchcancel', this.onPointerUp.bind(this));
		} */
	};

	//mousewheel scaling
	GLmol.prototype.onScroll = function(e)
	{
		e.preventDefault();
		if(!this.scene) return;

		var scaleFactor = (this.rotationGroup.position.z - this.CAMERA_Z) * 0.3;
		if(scaleFactor > 2000) scaleFactor = 2000;

		if(e.originalEvent.detail)
		{
			this.rotationGroup.position.z += scaleFactor * e.originalEvent.detail / 10;
			this.zoom2D += scaleFactor * e.originalEvent.detail / 10;
		}
		else if(e.originalEvent.wheelDelta)
		{
			this.rotationGroup.position.z -= scaleFactor * e.originalEvent.wheelDelta / 400;
			this.zoom2D -= 0.5 * scaleFactor * e.originalEvent.wheelDelta / 400;
		}

		if(this.rotationGroup.position.z > 10000) this.rotationGroup.position.z = 10000;
		if(this.rotationGroup.position.z < -149) this.rotationGroup.position.z = -149;
		if(this.zoom2D < 2) this.zoom2D = 2;

		this.redraw();
	};

	GLmol.prototype.onPointerDown = function(e)
	{
		/* if(e.target != this.eventTarget && !this.isDragging ||
				(e.type == "touchstart" && !this.isDragging && e.originalEvent.targetTouches.length > 1))
		{
			return;
		} */

		if(!this.scene) return;

		e.preventDefault();
		e.stopImmediatePropagation();

		var x = e.pageX,
			y = e.pageY;

		if(e.originalEvent.targetTouches && e.originalEvent.targetTouches[0])
		{
			x = e.originalEvent.targetTouches[0].pageX;
			y = e.originalEvent.targetTouches[0].pageY;
		}

		if(e.originalEvent.targetTouches && e.originalEvent.targetTouches.length > 1)
		{
			var t = e.originalEvent.targetTouches;
			var dx = t[0].pageX - t[1].pageX;
			var dy = t[0].pageY - t[1].pageY;
			this.multiTouchD = Math.sqrt(dx * dx + dy * dy);
			this.multiTouch = true;
		}

		if(x == undefined) return;

		this.isDragging = true;
		this.mouseButton = e.which || 1;
		this.mouseStartX = x;
		this.mouseStartY = y;
		this.cq = this.rotationGroup.quaternion;
		this.cz = this.rotationGroup.position.z;
		this.currentModelPos = this.modelGroup.position.clone();
		this.cslabNear = this.slabNear;
		this.cslabFar = this.slabFar;
	};

	GLmol.prototype.onPointerMove = function(e)
	{
		if(!this.scene) return;
		if(!this.isDragging) return;

		e.preventDefault();
		e.stopImmediatePropagation();

		if((e.which == 0 && (e.originalEvent.targetTouches === undefined || e.originalEvent.targetTouches.length == 0))
		|| (e.originalEvent.targetTouches && e.originalEvent.targetTouches.length == 0))
		{
			this.isDragging = false;
			this.multiTouch = false;
			this.redraw();
			return;
		}

		var x = e.pageX,
			y = e.pageY;

		if(e.originalEvent.targetTouches && e.originalEvent.targetTouches[0])
		{
			x = e.originalEvent.targetTouches[0].pageX;
			y = e.originalEvent.targetTouches[0].pageY;
		}

		//multi touch zoom
		if(this.multiTouch && e.originalEvent.targetTouches && e.originalEvent.targetTouches.length > 1)
		{
			var t = e.originalEvent.targetTouches;
			var dx = t[0].pageX - t[1].pageX;
			var dy = t[0].pageY - t[1].pageY;

			var d = Math.sqrt(dx * dx + dy * dy);
			var ratio = d / this.multiTouchD;
			this.multiTouchD = d;

			var scaleFactor = (this.rotationGroup.position.z - this.CAMERA_Z) * 0.85;
			this.rotationGroup.position.z += scaleFactor * (-ratio + 1);
			this.zoom2D *= ratio;

			if(this.rotationGroup.position.z > 10000) this.rotationGroup.position.z = 10000;
			if(this.rotationGroup.position.z < -149) this.rotationGroup.position.z = -149;
			if(this.zoom2D < 2) this.zoom2D = 2;

			this.redraw();
		}

		if(this.multiTouch || x == undefined) return;

		var dx = (x - this.mouseStartX) / this.WIDTH;
		var dy = (y - this.mouseStartY) / this.HEIGHT;
		var r = Math.sqrt(dx * dx + dy * dy);

		if(this.mouseButton == 1 && e.ctrlKey && e.shiftKey)//slab
		{
			this.slabNear = this.cslabNear + dx * 100;
			this.slabFar = this.cslabFar + dy * 100;
		}
		else if(this.mouseButton == 2)//translate
		{
			var scaleFactor = (this.rotationGroup.position.z - this.CAMERA_Z) * 0.85;
			if(scaleFactor < 20) scaleFactor = 20;

			if(this.webglFailed)
			{
				dx *= -1;
				dy *= -1;
			}

			var translationByScreen = new TV3(-dx * scaleFactor, -dy * scaleFactor, 0);
			var q = this.rotationGroup.quaternion;
			var qinv = new THREE.Quaternion(q.x, q.y, q.z, q.w).inverse().normalize();
			var translation = qinv.multiplyVector3(translationByScreen);

			this.modelGroup.position.x = this.currentModelPos.x + translation.x;
			this.modelGroup.position.y = this.currentModelPos.y + translation.y;
			this.modelGroup.position.z = this.currentModelPos.z + translation.z;
		}
		else if(this.mouseButton == 1 && r != 0)//rotate
		{
			var rs = Math.sin(r * Math.PI) / r;
			this.dq.x = Math.cos(r * Math.PI);
			this.dq.y = 0;
			this.dq.z = rs * dx;
			this.dq.w = rs * dy;

			this.rotationGroup.quaternion = new THREE.Quaternion(1, 0, 0, 0);
			this.rotationGroup.quaternion.multiplySelf(this.dq);
			this.rotationGroup.quaternion.multiplySelf(this.cq);
		}

		this.redraw();
	};

	GLmol.prototype.onPointerUp = function(e)
	{
		this.isDragging = false;

		if(!(e.originalEvent.targetTouches && e.originalEvent.targetTouches.length > 1))
		{
			this.multiTouch = false;
		}

		this.redraw();
	};

	/**
	 * Auto resize GLmol canvas using the DOM container
	 */
	GLmol.prototype.resize = function()
	{
		this.WIDTH = this.container.width() * this.devicePixelRatio;
		this.HEIGHT = this.container.height() * this.devicePixelRatio;
		if(!this.webglFailed)
		{
			this.ASPECT = this.WIDTH / this.HEIGHT;

			this.renderer.setSize(this.WIDTH, this.HEIGHT);
			jQuery(this.renderer.domElement).css({
				width: this.container.width(),
				height: this.container.height()
			});

			this.camera.aspect = this.ASPECT;
			this.camera.updateProjectionMatrix();
		}
		else
		{
			this.canvas2d[0].height = this.HEIGHT;
			this.canvas2d[0].width = this.WIDTH;
			jQuery(this.canvas2d).css({
				width: this.container.width(),
				height: this.container.height()
			});
		}
		this.redraw();
	};

	/**
	 * Calculates if two atoms are connected
	 * Used to detect bonds in PDB files
	 * @param {Object} atom1
	 * @param {Object} atom2
	 */
	GLmol.prototype.isConnected = function(atom1, atom2)
	{
		var s = atom1.bonds.indexOf(atom2.serial);
		if(s != -1) return atom1.bondOrder[s];

		if(this.protein.smallMolecule && (atom1.hetflag || atom2.hetflag)) return 0;//CHECK: should this be retained?

		var distSquared =
			(atom1.x - atom2.x) * (atom1.x - atom2.x) +
			(atom1.y - atom2.y) * (atom1.y - atom2.y) +
			(atom1.z - atom2.z) * (atom1.z - atom2.z);

		//if(atom1.altLoc != atom2.altLoc) return false;
		if(isNaN(distSquared)) return 0;
		if(distSquared < 0.5) return 0;//maybe duplicate position.

		if(distSquared > 1.3 && (atom1.elem == 'H' || atom2.elem == 'H' || atom1.elem == 'D' || atom2.elem == 'D')) return 0;
		if(distSquared < 3.42 && (atom1.elem == 'S' || atom2.elem == 'S')) return 1;
		if(distSquared > 2.78) return 0;

		return 1;
	};

	GLmol.prototype.loadSDF = function(str){ this.loadMolecule(str, this.parseSDF); };
	GLmol.prototype.loadXYZ = function(str){ this.loadMolecule(str, this.parseXYZ); };
	GLmol.prototype.loadPDB = function(str){ this.loadMolecule(str, this.parsePDB); };

	GLmol.prototype.loadMolecule = function(str, parser)
	{
		this.protein = {
			sheet: [],
			helix: [],
			biomtChains: '',
			biomtMatrices: [],
			symMat: [],
			pdbID: '',
			title: ''
		};
		this.atoms = [];

		parser.call(this, str);

		this.rebuildScene();
		this.zoomInto(this.getAllAtoms());
		this.redraw();
	};

	GLmol.prototype.parseSDF = function(str)
	{
		var atoms = this.atoms;
		var protein = this.protein;

		var lines = str.split("\n");
		if(lines.length < 4) return;
		var atomCount = parseInt(lines[3].substr(0, 3));
		if(isNaN(atomCount) || atomCount <= 0) return;
		var bondCount = parseInt(lines[3].substr(3, 3));
		var offset = 4;
		if(lines.length < 4 + atomCount + bondCount) return;
		for(var i = 1; i <= atomCount; i++)
		{
			var line = lines[offset];
			offset++;
			var atom = {};
			atom.serial = i;
			atom.x = parseFloat(line.substr(0, 10));
			atom.y = parseFloat(line.substr(10, 10));
			atom.z = parseFloat(line.substr(20, 10));
			atom.hetflag = true;
			atom.atom = atom.elem = line.substr(31, 3).replace(/ /g, "");
			atom.bonds = [];
			atom.bondOrder = [];
			atoms[i] = atom;
		}
		for(i = 1; i <= bondCount; i++)
		{
			var line = lines[offset];
			offset++;
			var from = parseInt(line.substr(0, 3));
			var to = parseInt(line.substr(3, 3));
			var order = parseInt(line.substr(6, 3));
			atoms[from].bonds.push(to);
			atoms[from].bondOrder.push(order);
			atoms[to].bonds.push(from);
			atoms[to].bondOrder.push(order);
		}

		protein.smallMolecule = true;
		return true;
	};

	GLmol.prototype.parseXYZ = function(str)
	{
		var atoms = this.atoms;
		var protein = this.protein;

		var lines = str.split("\n");
		if(lines.length < 3) return;
		var atomCount = parseInt(lines[0].substr(0, 3));
		if(isNaN(atomCount) || atomCount <= 0) return;
		if(lines.length < atomCount + 2) return;
		var offset = 2;

		for(var i = 1; i <= atomCount; i++)
		{
			var line = lines[offset++];
			var tokens = line.replace(/^\s+/, "").replace(/\s+/g, " ").split(" ");
			var atom = {};
			atom.serial = i;
			atom.atom = atom.elem = tokens[0];
			atom.x = parseFloat(tokens[1]);
			atom.y = parseFloat(tokens[2]);
			atom.z = parseFloat(tokens[3]);
			atom.hetflag = true;
			atom.bonds = [];
			atom.bondOrder = [];
			atoms[i] = atom;
		}

		for(var i = 1; i < atomCount; i++)//hopefully XYZ is small enough
		{
			for(var j = i + 1; j <= atomCount; j++)
			{
				if(this.isConnected(atoms[i], atoms[j]))
				{
					atoms[i].bonds.push(j);
					atoms[i].bondOrder.push(1);
					atoms[j].bonds.push(i);
					atoms[j].bondOrder.push(1);
				}
			}
		}

		protein.smallMolecule = true;
		return true;
	};

	GLmol.prototype.parsePDB = function(str)
	{
		var atoms = this.atoms;
		var protein = this.protein;
		var molID;

		var atoms_cnt = 0;
		lines = str.split("\n");
		for(var i = 0; i < lines.length; i++)
		{
			line = lines[i].replace(/^\s*/, '');//remove indent
			var recordName = line.substr(0, 6);
			if(recordName == 'ATOM  ' || recordName == 'HETATM')
			{
				var atom, resn, chain, resi, x, y, z, hetflag, elem, serial, altLoc, b;

				altLoc = line.substr(16, 1);
				if(altLoc != ' ' && altLoc != 'A') continue;//FIXME: ad hoc

				serial = parseInt(line.substr(6, 5));
				atom = line.substr(12, 4).replace(/ /g, "");
				resn = line.substr(17, 3);
				chain = line.substr(21, 1);
				resi = parseInt(line.substr(22, 5));
				x = parseFloat(line.substr(30, 8));
				y = parseFloat(line.substr(38, 8));
				z = parseFloat(line.substr(46, 8));
				b = parseFloat(line.substr(60, 8));

				elem = line.substr(76, 2).replace(/ /g, "");
				if(elem == '')//for some incorrect PDB files
				{
					elem = line.substr(12, 4).replace(/ /g, "");
				}

				if(line[0] == 'H') hetflag = true;
				else hetflag = false;

				atoms[serial] = {
					'resn': resn,
					'x': x,
					'y': y,
					'z': z,
					'elem': elem,
					'hetflag': hetflag,
					'chain': chain,
					'resi': resi,
					'serial': serial,
					'atom': atom,
					'ss': 'c',
					'color': 0xFFFFFF,
					'bonds': [],
					'bondOrder': [],
					'b': b /*', altLoc': altLoc*/
				};
			}
			else if(recordName == 'SHEET ')
			{
				var startChain = line.substr(21, 1);
				var startResi = parseInt(line.substr(22, 4));
				var endChain = line.substr(32, 1);
				var endResi = parseInt(line.substr(33, 4));
				protein.sheet.push([startChain, startResi, endChain, endResi]);
			}
			else if(recordName == 'CONECT')
			{
				/**
				 * MEMO: We don't have to parse SSBOND, LINK because both are also
				 * described in CONECT. But what about 2JYT???
				 */
				var from = parseInt(line.substr(6, 5));
				for(var j = 0; j < 4; j++)
				{
					var to = parseInt(line.substr([11, 16, 21, 26][j], 5));
					if(isNaN(to)) continue;
					if(atoms[from] != undefined)
					{
						atoms[from].bonds.push(to);
						atoms[from].bondOrder.push(1);
					}
				}
			}
			else if(recordName == 'HELIX ')
			{
				var startChain = line.substr(19, 1);
				var startResi = parseInt(line.substr(21, 4));
				var endChain = line.substr(31, 1);
				var endResi = parseInt(line.substr(33, 4));
				protein.helix.push([startChain, startResi, endChain, endResi]);
			}
			else if(recordName == 'CRYST1')
			{
				protein.a = parseFloat(line.substr(6, 9));
				protein.b = parseFloat(line.substr(15, 9));
				protein.c = parseFloat(line.substr(24, 9));
				protein.alpha = parseFloat(line.substr(33, 7));
				protein.beta = parseFloat(line.substr(40, 7));
				protein.gamma = parseFloat(line.substr(47, 7));
				protein.spacegroup = line.substr(55, 11);
				this.defineCell();
			}
			else if(recordName == 'REMARK')
			{
				var type = parseInt(line.substr(7, 3));
				if(type == 290 && line.substr(13, 5) == 'SMTRY')
				{
					var n = parseInt(line[18]) - 1;
					var m = parseInt(line.substr(21, 2));
					if(protein.symMat[m] == undefined) protein.symMat[m] = new THREE.Matrix4().identity();
					protein.symMat[m].elements[n] = parseFloat(line.substr(24, 9));
					protein.symMat[m].elements[n + 4] = parseFloat(line.substr(34, 9));
					protein.symMat[m].elements[n + 8] = parseFloat(line.substr(44, 9));
					protein.symMat[m].elements[n + 12] = parseFloat(line.substr(54, 10));
				}
				else if(type == 350 && line.substr(13, 5) == 'BIOMT')
				{
					var n = parseInt(line[18]) - 1;
					var m = parseInt(line.substr(21, 2));
					if(protein.biomtMatrices[m] == undefined) protein.biomtMatrices[m] = new THREE.Matrix4().identity();
					protein.biomtMatrices[m].elements[n] = parseFloat(line.substr(24, 9));
					protein.biomtMatrices[m].elements[n + 4] = parseFloat(line.substr(34, 9));
					protein.biomtMatrices[m].elements[n + 8] = parseFloat(line.substr(44, 9));
					protein.biomtMatrices[m].elements[n + 12] = parseFloat(line.substr(54, 10));
				}
				else if(type == 350 && line.substr(11, 11) == 'BIOMOLECULE')
				{
					protein.biomtMatrices = [];
					protein.biomtChains = '';
				}
				else if(type == 350 && line.substr(34, 6) == 'CHAINS')
				{
					protein.biomtChains += line.substr(41, 40);
				}
			}
			else if(recordName == 'HEADER')
			{
				protein.pdbID = line.substr(62, 4);
			}
			else if(recordName == 'TITLE ')
			{
				if(protein.title == undefined) protein.title = "";
				protein.title += line.substr(10, 70) + "\n";//CHECK: why is 60 not enough???
			}
			else if(recordName == 'COMPND')
			{
				//TODO: Implement me!
			}
		}

		//assign secondary structures
		for(i = 0; i < atoms.length; i++)
		{
			atom = atoms[i];
			if(atom == undefined) continue;

			var found = false;
			//MEMO: Can start chain and end chain differ?
			for(j = 0; j < protein.sheet.length; j++)
			{
				if(atom.chain != protein.sheet[j][0]) continue;
				if(atom.resi < protein.sheet[j][1]) continue;
				if(atom.resi > protein.sheet[j][3]) continue;
				atom.ss = 's';
				if(atom.resi == protein.sheet[j][1]) atom.ssbegin = true;
				if(atom.resi == protein.sheet[j][3]) atom.ssend = true;
			}
			for(j = 0; j < protein.helix.length; j++)
			{
				if(atom.chain != protein.helix[j][0]) continue;
				if(atom.resi < protein.helix[j][1]) continue;
				if(atom.resi > protein.helix[j][3]) continue;
				atom.ss = 'h';
				if(atom.resi == protein.helix[j][1]) atom.ssbegin = true;
				else if(atom.resi == protein.helix[j][3]) atom.ssend = true;
			}
		}

		protein.smallMolecule = false;

		return true;
	};

	GLmol.prototype.calculateBonds = function()
	{
		var atomlist = this.getAllAtoms();
		for(var _i = 0; _i < atomlist.length; _i++)
		{
			var i = atomlist[_i];
			var atom1 = this.atoms[i];
			if(atom1 == undefined) continue;
			for(var _j = _i + 1; _j < _i + 30 && _j < atomlist.length; _j++)
			{
				var j = atomlist[_j];
				var atom2 = this.atoms[j];
				if(atom2 == undefined) continue;

				if(this.isConnected(atom1, atom2))
				{
					if(atom1.bonds.indexOf(j) == -1)
					{
						atom1.bonds.push(j)
						atom1.bondOrder.push(1);
					}
					if(atom2.bonds.indexOf(i) == -1)
					{
						atom2.bonds.push(i)
						atom2.bondOrder.push(1);
					}
				}
			}
		}
	};

	/**
	 * Catmull-Rom subdivision
	 * @param  {Array} _points contains Vector3
	 */
	GLmol.prototype.subdivide = function(_points, DIV)
	{
		var ret = [];
		var points = _points;
		points = new Array();//smoothing test
		points.push(_points[0]);
		for(var i = 1, lim = _points.length - 1; i < lim; i++)
		{
			var p1 = _points[i],
				p2 = _points[i + 1];
			if(p1.smoothen) points.push(new TV3((p1.x + p2.x) / 2,(p1.y + p2.y) / 2,(p1.z + p2.z) / 2));
			else points.push(p1);
		}
		points.push(_points[_points.length - 1]);

		for(var i = -1, size = points.length; i <= size - 3; i++)
		{
			var p0 = points[(i == -1) ? 0 : i];
			var p1 = points[i + 1],
				p2 = points[i + 2];
			var p3 = points[(i == size - 3) ? size - 1 : i + 3];
			var v0 = new TV3().sub(p2, p0).multiplyScalar(0.5);
			var v1 = new TV3().sub(p3, p1).multiplyScalar(0.5);
			for(var j = 0; j < DIV; j++)
			{
				var t = 1.0 / DIV * j;
				var x = p1.x + t * v0.x + t * t *(-3 * p1.x + 3 * p2.x - 2 * v0.x - v1.x) + t * t * t *(2 * p1.x - 2 * p2.x + v0.x + v1.x);
				var y = p1.y + t * v0.y + t * t *(-3 * p1.y + 3 * p2.y - 2 * v0.y - v1.y) + t * t * t *(2 * p1.y - 2 * p2.y + v0.y + v1.y);
				var z = p1.z + t * v0.z + t * t *(-3 * p1.z + 3 * p2.z - 2 * v0.z - v1.z) + t * t * t *(2 * p1.z - 2 * p2.z + v0.z + v1.z);
				ret.push(new TV3(x, y, z));
			}
		}
		ret.push(points[points.length - 1]);
		return ret;
	};

	/**
	 * Drawing methods
	 */

	GLmol.prototype.drawAtomsAsSphere = function(group, atomlist, defaultRadius, forceDefault, scale)
	{
		var sphereGeometry = new THREE.SphereGeometry(1, this.sphereQuality, this.sphereQuality);//r, seg, ring
		for(var i = 0; i < atomlist.length; i++)
		{
			var atom = this.atoms[atomlist[i]];
			if(atom == undefined) continue;

			var sphereMaterial = new THREE.MeshLambertMaterial(
			{
				color: atom.color
			});
			var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
			group.add(sphere);

			var r =(!forceDefault && GLmolVDWRadii[atom.elem] != undefined) ? GLmolVDWRadii[atom.elem] : defaultRadius;
			if(!forceDefault && scale) r *= scale;
			sphere.scale.x = sphere.scale.y = sphere.scale.z = r;
			sphere.position.x = atom.x;
			sphere.position.y = atom.y;
			sphere.position.z = atom.z;
		}
	};

	/**
	 * About two times faster than sphere when div = 2
	 */
	GLmol.prototype.drawAtomsAsIcosahedron = function(group, atomlist, defaultRadius, forceDefault)
	{
		var geo = this.IcosahedronGeometry();
		for(var i = 0; i < atomlist.length; i++)
		{
			var atom = this.atoms[atomlist[i]];
			if(atom == undefined) continue;

			var mat = new THREE.MeshLambertMaterial(
			{
				color: atom.color
			});
			var sphere = new THREE.Mesh(geo, mat);
			sphere.scale.x = sphere.scale.y = sphere.scale.z =(!forceDefault && GLmolVDWRadii[atom.elem] != undefined) ? GLmolVDWRadii[atom.elem] : defaultRadius;
			group.add(sphere);
			sphere.position.x = atom.x;
			sphere.position.y = atom.y;
			sphere.position.z = atom.z;
		}
	};

	GLmol.prototype.drawBondAsStickSub = function(group, atom1, atom2, bondR, order)
	{
		var delta, tmp;
		if(order > 1) delta = this.calcBondDelta(atom1, atom2, bondR * 2.3);
		var p1 = new TV3(atom1.x, atom1.y, atom1.z);
		var p2 = new TV3(atom2.x, atom2.y, atom2.z);
		var mp = p1.clone().addSelf(p2).multiplyScalar(0.5);

		var c1 = new TCo(atom1.color),
			c2 = new TCo(atom2.color);

		if (order == 1 || order == 3)
		{
			this.drawCylinder(group, p1, mp, bondR, atom1.color);
			this.drawCylinder(group, p2, mp, bondR, atom2.color);
		}
		if (order > 1)
		{
			tmp = mp.clone().addSelf(delta);
			this.drawCylinder(group, p1.clone().addSelf(delta), tmp, bondR, atom1.color);
			this.drawCylinder(group, p2.clone().addSelf(delta), tmp, bondR, atom2.color);
			tmp = mp.clone().subSelf(delta);
			this.drawCylinder(group, p1.clone().subSelf(delta), tmp, bondR, atom1.color);
			this.drawCylinder(group, p2.clone().subSelf(delta), tmp, bondR, atom2.color);
		}
	};

	GLmol.prototype.drawBondsAsStick = function(group, atomlist, bondR, atomR, multipleBonds, scale)
	{
		if(!!multipleBonds) bondR /= 2.5;
		for(var _i = 0; _i < atomlist.length; _i++)
		{
			var i = atomlist[_i];
			var atom1 = this.atoms[i];
			if(atom1 == undefined) continue;
			for(var _j = 0; _j < atom1.bonds.length; _j++)
			{
				var j = atom1.bonds[_j];
				if(atomlist.indexOf(j) == -1) continue;
				var atom2 = this.atoms[j];
				if(atom2 == undefined) continue;
				if(j < i && atom2.bonds.indexOf(i) != -1) continue;//bond has been drawn already
				this.drawBondAsStickSub(group, atom1, atom2, bondR, (!!multipleBonds) ? atom1.bondOrder[_j] : 1);
			}
		}
		this.drawAtomsAsSphere(group, atomlist, atomR, !scale, scale);
	};

	GLmol.prototype.defineCell = function()
	{
		var p = this.protein;
		if(p.a == undefined) return;

		p.ax = p.a;
		p.ay = 0;
		p.az = 0;
		p.bx = p.b * Math.cos(Math.PI / 180.0 * p.gamma);
		p.by = p.b * Math.sin(Math.PI / 180.0 * p.gamma);
		p.bz = 0;
		p.cx = p.c * Math.cos(Math.PI / 180.0 * p.beta);
		p.cy = p.c * Math.cos(
						Math.PI / 180.0 * p.alpha
						- Math.cos(Math.PI / 180.0 * p.gamma)
						* Math.cos(Math.PI / 180.0 * p.beta)
					) / Math.sin(Math.PI / 180.0 * p.gamma);
		p.cz = Math.sqrt(p.c * p.c * Math.sin(Math.PI / 180.0 * p.beta)
			 * Math.sin(Math.PI / 180.0 * p.beta) - p.cy * p.cy);
	};

	GLmol.prototype.drawUnitcell = function(group)
	{
		var p = this.protein;
		if(p.a == undefined) return;

		var vertices = [
			[0, 0, 0],
			[p.ax, p.ay, p.az],
			[p.bx, p.by, p.bz],
			[p.ax + p.bx, p.ay + p.by, p.az + p.bz],
			[p.cx, p.cy, p.cz],
			[p.cx + p.ax, p.cy + p.ay, p.cz + p.az],
			[p.cx + p.bx, p.cy + p.by, p.cz + p.bz],
			[p.cx + p.ax + p.bx, p.cy + p.ay + p.by, p.cz + p.az + p.bz]
		];
		var edges = [0, 1, 0, 2, 1, 3, 2, 3, 4, 5, 4, 6, 5, 7, 6, 7, 0, 4, 1, 5, 2, 6, 3, 7];

		var geo = new THREE.Geometry();
		for(var i = 0; i < edges.length; i++)
		{
			geo.vertices.push(new TV3(vertices[edges[i]][0], vertices[edges[i]][1], vertices[edges[i]][2]));
		}
		var lineMaterial = new THREE.LineBasicMaterial(
		{
			linewidth: 1,
			color: 0xcccccc
		});
		var line = new THREE.Line(geo, lineMaterial);
		line.type = THREE.LinePieces;
		group.add(line);
	};

	/**
	 * TODO: Find inner side of a ring
	 */
	GLmol.prototype.calcBondDelta = function(atom1, atom2, sep)
	{
		var dot;
		var axis = new TV3(atom1.x - atom2.x, atom1.y - atom2.y, atom1.z - atom2.z).normalize();
		var found = null;
		for(var i = 0; i < atom1.bonds.length && !found; i++)
		{
			var atom = this.atoms[atom1.bonds[i]];
			if(!atom) continue;
			if(atom.serial != atom2.serial && atom.elem != 'H') found = atom;
		}
		for(var i = 0; i < atom2.bonds.length && !found; i++)
		{
			var atom = this.atoms[atom2.bonds[i]];
			if(!atom) continue;
			if(atom.serial != atom1.serial && atom.elem != 'H') found = atom;
		}
		if(found)
		{
			var tmp = new TV3(atom1.x - found.x, atom1.y - found.y, atom1.z - found.z).normalize();
			dot = tmp.dot(axis);
			delta = new TV3(tmp.x - axis.x * dot, tmp.y - axis.y * dot, tmp.z - axis.z * dot);
		}
		if(!found || Math.abs(dot - 1) < 0.001 || Math.abs(dot + 1) < 0.001)
		{
			//CHECK: why was this code here???
			console.log(axis);
			if(Math.abs(axis.x) < 0.01 && Math.abs(axis.y) < 0.01)
			{
				delta = new TV3(0, -axis.z, axis.y);
			}
			else
			{
				delta = new TV3(-axis.y, axis.x, 0);
			}
			//delta = new TV3(-axis.y, axis.x, 0);
		}
		delta.normalize().multiplyScalar(sep);
		return delta;
	};

	GLmol.prototype.drawBondsAsLineSub = function(geo, atom1, atom2, order)
	{
		var delta, tmp, vs = geo.vertices, cs = geo.colors;
		if (order > 1) delta = this.calcBondDelta(atom1, atom2, 0.15);
		var p1 = new TV3(atom1.x, atom1.y, atom1.z);
		var p2 = new TV3(atom2.x, atom2.y, atom2.z);
		var mp = p1.clone().addSelf(p2).multiplyScalar(0.5);

		var c1 = new TCo(atom1.color),
			c2 = new TCo(atom2.color);
		if (order == 1 || order == 3)
		{
			vs.push(p1); cs.push(c1); vs.push(mp); cs.push(c1);
			vs.push(p2); cs.push(c2); vs.push(mp); cs.push(c2);
		}
		if (order > 1)
		{
			vs.push(p1.clone().addSelf(delta)); cs.push(c1);
			vs.push(tmp = mp.clone().addSelf(delta)); cs.push(c1);
			vs.push(p2.clone().addSelf(delta)); cs.push(c2);
			vs.push(tmp); cs.push(c2);
			vs.push(p1.clone().subSelf(delta)); cs.push(c1);
			vs.push(tmp = mp.clone().subSelf(delta)); cs.push(c1);
			vs.push(p2.clone().subSelf(delta)); cs.push(c2);
			vs.push(tmp); cs.push(c2);
		}
	};

	GLmol.prototype.drawBondsAsLine = function(group, atomlist, lineWidth)
	{
		var geo = new THREE.Geometry();

		for(var _i = 0; _i < atomlist.length; _i++)
		{
			var i = atomlist[_i];
			var atom1 = this.atoms[i];
			if(atom1 == undefined) continue;
			for(var _j = 0; _j < atom1.bonds.length; _j++)
			{
				var j = atom1.bonds[_j];
				if(atomlist.indexOf(j) == -1) continue;
				var atom2 = this.atoms[j];
				if(atom2 == undefined) continue;
				if(j < i && atom2.bonds.indexOf(i) != -1) continue;//bond has been drawn already
				this.drawBondsAsLineSub(geo, atom1, atom2, atom1.bondOrder[_j]);
			}
		}

		var lineMaterial = new THREE.LineBasicMaterial(
		{
			linewidth: lineWidth
		});
		lineMaterial.vertexColors = true;

		var line = new THREE.Line(geo, lineMaterial);
		line.type = THREE.LinePieces;
		group.add(line);
	};

	GLmol.prototype.drawSmoothCurve = function(group, _points, width, colors, div)
	{
		if(_points.length == 0) return;

		div =(div == undefined) ? 5 : div;

		var geo = new THREE.Geometry();
		var points = this.subdivide(_points, div);

		for(var i = 0; i < points.length; i++)
		{
			geo.vertices.push(points[i]);
			geo.colors.push(new TCo(colors[(i == 0) ? 0 : Math.round((i - 1) / div)]));
		}

		var lineMaterial = new THREE.LineBasicMaterial(
		{
			linewidth: width
		});
		lineMaterial.vertexColors = true;
		var line = new THREE.Line(geo, lineMaterial);
		line.type = THREE.LineStrip;
		group.add(line);
	};

	GLmol.prototype.drawAsCross = function(group, atomlist, delta)
	{
		var geo = new THREE.Geometry();
		var points = [
			[delta, 0, 0],
			[-delta, 0, 0],
			[0, delta, 0],
			[0, -delta, 0],
			[0, 0, delta],
			[0, 0, -delta]
		];

		for(var i = 0, lim = atomlist.length; i < lim; i++)
		{
			var atom = this.atoms[atomlist[i]];
			if(atom == undefined) continue;

			var c = new TCo(atom.color);
			for(var j = 0; j < 6; j++)
			{
				geo.vertices.push(new TV3(atom.x + points[j][0], atom.y + points[j][1], atom.z + points[j][2]));
				geo.colors.push(c);
			}
		}
		var lineMaterial = new THREE.LineBasicMaterial(
		{
			linewidth: this.lineWidth
		});
		lineMaterial.vertexColors = true;
		var line = new THREE.Line(geo, lineMaterial, THREE.LinePieces);
		group.add(line);
	};

	/**
	 * FIXME: Winkled tube
	 */
	GLmol.prototype.drawSmoothTube = function(group, _points, colors, radii)
	{
		if(_points.length < 2) return;

		var circleDiv = this.tubeDIV,
			axisDiv = this.axisDIV;
		var geo = new THREE.Geometry();
		var points = this.subdivide(_points, axisDiv);
		var prevAxis1 = new TV3(),
			prevAxis2;

		for(var i = 0, lim = points.length; i < lim; i++)
		{
			var r, idx =(i - 1) / axisDiv;
			if(i == 0) r = radii[0];
			else
			{
				if(idx % 1 == 0) r = radii[idx];
				else
				{
					var floored = Math.floor(idx);
					var tmp = idx - floored;
					r = radii[floored] * tmp + radii[floored + 1] *(1 - tmp);
				}
			}
			var delta, axis1, axis2;

			if(i < lim - 1)
			{
				delta = new TV3().sub(points[i], points[i + 1]);
				axis1 = new TV3(0, -delta.z, delta.y).normalize().multiplyScalar(r);
				axis2 = new TV3().cross(delta, axis1).normalize().multiplyScalar(r);
			//     var dir = 1, offset = 0;
				if(prevAxis1.dot(axis1) < 0)
				{
					axis1.negate();
					axis2.negate(); //dir = -1;//offset = 2 * Math.PI / axisDiv;
				}
				prevAxis1 = axis1;
				prevAxis2 = axis2;
			}
			else
			{
				axis1 = prevAxis1;
				axis2 = prevAxis2;
			}

			for(var j = 0; j < circleDiv; j++)
			{
				var angle = 2 * Math.PI / circleDiv * j; //* dir  + offset;
				var c = Math.cos(angle),
					s = Math.sin(angle);
				geo.vertices.push(new TV3(
					points[i].x + c * axis1.x + s * axis2.x,
					points[i].y + c * axis1.y + s * axis2.y,
					points[i].z + c * axis1.z + s * axis2.z));
			}
		}

		var offset = 0;
		for(var i = 0, lim = points.length - 1; i < lim; i++)
		{
			var c = new TCo(colors[Math.round((i - 1) / axisDiv)]);

			var reg = 0;
			var r1 = new TV3().sub(geo.vertices[offset], geo.vertices[offset + circleDiv]).lengthSq();
			var r2 = new TV3().sub(geo.vertices[offset], geo.vertices[offset + circleDiv + 1]).lengthSq();
			if(r1 > r2)
			{
				r1 = r2;
				reg = 1;
			};
			for(var j = 0; j < circleDiv; j++)
			{
				geo.faces.push(new TF3(offset + j, offset +(j + reg) % circleDiv + circleDiv, offset +(j + 1) % circleDiv));
				geo.faces.push(new TF3(offset +(j + 1) % circleDiv, offset +(j + reg) % circleDiv + circleDiv, offset +(j + reg + 1) % circleDiv + circleDiv));
				geo.faces[geo.faces.length - 2].color = c;
				geo.faces[geo.faces.length - 1].color = c;
			}
			offset += circleDiv;
		}
		geo.computeFaceNormals();
		geo.computeVertexNormals(false);
		var mat = new THREE.MeshLambertMaterial();
		mat.vertexColors = THREE.FaceColors;
		var mesh = new THREE.Mesh(geo, mat);
		mesh.doubleSided = true;
		group.add(mesh);
	};

	GLmol.prototype.drawMainchainCurve = function(group, atomlist, curveWidth, atomName, div)
	{
		var points = [],
			colors = [];
		var currentChain, currentResi;
		if(div == undefined) div = 5;

		for(var i in atomlist)
		{
			var atom = this.atoms[atomlist[i]];
			if(atom == undefined) continue;

			if((atom.atom == atomName) && !atom.hetflag)
			{
				if(currentChain != atom.chain || currentResi + 1 != atom.resi)
				{
					this.drawSmoothCurve(group, points, curveWidth, colors, div);
					points = [];
					colors = [];
				}
				points.push(new TV3(atom.x, atom.y, atom.z));
				colors.push(atom.color);
				currentChain = atom.chain;
				currentResi = atom.resi;
			}
		}
		this.drawSmoothCurve(group, points, curveWidth, colors, div);
	};

	GLmol.prototype.drawMainchainTube = function(group, atomlist, atomName, radius)
	{
		var points = [],
			colors = [],
			radii = [];
		var currentChain, currentResi;
		for(var i in atomlist)
		{
			var atom = this.atoms[atomlist[i]];
			if(atom == undefined) continue;

			if((atom.atom == atomName) && !atom.hetflag)
			{
				if(currentChain != atom.chain || currentResi + 1 != atom.resi)
				{
					this.drawSmoothTube(group, points, colors, radii);
					points = [];
					colors = [];
					radii = [];
				}
				points.push(new TV3(atom.x, atom.y, atom.z));
				if(radius == undefined)
				{
					radii.push((atom.b > 0) ? atom.b / 100 : 0.3);
				}
				else
				{
					radii.push(radius);
				}
				colors.push(atom.color);
				currentChain = atom.chain;
				currentResi = atom.resi;
			}
		}
		this.drawSmoothTube(group, points, colors, radii);
	};

	GLmol.prototype.drawStrip = function(group, p1, p2, colors, div, thickness)
	{
		if((p1.length) < 2) return;
		div = div || this.axisDIV;
		p1 = this.subdivide(p1, div);
		p2 = this.subdivide(p2, div);
		if(!thickness) return this.drawThinStrip(group, p1, p2, colors, div);

		var geo = new THREE.Geometry();
		var vs = geo.vertices,
			fs = geo.faces;
		var axis, p1v, p2v, a1v, a2v;
		for(var i = 0, lim = p1.length; i < lim; i++)
		{
			vs.push(p1v = p1[i]);//0
			vs.push(p1v);//1
			vs.push(p2v = p2[i]);//2
			vs.push(p2v);//3
			if(i < lim - 1)
			{
				var toNext = p1[i + 1].clone().subSelf(p1[i]);
				var toSide = p2[i].clone().subSelf(p1[i]);
				axis = toSide.crossSelf(toNext).normalize().multiplyScalar(thickness);
			}
			vs.push(a1v = p1[i].clone().addSelf(axis));//4
			vs.push(a1v);//5
			vs.push(a2v = p2[i].clone().addSelf(axis));//6
			vs.push(a2v);//7
		}
		var faces = [
			[0, 2, -6, -8],
			[-4, -2, 6, 4],
			[7, 3, -5, -1],
			[-3, -7, 1, 5]
		];
		for(var i = 1, lim = p1.length; i < lim; i++)
		{
			var offset = 8 * i,
				color = new TCo(colors[Math.round((i - 1) / div)]);
			for(var j = 0; j < 4; j++)
			{
				var f = new THREE.Face4(offset + faces[j][0], offset + faces[j][1], offset + faces[j][2], offset + faces[j][3], undefined, color);
				fs.push(f);
			}
		}
		var vsize = vs.length - 8;//cap
		for(var i = 0; i < 4; i++)
		{
			vs.push(vs[i * 2]);
			vs.push(vs[vsize + i * 2])
		};
		vsize += 8;
		fs.push(new THREE.Face4(vsize, vsize + 2, vsize + 6, vsize + 4, undefined, fs[0].color));
		fs.push(new THREE.Face4(vsize + 1, vsize + 5, vsize + 7, vsize + 3, undefined, fs[fs.length - 3].color));

		geo.computeFaceNormals();
		geo.computeVertexNormals();

		var material = new THREE.MeshLambertMaterial();
		material.vertexColors = THREE.FaceColors;
		var mesh = new THREE.Mesh(geo, material);
		mesh.doubleSided = true;
		group.add(mesh);
	};

	GLmol.prototype.drawThinStrip = function(group, p1, p2, colors, div)
	{
		var geo = new THREE.Geometry();
		for(var i = 0, lim = p1.length; i < lim; i++)
		{
			geo.vertices.push(p1[i]);//2i
			geo.vertices.push(p2[i]);//2i + 1
		}
		for(var i = 1, lim = p1.length; i < lim; i++)
		{
			var f = new THREE.Face4(2 * i, 2 * i + 1, 2 * i - 1, 2 * i - 2);
			f.color = new TCo(colors[Math.round((i - 1) / div)]);
			geo.faces.push(f);
		}

		geo.computeFaceNormals();
		geo.computeVertexNormals(false);
		var material = new THREE.MeshLambertMaterial();
		material.vertexColors = THREE.FaceColors;
		var mesh = new THREE.Mesh(geo, material);
		mesh.doubleSided = true;
		group.add(mesh);
	};

	GLmol.prototype.IcosahedronGeometry = function()
	{
		if(!this.icosahedron) this.icosahedron = new THREE.IcosahedronGeometry(1);
		return this.icosahedron;
	};

	GLmol.prototype.drawCylinder = function(group, from, to, radius, color, cap)
	{
		if(!from || !to) return;

		var midpoint = new TV3().add(from, to).multiplyScalar(0.5);
		var color = new TCo(color);

		if(cap && !this.cylinderGeometryCap)
		{
			this.cylinderGeometryCap = new THREE.CylinderGeometry(1, 1, 1, this.cylinderQuality, 1, false);
			this.cylinderGeometryCap.faceUvs = [];
			this.faceVertexUvs = [];
		}
		if(!cap && !this.cylinderGeometry)
		{
			this.cylinderGeometry = new THREE.CylinderGeometry(1, 1, 1, this.cylinderQuality, 1, true);
			this.cylinderGeometry.faceUvs = [];
			this.faceVertexUvs = [];
		}

		var cylinderMaterial = new THREE.MeshLambertMaterial(
		{
			color: color.getHex()
		});

		var cylinder = new THREE.Mesh(!cap ? this.cylinderGeometry : this.cylinderGeometryCap, cylinderMaterial);
		cylinder.position = midpoint;
		cylinder.lookAt(from);
		cylinder.updateMatrix();
		cylinder.matrixAutoUpdate = false;
		var m = new THREE.Matrix4().makeScale(radius, radius, from.distanceTo(to));
		m.rotateX(Math.PI / 2);
		cylinder.matrix.multiplySelf(m);
		group.add(cylinder);
	};

	/**
	 * FIXME: Tube to cylinder transition
	 */
	GLmol.prototype.drawHelixAsCylinder = function(group, atomlist, radius)
	{
		var start = null;
		var currentChain, currentResi;

		var others = [],
			beta = [];

		for(var i in atomlist)
		{
			var atom = this.atoms[atomlist[i]];
			if(atom == undefined || atom.hetflag) continue;
			if((atom.ss != 'h' && atom.ss != 's') || atom.ssend || atom.ssbegin) others.push(atom.serial);
			if(atom.ss == 's') beta.push(atom.serial);
			if(atom.atom != 'CA') continue;

			if(atom.ss == 'h' && atom.ssend)
			{
				if(start != null)
				{
					this.drawCylinder(group,
						new TV3(start.x, start.y, start.z),
						new TV3(atom.x, atom.y, atom.z),
						radius, atom.color, true);
				}
				start = null;
			}
			currentChain = atom.chain;
			currentResi = atom.resi;
			if(start == null && atom.ss == 'h' && atom.ssbegin) start = atom;
		}
		if(start != null)
		{
			this.drawCylinder(group,
				new TV3(start.x, start.y, start.z),
				new TV3(atom.x, atom.y, atom.z),
				radius, atom.color, true);
		}

		this.drawMainchainTube(group, others, "CA", 0.3);
		this.drawStrand(group, beta, 2, undefined, true, undefined, this.helixSheetWidth, false, 2 * this.thickness);
	};

	GLmol.prototype.drawCartoon = function(group, atomlist, doNotSmoothen, thickness)
	{
		this.drawStrand(group, atomlist, 2, undefined, true, undefined, undefined, doNotSmoothen, thickness);
	};

	GLmol.prototype.drawStrand = function(group, atomlist, num, div, fill, coilWidth, helixSheetWidth, doNotSmoothen, thickness)
	{
		num = num || this.strandDIV;
		div = div || this.axisDIV;
		coilWidth = coilWidth || this.coilWidth;
		doNotSmoothen ==(doNotSmoothen == undefined) ? false : doNotSmoothen;
		helixSheetWidth = helixSheetWidth || this.helixSheetWidth;
		var points = [];
		for(var k = 0; k < num; k++) points[k] = [];
		var colors = [];
		var currentChain, currentResi, currentCA;
		var prevCO = null,
			ss = null,
			ssborder = false;

		for(var i in atomlist)
		{
			var atom = this.atoms[atomlist[i]];
			if(atom == undefined) continue;

			if((atom.atom == 'O' || atom.atom == 'CA') && !atom.hetflag)
			{
				if(atom.atom == 'CA')
				{
					if(currentChain != atom.chain || currentResi + 1 != atom.resi)
					{
						for(var j = 0; !thickness && j < num; j++)
							this.drawSmoothCurve(group, points[j], 1, colors, div);
						if(fill) this.drawStrip(group, points[0], points[num - 1], colors, div, thickness);
						var points = [];
						for(var k = 0; k < num; k++) points[k] = [];
						colors = [];
						prevCO = null;
						ss = null;
						ssborder = false;
					}
					currentCA = new TV3(atom.x, atom.y, atom.z);
					currentChain = atom.chain;
					currentResi = atom.resi;
					ss = atom.ss;
					ssborder = atom.ssstart || atom.ssend;
					colors.push(atom.color);
				}
				else//O
				{
					var O = new TV3(atom.x, atom.y, atom.z);
					O.subSelf(currentCA);
					O.normalize();//can be omitted for performance
					O.multiplyScalar((ss == 'c') ? coilWidth : helixSheetWidth);
					if(prevCO != undefined && O.dot(prevCO) < 0) O.negate();
					prevCO = O;
					for(var j = 0; j < num; j++)
					{
						var delta = -1 + 2 /(num - 1) * j;
						var v = new TV3(currentCA.x + prevCO.x * delta,
							currentCA.y + prevCO.y * delta, currentCA.z + prevCO.z * delta);
						if(!doNotSmoothen && ss == 's') v.smoothen = true;
						points[j].push(v);
					}
				}
			}
		}
		for(var j = 0; !thickness && j < num; j++)
			this.drawSmoothCurve(group, points[j], 1, colors, div);
		if(fill) this.drawStrip(group, points[0], points[num - 1], colors, div, thickness);
	};

	GLmol.prototype.drawNucleicAcidLadderSub = function(geo, lineGeo, atoms, color)
	{
		//color.r *= 0.9; color.g *= 0.9; color.b *= 0.9;

		if(atoms[0] != undefined && atoms[1] != undefined && atoms[2] != undefined &&
			atoms[3] != undefined && atoms[4] != undefined && atoms[5] != undefined)
		{
			var baseFaceId = geo.vertices.length;
			for(var i = 0; i <= 5; i++) geo.vertices.push(atoms[i]);
			geo.faces.push(new TF3(baseFaceId, baseFaceId + 1, baseFaceId + 2));
			geo.faces.push(new TF3(baseFaceId, baseFaceId + 2, baseFaceId + 3));
			geo.faces.push(new TF3(baseFaceId, baseFaceId + 3, baseFaceId + 4));
			geo.faces.push(new TF3(baseFaceId, baseFaceId + 4, baseFaceId + 5));
			for(var j = geo.faces.length - 4, lim = geo.faces.length; j < lim; j++) geo.faces[j].color = color;
		}
		if(atoms[4] != undefined && atoms[3] != undefined && atoms[6] != undefined &&
			atoms[7] != undefined && atoms[8] != undefined)
		{
			var baseFaceId = geo.vertices.length;
			geo.vertices.push(atoms[4]);
			geo.vertices.push(atoms[3]);
			geo.vertices.push(atoms[6]);
			geo.vertices.push(atoms[7]);
			geo.vertices.push(atoms[8]);
			for(var i = 0; i <= 4; i++) geo.colors.push(color);
			geo.faces.push(new TF3(baseFaceId, baseFaceId + 1, baseFaceId + 2));
			geo.faces.push(new TF3(baseFaceId, baseFaceId + 2, baseFaceId + 3));
			geo.faces.push(new TF3(baseFaceId, baseFaceId + 3, baseFaceId + 4));
			for(var j = geo.faces.length - 3, lim = geo.faces.length; j < lim; j++) geo.faces[j].color = color;
		}
	};

	GLmol.prototype.drawNucleicAcidLadder = function(group, atomlist)
	{
		var geo = new THREE.Geometry();
		var lineGeo = new THREE.Geometry();
		var baseAtoms = ["N1", "C2", "N3", "C4", "C5", "C6", "N9", "C8", "N7"];
		var currentChain, currentResi, currentComponent = new Array(baseAtoms.length);
		var color = new TCo(0xcc0000);

		for(var i in atomlist)
		{
			var atom = this.atoms[atomlist[i]];
			if(atom == undefined || atom.hetflag) continue;

			if(atom.resi != currentResi || atom.chain != currentChain)
			{
				this.drawNucleicAcidLadderSub(geo, lineGeo, currentComponent, color);
				currentComponent = new Array(baseAtoms.length);
			}
			var pos = baseAtoms.indexOf(atom.atom);
			if(pos != -1) currentComponent[pos] = new TV3(atom.x, atom.y, atom.z);
			if(atom.atom == 'O3\'') color = new TCo(atom.color);
			currentResi = atom.resi;
			currentChain = atom.chain;
		}
		this.drawNucleicAcidLadderSub(geo, lineGeo, currentComponent, color);
		geo.computeFaceNormals();
		var mat = new THREE.MeshLambertMaterial();
		mat.vertexColors = THREE.VertexColors;
		var mesh = new THREE.Mesh(geo, mat);
		mesh.doubleSided = true;
		group.add(mesh);
	};

	GLmol.prototype.drawNucleicAcidStick = function(group, atomlist)
	{
		var currentChain, currentResi, start = null, end = null;

		for(var i = 0; i < atomlist.length; i++)
		{
			var atom = this.atoms[atomlist[i]];
			if(atom == undefined || atom.hetflag) continue;

			if(atom.resi != currentResi || atom.chain != currentChain)
			{
				if(start != null && end != null)
					this.drawCylinder(group, new TV3(start.x, start.y, start.z),
						new TV3(end.x, end.y, end.z), 0.3, start.color, true);
				start = null;
				end = null;
			}
			if(atom.atom == 'O3\'') start = atom;
			if(atom.resn == '  A' || atom.resn == '  G' || atom.resn == ' DA' || atom.resn == ' DG')
			{
				if(atom.atom == 'N1') end = atom;//N1(AG), N3(CTU)
			}
			else if(atom.atom == 'N3')
			{
				end = atom;
			}
			currentResi = atom.resi;
			currentChain = atom.chain;
		}

		if(start != null && end != null)
		{
			this.drawCylinder(group, new TV3(start.x, start.y, start.z),
					new TV3(end.x, end.y, end.z), 0.3, start.color, true);
		}
	};

	GLmol.prototype.drawNucleicAcidLine = function(group, atomlist)
	{
		var currentChain, currentResi, start = null,
			end = null;
		var geo = new THREE.Geometry();

		for(var i in atomlist)
		{
			var atom = this.atoms[atomlist[i]];
			if(atom == undefined || atom.hetflag) continue;

			if(atom.resi != currentResi || atom.chain != currentChain)
			{
				if(start != null && end != null)
				{
					geo.vertices.push(new TV3(start.x, start.y, start.z));
					geo.colors.push(new TCo(start.color));
					geo.vertices.push(new TV3(end.x, end.y, end.z));
					geo.colors.push(new TCo(start.color));
				}
				start = null;
				end = null;
			}
			if(atom.atom == 'O3\'') start = atom;
			if(atom.resn == '  A' || atom.resn == '  G' || atom.resn == ' DA' || atom.resn == ' DG')
			{
				if(atom.atom == 'N1') end = atom;//N1(AG), N3(CTU)
			}
			else if(atom.atom == 'N3')
			{
				end = atom;
			}
			currentResi = atom.resi;
			currentChain = atom.chain;
		}

		if(start != null && end != null)
		{
			geo.vertices.push(new TV3(start.x, start.y, start.z));
			geo.colors.push(new TCo(start.color));
			geo.vertices.push(new TV3(end.x, end.y, end.z));
			geo.colors.push(new TCo(start.color));
		}

		var mat = new THREE.LineBasicMaterial(
		{
			linewidth: 1,
			linejoin: false
		});
		mat.linewidth = 1.5;
		mat.vertexColors = true;
		var line = new THREE.Line(geo, mat, THREE.LinePieces);
		group.add(line);
	};

	GLmol.prototype.drawCartoonNucleicAcid = function(group, atomlist, div, thickness)
	{
		this.drawStrandNucleicAcid(group, atomlist, 2, div, true, undefined, thickness);
	};

	GLmol.prototype.drawStrandNucleicAcid = function(group, atomlist, num, div, fill, nucleicAcidWidth, thickness)
	{
		nucleicAcidWidth = nucleicAcidWidth || this.nucleicAcidWidth;
		div = div || this.axisDIV;
		num = num || this.nucleicAcidStrandDIV;
		var points = [];
		for(var k = 0; k < num; k++) points[k] = [];
		var colors = [];
		var currentChain, currentResi, currentO3;
		var prevOO = null;

		for(var i in atomlist)
		{
			var atom = this.atoms[atomlist[i]];
			if(atom == undefined) continue;

			if((atom.atom == 'O3\'' || atom.atom == 'OP2') && !atom.hetflag)
			{
				if(atom.atom == 'O3\'')
				{//to connect 3' end. FIXME: better way to do?
					if(currentChain != atom.chain || currentResi + 1 != atom.resi)
					{
						if(currentO3)
						{
							for(var j = 0; j < num; j++)
							{
								var delta = -1 + 2 /(num - 1) * j;
								points[j].push(new TV3(currentO3.x + prevOO.x * delta,
									currentO3.y + prevOO.y * delta, currentO3.z + prevOO.z * delta));
							}
						}
						if(fill) this.drawStrip(group, points[0], points[1], colors, div, thickness);
						for(var j = 0; !thickness && j < num; j++)
							this.drawSmoothCurve(group, points[j], 1, colors, div);
						var points = [];
						for(var k = 0; k < num; k++) points[k] = [];
						colors = [];
						prevOO = null;
					}
					currentO3 = new TV3(atom.x, atom.y, atom.z);
					currentChain = atom.chain;
					currentResi = atom.resi;
					colors.push(atom.color);
				}
				else//OP2
				{
					if(!currentO3)//for 5' phosphate(e.g. 3QX3)
					{
						prevOO = null;
						continue;
					}

					var O = new TV3(atom.x, atom.y, atom.z);
					O.subSelf(currentO3);
					O.normalize().multiplyScalar(nucleicAcidWidth);//TODO: refactor
					if(prevOO != undefined && O.dot(prevOO) < 0)
					{
						O.negate();
					}
					prevOO = O;
					for(var j = 0; j < num; j++)
					{
						var delta = -1 + 2 /(num - 1) * j;
						points[j].push(new TV3(currentO3.x + prevOO.x * delta,
							currentO3.y + prevOO.y * delta, currentO3.z + prevOO.z * delta));
					}
					currentO3 = null;
				}
			}
		}

		if(currentO3)
		{
			for(var j = 0; j < num; j++)
			{
				var delta = -1 + 2 /(num - 1) * j;
				points[j].push(new TV3(currentO3.x + prevOO.x * delta,
					currentO3.y + prevOO.y * delta, currentO3.z + prevOO.z * delta));
			}
		}

		if(fill)
		{
			this.drawStrip(group, points[0], points[1], colors, div, thickness);
		}

		for(var j = 0; !thickness && j < num; j++)
		{
			this.drawSmoothCurve(group, points[j], 1, colors, div);
		}
	};

	GLmol.prototype.drawDottedLines = function(group, points, color)
	{
		var geo = new THREE.Geometry();
		var step = 0.3;

		for(var i = 0, lim = Math.floor(points.length / 2); i < lim; i++)
		{
			var p1 = points[2 * i],
				p2 = points[2 * i + 1];
			var delta = p2.clone().subSelf(p1);
			var dist = delta.length();
			delta.normalize().multiplyScalar(step);
			var jlim = Math.floor(dist / step);
			for(var j = 0; j < jlim; j++)
			{
				var p = new TV3(p1.x + delta.x * j, p1.y + delta.y * j, p1.z + delta.z * j);
				geo.vertices.push(p);
			}
			if(jlim % 2 == 1) geo.vertices.push(p2);
		}

		var mat = new THREE.LineBasicMaterial(
		{
			'color': color.getHex()
		});
		mat.linewidth = 2;
		var line = new THREE.Line(geo, mat, THREE.LinePieces);
		group.add(line);
	};

	/**
	 * Getters and data modifiers
	 */

	GLmol.prototype.getAllAtoms = function()
	{
		var ret = [];
		for(var i in this.atoms)
		{
			ret.push(this.atoms[i].serial);
		}
		return ret;
	};

	/**
	 * Probably you can refactor using higher-order functions.
	 */
	GLmol.prototype.getHetatms = function(atomlist)
	{
		var ret = [];
		for(var i in atomlist)
		{
			var atom = this.atoms[atomlist[i]];
			if(atom == undefined) continue;

			if(atom.hetflag) ret.push(atom.serial);
		}
		return ret;
	};

	GLmol.prototype.removeSolvents = function(atomlist)
	{
		var ret = [];
		for(var i in atomlist)
		{
			var atom = this.atoms[atomlist[i]];
			if(atom == undefined) continue;

			if(atom.resn != 'HOH') ret.push(atom.serial);
		}
		return ret;
	};

	GLmol.prototype.getProteins = function(atomlist)
	{
		var ret = [];
		for(var i in atomlist)
		{
			var atom = this.atoms[atomlist[i]];
			if(atom == undefined) continue;

			if(!atom.hetflag) ret.push(atom.serial);
		}
		return ret;
	};

	/**
	 * TODO: Testing
	 */
	GLmol.prototype.excludeAtoms = function(atomlist, deleteList)
	{
		var ret = [];
		var blackList = new Object();
		for(var _i in deleteList) blackList[deleteList[_i]] = true;

		for(var _i in atomlist)
		{
			var i = atomlist[_i];

			if(!blackList[i]) ret.push(i);
		}
		return ret;
	};

	GLmol.prototype.getSidechains = function(atomlist)
	{
		var ret = [];
		for(var i in atomlist)
		{
			var atom = this.atoms[atomlist[i]];
			if(atom == undefined) continue;

			if(atom.hetflag) continue;
			if(atom.atom == 'C' || atom.atom == 'O' ||(atom.atom == 'N' && atom.resn != "PRO")) continue;
			ret.push(atom.serial);
		}
		return ret;
	};

	GLmol.prototype.getAtomsWithin = function(atomlist, extent)
	{
		var ret = [];

		for(var i in atomlist)
		{
			var atom = this.atoms[atomlist[i]];
			if(atom == undefined) continue;

			if(atom.x < extent[0][0] || atom.x > extent[1][0]) continue;
			if(atom.y < extent[0][1] || atom.y > extent[1][1]) continue;
			if(atom.z < extent[0][2] || atom.z > extent[1][2]) continue;
			ret.push(atom.serial);
		}
		return ret;
	};

	GLmol.prototype.getExtent = function(atomlist)
	{
		var xmin = ymin = zmin = 9999;
		var xmax = ymax = zmax = -9999;
		var xsum = ysum = zsum = cnt = 0;

		for(var i in atomlist)
		{
			var atom = this.atoms[atomlist[i]];
			if(atom == undefined) continue;
			cnt++;
			xsum += atom.x;
			ysum += atom.y;
			zsum += atom.z;

			xmin =(xmin < atom.x) ? xmin : atom.x;
			ymin =(ymin < atom.y) ? ymin : atom.y;
			zmin =(zmin < atom.z) ? zmin : atom.z;
			xmax =(xmax > atom.x) ? xmax : atom.x;
			ymax =(ymax > atom.y) ? ymax : atom.y;
			zmax =(zmax > atom.z) ? zmax : atom.z;
		}
		return [[xmin, ymin, zmin], [xmax, ymax, zmax], [xsum / cnt, ysum / cnt, zsum / cnt]];
	};

	GLmol.prototype.getResiduesById = function(atomlist, resi)
	{
		var ret = [];
		for(var i in atomlist)
		{
			var atom = this.atoms[atomlist[i]];
			if(atom == undefined) continue;

			if(resi.indexOf(atom.resi) != -1) ret.push(atom.serial);
		}
		return ret;
	};

	GLmol.prototype.getResidueBySS = function(atomlist, ss)
	{
		var ret = [];
		for(var i in atomlist)
		{
			var atom = this.atoms[atomlist[i]];
			if(atom == undefined) continue;

			if(ss.indexOf(atom.ss) != -1) ret.push(atom.serial);
		}
		return ret;
	};

	GLmol.prototype.getChain = function(atomlist, chain)
	{
		var ret = [], chains = {};
		chain = chain.toString();//concat if Array
		for(var i = 0, lim = chain.length; i < lim; i++) chains[chain.substr(i, 1)] = true;
		for(var i in atomlist)
		{
			var atom = this.atoms[atomlist[i]];
			if(atom == undefined) continue;

			if(chains[atom.chain]) ret.push(atom.serial);
		}
		return ret;
	};

	/**
	 * For HETATM only
	 */
	GLmol.prototype.getNonbonded = function(atomlist, chain)
	{
		var ret = [];
		for(var i in atomlist)
		{
			var atom = this.atoms[atomlist[i]];
			if(atom == undefined) continue;

			if(atom.hetflag && atom.bonds.length == 0) ret.push(atom.serial);
		}
		return ret;
	};

	/**
	 * Coloring schemes
	 */

	GLmol.prototype.colorByAtom = function(atomlist, colors)
	{
		for(var i in atomlist)
		{
			var atom = this.atoms[atomlist[i]];
			if(atom == undefined) continue;

			var c = colors[atom.elem];
			if(c == undefined) c = GLmolElementColors[atom.elem];
			if(c == undefined) c = this.defaultColor;
			atom.color = c;
		}
	};

	/**
	 * Note: Color only CA. maybe I should add atom.cartoonColor.
	 */
	GLmol.prototype.colorByStructure = function(atomlist, helixColor, sheetColor, coilColor, colorSidechains)
	{
		for(var i in atomlist)
		{
			var atom = this.atoms[atomlist[i]];
			if(atom == undefined) continue;

			if(!colorSidechains &&(atom.atom != 'CA' || atom.hetflag)) continue;
			if(atom.ss[0] == 's') atom.color = sheetColor;
			else if(atom.ss[0] == 'h') atom.color = helixColor;
			else if(atom.ss[0] == 'c') atom.color = coilColor;
		}
	};

	GLmol.prototype.colorByBFactor = function(atomlist, colorSidechains)
	{
		var minB = 1000,
			maxB = -1000;

		for(var i in atomlist)
		{
			var atom = this.atoms[atomlist[i]];
			if(atom == undefined) continue;

			if(atom.hetflag) continue;
			if(colorSidechains || atom.atom == 'CA' || atom.atom == 'O3\'')
			{
				if(minB > atom.b) minB = atom.b;
				if(maxB < atom.b) maxB = atom.b;
			}
		}

		var mid =(maxB + minB) / 2;

		var range =(maxB - minB) / 2;
		if(range < 0.01 && range > -0.01) return;
		for(var i in atomlist)
		{
			var atom = this.atoms[atomlist[i]];
			if(atom == undefined) continue;

			if(atom.hetflag) continue;
			if(colorSidechains || atom.atom == 'CA' || atom.atom == 'O3\'')
			{
				var color = new TCo(0);
				if(atom.b < mid)
					color.setHSV(0.667,(mid - atom.b) / range, 1);
				else
					color.setHSV(0,(atom.b - mid) / range, 1);
				atom.color = color.getHex();
			}
		}
	};

	GLmol.prototype.colorByChain = function(atomlist, colorSidechains)
	{
		for(var i in atomlist)
		{
			var atom = this.atoms[atomlist[i]];
			if(atom == undefined) continue;

			if(atom.hetflag) continue;
			if(colorSidechains || atom.atom == 'CA' || atom.atom == 'O3\'')
			{
				var color = new TCo(0);
				color.setHSV((atom.chain.charCodeAt(0) * 5) % 17 / 17.0, 1, 0.9);
				atom.color = color.getHex();
			}
		}
	};

	GLmol.prototype.colorByResidue = function(atomlist, residueColors)
	{
		for(var i in atomlist)
		{
			var atom = this.atoms[atomlist[i]];
			if(atom == undefined) continue;

			c = residueColors[atom.resn]
			if(c != undefined) atom.color = c;
		}
	};

	GLmol.prototype.colorAtoms = function(atomlist, c)
	{
		for(var i in atomlist)
		{
			var atom = this.atoms[atomlist[i]];
			if(atom == undefined) continue;

			atom.color = c;
		}
	};

	GLmol.prototype.colorByPolarity = function(atomlist, polar, nonpolar)
	{
		var colorMap = {};
		for(var i in polarResidues) colorMap[polarResidues[i]] = polar;
		for(i in nonPolarResidues) colorMap[nonPolarResidues[i]] = nonpolar;
		this.colorByResidue(atomlist, colorMap);
	};

	/**
	 * TODO: Add near(atomlist, neighbor, distanceCutoff)
	 * TODO: Add expandToResidue(atomlist)
	 */
	GLmol.prototype.colorChainbow = function(atomlist, colorSidechains)
	{
		var cnt = 0;
		var atom, i;
		for(i in atomlist)
		{
			atom = this.atoms[atomlist[i]];
			if(atom == undefined) continue;

			if((colorSidechains || atom.atom != 'CA' || atom.atom != 'O3\'') && !atom.hetflag)
				cnt++;
		}

		var total = cnt;
		cnt = 0;
		for(i in atomlist)
		{
			atom = this.atoms[atomlist[i]];
			if(atom == undefined) continue;

			if((colorSidechains || atom.atom != 'CA' || atom.atom != 'O3\'') && !atom.hetflag)
			{
				var color = new TCo(0);
				color.setHSV(240.0 / 360 *(1 - cnt / total), 1, 0.9);
				atom.color = color.getHex();
				cnt++;
			}
		}
	};

	/**
	 * Symmetry Mates
	 */

	GLmol.prototype.drawSymmetryMates2 = function(group, asu, matrices)
	{
		if(matrices == undefined) return;
		asu.matrixAutoUpdate = false;

		var cnt = 1;
		this.protein.appliedMatrix = new THREE.Matrix4();
		for(var i = 0; i < matrices.length; i++)
		{
			var mat = matrices[i];
			if(mat == undefined || mat.isIdentity()) continue;
			var symmetryMate = THREE.SceneUtils.cloneObject(asu);
			symmetryMate.matrix = mat;
			group.add(symmetryMate);
			for(var j = 0; j < 16; j++) this.protein.appliedMatrix.elements[j] += mat.elements[j];
			cnt++;
		}
		this.protein.appliedMatrix.multiplyScalar(cnt);
	};

	GLmol.prototype.drawSymmetryMatesWithTranslation2 = function(group, asu, matrices)
	{
		if(matrices == undefined) return;
		var p = this.protein;
		asu.matrixAutoUpdate = false;

		for(var i = 0; i < matrices.length; i++)
		{
			var mat = matrices[i];
			if(mat == undefined) continue;

			for(var a = -1; a <= 0; a++)
			{
				for(var b = -1; b <= 0; b++)
				{
					for(var c = -1; c <= 0; c++)
					{
						var translationMat = new THREE.Matrix4().makeTranslation(
							p.ax * a + p.bx * b + p.cx * c,
							p.ay * a + p.by * b + p.cy * c,
							p.az * a + p.bz * b + p.cz * c);
						var symop = mat.clone().multiplySelf(translationMat);
						if(symop.isIdentity()) continue;
						var symmetryMate = THREE.SceneUtils.cloneObject(asu);
						symmetryMate.matrix = symop;
						group.add(symmetryMate);
					}
				}
			}
		}
	};

	/**
	 * Scene setup
	 */

	GLmol.prototype.defineRepresentation = function()
	{
		var all = this.getAllAtoms();
		var hetatm = this.removeSolvents(this.getHetatms(all));
		this.colorByAtom(all, {});
		this.colorByChain(all);

		this.drawAtomsAsSphere(this.modelGroup, hetatm, this.sphereRadius);
		this.drawMainchainCurve(this.modelGroup, all, this.curveWidth, 'P');
		this.drawCartoon(this.modelGroup, all, this.curveWidth);
	};

	GLmol.prototype.getView = function()
	{
		if(!this.modelGroup) return [0, 0, 0, 0, 0, 0, 0, 1];
		var pos = this.modelGroup.position;
		var q = this.rotationGroup.quaternion;
		return [pos.x, pos.y, pos.z, this.rotationGroup.position.z, q.x, q.y, q.z, q.w];
	};

	GLmol.prototype.setView = function(arg)
	{
		if(!this.modelGroup || !this.rotationGroup) return;
		this.modelGroup.position.x = arg[0];
		this.modelGroup.position.y = arg[1];
		this.modelGroup.position.z = arg[2];
		this.rotationGroup.position.z = arg[3];
		this.rotationGroup.quaternion.x = arg[4];
		this.rotationGroup.quaternion.y = arg[5];
		this.rotationGroup.quaternion.z = arg[6];
		this.rotationGroup.quaternion.w = arg[7];
		this.redraw();
	};

	GLmol.prototype.setBackground = function(hex, a)
	{
		if(!this.scene) return;

		var r = hex >> 16; r /= 255;
		var g = hex >> 8 & 0xFF; g /= 255;
		var b = hex & 0xFF; b /= 255;
		if(a === undefined) a = 1.0;

		this.bgColor = hex;
		this.bgAlpha = a;

		if(this.renderer) this.renderer.setClearColor({r:r,g:g,b:b}, a);
		this.scene.fog.color = new TCo(hex);
	};

	GLmol.prototype.setupLights = function(scene)
	{
		var directionalLight = new THREE.DirectionalLight(0xFFFFFF);
		directionalLight.position = new TV3(0.2, 0.2, -1).normalize();
		directionalLight.intensity = 1.2;
		scene.add(directionalLight);
		var ambientLight = new THREE.AmbientLight(0x202020);
		scene.add(ambientLight);
	};

	GLmol.prototype.initializeScene = function()
	{
		//CHECK: Should I explicitly call scene.deallocateObject?
		this.scene = new THREE.Scene();
		this.scene.fog = new THREE.Fog(this.bgColor, 100, 200);

		this.modelGroup = new THREE.Object3D();
		this.rotationGroup = new THREE.Object3D();
		this.rotationGroup.useQuaternion = true;
		this.rotationGroup.quaternion = new THREE.Quaternion(1, 0, 0, 0);
		this.rotationGroup.add(this.modelGroup);

		this.scene.add(this.rotationGroup);
		this.setupLights(this.scene);
	};

	GLmol.prototype.zoomInto = function(atomlist, keepSlab)
	{
		var tmp = this.getExtent(atomlist);
		var center = new TV3(tmp[2][0], tmp[2][1], tmp[2][2]);//(tmp[0][0] + tmp[1][0]) / 2,(tmp[0][1] + tmp[1][1]) / 2,(tmp[0][2] + tmp[1][2]) / 2);
		if(this.protein.appliedMatrix)
		{
			center = this.protein.appliedMatrix.multiplyVector3(center);
		}
		this.modelGroup.position = center.multiplyScalar(-1);
		var x = tmp[1][0] - tmp[0][0],
			y = tmp[1][1] - tmp[0][1],
			z = tmp[1][2] - tmp[0][2];

		var maxD = Math.sqrt(x * x + y * y + z * z);
		if(maxD < 25) maxD = 25;

		if(!keepSlab)
		{
			this.slabNear = -maxD * 1;
			this.slabFar = maxD * 1;
		}

		this.rotationGroup.position.z = maxD * 0.35 / Math.tan(Math.PI / 180.0 * this.camera.fov / 2) - 150;
		this.rotationGroup.quaternion = new THREE.Quaternion(1, 0, 0, 0);
		this.zoom2D = 30 / (maxD / 25);
	};

	GLmol.prototype.rebuildScene = function()
	{
		this.canvasdrawStack = [];
		var view = this.getView();
		this.initializeScene();
		this.defineRepresentation();
		this.setView(view);
	};

	GLmol.prototype.setSlabAndFog = function()
	{
		var center = this.rotationGroup.position.z - this.camera.position.z;
		if(center < 1) center = 1;
		this.camera.near = center + this.slabNear;
		if(this.camera.near < 1) this.camera.near = 1;
		this.camera.far = center + this.slabFar;
		if(this.camera.near + 1 > this.camera.far) this.camera.far = this.camera.near + 1;
		if(this.camera instanceof THREE.PerspectiveCamera)
		{
			this.camera.fov = this.fov;
		}
		else
		{
			this.camera.right = center * Math.tan(Math.PI / 180 * this.fov);
			this.camera.left = -this.camera.right;
			this.camera.top = this.camera.right / this.ASPECT;
			this.camera.bottom = -this.camera.top;
		}

		this.camera.updateProjectionMatrix();

		this.scene.fog.near = this.camera.near + this.fogStart *(this.camera.far - this.camera.near);
		//if(this.scene.fog.near > center) this.scene.fog.near = center;
		this.scene.fog.far = this.camera.far;
	};

	GLmol.prototype.draw = function()
	{
		if(!this.scene) return;

		this.framePending = false;
		this.setSlabAndFog();
		if(!this.webglFailed) this.renderer.render(this.scene, this.camera);
		else this.render2d();
	};

	GLmol.prototype.redraw = function()
	{
		if(this.framePending) return;
		this.pendingFrame = true
		requestAnimationFrame(this.draw.bind(this));
	};

	GLmol.prototype.render2d = function()
	{
		var ctx = this.canvas2d[0].getContext("2d");
		this.scene.updateMatrixWorld();

		ctx.clearRect(0, 0, this.WIDTH, this.HEIGHT);
		ctx.fillStyle = "rgba(" + (this.bgColor >> 16) + "," + (this.bgColor >> 8 & 0xFF)
			+ "," + (this.bgColor & 0xFF) + "," + this.bgAlpha + ")";
		ctx.fillRect(0, 0, this.WIDTH, this.HEIGHT);
		ctx.save();

		ctx.translate(this.WIDTH / 2, this.HEIGHT / 2);
		ctx.scale(this.zoom2D || 1, this.zoom2D || 1);

		var lineWidth = 0.02;
		var mvMat = new THREE.Matrix4();
		mvMat.multiply(this.camera.matrixWorldInverse, this.modelGroup.matrixWorld);

		var PI2 = Math.PI * 2;
		var atoms = this.atoms;

		//transform coordinates
		for(var i = 0; i < this.atoms.length; i++)
		{
			var atom = atoms[i];
			if(atom == undefined) continue;

			if(atom.screen == undefined) atom.screen = new THREE.Vector3;
			atom.screen.set(atom.x, atom.y, atom.z);

			/*p*/
			mvMat.multiplyVector3(atom.screen);
			if(!this.webglFailed) atom.screen.y *= -1;//plus direction of y-axis: up in OpenGL, down in Canvas
		}

		//create draw stack
		if(this.canvasdrawStack.length == 0)
		{
			for(var i = 0; i < atoms.length; i++)
			{
				var atom = atoms[i];
				if(atom == undefined) continue;

				var part = {
					i: i,
					screen: atom.screen,
					color: "rgb(" + (atom.color >> 16) + "," + (atom.color >> 8 & 255) + "," + (atom.color & 255) + ")",
					r: this.canvasVDW ? GLmolVDWRadii[atom.elem] : this.canvasAtomRadius
				};

				//cache arc
				part.arc = [];
				if(part.r > 0)
				{
					var detail = this.canvasDetail;
					for(var v = 0; v < detail; v++)
					{
						part.arc.push([ part.r * Math.cos(PI2 / detail * v),
										part.r * Math.sin(PI2 / detail * v) ]);
					}
				}

				//add bonds
				part.bonds = [];
				for(var j = 0; j < atom.bonds.length; j++)
				{
					var atom2 = atoms[atom.bonds[j]];
					if(atom2 == undefined) continue;

					part.bonds.push(atom.bonds[j]);
				}

				this.canvasdrawStack.push(part);
			}
		}

		//sort draw stack
		this.canvasdrawStack.sort(function(a, b)
		{
			return a.screen.z - b.screen.z;
		});

		//prepare
		for(var i = 0; i < this.canvasdrawStack.length; i++)
		{
			atoms[this.canvasdrawStack[i].i].zIndex = i;
		}

		//draw
		for(var i = 0; i < this.canvasdrawStack.length; i++)
		{
			var part = this.canvasdrawStack[i];

			//draw atom black body
			if(!this.isDragging && part.r > 0)
			{
				ctx.save();
				ctx.translate(part.screen.x, part.screen.y);

				ctx.fillStyle = "#000000";
				ctx.lineWidth = lineWidth;
				ctx.beginPath();
				var mult = (part.r + lineWidth) / part.r;
				for(var v = 0; v < part.arc.length; v++)
				{
					if(v == 0) ctx.moveTo(mult * part.arc[v][0], mult * part.arc[v][1]);
					else ctx.lineTo(mult * part.arc[v][0], mult * part.arc[v][1]);
				}
				ctx.closePath();
				ctx.fill();

				ctx.restore();

				//draw bonds blackbody
				if(!this.canvasVDW)
				{
					for(var j = 0; j < part.bonds.length; j++)
					{
						var atom = atoms[part.bonds[j]];

						if(atom.screen.z > part.screen.z ||
						  (atom.screen.z == part.screen.z && atom.zIndex > atoms[part.i].zIndex))
						{
							var cx = (part.screen.x + atom.screen.x) / 2;
							var cy = (part.screen.y + atom.screen.y) / 2;

							ctx.lineWidth = ((this.isDragging || this.canvasLine) ?
								1 / this.zoom2D : this.canvasBondWidth) + lineWidth * 2;
							ctx.strokeStyle = "#000000";

							ctx.beginPath();
							ctx.moveTo(part.screen.x, part.screen.y);
							ctx.lineTo(cx, cy);
							ctx.closePath();
							ctx.stroke();

							ctx.beginPath();
							ctx.moveTo(atom.screen.x, atom.screen.y);
							ctx.lineTo(cx, cy);
							ctx.closePath();
							ctx.stroke();
						}
					}
				}
			}

			//draw colored bonds
			if(!this.canvasVDW || this.isDragging)
			{
				for(var j = 0; j < part.bonds.length; j++)
				{
					var atom = atoms[part.bonds[j]];
					var atomColor = this.canvasdrawStack[atoms[part.bonds[j]].zIndex].color;

					if(atom.screen.z > part.screen.z ||
					  (atom.screen.z == part.screen.z && atom.zIndex > atoms[part.i].zIndex))
					{
						var cx = (part.screen.x + atom.screen.x) / 2;
						var cy = (part.screen.y + atom.screen.y) / 2;

						ctx.lineWidth = (this.isDragging || this.canvasLine) ?
							1 / this.zoom2D : this.canvasBondWidth;

						ctx.strokeStyle = part.color;
						ctx.beginPath();
						ctx.moveTo(part.screen.x, part.screen.y);
						ctx.lineTo(cx, cy);
						ctx.closePath();
						ctx.stroke();

						ctx.strokeStyle = atomColor;
						ctx.beginPath();
						ctx.moveTo(atom.screen.x, atom.screen.y);
						ctx.lineTo(cx, cy);
						ctx.closePath();
						ctx.stroke();
					}
				}
			}

			//draw atom
			if(!this.isDragging && part.r > 0)
			{
				ctx.save();
				ctx.translate(part.screen.x, part.screen.y);

				ctx.fillStyle = part.color;
				ctx.beginPath();
				for(var v = 0; v < part.arc.length; v++)
				{
					if(v == 0) ctx.moveTo(part.arc[v][0], part.arc[v][1]);
					else ctx.lineTo(part.arc[v][0], part.arc[v][1]);
				}
				ctx.closePath();
				ctx.fill();

				ctx.restore();
			}
		}

		ctx.restore();
	};

	return GLmol;
}());
