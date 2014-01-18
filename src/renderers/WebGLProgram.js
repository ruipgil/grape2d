/**
 * This is an higher level abstraction of a WebGKProgram. To be
 *   created it needs a vertex shader and a fragment shader. After 
 *   that it needs to be compiled by a WebGLRendering context. At 
 *   compiling it does "lower-level" compiling operations, it also 
 *   extracts the uniforms and attributes to create the right setter 
 *   functions for them. Making it very easy to send information to 
 *   the shaders. There are some kind of limitations that comes form 
 *   this:<ul>
 *   <li> Any mat3 passed should be transposed, since Grape2D's
 *     representation of matrix is row-major where WebGL is
 *     column-major.
 *   <li> mat2 and mat4 are not supported as uniforms. A "built-in"
 *     function is provided so to cast a mat3 matrix (without being
 *     transposed) to a mat4 matrix, in the vertex shader. The 
 *     function is <code>grape2DMatrixToMat4</code> and receives a
 *     mat3 and returns a mat4.
 *   <li> Matrices are not supported as attributes.
 *   </ul>
 *
 * @param {!string} vertexShaderStr Vertex shader as a string.
 * @param {!string} fragmentShaderStr Fragment shader as a string.
 * 
 * @constructor
 */
Grape2D.WebGLProgram = function(vertexShaderStr, fragmentShaderStr) {
	/**
	 * Compiled raw WebGL program. Its <code>null</code> if there was
	 *   some error
	 *
	 * @type {WebGLProgram}
	 * @private
	 */
	this.compiled = null;
	/**
	 * WebGL context associated with this program. May change after
	 *   the implementation of shared resources.
	 *
	 * @type {WebGLRenderingContext}
	 * @private
	 */
	this.gl = null;

	/**
	 * Vertex shader.
	 *
	 * @type {!string}
	 * @private
	 */
	this.vertexShader = vertexShaderStr;
	/**
	 * Fragment shader.
	 *
	 * @type {!string}
	 * @private
	 */
	this.fragmentShader = fragmentShaderStr;

	/**
	 * Cached locations and setting functions of the uniforms and
	 *   attributes of the program.
	 *
	 * @type {!Object.<!string, !Object.<!string, !(number|function)>>}
	 * @private
	 */
	this.cache = {
		uniform: {},
		attribute: {}
	};
};

