/**
 * This renders the objects to a canvas element, with a WebGL context.
 *   This method is hardware accelerated, and should be much faster
 *   than it counter part {@link Grape2D.CanvasRenderer}.
 *
 * @param {Object.<!number,?>=} options Setup options.
 * @param {!number=} options.width Width of the renderer.
 * @param {!number=} options.height Height of the renderer.
 * @param {!Grape2D.Color=} options.clearColor Clear color of the
 *   renderer.
 * @param {!boolean=} options.depthBuffer Enables depth buffer.
 * @param {!Grape2D.WebGLProgram=} options.colorShaderProgram Color
 *   program to be used to render {@link Grape2D.IShape}'s. If none is
 *   provided <code>Grape2D.WebGLProgram.createColorDefault()</code>
 *   is used.
 * @param {!Grape2D.WebGLProgram=} options.textureShaderProgram Color
 *   program to be used to render {@link Grape2D.ITexture}'s. If none
 *   is provided <code>Grape2D.WebGLProgram.createTextureDefault()
 *   </code> is used.
 * @implements {Grape2D.Renderer}
 * @constructor
 */
Grape2D.WebGLRenderer = function(options) {
	options = options || {};
	/**
	 * Width of the renderer. The default value is 800.
	 *
	 * @type {!number}
	 * @private
	 */
	this.width = options.width || 800;
	/**
	 * Height of the renderer. The default value is 600.
	 *
	 * @type {!number}
	 * @private
	 */
	this.height = options.height || 600;
	/**
	 * Raw canvas DOM element.
	 *
	 * @type {!Element}
	 * @protected
	 */
	this.canvas = document.createElement("canvas");
	this.canvas.width = this.width;
	this.canvas.height = this.height;

	/**
	 * WebGL context.
	 *
	 * @type {!WebGLRenderingContext}
	 */
	this.gl = this.canvas.getContext("webgl");

	/**
	 * Renderer's clear color.
	 *
	 * @type {!Grape2D.Color}
	 * @private
	 */
	this.clearColor = options.clearColor || new Grape2D.Color();
	this.gl.clearColor(this.clearColor.getR(), this.clearColor.getG(), this.clearColor.getB(), this.clearColor.getA());

	/**
	 * Clear flag. This allows to switch choose between painter's or
	 *   z-buffer algorithm.
	 *
	 * @type {!number}
	 * @private
	 */
	this.clearFlag = options.depthBuffer ? (this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT) : this.gl.COLOR_BUFFER_BIT;

	/**
	 * General purpose buffer.
	 *
	 * @type {!WegGLBuffer}
	 * @private
	 */
	this.buffer = this.gl.createBuffer();

	/**
	 * Shader program in use.
	 *
	 * @type {Grape2D.WebGLProgram}
	 * @private
	 */
	this.shaderProgram = null;
	/**
	 * The shader program to be used to render textures.
	 *
	 * @type {!Grape2D.WebGLProgram}
	 * @private
	 */
	this.textureShaderProgram = (options.textureShaderProgram || Grape2D.WebGLProgram.createTextureDefault()).compile(this.gl);
	/**
	 * The shader program to be used to render shapes.
	 *
	 * @type {!Grape2D.WebGLProgram}
	 * @private
	 */
	this.colorShaderProgram = (options.colorShaderProgram || Grape2D.WebGLProgram.createColorDefault()).compile(this.gl);

	/**
	 * Model view matrix stack.
	 *
	 * @type {!Grape2D.MatrixStack}
	 * @private
	 */
	this.modelView = new Grape2D.MatrixStack();
	/**
	 * Renderer's projection matrix. This is calculated when the
	 *   renderer is created and whenever it's resized.
	 *
	 * @type {!Grape2D.Matrix}
	 * @private
	 */
	this.projection = new Grape2D.Matrix();

	/**
	 * Color mode represents a fill or stroke mode to be applied when
	 *   rendering/coloring the next {@link Grape2D.IShape}.
	 *
	 * @type {!number}
	 * @private
	 */
	this.colorMode = this.gl.LINE_LOOP;
	/**
	 * The current color to be used in the color mode.
	 *
	 * @type {!Grape2D.Color}
	 * @private
	 */
	this.color = new Grape2D.Color([0, 255, 0, 1]);

	/**
	 * The current camera in use.
	 *
	 * @type {Grape2D.Camera}
	 * @private
	 */
	this.camera = null;

	//adds the default event listener
	var that = this;
	this.canvas.addEventListener("resize", function() {
		that.updateProjection();
	}, false);

	this.updateProjection();
};
Grape2D.WebGLRenderer.prototype = Object.create(Grape2D.Renderer.prototype);
/**
 * Sets the clear color.
 *
 * @param {Grape2D.Color} color Clear color.
 * @public
 */
Grape2D.WebGLRenderer.prototype.setClearColor = function(color) {
	this.clearColor.set(color);
};
/**
 * Updates the projection matrix.
 *
 * @public
 */
