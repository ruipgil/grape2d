/**
 * This is a simple abstraction of the canvas object,
 *   may be used to do some optimizations.
 *
 * @constructor
 */
Grape2D.Canvas = function(options) {
	if (!options) options = {};
	/**
	 * Canvas DOM element.
	 *
	 * @type {!Element}
	 * @private
	 */
	this.canvas = document.createElement("Canvas");
	this.canvas.width = options.width || 300;
	this.canvas.height = options.height || 150;
	/**
	 * Half width of the canvas.
	 *
	 * @type {!number}
	 * @private
	 */
	this.halfWidth = this.canvas.width / 2;
	/**
	 * Half height of the canvas.
	 *
	 * @type {!number}
	 * @private
	 */
	this.halfHeight = this.canvas.height / 2;
	/**
	 * Context of the canvas.
	 *
	 * @type {!CanvasRenderingContext2D}
	 * @private
	 */
	this.context = this.canvas.getContext("2d");
};

Grape2D.Canvas.prototype = {
	/**
	 * Gets canvas width.
	 *
	 * @return {!number} Canvas width.
	 */
	getWidth: function() {
		return this.canvas.width;
	},
	/**
	 * Gets canvas half width.
	 *
	 * @return {!number} Canvas half width.
	 */
	getHalfWidth: function() {
		return this.halfWidth;
	},
	/**
	 * Sets canvas width.
	 *
	 * @param  {!number} width New canvas width.
	 */
	setWidth: function(width) {
		this.canvas.width = width;
		this.halfWidth = width / 2;
	},
	/**
	 * Gets canvas height.
	 *
	 * @return {!number} Canvas height.
	 */
	getHeight: function() {
		return this.canvas.height;
	},
	/**
	 * Gets canvas half height.
	 *
	 * @return {!number} Canvas half height.
	 */
	getHalfHeight: function() {
		return this.halfHeight;
	},
	/**
	 * Sets canvas height.
	 *
	 * @param  {!number} height New canvas height.
	 */
	setHeight: function(height) {
		this.canvas.height = height;
		this.halfHeight = height / 2;
	},
	// Canvas element
	/**
	 * @public
	 */
	toDataURL: function(type, args) {
		return this.canvas.toDataURL(type, args);
	},
	/**
	 * Gets canvas context.
	 *
	 * @return {!CanvasRenderingContext2D} Canvas context.
	 */
	getContext: function() {
		return this.context;
	},
	// 2D Context
	/**
	 * Saves the state of the canvas.
	 *
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	save: function() {
		this.context.save();
		return this;
	},
	/**
	 * Restores a saved state.
	 *
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	restore: function() {
		this.context.restore();
		return this;
	},
	// Transformations
	/**
	 * Scales the canvas. Not the DOM element. Equivalent
	 *   to apply a scale matrix.
	 *
	 * @param  {!number} x X scale.
	 * @param  {!number} y Y scale.
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	scale: function(x, y) {
		this.context.scale(x, y);
		return this;
	},
	/**
	 * Rotates the canvas. Not the DOM element. Equivalent
	 *   to apply a rotation matrix.
	 *
	 * @param  {!number} angle Angle to rotate.
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	rotate: function(angle) {
		this.context.rotate(angle);
		return this;
	},
	/**
	 * Translate the canvas. Not the DOM element. Equivalent
	 *   to apply a translation matrix.
	 *
	 * @param  {!number} x Translation in the X axis.
	 * @param  {!number} y Translation in the Y axis.
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	translate: function(x, y) {
		this.context.translate(x, y);
		return this;
	},
	/**
	 * Sets a transformation matrix.
	 *
	 * @param  {!number} m11 Element.
	 * @param  {!number} m12 Element.
	 * @param  {!number} m21 Element.
	 * @param  {!number} m22 Element.
	 * @param  {!number} dx Element.
	 * @param  {!number} dy Element.
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	transform: function(m11, m12, m21, m22, dx, dy) {
		this.context.transform(m11, m12, m21, m22, dx, dy);
		return this;
	},
	// Image drawing
	/**
	 * Draws an image to the canvas.
	 *
	 * @param {!(HTMLImageElement|HTMLCanvasElement|HTMLVideoElement)}
	 *   image Image to draw.
	 * @param {!number} dx Destination x
	 * @param {!number} dy Destination y
	 * @param {!number} dw Destination width
	 * @param {!number} dh Destination height
	 * @param {!number} sx Source x
	 * @param {!number} sy Source y
	 * @param {!number} sw Source width
	 * @param {!number} sh Source height
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	drawImage: function(image, sx, sy, sw, sh, dx, dy, dw, dh) {
		this.context.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
		return this;
	},
	// Compositing
	/**
	 * Sets the global alpha property.
	 *
	 * @param  {!number} value New alpha value.
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	setGlobalAlpha: function(value) {
		this.context.globalAlpha = value;
		return this;
	},
	/**
	 * Performs a composition operation, according to a flag. The
	 *   available flags are:
	 *   <ul>
	 *   <li>source-over
	 *   <li>source-in
	 *   <li>source-out
	 *   <li>source-atop
	 *   <li>destination-over
	 *   <li>destination-in
	 *   <li>destination-out
	 *   <li>destination-atop
	 *   <li>lighter
	 *   <li>copy
	 *   <li>xor
	 *
	 * @param  {!string} flag An valid flag.
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	globalCompositeOperation: function(flag) {
		this.context.globalCompositeOperation = flag;
		return this;
	},
	// Lines
	/**
	 * Sets the line width
	 *
	 * @param  {!number} value New line width value.s
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	setLineWidth: function(value) {
		this.context.lineWidth = value;
		return this;
	},
	/**
	 * Sets the type of line cap. The available options are:
	 *   <ul>
	 *   <li>butt
	 *   <li>round
	 *   <li>square
	 *
	 * @param  {!string} value A valid line cap option.
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	setLineCap: function(value) {
		this.context.lineCap = value;
		return this;
	},
	/**
	 * Sets the line join. The available options are:
	 *   <ul>
	 *   <li>round
	 *   <li>bevel
	 *   <li>miter
	 *
	 * @param  {!string} value A valid line join option.
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	setLineJoin: function(value) {
		this.context.lineJoin = value;
		return this;
	},
	/**
	 * Sets the miter limit.
	 *
	 * @param  {!number} value Miter limit value.
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	setMiterLimit: function(value) {
		this.context.miterLimit = value;
		return this;
	},
	/** Colors **/
	/**
	 * Sets the stroke style.
	 *
	 * @param  {!string} value Stroke color. In a valid CSS3 format.
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	setStrokeStyle: function(value) {
		this.context.strokeStyle = value;
		return this;
	},
	/**
	 * Sets the fill style.
	 *
	 * @param  {!string} value Fill color. In a valid CSS3 format.
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	setFillStyle: function(value) {
		this.context.fillStyle = value;
		return this;
	},
	/**
	 * Sets the shadow offset in the x axis.
	 *
	 * @param  {!number} value Shadow offset, at the x axis
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	setShadowOffsetX: function(value) {
		this.context.shadowOffsetX = value;
		return this;
	},
	/**
	 * Sets the shadow offset in the y axis.
	 *
	 * @param  {!number} value Shadow offset, at the y axis.
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	setShadowOffsetY: function(value) {
		this.context.shadowOffsetY = value;
		return this;
	},
	/**
	 * Sets the shadow blur value.
	 *
	 * @param  {!number} value Shadow blur.
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	setShadowBlur: function(value) {
		this.context.shadowBlur = value;
		return this;
	},
	/**
	 * Sets the shadow color.
	 *
	 * @param  {!string} value Shadow color in a valid CSS3 format.
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	setShadowColor: function(value) {
		this.context.shadowColor = value;
		return this;
	},
	/**
	 * Creates a line gradient in the canvas.
	 *
	 * @param  {!number} x0 Start x.
	 * @param  {!number} y0 Start y.
	 * @param  {!number} x1 End x.
	 * @param  {!number} y1 End y.
	 * @return {?CanvasGradient} Result gradient.
	 */
	createLinearGradient: function(x0, y0, x1, y1) {
		return this.context.createLinearGradient(x0, y0, x1, y1);
	},
	/**
	 * Creates a radial gradient.
	 *
	 * @param  {!number} x0 X.
	 * @param  {!number} y0 Y.
	 * @param  {!number} r0 Radius.
	 * @param  {!number} x1 X.
	 * @param  {!number} y1 Y.
	 * @param  {!number} r1 Radius.
	 * @return {?CanvasGradient} Result gradient.
	 */
	createRadialGradient: function(x0, y0, r0, x1, y1, r1) {
		return this.context.createRadialGradient(x0, y0, r0, x1, y1, r1);
	},
	/**
	 * Creates a pattern. There are 4 available options:
	 *   <ul>
	 *   <li>repeat
	 *   <li>repeat-x
	 *   <li>repeat-y
	 *   <li>no-repeat
	 *
	 * @param  {?(HTMLImageElement|HTMLCanvasElement)}
	 *   image Image
	 * @param  {!string} repetition Valid repetition.
	 * @return {?CanvasPattern} Result pattern.
	 */
	createPattern: function(image, repetition) {
		return this.context.createPattern(image, repetition);
	},
	// Paths
	/**
	 * Starts a path.
	 *
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	beginPath: function() {
		this.context.beginPath();
		return this;
	},
	/**
	 * Closes a path.
	 *
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	closePath: function() {
		this.context.closePath();
		return this;
	},
	/**
	 * Fills the canvas.
	 *
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	fill: function() {
		this.context.fill();
		return this;
	},
	/**
	 * Stroke the canvas.
	 *
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	stroke: function() {
		this.context.stroke();
		return this;
	},
	/**
	 * Clips the canvas
	 *
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	clip: function() {
		this.context.clip();
		return this;
	},
	/**
	 * Moves to a position to start a line/shape.
	 *
	 * @param  {!number} x X coordinate.
	 * @param  {!number} y Y coordinate.
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	moveTo: function(x, y) {
		this.context.moveTo(x, y);
		return this;
	},
	/**
	 * Creates a line to a position.
	 *
	 * @param  {!number} x End x coordinate.
	 * @param  {!number} y End y coordinate.
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	lineTo: function(x, y) {
		this.context.lineTo(x, y);
		return this;
	},
	/**
	 * Creates a quadratic curve.
	 *
	 * @param  {!number} cpx CPX.
	 * @param  {!number} cpy CPY
	 * @param  {!number} x X.
	 * @param  {!number} y Y.
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	quadraticCurveTo: function(cpx, cpy, x, y) {
		this.context.quadraticCurveTo(cpx, cpy, x, y);
		return this;
	},
	/**
	 * Creates a bezier curve.
	 *
	 * @param  {!number} cp1x CP1X.
	 * @param  {!number} cp1y CP1Y.
	 * @param  {!number} cp2x CP2X.
	 * @param  {!number} cp2y CP2Y.
	 * @param  {!number} x X.
	 * @param  {!number} y Y.
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	bezierCurveTo: function(cp1x, cp1y, cp2x, cp2y, x, y) {
		this.context.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
		return this;
	},
	/**
	 * Creates an arc to a position.
	 *
	 * @param  {!number} x1 Start x.
	 * @param  {!number} y1 Start y.
	 * @param  {!number} x2 End x.
	 * @param  {!number} y2 End y.
	 * @param  {!number} radius Radius of the arc.
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	arcTo: function(x1, y1, x2, y2, radius) {
		this.context.arcTo(x1, y1, x2, y2, radius);
		return this;
	},
	/**
	 * Creates an arc.
	 *
	 * @param  {!number} x Center x.
	 * @param  {!number} y Center y.
	 * @param  {!number} radius Arc radius.
	 * @param  {!number=} startAngle Start angle.
	 * @param  {!number=} endAngle End angle.
	 * @param  {!boolean=} CCW True for counter clock wise.
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	arc: function(x, y, radius, startAngle, endAngle, CCW) {
		this.context.arc(x, y, radius, startAngle || 0, endAngle || Grape2D.Math.PIx2, CCW || false);
		return this;
	},
	/**
	 * Creates a rectangle.
	 *
	 * @param  {!number} x X coordinate of the top left corner.
	 * @param  {!number} y Y coordinate of the top left corner.
	 * @param  {!number} w Width of the rectangle.
	 * @param  {!number} h Height of the rectangle.
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	rect: function(x, y, w, h) {
		this.context.rect(x, y, w, h);
		return this;
	},
	/**
	 * Checks if the point is in the current path.
	 *
	 * @param  {!number} x X coordinate.
	 * @param  {!number} y Y coordinate.
	 * @return {!boolean} True if it's in the path.
	 */
	isPointInPath: function(x, y) {
		return this.context.isPointInPath(x, y);
	},
	// Text
	/**
	 * Sets the font type.
	 *
	 * @param  {!string} font New font.
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	setFont: function(font) {
		this.context.font = font;
		return this;
	},
	/**
	 * Set the text align. The available options are:
	 *   <ul>
	 *   <li>start
	 *   <li>end
	 *   <li>left
	 *   <li>right
	 *   <li>center
	 *
	 * @param  {!string} value A valid align option.
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	setTextAlign: function(value) {
		this.context.textAlign = value;
		return this;
	},
	/**
	 * Sets the baseline. The available options are:
	 *   <ul>
	 *   <li>top
	 *   <li>hanging
	 *   <li>middle
	 *   <li>alphabetic
	 *   <li>ideographic
	 *   <li>bottom
	 *
	 * @param  {!string} baseline A valid option.
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	setTextBaseline: function(baseline) {
		this.context.textBaseline = baseline;
		return this;
	},
	/**
	 * Fills the text.
	 *
	 * @param  {!string} text Text to fill.
	 * @param  {!number} x X.
	 * @param  {!number} y Y.
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	fillText: function(text, x, y) {
		this.context.fillText(text, x, y);
		return this;
	},
	/**
	 * Stroke text.
	 *
	 * @param  {!string} text Text to stroke.
	 * @param  {!number} x X.
	 * @param  {!number} y Y.
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	strokeText: function(text, x, y) {
		this.context.strokeText(text, x, y);
		return this;
	},
	/**
	 * Measures a text.
	 *
	 * @param  {!string} text Text to measure.
	 * @return {?TextMetrics} Text metrics
	 */
	measureText: function(text) {
		return this.context.measureText(text);
	},
	// Rectangles
	/**
	 * Clears a rectangle.
	 *
	 * @param  {!number} x Start x.
	 * @param  {!number} y Start y.
	 * @param  {!number} w Width.
	 * @param  {!number} h Height.
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	clearRect: function(x, y, w, h) {
		this.context.clearRect(x, y, w, h);
		return this;
	},
	/**
	 * Fills a rectangle.
	 *
	 * @param  {!number} x Start x.
	 * @param  {!number} y Start y.
	 * @param  {!number} w Width.
	 * @param  {!number} h Height.
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	fillRect: function(x, y, w, h) {
		this.context.fillRect(x, y, w, h);
		return this;
	},
	/**
	 * Strokes a rectangle.
	 *
	 * @param  {!number} x Start x.
	 * @param  {!number} y Start y.
	 * @param  {!number} w Width.
	 * @param  {!number} h Height.
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	strokeRect: function(x, y, w, h) {
		this.context.strokeRect(x, y, w, h);
		return this;
	},
	/** Pixel manipulation **/
	/**
	 * Creates an image data.
	 *
	 * @param  {!number} sw Source width.
	 * @param  {!number} sh Source height.
	 * @return {?ImageData} Image data.
	 */
	createImageData: function(sw, sh) {
		return this.context.createImageData(sw, sh);
	},
	/**
	 * Gets canvas data as an image.
	 *
	 * @param  {!number} sx Source x.
	 * @param  {!number} sy Source y.
	 * @param  {!number} sw Source width.
	 * @param  {!number} sh Source height.
	 * @return {?ImageData} Image data.
	 */
	getImageData: function(sx, sy, sw, sh) {
		return this.context.getImageData(sx, sy, sw, sh);
	},
	/**
	 * Puts image data into the canvas.
	 *
	 * @param  {!ImageData} imageData Image data.
	 * @param  {!number} dx Destination x.
	 * @param  {!number} dy Destination y.
	 * @param  {!number} dirtyX Dirty x.
	 * @param  {!number} dirtyY Dirty y.
	 * @param  {!number} dirtyWidth Dirty width.
	 * @param  {!number} dirtyHeight Dirty height.
	 * @return {?Grape2D.Canvas} This canvas.
	 */
	putImageData: function(imageData, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight) {
		this.context.putImageData(imageData, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight);
		return this;
	},
	/**
	 * Resizes the canvas.
	 *
	 * @param  {!number} w New width.
	 * @param  {!number} h New height.
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	resize: function(w, h) {
		this.setWidth(w);
		this.setHeight(h);
		return this;
	},
	/**
	 * Appends canvas to a DOM element.
	 *
	 * @param  {!Element} on Element to append to.
	 * @return {!Grape2D.Canvas} This canvas.
	 */
	appendOn: function(on) {
		on.appendChild(this.canvas);
		return this;
	},
	/**
	 * Clears the canvas.
	 */
	clear: function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
};