/*===========================================================================*/
/*                     (c) Copyright 2014, MolSoft L.L.C.                    */
/*                          ALL RIGHTS RESERVED                              */
/*                               v. 1.2.4                                    */
/*===========================================================================*/

/*
Used and modified for MolView with permission from MolSoft L.L.C.
See: http://molview.org
*/

//--------------------------------------------------------------Object-----------------------------------------------------------------

function clone_object(obj)
{
	var ret;
	if(obj instanceof Array)
	{
		ret = new Array(obj.length);
		for(var i = 0; i < obj.length; i++)
		{
			if(obj[i] && typeof obj[i] == "object")
			{
				ret[i] = clone_object(obj[i]);
			}
			else ret[i] = obj[i];
		}
	}
	else
	{
		ret = new Object();
		for(var i in obj)
		{
			if(i != "clone" && i != "count")
			{
				if(obj[i] && typeof obj[i] == "object")
				{
					ret[i] = clone_object(obj[i]);
				}
				else ret[i] = obj[i];
			}
		}
	}
	return ret;
}

function count_properties()
{
	var count = 0;
	for(var prop in this)
		if(this.hasOwnProperty(prop)) count++;
	return count;
}

//--------------------------------------------------------------Array-----------------------------------------------------------------

Array.prototype.map = function(f)
{
	var v = new Array(this.length);
	for(var i = 0; i < this.length; i++) v[i] = f(this[i]);
	return v;
}

Array.prototype.forEach = function(f)
{
	for(var i = 0; i < this.length; i++) f(this[i]);
}

Array.prototype.fill = function(initValue)
{
	for(var i = 0; i < this.length; i++) this[i] = initValue;
}

Array.prototype.sub = function(p, n)
{
	var v = new Array(n);
	for(var i = 0; i < n; i++) v[i] = this[i + p];
	return v;
}

Array.prototype.unique = function()
{
	var res = [];
	for(var i = 0; i < this.length; i++)
		if(res.length == 0 || res[res.length - 1] != this[i]) res.push(this[i]);
	return res;
}

//--------------------------------------------------------------WMatrix-----------------------------------------------------------------

function WMatrix()
{
	this.mvm = [
		1., 0., 0., 0.,
		0., 1., 0., 0.,
		0., 0., 1., 0.,
		0., 0., 0., 1.
	];
}

WMatrix.prototype.translate = function (x, y, z)
{
	this.mvm[12] += x * this.mvm[0] + y * this.mvm[4] + z * this.mvm[8]; // | 1  0  0  x |
	this.mvm[13] += x * this.mvm[1] + y * this.mvm[5] + z * this.mvm[9]; // | 0  1  0  y |
	this.mvm[14] += x * this.mvm[2] + y * this.mvm[6] + z * this.mvm[10]; // | 0  0  1  z |
	this.mvm[15] += x * this.mvm[3] + y * this.mvm[7] + z * this.mvm[11]; // | 0  0  0  1 | 
	return this;
}

WMatrix.prototype.rotateZ = function (c, s)
{
	var tmp;
	tmp = this.mvm[0];
	this.mvm[0] = tmp * c + this.mvm[4] * s;
	this.mvm[4] = -tmp * s + this.mvm[4] * c; //| c -s  0  0 |
	tmp = this.mvm[1];
	this.mvm[1] = tmp * c + this.mvm[5] * s;
	this.mvm[5] = -tmp * s + this.mvm[5] * c; //| s  c  0  0 |
	tmp = this.mvm[2];
	this.mvm[2] = tmp * c + this.mvm[6] * s;
	this.mvm[6] = -tmp * s + this.mvm[6] * c; //| 0  0  1  0 |
	tmp = this.mvm[3];
	this.mvm[3] = tmp * c + this.mvm[7] * s;
	this.mvm[7] = -tmp * s + this.mvm[7] * c; //| 0  0  0  1 |
	return this;
}

WMatrix.prototype.rotateZAroundPoint = function (x, y, a)
{
	return this.translate(x, y, 0)
		.rotateZ(Math.cos(a), Math.sin(a))
		.translate(-x, -y, 0);
}

WMatrix.prototype.map = function(p)
{
	var xx = p.x * this.mvm[0] + p.y * this.mvm[4] + this.mvm[12];
	var yy = p.x * this.mvm[1] + p.y * this.mvm[5] + this.mvm[13];
	return {
		x: xx,
		y: yy,
		z: 0
	};
}

