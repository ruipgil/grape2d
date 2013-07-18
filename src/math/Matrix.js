/**
 * Matrix defines a 3x3 matrix indicated to deal with 2D operations.
 *
 * @param  {number=} aa [description]
 * @param  {number=} ab [description]
 * @param  {number=} ac [description]
 * @param  {number=} ba [description]
 * @param  {number=} bb [description]
 * @param  {number=} bc [description]
 * @param  {number=} ca [description]
 * @param  {number=} cb [description]
 * @param  {number=} cc [description]
 *
 * @constructor
 */
Grape2D.Matrix = function(aa, ab, ac, ba, bb, bc, ca, cb, cc){
	/**
	 * Matrix elements.
	 *
	 * @type {Array.<number>}
	 * @private
	 */
	this.v = [];
	if(aa!==undefined){
		this.v = [ aa, ab, ac, ba, bb, bc, ca, cb, cc ];
	}else{
		this.identity();
	}
};

Grape2D.Matrix.prototype = {
	constructor: Grape2D.Matrix,
	set: function(aa, ab, ac, ba, bb, bc, ca, cb, cc){
		var tv = this.v;
		tv[0] = tv[4] = tv[8] = 1;
		tv[1] = tv[2] = tv[3] = tv[5] = tv[6] = tv[7] = 0;
		return this;
	},
	add: function(matrix){
		for(var i=0; i<9; i++)
			this.v[i]+=matrix.v[i];
		return this;
	},
	identity: function(){
		this.v = [ 1, 0, 0, 0, 1, 0, 0, 0, 1 ];
		return this;
	},
	invert: function(){
		var det = this.determinant(), v=this.v;
		this.v = [
			v[4]*v[8]-v[5]*v[7],
			v[2]*v[7]-v[1]*v[8],
			v[1]*v[5]-v[2]*v[4],

			v[5]*v[6]-v[8]*v[3],
			v[0]*v[8]-v[2]*v[6],
			v[2]*v[3]-v[0]*v[5],

			v[3]*v[7]-v[4]*v[6],
			v[1]*v[6]-v[0]*v[7],
			v[0]*v[4]-v[1]*v[3]
		];
		return this.multiplyByScalar(1/det);
	},
	determinant: function(){
		var tv = this.v;
		return tv[0]*(tv[4]*tv[8]-tv[5]*tv[7])-tv[1]*(tv[3]*tv[8]-tv[5]*tv[6])+tv[2]*(tv[3]*tv[7]-tv[4]*tv[6]);
	},
	multiplyByVector: function(v){
		return new Grape2D.Vector(
			this.v[0]*v.x+this.v[1]*v.y+this.v[2],
			this.v[3]*v.x+this.v[4]*v.y+this.v[5]
		);
	},
	multiplyByScalar: function(scalar){
		this.v[0]*=scalar;
		this.v[1]*=scalar;
		this.v[2]*=scalar;

		this.v[3]*=scalar;
		this.v[4]*=scalar;
		this.v[5]*=scalar;

		this.v[6]*=scalar;
		this.v[7]*=scalar;
		this.v[8]*=scalar;
		return this;
	},
	multiplyByMatrix: function(matrix){
		var v = this.v, m = matrix.v,
			aa = v[0]*m[0]+v[1]*m[3]+v[2]*m[6], ab = v[0]*m[1]+v[1]*m[4]+v[2]*m[7], ac = v[0]*m[2]+v[1]*m[5]+v[2]*m[8],
			ba = v[3]*m[0]+v[4]*m[3]+v[5]*m[6], bb = v[3]*m[1]+v[4]*m[4]+v[5]*m[7], bc = v[3]*m[2]+v[4]*m[5]+v[5]*m[8],
			ca = v[6]*m[0]+v[7]*m[3]+v[8]*m[6], cb = v[6]*m[1]+v[7]*m[4]+v[8]*m[7], cc = v[6]*m[2]+v[7]*m[5]+v[8]*m[8];

		return new Grape2D.Matrix(
			aa, ab, ac,
			ba, bb, bc,
			ca, cb, cc
		);
	},
	transpose: function(){
		var tmp, m = this.v;
		tmp = m[1]; m[1] = m[3]; m[3] = tmp;
		tmp = m[2]; m[2] = m[6]; m[6] = tmp;
		tmp = m[5]; m[5] = m[7]; m[7] = tmp;

		return this;
	},
	rotate: function(angle){
		return;
	},
	setRendererTransform: function(renderer){
		renderer.transform(this.v[0], this.v[1], this.v[2], this.v[3], this.v[4], this.v[5]);
	},
	clone: function(){
		return new Grape2D.Matrix(this.v[0], this.v[1], this.v[2], this.v[3], this.v[4], this.v[5], this.v[6], this.v[7], this.v[8]);
	},
	toString: function(){
		return "Grape2D.Matrix\n"+this.v[0]+" "+this.v[1]+" "+this.v[2]+"\n"+
			this.v[3]+" "+this.v[4]+" "+this.v[5]+"\n"+
			this.v[6]+" "+this.v[7]+" "+this.v[8];
	}

};