Grape2D.WebGLProgram.prototype = {
	constructor: Grape2D.WebGLProgram,
	/**
	 * Compiles a single shader.
	 *
	 * @param  {!string} shaderStr Shader string.
	 * @param  {!WebGLRenderingContext} gl WebGL context.
	 * @param  {!number} type Type of the shader.
	 *
	 * @return {!WebGLShader}
	 * @protected
	 */
	compileShader: function(shaderStr, gl, type) {
		var shader = gl.createShader(type);
		gl.shaderSource(shader, shaderStr);
		gl.compileShader(shader);
		return shader;
	},
	/**
	 * Sets a uniform variable.
	 *
	 * @param {!string} name Uniform name.
	 * @param {!number} a First argument.
	 * @param {!number} b Second argument.
	 * @param {!number} c Third argument.
	 * @param {!number} d Fourth argument.
	 * @public
	 */
	setUniform: function(name, a, b, c, d) {
		this.cache.uniform[name].set(a, b, c, d);
	},
	/**
	 * Sets an attribute variable.
	 *
	 * @param {!string} name Name of the attribute.
	 * @param {!number} a First argument.
	 * @param {!number} b Second argument.
	 * @param {!number} c Third argument.
	 * @param {!number} d Fourth argument.
	 * @public
	 */
	setAttribute: function(name, a, b, c, d) {
		this.cache.attribute[name].set(a, b, c, d);
	},
	/**
	 * Compiles each shader, and a program with the two of them, also
	 *   generates the setting functions for each attribute and uniform.
	 *
	 * @param  {!WebGLRenderingContext} gl WebGL context.
	 * @return {?Grape2D.WebGLProgram} This program, if the compilation
	 *   when on without trouble, null otherwise.
	 * @public
	 */
	compile: function(gl) {
		var shaderProgram = gl.createProgram();
		var vs = Grape2D.WebGLProgram.G2D_SPECIFIC_FN +
			this.vertexShader;
		var wShader = vs + this.fragmentShader;

		gl.attachShader(shaderProgram, this.compileShader(vs, gl, gl.VERTEX_SHADER));
		gl.attachShader(shaderProgram, this.compileShader(this.fragmentShader, gl, gl.FRAGMENT_SHADER));
		gl.linkProgram(shaderProgram);
		if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
			alert("Couldn't initialize the shader program");
			return;
		} else {
			this.gl = gl;
		}
		this.compiled = shaderProgram;

		this.compileSetters(wShader);

		return this;
	},
	/**
	 * Checks if the program was compiled.
	 *
	 * @return {!boolean}
	 * @public
	 */
	isCompiled: function() {
		return this.compile != null;
	},
	/**
	 * Makes the associated WebGL context use this program.
	 *
	 * @return {!Grape2D.WebGLProgram} This object.
	 * @public
	 */
	use: function() {
		this.gl.useProgram(this.compiled);
		return this;
	},
	/**
	 * Gets the location of an uniform, given it's name.
	 *
	 * @param  {!string} uniform Uniform's name.
	 * @return {?number} Uniform id, null if it doesn't exist.
	 * @public
	 */
	getUniformLocation: function(uniform) {
		return this.cache.uniform[uniform].id;
	},
	/**
	 * Gets the location of an attribute, given it's name.
	 *
	 * @param  {!string} attribute Attributes's name.
	 * @return {?number} Attribute's id, null if it doesn't exist.
	 * @public
	 */
	getAttributeLocation: function(attribute) {
		return this.cache.attribute[attribute].id;
	}
};
/**
 * Compile set functions of the uniforms and attributes.
 *
 * @param  {!string} wShader String with the declaration of the uniforms and attributes.
 * @public
 */
Grape2D.WebGLProgram.prototype.compileSetters = function(wShader) {
	var gl = this.gl,
		asso = this.buildAssociationObject(),
		rg = /(attribute|uniform) ((?:(?:(?:[i|b])?vec|mat)(?:[2|3|4]))|int|unsigned int|float|bool|sampler2D|samplerCube) ([\w|\d|_]+);/g,
		result,
		id, type, varName, varType;
	while ((result = rg.exec(wShader)) !== null) {
		type = result[1];
		varType = result[2];
		varName = result[3];
		if (type == "attribute") {
			id = gl.getAttribLocation(this.compiled, varName);
		} else {
			id = gl.getUniformLocation(this.compiled, varName);
		}
		this.cache[type][varName] = {
			set: asso[type][varType](id),
			id: id
		};
	}
};
/**
 * Builds an association object, where the first keys represent the
 *   type (an attribute or an uniform) and the second keys represent
 *   the uniform/attribute type. The result is a function that should
 *   be called with an attribute/uniform id. That call will return the
 *   set function for that uniform/attribute.
 *
 * @return {!Object.<!string, !Object.<!string, !function>>} The
 *   association object.
 * @public
 */
