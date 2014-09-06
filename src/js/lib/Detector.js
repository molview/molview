/**
 * @author alteredq / http://alteredqualia.com/
 * @author mr.doob / http://mrdoob.com/
 */

var Detector = {
	canvas: !! window.CanvasRenderingContext2D,
	webgl: ( function () { try { return !! window.WebGLRenderingContext && !! document.createElement( 'canvas' ).getContext( 'experimental-webgl' ); } catch( e ) { return false; } } )(),
	workers: !! window.Worker,
	fileapi: window.File && window.FileReader && window.FileList && window.Blob,

	getWebGLErrorMessage: function()
	{
		var msg = "Your browser supports WebGL";
		if(!this.webgl)
		{
			msg = window.WebGLRenderingContext ?
				'Your graphics card does not seem to support <a class="link" href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation">WebGL</a>. Find out how to get it <a class="link" href="http://get.webgl.org/">here</a>.'
			:
				'Your browser does not seem to support <a class="link" href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation">WebGL</a>. Find out how to get it <a class="link" href="http://get.webgl.org/">here</a>.';

		}
		return msg;
	},
};
