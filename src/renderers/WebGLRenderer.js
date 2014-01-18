/**
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
	this.gl.viewportWidth = this.width;
	this.gl.viewportHeight = this.height;

	this.clearColor = options.clearColor || new Grape2D.Color();
	this.gl.clearColor(this.clearColor.getR(), this.clearColor.getG(), this.clearColor.getB(), this.clearColor.getA());

	this.clearFlag = options.depthBuffer ? (this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT) : this.gl.COLOR_BUFFER_BIT;

	this.buffer = this.gl.createBuffer();

	/**
	 * Shader program in use.
	 *
	 * @type {!Grape2D.WebGLProgram}
	 * @private
	 */
	this.shaderProgram; // = new Grape2D.WebGLProgram(document.getElementById("textureVertexShader").textContent, document.getElementById("textureFragmentShader").textContent);
	this.textureShaderProgram = options.textureShaderProgram || Grape2D.WebGLProgram.createTextureDefault();
	this.colorShaderProgram = options.colorShaderProgram || Grape2D.WebGLProgram.createColorDefault();

	this.modelView = new Grape2D.MatrixStack();
	this.projection = new Grape2D.Matrix();
	this.projNCam = new Grape2D.Matrix();

	this.color = new Grape2D.Color([0, 255, 0, 1]);

	this.camera = null;

	var that = this;
	this.canvas.addEventListener("resize", function() {
		that.init();
	}, false);

	this.colorMode = this.gl.LINE_LOOP;

	this.initShaders();
	this.init();
};
Grape2D.WebGLRenderer.prototype = Object.create(Grape2D.Renderer.prototype);
Grape2D.WebGLRenderer.prototype.setClearColor = function(color) {
	this.clearColor.set(color);
};
Grape2D.WebGLRenderer.prototype.init = function() {
	this.projection = Grape2D.Matrix.createFromScale(2 / this.width, 2 / this.height);
};
Grape2D.WebGLRenderer.prototype.initShaders = function() {
	//this.shaderProgram.compile(this.gl).use();
	this.textureShaderProgram.compile(this.gl).use();
	this.colorShaderProgram.compile(this.gl).use();
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
Grape2D.WebGLRenderer.prototype.generateTextureBuffer = function(texture) {
	var gl = this.gl;
	texture.glBuffer = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture.glBuffer);
	//gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.getBuffer());
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
};
Grape2D.WebGLRenderer.prototype.changeShader = function(shader) {
	shader.use();
	this.shaderProgram = shader;
};
/**
 * @override
 */
Grape2D.WebGLRenderer.prototype.renderTexture = function(texture, camera, temp) {
	this.changeShader(this.textureShaderProgram);
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

	this.shaderProgram.setUniform("textureCenter", temp);

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
	/*obj.getTexture().render(this, camera.wcsToViewport(this, pos));*/
	return;
};
/**
 * @override
 */
Grape2D.WebGLRenderer.prototype.renderAABB = function(aabb, camera) {
	this.changeShader(this.colorShaderProgram);
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
	this.lineRender(new Float32Array(temp), 4, camera);
	this.modelView.pop();
};
/**
 * @override
 */
Grape2D.WebGLRenderer.prototype.renderCircle = function(circle, camera) {
	this.changeShader(this.colorShaderProgram);
	var n = Grape2D.WebGLRenderer.CIRCLE_PRECISION,
		g, n1 = 1 / n,
		temp = [];
	for (var i = 0; i < n; i++) {
		g = (i * n1) * Grape2D.Math.PIx2;
		temp.push(circle.radius * Math.cos(g), circle.radius * Math.sin(g));
	}
	this.modelView.pushIdentity().translate(circle.getPosition());
	this.lineRender(new Float32Array(temp), n, camera);
	this.modelView.pop();
	this.renderPoint(circle.getPosition());
};
Grape2D.WebGLRenderer.prototype.lineRender = function(vertexList, n, camera, flag) {
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
	this.gl.bufferData(this.gl.ARRAY_BUFFER, vertexList, this.gl.STATIC_DRAW);
	this.shaderProgram.setAttribute("vertexPosition");
	this.setMatrixUniforms();
	this.gl.drawArrays(flag || this.gl.LINE_LOOP, 0, n);
};
Grape2D.WebGLRenderer.prototype.setMatrixUniforms = function() {
	this.shaderProgram.setUniform("rendererProjectionMatrix", this.projection);
	this.shaderProgram.setUniform("cameraProjectionMatrix", this.camera.getProjection());
	this.shaderProgram.setUniform("modelViewMatrix", this.modelView.getHead());
	//this.shaderProgram.setUniform("vertexColor", this.color.getRaw());
};
/**
 * @override
 */
Grape2D.WebGLRenderer.prototype.renderPolygon = function(polygon, camera) {
	this.changeShader(this.colorShaderProgram);
	this.modelView.pushIdentity().translate(polygon.getPosition());
	var polyVert = polygon.getVertexList(),
		l = polyVert.length,
		verteces = [];
	for (var i = 0; i < l; i++) {
		verteces.push(polyVert[i].getX(), polyVert[i].getY());
	}
	this.lineRender(new Float32Array(verteces), l, camera);
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
Grape2D.WebGLRenderer.prototype.getColor = function() {
	return this.color;
};
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
	this.changeShader(this.colorShaderProgram);
	var verteces = new Float32Array([start.getX(), start.getY(), end.getX(), end.getY()]);
	this.lineRender(verteces, 2, camera, this.gl.LINES);
};
/**
 * @override
 */
Grape2D.WebGLRenderer.prototype.renderPoint = function(point, camera) {
	this.changeShader(this.colorShaderProgram);
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
	this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([point.getX(), point.getY()]), this.gl.STATIC_DRAW);
	this.shaderProgram.setAttribute("vertexPosition");
	this.setMatrixUniforms();
	this.gl.drawArrays(this.gl.POINTS, 0, 1);
};
Grape2D.WebGLRenderer.CIRCLE_PRECISION = 32;