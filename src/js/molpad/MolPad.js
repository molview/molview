function MolPad(container)
{

}

/**
 * Basic MolPad API
 */

MolPad.prototype.resize = function()
{

}

MolPad.prototype.loadMOL = function(mol)
{

}

MolPad.prototype.getMOL = function()
{

}

MolPad.prototype.onChange = function(cb)
{

}

MolPad.prototype.setTool = function(type, data)
{

}

MolPad.prototype.toDataURL = function(cb)
{
	this.stage.toDataURL({ callback: cb });
}
