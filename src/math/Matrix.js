/**
 * Matrix defines a 3x3 matrix indicated to deal with 2D operations.
 *   If it's instantiated with no arguments then, it becomes the
 *   identity matrix.
 *
 * @param  {!number=} aa Element of the first row and first line.
 * @param  {!number=} ab Element of the second row and first line.
 * @param  {!number=} ac Element of the third row and first line.
 * @param  {!number=} ba Element of the first row and second line.
 * @param  {!number=} bb Element of the second row and second line.
 * @param  {!number=} bc Element of the third row and second line.
 * @param  {!number=} ca Element of the first row and third line.
 * @param  {!number=} cb Element of the second row and third line.
 * @param  {!number=} cc Element of the third row and third line.
 *
 * @constructor
 */
Grape2D.Matrix = function(aa, ab, ac, ba, bb, bc, ca, cb, cc) {
	/**
	 * Matrix elements.
	 *
	 * @type {!Float32Array}
	 * @public
	 */
	this.v = new Float32Array(9);
	if (aa !== undefined) {
		this.v[0] = aa;
		this.v[1] = ab;
		this.v[2] = ac;
		this.v[3] = ba;
		this.v[4] = bb;
		this.v[5] = bc;
		this.v[6] = ca;
		this.v[7] = cb;
		this.v[8] = cc;
	} else {
		this.identity();
	}
};

