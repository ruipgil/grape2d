/**
 * This is a simple abstraction of the canvas object,
 * may be used to do some optimizations
 */
Grape2D.Canvas = function(options){
	if(!options) options = {};
	this.canvas = document.createElement("Canvas");
	this.canvas.width = this.width = options.width || 300;
	this.canvas.height = this.height = options.height || 150;
	this.halfWidth = this.width/2;
	this.halfHeight = this.height/2;
	this.context = this.getContext();
};

Grape2D.Canvas.prototype = {
	/** Canvas element **/
	toDataURL : function(type, args){
		return this.context.toDataURL(type, args);
	},
	getContext : function(){
		return this.canvas.getContext("2d");
	},
	/** 2D Context **/
	save : function(){
		this.context.save();
		return this;
	},
	restore : function(){
		this.context.restore();
		return this;
	},
	/** Transformations **/
	scale : function(x, y){
		this.context.scale(x, y);
		return this;
	},
	rotate : function(angle){
		this.context.rotate(angle);
		return this;
	},
	translate : function(x, y){
		this.context.translate(x, y);
		return this;
	},
	transform : function(m11, m12, m21, m22, dx, dy){
		this.context.transform(m11, m12, m21, m22, dx, dy);
		return this;
	},
	/** Image drawing **/
	/**
	 * Draws an image to the canvas.
	 * @param image: HTMLImageElement, HTMLCanvasElement or HTMLVideoElement
	 * @param dx: destination x
	 * @param dy: destination y
	 * @param dw: destination width
	 * @param dh: destination height
	 * @param sx: source x
	 * @param sy: source y
	 * @param sw: source width
	 * @param sh: source height
	 */
	drawImage : function(image, dx, dy, dw, dh, sx, sy, sw, sh){
		this.context.drawImage(image, sx || 0, sy || 0, sw || image.width, sh || image.height, dx, dy, dw || image.width, dh || image.height);
		return this;
	},
	/** Compositing **/
	setGlobalAlpha : function(value){
		this.context.globalAlpha = value;
		return this;
	},
	globalCompositeOperation : function(flag){
		this.context.globalCompositeOperation = flag;
		return this;
	},
	/** Lines **/
	setLineWidth : function(value){
		this.context.lineWidth = value;
		return this;
	},
	setLineCap : function(value){
		this.context.lineCap = value;
		return this;
	},
	setLineJoin : function(value){
		this.context.lineJoin = value;
		return this;
	},
	setMiterLimit : function(value){
		this.context.miterLimit = value;
		return this;
	},
	/** Colors **/
	setStrokeStyle : function(value){
		this.context.strokeStyle = value;
		return this;
	},
	setFillStyle : function(value){
		this.context.fillStyle = value;
		return this;
	},
	setShadowOffsetX : function(value){
		this.context.shadowOffsetX = value;
		return this;
	},
	setShadowOffsetY : function(value){
		this.context.shadowOffsetY = value;
		return this;
	},
	setShadowBlur : function(value){
		this.context.shadowBlur = value;
		return this;
	},
	setShadowColor : function(value){
		this.context.shadowColor = value;
		return this;
	},

	createLinearGradient : function(x0, y0, x1, y1){
		return this.context.createLinearGradient(x0, y0, x1, y1);
	},
	createRadialGradient : function(x0, y0, r0, x1, y1, r1){
		return this.context.createRadialGradient(x0, y0, r0, x1, y1, r1);
	},
	createPattern : function(image, repetition){
		return this.context.createPattern(image, repetition);
	},
	/** Paths **/
	beginPath : function(){
		this.context.beginPath();
		return this;
	},
	closePath : function(){
		this.context.closePath();
		return this;
	},
	fill : function(){
		this.context.fill();
		return this;
	},
	stroke : function(){
		this.context.stroke();
		return this;
	},
	clip : function(){
		this.context.clip();
		return this;
	},
	moveTo : function(x, y){
		this.context.moveTo(x, y);
		return this;
	},
	lineTo : function(x, y){
		this.context.lineTo(x, y);
		return this;
	},
	quadraticCurveTo : function(cpx, cpy, x, y){
		this.context.quadraticCurveTo(cpx, cpy, x, y);
		return this;
	},
	bezierCurveTo : function(cp1x, cp1y, cp2x, cp2y, x, y){
		this.context.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
		return this;
	},
	arcTo : function(x1, y1, x2, y2, radius){
		this.context.arcTo(x1, y1, x2, y2, radius);
		return this;
	},
	arc : function(x, y, radius, startAngle, endAngle, CCW){
		this.context.arc(x, y, radius, startAngle || 0, endAngle || Grape2D.Math.PIx2, CCW || false);
		return this;
	},
	rect : function(x, y, w, h){
		this.context.rect(x, y, w, h);
		return this;
	},
	isPointInPath : function(x, y){
		return this.context.isPointInPath(x, y);
	},
	/** Text **/
	setFont : function(font){
		this.context.font = font;
		return this;
	},
	setTextAlign : function(value){
		this.context.textAlign = value;
		return this;
	},
	setTextBaseline : function(baseline){
		this.context.textBaseline = baseline;
		return this;
	},
	fillText : function(text, x, y, maxWidth){
		this.context.fillText(text, x, y);
		return this;
	},
	strokeText : function(text, x, y, maxWidth){
		this.context.strokeText(text, x, y);
		return this;
	},
	measureText : function(text){
		return this.context.measureText(text);
	},
	/** Rectangles **/
	clearRect : function(x, y, w, h){
		this.context.clearRect(x, y, w, h);
		return this;
	},
	fillRect : function(x, y, w, h){
		this.context.fillRect(x, y, w, h);
		return this;
	},
	strokeRect : function(x, y, w, h){
		this.context.strokeRect(x, y, w, h);
		return this;
	},
	/** Pixel manipulation **/
	createImageData : function(sw, sh){
		return this.context.createImageData(sw, sh);
	},
	getImageData : function(imageData){
		return this.context.getImageData(imageData);
	},
	putImageData : function(imageData, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight){
		this.context.putImageData(imageData, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight);
		return this;
	},
	resize : function(w, h){
		this.width = this.canvas.width = w;
		this.height = this.canvas.height = h;
	},
	appendOn : function(on){
		//this.canvas.style.position = 'absolute';
		on.appendChild(this.canvas);
	},
	clear : function(){
		this.context.clearRect(0, 0, this.width, this.height);
	}
};