/**
 * Grape2D.WebGLProgram class.
 *
 * @constructor
 */
Grape2D.WebGLProgram = function(vertexShaderStr, fragmentShaderStr) {
	this.compiled = null;
	this.gl = null;

	this.vertexShader = vertexShaderStr;
	this.fragmentShader = fragmentShaderStr;

	this.cache = {
		uniform: {},
		attribute: {}
	};
};

Grape2D.WebGLProgram.prototype = {
	constructor: Grape2D.WebGLProgram,
	compileShader: function(shaderStr, gl, type) {
		var shader = gl.createShader(type);
		gl.shaderSource(shader, shaderStr);
		gl.compileShader(shader);
		return shader;
	},
	setUniform: function(name, a, b, c, d) {
		//console.log("uniform:" + name);
		this.cache.uniform[name].set(a, b, c, d);
	},
	setAttribute: function(name, a, b, c, d) {
		//console.log("attribute:" + name);
		//debugger;
		this.cache.attribute[name].set(a, b, c, d);
	},
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

		var rg = /(attribute|uniform) ((?:(([i|b])?vec|mat)([2|3|4]))|int|unsigned int|float|bool|sampler2D|samplerCube) ([\w|\d|_]+);[ \t]*(?:(?:(?:\/\/)|(?:\/\*))[ \t]*([v|e]*)[ \t]*(?:\*\/)?)?/g;
		var isV = false,
			resultado,
			resMapped = {
				attrUnif: null,
				completeType: null,
				type: null,
				intBool: null,
				typeNum: null,
				name: null,
				enableVAtt: false,
				array: false
			};
		//console.log("start");
		while ((resultado = rg.exec(wShader)) !== null) {
			//console.log(resultado);

			resMapped.attrUnif = resultado[1];
			resMapped.completeType = resultado[2];
			resMapped.type = resultado[3];
			resMapped.intBool = resultado[4];
			resMapped.typeNum = resultado[5];
			resMapped.name = resultado[6];
			resMapped.enableVAtt = resultado[7] && resultado[7].indexOf("e") != -1;
			resMapped.array = resultado[7] && resultado[7].indexOf("v") != -1;

			//this.cache[resultado[1]][resultado[6]] = Grape2D.WebGLProgram.buildAttrUnifCache(gl, shaderProgram, resultado[1], resultado[4], resultado[3], resultado[5], resultado[2], resultado[6], resultado[7], resultado[1] == "attribute" && resultado[8] == "e");

			//console.log(Grape2D.WebGLProgram.buildAttrUnifCache__(gl, shaderProgram, resMapped));
			this.cache[resultado[1]][resultado[6]] = Grape2D.WebGLProgram.buildAttrUnifCache__(gl, shaderProgram, resMapped);
			/*if (resultado[1] == "attribute" && resultado[8] == "e") {
				gl.enableVertexAttribArray(this.cache[resultado[1]][resultado[6]].id);
			}*/
		};
		//console.log("end");

		return this;
	},
	isCompiled: function() {
		return this.compile != null;
	},
	use: function() {
		this.gl.useProgram(this.compiled);
		return this;
	},
	getCachedUniform: function(uniform) {
		return this.cache.uniform[uniform];
	},
	getCachedAttribute: function(attribute) {
		return this.cache.attribute[attribute];
	}
};
Grape2D.WebGLProgram.createDefault = function() {
	return new Grape2D.WebGLProgram(document.getElementById("vertexShader").textContent, document.getElementById("fragmentShader").textContent);
};
Grape2D.WebGLProgram.createColorDefault = function() {
	return new Grape2D.WebGLProgram(document.getElementById("colorVertexShader").textContent, document.getElementById("colorFragmentShader").textContent);
};
Grape2D.WebGLProgram.createTextureDefault = function() {
	return new Grape2D.WebGLProgram(document.getElementById("textureVertexShader").textContent, document.getElementById("textureFragmentShader").textContent);
};
/**
 * Parses the shaders as a string. It can parse one or more shaders,
 *   retrieving its uniforms and attributes, the name of them, the
 *   setting function and (in case of an attribute) returns the if an
 *   <code>enableVertexAttrib</code> is necessary. To set the last
 *   feature and to set the setting type as an array, a comment must
 *   be provided in front of the attribute/uniform, it can be both an
 *   inline or a multiple line comment.
 * <ol>
 * 	<li>setting as an array - v
 * 	<li>enable vertex attribute - e
 * </ol>
 * They must be in the order above and and must be the first characters of the comment.
 *
 * @param  {!string} shaderStr A valid shader.
 * @return {!Object.<!string|!Array.<!string|!(string|boolean)>>} An
 *   object with the valid attributes and uniforms, and it's data.
 * @public
 * @static
 */
