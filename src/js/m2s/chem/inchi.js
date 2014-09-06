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

if(!window.chem || !chem.Struct)
	throw new Error("chem.Molecule should be defined first");

chem.InChiSaver = function () {};

chem.InChiSaver.prototype.saveMolecule = function (molecule)
{
	var ret = '',
		err = null;
	if(ui.standalone)
		throw {
			message: 'InChI is not supported in the standalone mode'
		};
	if(molecule.rgroups.count() !== 0)
		throw new Error("R-group fragments are not supported and will be discarded");
	molecule = molecule.getScaffold();
	if(molecule.atoms.count() === 0)
		return ret;
	molecule = molecule.clone();
	molecule.sgroups.each(function (sgid, sg)
	{
		if(sg.type !== 'MUL')
		{
			throw {
				message: "InChi data format doesn't support s-groups"
			};
		}
	}, this);
	var moldata = new chem.MolfileSaver().saveMolecule(molecule);
	new Ajax.Request(ui.api_path + 'getinchi',
	{
		method: 'post',
		asynchronous: false,
		parameters:
		{
			moldata: moldata
		},
		onComplete: function (res)
		{
			if(res.responseText.startsWith('Ok.'))
			{
				ret = res.responseText.split('\n')[1];
			}
			else if(res.responseText.startsWith('Error.'))
			{
				err = {
					message: res.responseText.split('\n')[1]
				};
			}
			else
			{
				err = {
					message: 'Unexpected server message (' + res.responseText + ')'
				};
			}
		}
	});
	if(err)
		throw err;
	return ret;
};