Grape2D.Matrix.prototype = {
	constructor: Grape2D.Matrix,
	/**
	 * Sets the matrix with new elements.
	 *
	 * @param  {!number=} aa Element of the first row and first line.
	 * @param  {!number=} ab Element of the second row and first line.
	 * @param  {!number=} ac Element of the third row and first line.
	 * @param  {!number=} ba Element of the first row and second line.
	 * @param  {!number=} bb Element of the second row and second line.
	 * @param  {!number=} bc Element of the third row and second line.
	 * @param  {!number=} ca Element of the first row and third line.
	 * @param  {!number=} cb Element of the second row and third line.
	 * @param  {!number=} cc Element of the third row and third line.
	 * @return {!Grape2D.Matrix} This matrix.
	 * @public
	 */
	set: function(aa, ab, ac, ba, bb, bc, ca, cb, cc) {
		var tv = this.v;
		tv[0] = aa;
		tv[1] = ab;
		tv[2] = ac;

		tv[3] = ba;
		tv[4] = bb;
		tv[5] = bc;

		tv[6] = ca;
		tv[7] = cb;
		tv[8] = cc;

		return this;
	},
	/**
	 * Sets this matrix, from another one.
	 *
	 * @param {!Grape2D.Matrix} matrix Matrix to use.
	 * @return {!Grape2D.Matrix} This matrix.
	 * @public
	 */
	setFromMatrix: function(matrix){
		var mv = matrix.v;
		return this.set(
			mv[0], mv[1], mv[2],
			mv[3], mv[4], mv[5],
			mv[6], mv[7], mv[8]);
	},
	/**
	 * Adds to this matrix another one.
	 *
	 * @param  {Grape2D.Matrix} matrix Matrix to add.
	 * @return {!Grape2D.Matrix} This matrix.
	 * @public
	 */
	add: function(matrix) {
		for (var i = 0; i < 9; i++){
			this.v[i] += matrix.v[i];
		}
		return this;
	},
	/**
	 * Sets this matrix as the identity matrix.
	 *
	 * @return {!Grape2D.Matrix} This matrix.
	 * @public
	 */
	identity: function() {
		var tv = this.v;
		tv[0] = tv[4] = tv[8] = 1;
		tv[1] = tv[2] = tv[3] = tv[5] = tv[6] = tv[7] = 0;
		return this;
	},
	/**
	 * Inverts the matrix.
	 *
	 * @return {!Grape2D.Matrix} This matrix.
	 * @public
	 */
	invert: function() {
		var det = this.determinant(),
			v = this.v;
		this.v = new Float32Array([
			v[4] * v[8] - v[5] * v[7],
			v[2] * v[7] - v[1] * v[8],
			v[1] * v[5] - v[2] * v[4],

			v[5] * v[6] - v[8] * v[3],
			v[0] * v[8] - v[2] * v[6],
			v[2] * v[3] - v[0] * v[5],

			v[3] * v[7] - v[4] * v[6],
			v[1] * v[6] - v[0] * v[7],
			v[0] * v[4] - v[1] * v[3]
		]);
		return this.multiplyByScalar(1 / det);
	},
	/**
	 * Computes the determinant of the matrix.
	 *
	 * @return {!number} Determinant.
	 * @public
	 */
	determinant: function() {
		var tv = this.v;
		return tv[0] * (tv[4] * tv[8] - tv[5] * tv[7]) - tv[1] * (tv[3] * tv[8] - tv[5] * tv[6]) + tv[2] * (tv[3] * tv[7] - tv[4] * tv[6]);
	},
	/**
	 * Multiplies by a vector. Since Grape2D doesn't support 3D vectors
	 *   the third element of the vector is 1.
	 *
	 * @param  {!Grape2D.Vector} v Vector to multiply by.
	 * @return {!Grape2D.Vector} A new vector, result of the
	 *   multiplication.
	 * @public
	 */
	multiplyByVector: function(v) {
		return new Grape2D.Vector(
			this.v[0] * v.getX() + this.v[1] * v.getY() + this.v[2],
			this.v[3] * v.getX() + this.v[4] * v.getY() + this.v[5]
		);
	},
	/**
	 * Multiplies by a scalar number.
	 *
	 * @param  {!number} scalar Scalar to multiply by.
	 * @return {!Grape2D.Matrix} This matrix.
	 * @public
	 */
	multiplyByScalar: function(scalar) {
		this.v[0] *= scalar;
		this.v[1] *= scalar;
		this.v[2] *= scalar;

		this.v[3] *= scalar;
		this.v[4] *= scalar;
		this.v[5] *= scalar;

		this.v[6] *= scalar;
		this.v[7] *= scalar;
		this.v[8] *= scalar;
		return this;
	},
	/**
	 * Multiplies by other matrix.
	 *
	 * @param  {!Grape2D.Matrix} matrix Matrix to multiply by.
	 * @return {!Grape2D.Matrix} The new matrix, result of the
	 *   multiplication.
	 * @public
	 */
	multiplyByMatrix: function(matrix) {
		var v = this.v,
			m = matrix.v,
			aa = v[0] * m[0] + v[1] * m[3] + v[2] * m[6],
			ab = v[0] * m[1] + v[1] * m[4] + v[2] * m[7],
			ac = v[0] * m[2] + v[1] * m[5] + v[2] * m[8],
			ba = v[3] * m[0] + v[4] * m[3] + v[5] * m[6],
			bb = v[3] * m[1] + v[4] * m[4] + v[5] * m[7],
			bc = v[3] * m[2] + v[4] * m[5] + v[5] * m[8],
			ca = v[6] * m[0] + v[7] * m[3] + v[8] * m[6],
			cb = v[6] * m[1] + v[7] * m[4] + v[8] * m[7],
			cc = v[6] * m[2] + v[7] * m[5] + v[8] * m[8];

		return new Grape2D.Matrix(
			aa, ab, ac,
			ba, bb, bc,
			ca, cb, cc
		);
	},
	/**
	 * Multiplies this matrix by other matrix, and where the
	 *   result is stored in this one.
	 *
	 * @param  {!Grape2D.Matrix} matrix Matrix to multiply by.
	 * @return {!Grape2D.Matrix} This matrix.
	 * @public
	 */
	selfMultiplyByMatrix: function(matrix) {
		var v = this.v,
			m = matrix.v,
			aa = v[0] * m[0] + v[1] * m[3] + v[2] * m[6],
			ab = v[0] * m[1] + v[1] * m[4] + v[2] * m[7],
			ac = v[0] * m[2] + v[1] * m[5] + v[2] * m[8],
			ba = v[3] * m[0] + v[4] * m[3] + v[5] * m[6],
			bb = v[3] * m[1] + v[4] * m[4] + v[5] * m[7],
			bc = v[3] * m[2] + v[4] * m[5] + v[5] * m[8],
			ca = v[6] * m[0] + v[7] * m[3] + v[8] * m[6],
			cb = v[6] * m[1] + v[7] * m[4] + v[8] * m[7],
			cc = v[6] * m[2] + v[7] * m[5] + v[8] * m[8];

		this.set(
			aa, ab, ac,
			ba, bb, bc,
			ca, cb, cc);
		return this;
	},
	/**
	 * Translates this matrix.
	 *
	 * @param  {!number} x Translation in the x axis.
	 * @param  {!number} y Translation in the y axis.
	 * @return {!Grape2D.Matrix} This matrix.
	 * @public
	 */
	translate: function(x, y) {
		this.v[2] = this.v[0] * x + this.v[1] * y + this.v[2];
		this.v[5] = this.v[3] * x + this.v[4] * y + this.v[5];
		return this;
	},
	/**
	 * Scales this matrix.
	 *
	 * @param  {!number} x Scale in the x axis.
	 * @param  {!number} y Scale in the y axis.
	 * @return {!Grape2D.Matrix} This matrix.
	 * @public
	 */
	scale: function(x, y) {
		var v = this.v;
		v[0] *= x;
		v[1] *= y;
		v[3] *= x;
		v[4] *= y;
		v[6] *= x;
		v[7] *= y;
		return this;
	},
	/**
	 * Rotates this matrix.
	 *
	 * @param  {!number} angle Angle to rotate.
	 * @return {!Grape2D.Matrix} This matrix.
	 * @public
	 */
	rotate: function(angle) {
		var c = Grape2D.Math.cos(angle),
			s = Grape2D.Math.sin(angle),
			v = this.v,
			aa = v[0] * c + v[1] * s,
			ab = -v[0] * s + v[1] * s,
			ba = v[3] * c + v[4] * s,
			bb = -v[3] * s + v[4] * s,
			ca = v[6] * c + v[7] * s,
			cb = -v[6] * s + v[7] * s;
		v[0] = aa;
		v[1] = ab;
		v[3] = ba;
		v[4] = bb;
		v[6] = ca;
		v[7] = cb;
		return this;
	},
	/**
	 * Transposes the matrix.
	 *
	 * @return {!Grape2D.Matrix} This matrix.
	 * @public
	 */
	transpose: function() {
		var tmp, m = this.v;
		tmp = m[1];
		m[1] = m[3];
		m[3] = tmp;
		tmp = m[2];
		m[2] = m[6];
		m[6] = tmp;
		tmp = m[5];
		m[5] = m[7];
		m[7] = tmp;

		return this;
	},
	/**
	 * Clones the matrix. Instantiating another one with the same
	 *   elements.
	 *
	 * @return {!Grape2D.Matrix} Equivalent matrix.
	 * @public
	 */
	clone: function() {
		return new Grape2D.Matrix(this.v[0], this.v[1], this.v[2], this.v[3], this.v[4], this.v[5], this.v[6], this.v[7], this.v[8]);
	},
	/**
	 * Represents the matrix as a string.
	 *
	 * @return {!string} Matrix as a string.
	 * @public
	 */
	toString: function() {
		return "Grape2D.Matrix\n" + this.v[0] + " " + this.v[1] + " " + this.v[2] + "\n" +
			this.v[3] + " " + this.v[4] + " " + this.v[5] + "\n" +
			this.v[6] + " " + this.v[7] + " " + this.v[8];
	},
	/**
	 * Gets the raw representation of the matrix.
	 *
	 * @return {!Float32Array} Matrix, as an array of length of 3.
	 * @public
	 */
	getRaw: function() {
		return this.v;
	}
};
/**
 * Creates a translation matrix.
 *
 * @param  {!number} x Translation in the x axis.
 * @param  {!number} y Translation in the y axis.
 * @return {!Grape2D.Matrix} Transformation matrix.
 * @public
 */
Grape2D.Matrix.createFromTranslation = function(x, y) {
	return new Grape2D.Matrix(
		1, 0, x,
		0, 1, y,
		0, 0, 1);
};
/**
 * Creates a scale matrix.
 *
 * @param  {!number} x Scale in the x axis.
 * @param  {!number} y Scale in the y axis.
 * @return {!Grape2D.Matrix} Scale matrix.
 * @public
 */
Grape2D.Matrix.createFromScale = function(x, y) {
	return new Grape2D.Matrix(
		x, 0, 0,
		0, y, 0,
		0, 0, 1);
};
/**
 * Creates a rotation matrix.
 *
 * @param  {!number} angle Angle to rotate.
 * @return {!Grape2D.Matrix} Rotation matrix.
 * @public
 */
Grape2D.Matrix.createFromRotation = function(angle) {
	var c = Grape2D.Math.cos(angle),
		s = Grape2D.Math.sin(angle);
	return new Grape2D.Matrix(
		c, -s, 0,
		s, c, 0,
		0, 0, 1);
};