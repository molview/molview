/*===========================================================================*/
/*                     (c) Copyright 2014, MolSoft L.L.C.                    */
/*                          ALL RIGHTS RESERVED                              */
/*                               v. 1.2.4                                    */
/*===========================================================================*/

/*
Used and modified for MolView with permission from MolSoft L.L.C.
See: http://molview.org
*/

var MolEdit_AtomColors = { "H":"#000000","He":"#849b9b","Li":"#c87efa","Be":"#82ab00","B":"#c38a8a","C":"#000000","N":"#304ff7","O":"#ff0d0d","F":"#6dab3c","Ne":"#7b9ca8","Na":"#ab5cf2","Mg":"#61b400","Al":"#a79191","Si":"#b09276","P":"#ff8000","S":"#c39517","Cl":"#1dc51d","Ar":"#63a2b0","K":"#8f40d4","Ca":"#2fc300","Sc":"#969696","Ti":"#94969a","V":"#96969a","Cr":"#8796c3","Mn":"#9c7ac7","Fe":"#e06633","Co":"#db8293","Ni":"#45b645","Cu":"#c78033","Zn":"#7d80b0","Ga":"#bd8c8c","Ge":"#668f8f","As":"#bd80e3","Se":"#e28f00","Br":"#a62929","Kr":"#53a6bc","Rb":"#702eb0","Sr":"#00d000","Y":"#5fa4a4","Zr":"#6ba2a2","Nb":"#61a4a9","Mo":"#4ea9a9","Tc":"#3b9e9e","Ru":"#248f8f","Rh":"#0a7d8c","Pd":"#006985","Ag":"#969696","Cd":"#ae9462","In":"#a67573","Sn":"#668080","Sb":"#9e63b5","Te":"#d47a00","I":"#940094","Xe":"#429eb0","Cs":"#57178f","Ba":"#00c900","La":"#57a4c5","Ce":"#989877","Pr":"#869d7b","Nd":"#7da07d","Pm":"#69a581","Sm":"#5ea883","Eu":"#43b089","Gd":"#31b48d","Tb":"#23b890","Dy":"#17bb92","Ho":"#00c578","Er":"#00c765","Tm":"#00c94e","Yb":"#00bf38","Lu":"#00ab24","Hf":"#42a8dc","Ta":"#4ba2f9","W":"#2194d6","Re":"#267dab","Os":"#266696","Ir":"#175487","Pt":"#9595a0","Au":"#b9981a","Hg":"#9595a9","Tl":"#a6544d","Pb":"#575961","Bi":"#9e4fb5","Po":"#ab5c00","At":"#754f45","Rn":"#428296","Fr":"#420066","Ra":"#007d00","Ac":"#669ce4","Th":"#00b8fc","Pa":"#00a1ff","U":"#008fff","Np":"#0080ff","Pu":"#006bff","Am":"#545cf2","Cm":"#785ce3","Bk":"#8a4fe3","Cf":"#a136d4","Es":"#b31fd4","Fm":"#B31FBA","Md":"#B30DA6","No":"#BD0D87","Lr":"#C70066","Rf":"#CC0059","Db":"#D1004F","Sg":"#D90045","Bh":"#E00038","Hs":"#E6002E","Mt":"#EB0026","Ds":"#9595a0","Rg":"#b9981a","Cn":"#9595a9" };

var Elements = {
	'*': 0, "H":1,"He":2,"Li":3,"Be":4,"B":5,"C":6,"N":7,"O":8,"F":9,"Ne":10,"Na":11,"Mg":12,"Al":13,"Si":14,"P":15,"S":16,"Cl":17,"Ar":18,"K":19,"Ca":20,"Sc":21,"Ti":22,"V":23,"Cr":24,"Mn":25,"Fe":26,"Co":27,"Ni":28,"Cu":29,"Zn":30,"Ga":31,"Ge":32,"As":33,"Se":34,"Br":35,"Kr":36,"Rb":37,"Sr":38,"Y":39,"Zr":40,"Nb":41,"Mo":42,"Tc":43,"Ru":44,"Rh":45,"Pd":46,"Ag":47,"Cd":48,"In":49,"Sn":50,"Sb":51,"Te":52,"I":53,"Xe":54,"Cs":55,"Ba":56,"Hf":72,"Ta":73,"W":74,"Re":75,"Os":76,"Ir":77,"Pt":78,"Au":79,"Hg":80,"Tl":81,"Pb":82,"Bi":83,"Po":84,"At":85,"Rn":86,"Fr":87,"Ra":88,"Rf":104,"Db":105,"Sg":106,"Bh":107,"Hs":108,"Mt":109,"Ds":110,"Rg":111,"Cn":112,"Uut":113,"Fl":114,"Uup":115,"Lv":116,"Uus":117,"Uuo":118,"La":57,"Ce":58,"Pr":59,"Nd":60,"Pm":61,"Sm":62,"Eu":63,"Gd":64,"Tb":65,"Dy":66,"Ho":67,"Er":68,"Tm":69,"Yb":70,"Lu":71,"Ac":89,"Th":90,"Pa":91,"U":92,"Np":93,"Pu":94,"Am":95,"Cm":96,"Bk":97,"Cf":98,"Es":99,"Fm":100,"Md":101,"No":102,"Lr":103
};

var ElementNames = [];
{
	for(var el in Elements) ElementNames[Elements[el]] = el;
}

var M_CE = 1 << 0, // atom & bond
	M_AR = 1 << 1, // atom & bond
	M_RNG = 1 << 5, // atom & bond
	M_WK = 1 << 31, // atom & bond

	M_EXPLICT_QFM = 1 << 6, // atom
	M_APO = 1 << 7, // atom

	M_BO_UP = 1 << 6, // bond
	M_BO_DW = 1 << 7, // bond
	M_BO_TREE = 1 << 8, // bond
	M_BO_SLASH = 1 << 9, // bond
	M_BO_BSLASH = 1 << 10; // bond

var HYB_SP1 = 1,
	HYB_SP2 = 2,
	HYB_SP3 = 3;
var CHI_R = 1,
	CHI_S = 2;
var STEREO_LABEL = ["", "(R)", "(S)", "(RS)"];
var E_BOTY_NL = 0,
	E_BOTY_SI = 1,
	E_BOTY_DD = 2,
	E_BOTY_TR = 3,
	E_BOTY_AR = 4,
	E_BOTY_SD = 5,
	E_BOTY_SA = 6,
	E_BOTY_DA = 7,
	E_BOTY_AH = 8,
	E_BOTY_DS = 9;
var E_BOCYTY_AH = 0,
	E_BOCYTY_RN = 1,
	E_BOCYTY_CN = 2;
var ALS_NOOP = 0,
	ALS_HIAND = 1,
	ALS_OR = 2,
	ALS_LOAND = 3,
	ALS_NOT = 4;
var MINVOL = 0.01;
var ATOM_DISPLAY_RS = 1 << 0;

var MODE_NORMAL = 0,
	MODE_ZOOM = 1,
	MODE_ZROT = 2,
	MODE_RECT_SEL = 3,
	MODE_LASSO_SEL = 4,
	MODE_DRAG_ATOMS = 5,
	MODE_CHAIN = 6;

var TO_RAD = 0.017453292519943;
var TO_DEG = 57.29577951308232;

/* MODIFICATION */
var rotateAroundImage = new Image();
	rotateAroundImage.src = "src/img/action/rotate.svg"
