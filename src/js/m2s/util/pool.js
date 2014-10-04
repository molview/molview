/****************************************************************************
 * Copyright (C) 2009-2010 GGA Software Services LLC
 *
 * This file may be distributed and/or modified under the terms of the
 * GNU Affero General Public License version 3 as published by the Free
 * Software Foundation and appearing in the file LICENSE.GPL included in
 * the packaging of this file.
 *
 * This file is provided AS IS with NO WARRANTY OF ANY KIND, INCLUDING THE
 * WARRANTY OF DESIGN, MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.
 ***************************************************************************/

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

if(!window.util || !util.Map)
	throw new Error("Map should be defined first");

util.Pool = function ()
{
	this._map = new util.Map();
	this._nextId = 0;
};

util.Pool.prototype.newId = function ()
{
	return this._nextId++;
};

util.Pool.prototype.add = function (obj)
{
	var id = this._nextId++;
	this._map.set(id, obj);
	return id;
};

util.Pool.prototype.set = function (id, obj)
{
	this._map.set(id, obj);
};

util.Pool.prototype.get = function (id)
{
	return this._map.get(id);
};

util.Pool.prototype.has = function (id)
{
	return this._map.has(id);
};

util.Pool.prototype.remove = function (id)
{
	return this._map.unset(id);
};

util.Pool.prototype.clear = function ()
{
	this._map.clear();
};

util.Pool.prototype.keys = function ()
{
	return this._map.keys();
};

util.Pool.prototype.ikeys = function ()
{
	return this._map.ikeys();
};

util.Pool.prototype.each = function (func, context)
{
	this._map.each(func, context);
};

util.Pool.prototype.map = function (func, context)
{
	return this._map.map(func, context);
};

util.Pool.prototype.find = function (func, context)
{
	return this._map.find(func, context);
};

util.Pool.prototype.count = function ()
{
	return this._map.count();
};

util.Pool.prototype.keyOf = function (value)
{
	return this._map.keyOf(value);
};