Grape2D.WebGLRenderer.prototype.updateProjection = function() {
	this.projection = Grape2D.Matrix.createFromScale(2 / this.width, 2 / this.height);
};
/**
 * @override
 */
Grape2D.WebGLRenderer.prototype.getWidth = function() {
	return this.width;
};
/**
 * @override
 */
Grape2D.WebGLRenderer.prototype.getHalfWidth = function() {
	return this.width / 2;
};
/**
 * @override
 */
Grape2D.WebGLRenderer.prototype.setWidth = function(width) {
	this.width = width;
};
/**
 * @override
 */
Grape2D.WebGLRenderer.prototype.getHeight = function() {
	return this.height;
};
/**
 * @override
 */
Grape2D.WebGLRenderer.prototype.getHalfHeight = function() {
	return this.height / 2;
};
/**
 * @override
 */
Grape2D.WebGLRenderer.prototype.setHeight = function(height) {
	this.height = height;
};
/**
 * @override
 */
Grape2D.WebGLRenderer.prototype.renderColoredShape = function(shape, camera) {
	return;
};
/**
 * Generates a texture buffer. And stores it in the texture.
 *
 * @param  {!Grape2D.Texture} texture Texture to generate the buffer
 * @private
 */
Grape2D.WebGLRenderer.prototype.generateTextureBuffer = function(texture) {
	var gl = this.gl;
	texture.glBuffer = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture.glBuffer);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.getBuffer());
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
};
/**
 * Changes the current program.
 *
 * @param  {!Grape2D.WebGLProgram} program Program to use.
 * @public
 */
Grape2D.WebGLRenderer.prototype.changeProgram = function(program) {
	program.use();
	this.shaderProgram = program;
};
/**
 * @override
 */
Grape2D.WebGLRenderer.prototype.renderTexture = function(texture, camera, temp) {
	this.changeProgram(this.textureShaderProgram);
	var scale = 1,
		hw = texture.getHalfWidth(),
		hh = texture.getHalfHeight();
	var gl = this.gl;
	//texture mapping buffer
	var vertexTextureCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexTextureCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,
	]), gl.STATIC_DRAW);

	if (!texture.glBuffer) {
		this.generateTextureBuffer(texture);
	}
	//object position
	var vertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-hw, -hh, -hw, hh,
		hw, hh,
		hw, -hh
	]), gl.STATIC_DRAW);

	var vertexIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexIndexBuffer);
	var vertexIndices = [
		0, 1, 2, 0, 2, 3
	];
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndices), gl.STATIC_DRAW);

	this.shaderProgram.setUniform("textureCenter", temp.getX(), temp.getY());

	gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
	this.shaderProgram.setAttribute("vertexPosition");

	gl.bindBuffer(gl.ARRAY_BUFFER, vertexTextureCoordBuffer);
	this.shaderProgram.setAttribute("textureCoord");

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, texture.glBuffer);
	this.shaderProgram.setUniform("uSampler", 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexIndexBuffer);
	this.setMatrixUniforms();

	gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
};
/**
 * @override
 */
Grape2D.WebGLRenderer.prototype.renderObject2D = function(obj, camera) {
	obj.getTexture().render(this, camera);
};
/**
 * @override
 */
Grape2D.WebGLRenderer.prototype.renderNetworkObject2D = function(obj, pos, camera) {
	return;
};
/**
 * @override
 */
Grape2D.WebGLRenderer.prototype.renderAABB = function(aabb, camera) {
	this.changeProgram(this.colorShaderProgram);
	var temp = [
		//1,1
		aabb.getHalfWidth(), aabb.getHalfHeight(),
		//1,-1
		aabb.getHalfWidth(), -aabb.getHalfHeight(),
		//-1,-1
		-aabb.getHalfWidth(), -aabb.getHalfHeight(),
		//-1,1
		-aabb.getHalfWidth(), aabb.getHalfHeight()
	];
	this.modelView.pushIdentity().translate(aabb.getPosition());
	this.lineRender(new Float32Array(temp), 4);
	this.modelView.pop();
};
/**
 * @override
 */
Grape2D.WebGLRenderer.prototype.renderCircle = function(circle, camera) {
	this.changeProgram(this.colorShaderProgram);
	var n = Grape2D.WebGLRenderer.CIRCLE_PRECISION,
		g, n1 = 1 / n,
		temp = [];
	for (var i = 0; i < n; i++) {
		g = (i * n1) * Grape2D.Math.PIx2;
		temp.push(circle.radius * Math.cos(g), circle.radius * Math.sin(g));
	}
	this.modelView.pushIdentity().translate(circle.getPosition());
	this.lineRender(new Float32Array(temp), n);
	this.modelView.pop();
	this.renderPoint(circle.getPosition());
};
/**
 * This is the generic, lower level, method to render shapes.
 *
 * @param  {!Array.<!number>} vertexList Vertex coordinates, it
 *   contains coordinate pairs. The first is the x coordinate and the
 *   second the y coordinate. And the number of number pairs should be
 *   a multiple of two.
 * @param  {!number} n Number of verteces.
 * @param  {!number} flag Draw flag.
 * @protected
 */
