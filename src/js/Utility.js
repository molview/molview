/**
 * This file is part of MolView (http://molview.org)
 * Copyright (c) 2014-2023 Herman Bergwerf
 */

/**
 * Utility functions to check if a certain string
 * is a certain chemical identifier
 * @type {Object}
 */
var ChemIdentifiers = {
	regex: {
		formula: /^((?:[A-Z][a-z]?)+[\d,.]*)*/
	},

	isFormula: function(str)
	{
		return this.regex.formula.exec(str)[0] === str;
	}
}

/**
 * Converts the first character of a string into an uppercase character
 * @param  {String} str Input
 * @return {String}     Output
 */
function ucfirst(str)
{
	if(str === undefined) return str;
	else return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Converts capitalized text into more readable text using a special regex
 * @param  {String} str Input
 * @return {String}     Output
 */
function humanize(str)
{
	if(str === undefined) return str;
	//reverse case for all words with uppercase characters only
	else return str.replace(/(\b[A-Z]+\b)/g, function(word)
	{
		return word.toLowerCase();
	});
}

/**
 * Formats all molecular formulas in the input string using <sub>
 * @param  {String} str Input
 * @return {String}     Output
 */
function formatMFormula(str)
{
	if(str)
	{
		return str.replace(/[a-zA-Z0-9.,]+/g, function(word)
		{
			if(ChemIdentifiers.isFormula(word))
			{
				return word.replace(/[\d,.]*/g, "<sub>$&</sub>");
			}
			else return word;
		});
	}
	else return undefined;
}

/**
 * Formats all hyperlinks in the input string using <a>
 * @param  {String} str Input
 * @return {String}     Output
 */
function formatHTMLLinks(str)
{
	return str.replace(/(http|https):\/\/[^\s]+/g, function(link)
	{
		return '<a class="link" href="' + link + '" target="_blank">' + link + "</a>";
	});
}

/**
 * @return {Boolean} Tests wether this device supports touch
 */
function isTouchDevice()
{
	return !!('ontouchstart' in window) || (!!('onmsgesturechange' in window)
			&& !!window.navigator.maxTouchPoints);
}

/**
 * @return {Object} JS object containing current query parameters
 */
function getQuery()
{
	if(location.search === "") return {};

	var pairs = location.search.slice(1).split("&");
	var result = {};
	pairs.forEach(function(pair)
	{
		pair = pair.split(/=(.+)?/);
		result[pair[0]] = decodeURIComponent(pair[1] || "");
	});

	return result;
}

function oneOf(nail, haystack)
{
	return haystack.indexOf(nail) !== -1;
}

/**
 * Replacement for encodeURIComponent()
 * This function makes sure the MolView server can read the whole query
 * string with minimal changes.
 * Note: a '+' character is NOT converted into a space in the backend
 *
 * @param {[type]} str [description]
 */
function specialEncodeURIComponent(str)
{
	return str.replace(/&/g, "%26").replace(/#/g, "%23");
}

/**
 * jQuery Textfill plugin
 * https://github.com/jquery-textfill/jquery-textfill
 */
(function (jQuery)
{
	jQuery.fn.textfill = function (options)
	{
		var fontSize = options.maxFontPoints;
		var text = this.children();
		var maxHeight = jQuery(this).height();
		var maxWidth = jQuery(this).width();
		var textHeight;
		var textWidth;
		do
		{
			text.css("font-size", "" + fontSize + "pt");
			textHeight = text.outerHeight();
			textWidth = text.outerWidth();
			fontSize = fontSize - 1;
		}
		while((textHeight > maxHeight || textWidth > maxWidth) && fontSize > 6);
		return this;
	}
})(jQuery);

/**
 * jQuery plugin which tests if DOM Element dimensions have changed
 */
(function (jQuery)
{
	$.fn.sizeChanged = function()
	{
		return !(this.data("savedWidth") === this.width()
			  && this.data("savedHeight") === this.height());
	}

	$.fn.saveSize = function()
	{
		this.data("savedWidth", this.width());
		this.data("savedHeight", this.height());
	}
})(jQuery);

/**
 * Converts dataURI to a Blob
 * @param {String} dataURI
 * @return {Blob}
 */
function dataURItoBlob(dataURI)
{
	try
	{
		//convert base64 to raw binary data held in a string
		var byteString = atob(dataURI.split(',')[1]);

		//separate out the mime component
		var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

		//write the bytes of the string to an ArrayBuffer
		var arrayBuffer = new ArrayBuffer(byteString.length);
		var _ia = new Uint8Array(arrayBuffer);
		for(var i = 0; i < byteString.length; i++)
		{
			_ia[i] = byteString.charCodeAt(i);
		}

		var dataView = new DataView(arrayBuffer);
		var blob = new Blob([dataView],
		{
			type: mimeString
		});
		return blob;
	}
	catch(e)
	{
		console.error(e);
		return null;
	}
}

/**
 * Open dataURI in new tab
 * @param {String} dataURI
 */
function openDataURI(dataURI)
{
	var blob = dataURItoBlob(dataURI);
	var windowURL = window.URL || window.webkitURL || undefined;
	if(blob !== null && windowURL !== undefined)
	{
		window.open(windowURL.createObjectURL(blob));
	}
	else window.open(dataURI);
}

/**
 * Wrapper for jQuery.ajax
 * @param {Object}   obj              jQuery.ajax data + additional data
 * @param {Boolean}  obj.primary      Mark as primary AJAX call; aborts other primary AJAX calls
 * @param {Function} obj.defaultError Use default error handler with $defaultError as callback
 */
var xhr;//store primary AJAX call
function AJAX(obj)
{
	if(obj.primary && xhr !== undefined)
	{
		xhr.abort();
	}

	if(obj.defaultError !== undefined)
	{
		obj.error = function(jqXHR, textStatus)
		{
			if(textStatus !== "error") return;
			obj.defaultError(jqXHR.status);
		}
	}

	if(obj.primary)
	{
		xhr = $.ajax(obj);
		return xhr;
	}
	else
	{
		return $.ajax(obj);
	}
}

/**
 * PHP similar_text JavaScript implementation
 * see: http://phpjs.org/functions/similar_text/
 *
 * @param  {String}  first   String to compare with
 * @param  {String}  second  String to compare
 * @param  {Boolean} percent Indicates whether similairity percentage should be returned
 * @return {Float}           [description]
 */
function similar_text(first, second, percent)
{
	//  discuss at: http://phpjs.org/functions/similar_text/
	// original by: Rafał Kukawski (http://blog.kukawski.pl)
	// bugfixed by: Chris McMacken
	// bugfixed by: Jarkko Rantavuori original by findings in stackoverflow (http://stackoverflow.com/questions/14136349/how-does-similar-text-work)
	// improved by: Markus Padourek (taken from http://www.kevinhq.com/2012/06/php-similartext-function-in-javascript_16.html)
	//   example 1: similar_text('Hello World!', 'Hello phpjs!');
	//   returns 1: 7
	//   example 2: similar_text('Hello World!', null);
	//   returns 2: 0

	if(first === null || second === null || typeof first === 'undefined' || typeof second === 'undefined')
	{
		return 0;
	}

	first += '';
	second += '';

	var pos1 = 0,
		pos2 = 0,
		max = 0,
		firstLength = first.length,
		secondLength = second.length,
		p, q, l, sum;

	max = 0;

	for(p = 0; p < firstLength; p++)
	{
		for(q = 0; q < secondLength; q++)
		{
			for(l = 0;
				(p + l < firstLength) && (q + l < secondLength) && (first.charAt(p + l) === second.charAt(q + l)); l++)
			;
			if(l > max)
			{
				max = l;
				pos1 = p;
				pos2 = q;
			}
		}
	}

	sum = max;

	if(sum)
	{
		if(pos1 && pos2)
		{
			sum += this.similar_text(first.substr(0, pos1), second.substr(0, pos2));
		}

		if((pos1 + max < firstLength) && (pos2 + max < secondLength))
		{
			sum += this.similar_text(first.substr(pos1 + max, firstLength - pos1 - max), second.substr(pos2 + max,
				secondLength - pos2 - max));
		}
	}

	if(!percent)
	{
		return sum;
	}
	else
	{
		return (sum * 200) / (firstLength + secondLength);
	}
}