Grape2D.WebGLProgram.prototype.buildAssociationObject = function() {
	var gl = this.gl,
		u1i = (function(id) {
			return (function(value) {
				gl.uniform1i(id, value);
			});
		}),
		u4vi = (function(id) {
			return (function(v1, v2, v3) {
				gl.uniform4i(id, v1, v2, v3, v4);
			});
		}),
		u3vi = (function(id) {
			return (function(v1, v2, v3) {
				gl.uniform3i(id, v1, v2, v3);
			});
		}),
		u2vi = (function(id) {
			return (function(v1, v2) {
				gl.uniform2i(id, v1, v2);
			});
		}),

		genErrorMsg = function(msg) {
			return function(id) {
				throw new Error("[id:" + id + "] " + msg);
			};
		},

		avaa1 = (function(id) {
			gl.enableVertexAttribArray(id);
			return (function(stride, offset) {
				gl.vertexAttribPointer(id, 1, gl.FLOAT, false, stride || 0, offset || 0);
			});
		}),
		avaa2 = (function(id) {
			gl.enableVertexAttribArray(id);
			return (function(stride, offset) {
				gl.vertexAttribPointer(id, 2, gl.FLOAT, false, stride || 0, offset || 0);
			});
		}),
		avaa3 = (function(id) {
			gl.enableVertexAttribArray(id);
			return (function(stride, offset) {
				gl.vertexAttribPointer(id, 3, gl.FLOAT, false, stride || 0, offset || 0);
			});
		}),
		avaa4 = (function(id) {
			gl.enableVertexAttribArray(id);
			return (function(stride, offset) {
				gl.vertexAttribPointer(id, 4, gl.FLOAT, false, stride || 0, offset || 0);
			});
		});
	return {
		"uniform": {
			"vec4": (function(id) {
				return (function(v1, v2, v3, v4) {
					gl.uniform4f(id, v1, v2, v3, v4);
				});
			}),
			"vec3": (function(id) {
				return (function(v1, v2, v3) {
					gl.uniform3f(id, v1, v2, v3);
				});
			}),
			"vec2": (function(id) {
				return (function(v1, v2) {
					gl.uniform2f(id, v1, v2);
				});
			}),
			"bvec4": u4vi,
			"bvec3": u3vi,
			"bvec2": u2vi,
			"ivec4": u4vi,
			"ivec3": u3vi,
			"ivec2": u2vi,

			"mat4": genErrorMsg("This version of Grape2D doesn't support mat4 uniforms."),
			"mat3": (function(id) {
				return (function(matrix) {
					gl.uniformMatrix3fv(id, false, matrix.getRaw());
				});
			}),
			"mat2": genErrorMsg("This version of Grape2D doesn't support mat3 uniforms."),

			"float": (function(id) {
				return (function(value) {
					gl.uniform1f(id, value);
				});
			}),
			"bool": u1i,
			"int": u1i,
			"unsigned int": u1i,
			"sampler2D": u1i,
			"samplerCube": u1i,
		},
		"attribute": {
			"vec4": avaa4,
			"vec3": avaa3,
			"vec2": avaa2,

			"bvec4": avaa4,
			"bvec3": avaa3,
			"bvec2": avaa2,

			"ivec4": avaa4,
			"ivec3": avaa3,
			"ivec2": avaa2,

			"mat4": genErrorMsg("This version of Grape2D doesn't support mat4 attributes."),
			"mat3": genErrorMsg("This version of Grape2D doesn't support mat3 attributes."),
			"mat2": genErrorMsg("This version of Grape2D doesn't support mat2 attributes."),

			"float": avaa1,
			"bool": avaa1,
			"int": avaa1,
			"unsigned int": avaa1,
			"sampler2D": avaa1,
			"samplerCube": avaa1
		}
	}
};
/**
 * Creates the default color program, to be used when filling or
 *   stroking shapes.
 *
 * @return {!Grape2D.WebGLProgram} WebGL color program.
 * @public
 * @static
 */
Grape2D.WebGLProgram.createColorDefault = function() {
	return new Grape2D.WebGLProgram(Grape2D.WebGLProgram.DEFAULT_COLOR_VS, Grape2D.WebGLProgram.DEFAULT_COLOR_FS);
};
/**
 * Creates the deafult texture program, to be used when drawing
 *   textures.
 *
 * @return {!Grape2D.WebGLProgram} WebGL texture program.
 * @public
 * @static
 */
