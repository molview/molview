/**
   jQuery jMosueWheel plugin
   
   This jQuery plugin add a event handler for "mousewheel" event on any DOMElement
   
   @name jMosueWheel.js
   @author Trung-Hieu Le
   @version 1.0
   @date Jan 20, 2013
   @category jQuery plugin
   @copyright (C) 2013 - Trung-Hieu Le (http://www.webtrunghieu.info)
   @license AGPL version 3

   This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/agpl.txt/>.
 */
 
 (function(){
    /* Mozilla crossplatform mouse wheel event handling */
	var prefix = "", _addEventListener, onwheel, support;
 
    // detect event model
    if ( window.addEventListener ) {
        _addEventListener = "addEventListener";
    } else {
        _addEventListener = "attachEvent";
        prefix = "on";
    }
 
    // detect available wheel event
    if ( document.onmousewheel !== undefined ) {
        // Webkit and IE support at least "mousewheel"
        support = "mousewheel";
    }
    try {
        // Modern browsers support "wheel"
        WheelEvent("wheel");
        support = "wheel";
    } catch (e) {}
    if ( !support ) {
        // let's assume that remaining browsers are older Firefox
        support = "DOMMouseScroll";
    }
 
    window.addWheelListener = function( elem, callback, useCapture ) {
        _addWheelListener( elem, support, callback, useCapture );
 
        // handle MozMousePixelScroll in older Firefox
        if( support == "DOMMouseScroll" ) {
            _addWheelListener( elem, "MozMousePixelScroll", callback, useCapture );
        }
    };
 
    function _addWheelListener( elem, eventName, callback, useCapture ) {
        elem[ _addEventListener ]( prefix + eventName, support == "wheel" ? callback : function( originalEvent ) {
            !originalEvent && ( originalEvent = window.event );
 
            // create a normalized event object
            var event = {
                // keep a ref to the original event object
                originalEvent: originalEvent,
                target: originalEvent.target || originalEvent.srcElement,
                type: "wheel",
                deltaMode: originalEvent.type == "MozMousePixelScroll" ? 0 : 1,
                deltaX: 0,
                delatZ: 0,
                preventDefault: function() {
                    originalEvent.preventDefault ?
                        originalEvent.preventDefault() :
                        originalEvent.returnValue = false;
                }
            };
             
            // calculate deltaY (and deltaX) according to the event
            if ( support == "mousewheel" ) {
                event.deltaY = - 1/40 * originalEvent.wheelDelta;
                // Webkit also support wheelDeltaX
                originalEvent.wheelDeltaX && ( event.deltaX = - 1/40 * originalEvent.wheelDeltaX );
            } else {
                event.deltaY = originalEvent.detail;
            }
 
            // it's time to fire the callback
            return callback( event );
 
        }, useCapture || false );
    }
	
	/* jQuery wrapper */
	jQuery.fn.jMouseWheel = function(handler) {
		return this.each(function() {
			window.addWheelListener(this, handler, true);
		});
	};
 })(jQuery);