/*Grape2D.WebGLProgram.parseShader = function(shaderStr) {
	var fnR = {
		uniform: [],
		attribute: []
	};

	function buildSetting(name, ib, vecMatType, vecMatNum, type, varName, isV) {
		var id;
		if (name == "attribute") {
			id = gl.getAttribLocation(varName);
		} else {
			id = gl.getUniformLocation(varName);
		}
		var isVstr = (isV == "v" ? "v" : "");
		if (vecMatType) {
			if (vecMatType == "mat") {
				return name + "Matrix" + vecMatNum + "fv";
				fn = function(value) {
					return gl.setFn(id, false, value);
				};
			} else {
				return name + vecMatNum + (ib ? "ui" : "f") + isVstr;
				if (isVstr) {
					fn = function(value) {
						return gl.setFn(id, value);
					};
				} else {
					switch (vecMatNum) {
						case 2:
							fn = function(value1, value2) {
								return gl.setFn(id, value1, value2);
							};
							break;
						case 3:
							fn = function(value1, value2, value3) {
								return gl.setFn(id, value1, value2, value3);
							};
							break;
						case 4:
							fn = function(value1, value2, value3, value4) {
								return gl.setFn(id, value1, value2, value3, value4);
							};
							break;
						default:
							fn = function(value) {
								return gl.setFn(id, value);
							};
					};
				}
			}
		} else {
			return name + "1" + ((type[0] == "u" || type[0] == "b") ? "ui" : ((type == "sampler2D" || type == "samplerCube") ? "i" : type[0])) + isVstr;
			fn = function(value) {
				return gl.setFn(id, value);
			};
		}
	};
	var isV = false;
	for (var resultado, rg = /(attribute|uniform) ((?:(([i|b])?vec|mat)([2|3|4]))|int|unsigned int|float|bool|sampler2D|samplerCube) ([\w|\d|_]+);[ \t]*(?:(?:(?:\\\\)|(?:\\\*))[ \t]*(v?)(e?)[ \t]*(?:\*\/)?)?/g;
		(resultado = rg.exec(str)) !== null;) {
		fnR[resultado[1]].push({
			type: resultado[2],
			name: resultado[3],
			setting: buildSetting(resultado[1], resultado[4], resultado[3], resultado[5], resultado[2], resultado[6], resultado[7]),
			enableVertexAttrib: (resultado[1] == "attribute" && resultado[8] == "e")
		});
	}
	return fnR;
};*/
Grape2D.WebGLProgram.buildAttrUnifCache = function(gl, shaderProgram, name, ib, vecMatType, vecMatNum, type, varName, isV) {
	var id, fn, setFn;
	if (name == "attribute") {
		id = gl.getAttribLocation(shaderProgram, varName);
	} else {
		id = gl.getUniformLocation(shaderProgram, varName);
	}
	if (id == -1) {
		return;
	}
	var isVstr = (isV == "v" ? "v" : "");
	if (vecMatType) {
		if (vecMatType == "mat") {
			setFn = name + "Matrix" + vecMatNum + "fv";
			fn = function(value) {
				return gl[setFn](id, false, value);
			};
		} else {
			setFn = name + vecMatNum + (ib ? "ui" : "f") + isVstr;
			if (isVstr) {
				fn = function(value) {
					return gl[setFn](id, value);
				};
			} else {
				switch (vecMatNum) {
					case 2:
						fn = function(value1, value2) {
							return gl[setFn](id, value1, value2);
						};
						break;
					case 3:
						fn = function(value1, value2, value3) {
							return gl[setFn](id, value1, value2, value3);
						};
						break;
					case 4:
						fn = function(value1, value2, value3, value4) {
							return gl[setFn](id, value1, value2, value3, value4);
						};
						break;
					default:
						fn = function(value) {
							return gl[setFn](id, value);
						};
				}
			}
		}
	} else {
		setFn = name + "1" + ((type[0] == "u" || type[0] == "b") ? "ui" : ((type == "sampler2D" || type == "samplerCube") ? "i" : type[0])) + isVstr;
		fn = function(value) {
			return gl[setFn](id, value);
		};
	}
	return {
		id: id,
		set: fn
	};
};

Grape2D.WebGLProgram.buildAttrUnifCache__ = function(gl, shaderProgram, result) {
	var id, fn, setFn, num = Number(result.typeNum ? result.typeNum : 1),
		attrUnif = result.attrUnif;
	if (result.attrUnif == "attribute") {
		id = gl.getAttribLocation(shaderProgram, result.name);
		if (result.enableVAtt && id >= 0) {
			gl.enableVertexAttribArray(id);
			return {
				id: id,
				set: function(stride, offset) {
					gl.vertexAttribPointer(id, num, gl.FLOAT, false, stride || 0, offset || 0);
				},
				setStr: "vertexAttribPointer"
			}
		}
		attrUnif = "vertexAttrib";
	} else {
		id = gl.getUniformLocation(shaderProgram, result.name);
	}
	if (id == -1) {
		return;
	}
	//console.log(result, result.type, result.name);
	switch (result.type) {
		case "mat":
			setFn = attrUnif + "Matrix" + num + "fv";
			fn = function(value) {
				return gl[setFn](id, false, value);
			};
			break;
		case "vec":
			setFn = attrUnif + num + (result.intBool ? "ui" : "f") + (result.array ? "v" : "");
			switch (num) {
				case 2:
					fn = function(value1, value2) {
						return gl[setFn](id, value1, value2);
					};
					break;
				case 3:
					fn = function(value1, value2, value3) {
						return gl[setFn](id, value1, value2, value3);
					};
					break;
				case 4:
					fn = function(value1, value2, value3, value4) {
						return gl[setFn](id, value1, value2, value3, value4);
					};
					break;
				default:
					fn = function(value) {
						return gl[setFn](id, value);
					};
			}
			if (result.array) {
				fn = function(value) {
					return gl[setFn](id, value);
				}
			}
			break;
		default:
			var typeStart = result.completeType.charAt(0);
			setFn = attrUnif + "1" + ((typeStart == "u" || typeStart == "b") ? "ui" : ((result.completeType == "sampler2D" || result.completeType == "samplerCube") ? "i" : typeStart)) + (result.array ? "v" : "");
			fn = function(value) {
				return gl[setFn](id, value);
			};
	}
	//console.log(setFn);
	return {
		id: id,
		set: fn,
		setStr: setFn
	};
};

Grape2D.WebGLProgram.G2D_SPECIFIC_FN = [
	"mat4 grape2DMatrixToMat4(mat3 m){",
	"return mat4(m[0][0], m[0][1], 0, m[0][2], m[1][0], m[1][1], 0, m[1][2], 0, 0, 1, 0, m[2][0], m[2][1], 0, m[2][2]);",
	"}"
].join("\n");