Grape2D.WebGLProgram.createTextureDefault = function() {
	return new Grape2D.WebGLProgram(Grape2D.WebGLProgram.DEFAULT_TEXTR_VS, Grape2D.WebGLProgram.DEFAULT_TEXTR_FS);
};
/**
 * Default color vertex shader.
 *
 * @type {!string}
 * @public
 * @static
 */
Grape2D.WebGLProgram.DEFAULT_COLOR_VS = [
	"varying vec4 vColor;",
	"varying vec2 vTextureCoord;",

	"uniform mat3 rendererProjectionMatrix;",
	"uniform mat3 cameraProjectionMatrix;",
	"uniform mat3 modelViewMatrix;",
	"uniform mat3 projectionMatrix;",
	"uniform vec2 cameraPosition;",

	"uniform vec4 vertexColor;",
	"attribute vec2 vertexPosition;",

	"void main(void) {",
	"gl_PointSize = 2.0;",
	"gl_Position = ",
	"grape2DMatrixToMat4(rendererProjectionMatrix) * ",
	"grape2DMatrixToMat4(cameraProjectionMatrix) * ",
	"grape2DMatrixToMat4(modelViewMatrix) * ",
	"vec4(vertexPosition, 0.0, 1.0);",
	"vColor = vertexColor;",
	"}"
].join("\n");
/**
 * Default color fragment shader.
 *
 * @type {!string}
 * @public
 * @static
 */
Grape2D.WebGLProgram.DEFAULT_COLOR_FS = [
	"precision mediump float;",
	"varying vec4 vColor;",

	"void main(void) {",
	"gl_FragColor = vColor;",
	"}"
].join("\n");
/**
 * Default texture vertex shader.
 *
 * @type {!string}
 * @public
 * @static
 */
Grape2D.WebGLProgram.DEFAULT_TEXTR_VS = [
	"varying vec4 vColor;",
	"varying vec2 vTextureCoord;",

	"uniform mat3 rendererProjectionMatrix;",
	"uniform mat3 cameraProjectionMatrix;",
	"uniform mat3 modelViewMatrix;",
	"uniform vec2 cameraPosition;",

	"uniform vec2 textureCenter;",
	"attribute vec2 textureCoord;",
	"attribute vec2 vertexPosition;",

	"vec4 vPos;",
	"vec4 center;",

	"void main(void) {",
	"center = grape2DMatrixToMat4(rendererProjectionMatrix) * ",
	"grape2DMatrixToMat4(cameraProjectionMatrix) * ",
	"grape2DMatrixToMat4(modelViewMatrix) * ",
	"vec4(textureCenter, 0.0, 1.0);",

	"vPos = ",
	"grape2DMatrixToMat4(rendererProjectionMatrix) * ",
	"grape2DMatrixToMat4(modelViewMatrix) * ",
	"vec4(vertexPosition, 0.0, 1.0);",

	"gl_Position = vPos+center;",
	"vTextureCoord = textureCoord;",
	"}"
].join("\n");
/**
 * Default texture fragment shader.
 *
 * @type {!string}
 * @public
 * @static
 */
Grape2D.WebGLProgram.DEFAULT_TEXTR_FS = [
	"precision mediump float;",
	"varying vec2 vTextureCoord;",
	"uniform sampler2D uSampler;",

	"void main(void) {",
	"gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));",
	"}"
].join("\n");
/**
 * A vertex shader function that transforms {@link Grape2D.Matrix}
 *   into a valid GLSL 4x4 matrix representation. Basically what it is
 *   it  creates a mat4 matrix with the {@link Grape2D.Matrix}
 *   transposed, and with the translation defined.
 *
 * @type {!string}
 * @public
 * @static
 */
Grape2D.WebGLProgram.G2D_SPECIFIC_FN = [
	"mat4 grape2DMatrixToMat4(mat3 m){",
	"return mat4(m[0][0], m[0][1], 0, m[0][2], m[1][0], m[1][1], 0, m[1][2], 0, 0, 1, 0, m[2][0], m[2][1], 0, m[2][2]);",
	"}"
].join("\n");