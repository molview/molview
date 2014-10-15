/*===========================================================================*/
/*                     (c) Copyright 2014, MolSoft L.L.C.                    */
/*                          ALL RIGHTS RESERVED                              */
/*                               v. 1.2.4                                    */
/*===========================================================================*/

/**
 * This file is part of MolView (https://molview.org)
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

var Elements = {
	"*": 0,"H":1,"He":2,"Li":3,"Be":4,"B":5,"C":6,"N":7,"O":8,"F":9,"Ne":10,"Na":11,"Mg":12,"Al":13,"Si":14,"P":15,"S":16,"Cl":17,"Ar":18,"K":19,"Ca":20,"Sc":21,"Ti":22,"V":23,"Cr":24,"Mn":25,"Fe":26,"Co":27,"Ni":28,"Cu":29,"Zn":30,"Ga":31,"Ge":32,"As":33,"Se":34,"Br":35,"Kr":36,"Rb":37,"Sr":38,"Y":39,"Zr":40,"Nb":41,"Mo":42,"Tc":43,"Ru":44,"Rh":45,"Pd":46,"Ag":47,"Cd":48,"In":49,"Sn":50,"Sb":51,"Te":52,"I":53,"Xe":54,"Cs":55,"Ba":56,"Hf":72,"Ta":73,"W":74,"Re":75,"Os":76,"Ir":77,"Pt":78,"Au":79,"Hg":80,"Tl":81,"Pb":82,"Bi":83,"Po":84,"At":85,"Rn":86,"Fr":87,"Ra":88,"Rf":104,"Db":105,"Sg":106,"Bh":107,"Hs":108,"Mt":109,"Ds":110,"Rg":111,"Cn":112,"Uut":113,"Fl":114,"Uup":115,"Lv":116,"Uus":117,"Uuo":118,"La":57,"Ce":58,"Pr":59,"Nd":60,"Pm":61,"Sm":62,"Eu":63,"Gd":64,"Tb":65,"Dy":66,"Ho":67,"Er":68,"Tm":69,"Yb":70,"Lu":71,"Ac":89,"Th":90,"Pa":91,"U":92,"Np":93,"Pu":94,"Am":95,"Cm":96,"Bk":97,"Cf":98,"Es":99,"Fm":100,"Md":101,"No":102,"Lr":103,"D":104
};

var ElementNames = [];
{
	for(var el in Elements) ElementNames[Elements[el]] = el;
	ElementNames[Elements["D"]] = "2H";
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
//rotateAroundImage.src = "src/img/action/rotate.svg"
var closestAtomThreshold = 0.3;
