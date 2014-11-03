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

Number.prototype.toPaddedString = function(n)
{
	var str = this + '';
	return str.length >= n ? str : new Array(n - str.length + 1).join('0') + str;
}
