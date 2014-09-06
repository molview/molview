/*===========================================================================*/
/*                     (c) Copyright 2014, MolSoft L.L.C.                    */
/*                          ALL RIGHTS RESERVED                              */
/*                               v. 1.2.4                                    */
/*===========================================================================*/

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

function isMobile()
{
	var check = false;
	(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
	return check;
}

function isTouchDevice()
{
	return !!('ontouchstart' in window)
	   || (!!('onmsgesturechange' in window) && !!window.navigator.maxTouchPoints);
}

var unicodesupermap = {
'+':'\u207A','−':'\u207B','0':'\u2070','1':'\u00B9','2':'\u00B2','3':'\u00B3','4':'\u2074','5':'\u2075','6':'\u2076','7':'\u2077','8':'\u2078','9':'\u2079'
//,'a':'','e':'','ə':'','h':'','i':'','j':'','k':'','l':'','m':'','n':'','o':'','p':'','r':'','s':'','t':'','u':'','v':'','x':'','β':'','γ':'','ρ':'','φ':'','χ':''
};

function unicodeSuperscript(str)
{
	return str.replace(/[0-9+−]/g, function(c){ return unicodesupermap[c] })
}

(function (ctx)
{
	var sprintf = function ()
	{
		if(!sprintf.cache.hasOwnProperty(arguments[0]))
		{
			sprintf.cache[arguments[0]] = sprintf.parse(arguments[0]);
		}
		return sprintf.format.call(null, sprintf.cache[arguments[0]], arguments);
	};

	sprintf.format = function (parse_tree, argv)
	{
		var cursor = 1,
			tree_length = parse_tree.length,
			node_type = '',
			arg, output = [],
			i, k, match, pad, pad_character, pad_length;
		for(i = 0; i < tree_length; i++)
		{
			node_type = get_type(parse_tree[i]);
			if(node_type === 'string')
			{
				output.push(parse_tree[i]);
			}
			else if(node_type === 'array')
			{
				match = parse_tree[i]; // convenience purposes only
				if(match[2])
				{ // keyword argument
					arg = argv[cursor];
					for(k = 0; k < match[2].length; k++)
					{
						if(!arg.hasOwnProperty(match[2][k]))
						{
							throw(sprintf('[sprintf] property "%s" does not exist', match[2][k]));
						}
						arg = arg[match[2][k]];
					}
				}
				else if(match[1])
				{ // positional argument (explicit)
					arg = argv[match[1]];
				}
				else
				{ // positional argument (implicit)
					arg = argv[cursor++];
				}

				if(/[^s]/.test(match[8]) && (get_type(arg) != 'number'))
				{
					throw(sprintf('[sprintf] expecting number but found %s', get_type(arg)));
				}
				switch(match[8])
				{
				case 'b':
					arg = arg.toString(2);
					break;
				case 'c':
					arg = String.fromCharCode(arg);
					break;
				case 'd':
					arg = parseInt(arg, 10);
					break;
				case 'e':
					arg = match[7] ? arg.toExponential(match[7]) : arg.toExponential();
					break;
				case 'f':
					arg = match[7] ? parseFloat(arg)
						.toFixed(match[7]) : parseFloat(arg);
					break;
				case 'o':
					arg = arg.toString(8);
					break;
				case 's':
					arg = ((arg = String(arg)) && match[7] ? arg.substring(0, match[7]) : arg);
					break;
				case 'u':
					arg = arg >>> 0;
					break;
				case 'x':
					arg = arg.toString(16);
					break;
				case 'X':
					arg = arg.toString(16)
						.toUpperCase();
					break;
				}
				arg = (/[def]/.test(match[8]) && match[3] && arg >= 0 ? '+' + arg : arg);
				pad_character = match[4] ? match[4] == '0' ? '0' : match[4].charAt(1) : ' ';
				pad_length = match[6] - String(arg)
					.length;
				pad = match[6] ? str_repeat(pad_character, pad_length) : '';
				output.push(match[5] ? arg + pad : pad + arg);
			}
		}
		return output.join('');
	};

	sprintf.cache = {};

	sprintf.parse = function (fmt)
	{
		var _fmt = fmt,
			match = [],
			parse_tree = [],
			arg_names = 0;
		while(_fmt)
		{
			if((match = /^[^\x25]+/.exec(_fmt)) !== null)
			{
				parse_tree.push(match[0]);
			}
			else if((match = /^\x25{2}/.exec(_fmt)) !== null)
			{
				parse_tree.push('%');
			}
			else if((match = /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(_fmt)) !== null)
			{
				if(match[2])
				{
					arg_names |= 1;
					var field_list = [],
						replacement_field = match[2],
						field_match = [];
					if((field_match = /^([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null)
					{
						field_list.push(field_match[1]);
						while((replacement_field = replacement_field.substring(field_match[0].length)) !== '')
						{
							if((field_match = /^\.([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null)
							{
								field_list.push(field_match[1]);
							}
							else if((field_match = /^\[(\d+)\]/.exec(replacement_field)) !== null)
							{
								field_list.push(field_match[1]);
							}
							else
							{
								throw('[sprintf] huh?');
							}
						}
					}
					else
					{
						throw('[sprintf] huh?');
					}
					match[2] = field_list;
				}
				else
				{
					arg_names |= 2;
				}
				if(arg_names === 3)
				{
					throw('[sprintf] mixing positional and named placeholders is not (yet) supported');
				}
				parse_tree.push(match);
			}
			else
			{
				throw('[sprintf] huh?');
			}
			_fmt = _fmt.substring(match[0].length);
		}
		return parse_tree;
	};

	var vsprintf = function (fmt, argv, _argv)
	{
		_argv = argv.slice(0);
		_argv.splice(0, 0, fmt);
		return sprintf.apply(null, _argv);
	};

	/**
	 * helpers
	 */
	function get_type(variable)
	{
		return Object.prototype.toString.call(variable)
			.slice(8, -1)
			.toLowerCase();
	}

	function str_repeat(input, multiplier)
	{
		for(var output = []; multiplier > 0; output[--multiplier] = input)
		{ /* do nothing */ }
		return output.join('');
	}

	/**
	 * export to either browser or node.js
	 */
	ctx.sprintf = sprintf;
	ctx.vsprintf = vsprintf;
})(typeof exports != "undefined" ? exports : window);
