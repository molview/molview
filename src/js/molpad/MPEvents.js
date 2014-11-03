MolPad.prototype.onScroll = function(delta)
{
	var s = this.stage.getScaleX();
	s += s * this.settings.zoomSpeed * delta;

	this.stage.scale({ x: s, y: s });
	this.stage.offsetX(-(this.getWidth() / s - this.getWidth()) / 2);
	this.stage.offsetY(-(this.getHeight() / s - this.getHeight()) / 2);

	this.redraw();
}

MolPad.prototype.onPointerDown = function(e)
{
	this.pointer.old.x = e.pageX;
	this.pointer.old.y = e.pageY;
	this.pointer.drag = true;
}

MolPad.prototype.onPointerMove = function(e)
{
	if(e.which == 2 && this.pointer.drag)
	{
		this.move(e.pageX - this.pointer.old.x, e.pageY - this.pointer.old.y);
		this.pointer.old.x = e.pageX;
		this.pointer.old.y = e.pageY;
	}
}

MolPad.prototype.onPointerUp = function(e)
{
	this.pointer.drag = false;
}
