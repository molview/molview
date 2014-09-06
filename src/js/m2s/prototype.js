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

Array.prototype.each = function(iterator, context)
{
	for(var i = 0, length = this.length >>> 0; i < length; i++)
	{
		if(i in this)
		{
			if(iterator.call(context, this[i], i, this) === false)
				return;
		}
	}
}

Array.prototype.clone = function()
{
	return Array.prototype.slice.call(this, 0);
}

Array.prototype.find = function()
{
	var result;
    this.each(function(value, index)
    {
		if(iterator.call(context, value, index, this))
		{
			result = value;
			return false;
		}
		return true;
    }, this);
    return result;
}

Array.prototype.findAll = function()
{
	var results = [];
	this.each(function(value, index)
	{
		if(iterator.call(context, value, index, this))
		results.push(value);
	}, this);
	return results;
}