Grape2D.WebGLRenderer.prototype.lineRender = function(vertexList, n, flag) {
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
	this.gl.bufferData(this.gl.ARRAY_BUFFER, vertexList, this.gl.DYNAMIC_DRAW);
	this.shaderProgram.setAttribute("vertexPosition");
	this.setMatrixUniforms();
	this.shaderProgram.setUniform("vertexColor", this.color.getR(), this.color.getG(), this.color.getB(), this.color.getA());
	this.gl.drawArrays(flag || this.gl.LINE_LOOP, 0, n);
};
/**
 * Sets matrix uniforms.
 *
 * @protected
 */
Grape2D.WebGLRenderer.prototype.setMatrixUniforms = function() {
	this.shaderProgram.setUniform("rendererProjectionMatrix", this.projection);
	this.shaderProgram.setUniform("cameraProjectionMatrix", this.camera.getProjection());
	this.shaderProgram.setUniform("modelViewMatrix", this.modelView.getHead());
};
/**
 * @override
 */
Grape2D.WebGLRenderer.prototype.renderPolygon = function(polygon, camera) {
	this.changeProgram(this.colorShaderProgram);
	this.modelView.pushIdentity().translate(polygon.getPosition());
	var polyVert = polygon.getVertexList(),
		l = polyVert.length,
		verteces = [];
	for (var i = 0; i < l; i++) {
		verteces.push(polyVert[i].getX(), polyVert[i].getY());
	}
	this.lineRender(new Float32Array(verteces), l);
	this.modelView.pop();
};
/**
 * @override
 */
Grape2D.WebGLRenderer.prototype.renderText = function(text, position) {
	//this.canvas.fillText(text, position.getX(), position.getY());
	return;
};
/**
 * @override
 */
Grape2D.WebGLRenderer.prototype.start = function(camera) {
	this.gl.viewport(0, 0, this.width, this.height);
	this.gl.clear(this.clearFlag);

	this.camera = camera;

	this.modelView.reset().pushIdentity();
};
/**
 * @override
 */
Grape2D.WebGLRenderer.prototype.end = function() {};
/**
 * @override
 */
Grape2D.WebGLRenderer.prototype.appendToDOMElement = function(elm) {
	this.canvas.appendOn(elm);
};
/**
 * @override
 */
Grape2D.WebGLRenderer.prototype.getDOMElement = function() {
	return this.canvas.canvas;
};
/**
 * Gets the 2D context of teh canvas element.
 *
 * @return {!CanvasRenderingContext2D} Canvas 2D context.
 * @public
 */
Grape2D.WebGLRenderer.prototype.getContext = function() {
	return this.gl;
};
/**
 * Gets the color in use.
 *
 * @return {!Grape2D.Color} Color.
 * @public
 */
Grape2D.WebGLRenderer.prototype.getColor = function() {
	return this.color;
};
/**
 * Sets the color to be used.
 *
 * @param {!Grape2D.Color} color Color to be used.
 * @public
 */
Grape2D.WebGLRenderer.prototype.setColor = function(color) {
	this.color.set(color);
};
/**
 * @override
 */
Grape2D.WebGLRenderer.prototype.setStrokeColorMode = function() {};
/**
 * @override
 */
Grape2D.WebGLRenderer.prototype.setFillColorMode = function() {};
/**
 * @override
 */
Grape2D.WebGLRenderer.prototype.renderParticle = function(particle, camera) {
	/*var center = camera.wcsToViewport(this, particle.getPosition());
	this.canvas.beginPath();
	this.canvas.arc(center.x, center.y, 1, 0, Grape2D.Math.PIx2, false);
	this.canvas.fill();*/
};
/**
 * @override
 */
Grape2D.WebGLRenderer.prototype.renderLineSegment = function(start, end, camera) {
	this.changeProgram(this.colorShaderProgram);
	var verteces = new Float32Array([start.getX(), start.getY(), end.getX(), end.getY()]);
	this.lineRender(verteces, 2, camera, this.gl.LINES);
};
/**
 * @override
 */
Grape2D.WebGLRenderer.prototype.renderPoint = function(point, camera) {
	this.changeProgram(this.colorShaderProgram);
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
	this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([point.getX(), point.getY()]), this.gl.STATIC_DRAW);
	this.shaderProgram.setAttribute("vertexPosition");
	this.setMatrixUniforms();
	this.gl.drawArrays(this.gl.POINTS, 0, 1);
};
/**
 * Circle precision. Still not fully implemented.
 *
 * @type {!number}
 * @public
 * @constant
 */
Grape2D.WebGLRenderer.CIRCLE_PRECISION = 32;