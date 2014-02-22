/* global describe, it, expect, beforeEach, jasmine, xit, xdescribe */
var Grape2D = require("../../../build/Grape2D.js"),
	customMatchers = require("../customMatchers.js");

describe("Matrix class", function(){
	customMatchers.addCustomMatchers();
	function matrixTest(matrix, aa, ab, ac, ba, bb, bc, ca, cb, cc){
		var r = matrix.getRaw();
		expect(r[0]).toBe(aa);
		expect(r[1]).toBe(ab);
		expect(r[2]).toBe(ac);

		expect(r[3]).toBe(ba);
		expect(r[4]).toBe(bb);
		expect(r[5]).toBe(bc);

		expect(r[6]).toBe(ca);
		expect(r[7]).toBe(cb);
		expect(r[8]).toBe(cc);
	}
	function matrixApTest(matrix, aa, ab, ac, ba, bb, bc, ca, cb, cc){
		var r = matrix.getRaw();
		expect(r[0]).toBeApproximately(aa);
		expect(r[1]).toBeApproximately(ab);
		expect(r[2]).toBeApproximately(ac);

		expect(r[3]).toBeApproximately(ba);
		expect(r[4]).toBeApproximately(bb);
		expect(r[5]).toBeApproximately(bc);

		expect(r[6]).toBeApproximately(ca);
		expect(r[7]).toBeApproximately(cb);
		expect(r[8]).toBeApproximately(cc);
	}
	function vectorTest(vector, x, y){
		expect(vector.getX()).toBe(x);
		expect(vector.getY()).toBe(y);
	}
	describe("creation", function(){
		it("with no params", function(){
			matrixTest(new Grape2D.Matrix(),
				1, 0, 0,
				0, 1, 0,
				0, 0, 1);
		});
		it("with params", function(){
			matrixTest(new Grape2D.Matrix(1, 2, 3, 9, 8, 7, 4, 5, 6),
				1, 2, 3,
				9, 8, 7,
				4, 5, 6);
		});
	});
	describe("setters", function(){
		it("set", function(){
			var matrix = new Grape2D.Matrix();
			expect(matrix.set(1, 2, 3, 9, 8, 7, 4, 5, 6)).toBe(matrix);
			matrixTest(matrix,
				1, 2, 3,
				9, 8, 7,
				4, 5, 6);
		});
		it("setFromMatrix", function(){
			var matrix = new Grape2D.Matrix(),
				m2 = new Grape2D.Matrix(1, 2, 3, 9, 8, 7, 4, 5, 6),
				r = matrix.setFromMatrix(m2);
			expect(r).toBe(matrix);
			expect(r).not.toBe(m2);
			matrixTest(matrix,
				1, 2, 3,
				9, 8, 7,
				4, 5, 6);
		});
		it("identity", function(){
			var matrix = new Grape2D.Matrix(1, 2, 3, 9, 8, 7, 4, 5, 6);
			expect(matrix.identity()).toBe(matrix);
			matrixTest(matrix,
				1, 0, 0,
				0, 1, 0,
				0, 0, 1);
		});
	});
	describe("operations", function(){
		it("add", function(){
			var matrix = new Grape2D.Matrix(1, 2, 3, 9, 8, 7, 4, 5, 6),
				m2 = new Grape2D.Matrix();
			expect(matrix.add(m2)).toBe(matrix);
			matrixTest(matrix,
				2, 2, 3,
				9, 9, 7,
				4, 5, 7);
		});
		it("invert", function(){
			var matrix = new Grape2D.Matrix();
			expect(matrix.invert()).toBe(matrix);
			matrixTest(matrix,
				1, 0, 0,
				0, 1, 0,
				0, 0, 1);

			matrix = new Grape2D.Matrix(1, 2, 3, 9, 8, 8, 4, 5, 6);
			expect(matrix.invert()).toBe(matrix);
			matrixApTest(matrix,
				8/3, 1, -8/3,
				-22/3, -2, 19/3,
				13/3, 1, -10/3);
		});
		it("determinant", function(){
			expect(new Grape2D.Matrix(1, 2, 3, 9, 8, 7, 4, 5, 6).determinant()).toBe(0);
			expect(new Grape2D.Matrix(1, 2, 3, 9, 8, 8, 4, 5, 6).determinant()).toBe(3);
		});
		it("multiplyByVector", function(){
			var matrix = new Grape2D.Matrix();
			vectorTest(matrix.multiplyByVector(new Grape2D.Vector(89, -98)), 89, -98);
			matrix.set(1, 2, 3, 9, 8, 7, 4, 5, 6);
			vectorTest(matrix.multiplyByVector(new Grape2D.Vector(89, -98)), -107, -17);
		});
		it("multiplyByScalar", function(){
			var matrix = new Grape2D.Matrix();
			matrixTest(matrix.multiplyByScalar(8.8),
				8.8, 0, 0,
				0, 8.8, 0,
				0, 0, 8.8);

			matrix = new Grape2D.Matrix(1, 2, 3, 9, 8, 8, 4, 5, 6);
			matrixTest(matrix.multiplyByScalar(-894),
				-894, -1788, -2682,
				-8046, -7152, -7152,
				-3576, -4470, -5364);
		});
		it("multiplyByMatrix", function(){
			var matrix = new Grape2D.Matrix(),
				m2 = new Grape2D.Matrix(2, 2, 2, 8, 1, 6, 7, 3, 11),
				temp;
			expect(temp = matrix.multiplyByMatrix(new Grape2D.Matrix())).not.toBe(matrix);
			matrixTest(temp,
				1, 0, 0,
				0, 1, 0,
				0, 0, 1);

			expect(temp = matrix.multiplyByMatrix(new Grape2D.Matrix(2, 2, 2, 8, 1, 6, 7, 3, 11))).not.toBe(matrix);
			matrixTest(temp,
				2, 2, 2,
				8, 1, 6,
				7, 3, 11);

			expect(temp = m2.multiplyByMatrix(matrix)).not.toBe(matrix);
			matrixTest(temp,
				2, 2, 2,
				8, 1, 6,
				7, 3, 11);

			matrix.set(1, 2, 3, 9, 8, 7, 4, 5, 6);
			expect(temp = m2.multiplyByMatrix(matrix)).not.toBe(m2);
			matrixTest(temp,
				39, 13, 47,
				89, 29, 77,
				90, 31, 104);

			expect(temp = matrix.multiplyByMatrix(m2)).not.toBe(matrix);
			matrixTest(temp,
				28, 30, 20,
				41, 54, 61,
				78, 93, 90);
		});
		it("selfMultiplyByMatrix", function(){
			var matrix = new Grape2D.Matrix(),
				m2 = new Grape2D.Matrix(2, 2, 2, 8, 1, 6, 7, 3, 11);

			expect(m2.selfMultiplyByMatrix(matrix)).toBe(m2);
			matrixTest(matrix,
				2, 2, 2,
				8, 1, 6,
				7, 3, 11);

			expect(matrix.selfMultiplyByMatrix(m2)).toBe(matrix);
			matrixTest(matrix,
				2, 2, 2,
				8, 1, 6,
				7, 3, 11);

			matrix.set(1, 2, 3, 9, 8, 8, 4, 5, 6);
			expect(matrix.selfMultiplyByMatrix(m2)).toBe(matrix);
			matrixTest(matrix,
				39, 13, 47,
				89, 29, 77,
				90, 31, 104);

			matrix.set(1, 2, 3, 9, 8, 8, 4, 5, 6);
			expect(m2.selfMultiplyByMatrix(matrix)).toBe(m2);
			matrixTest(matrix,
				28, 30, 20,
				41, 54, 61,
				78, 93, 90);
		});
		it("translate", function(){
			var matrix = new Grape2D.Matrix();
			expect(matrix.translate(8, -9)).toBe(matrix);
			matrixTest(matrix,
				1, 0, 8,
				0, 1, -9,
				0, 0, 1);

			expect(matrix.translate(-8, 9)).toBe(matrix);
			matrixTest(matrix,
				1, 0, 0,
				0, 1, 0,
				0, 0, 1);
		});
		it("scale", function(){
			var matrix = new Grape2D.Matrix();
			expect(matrix.scale(2, 9)).toBe(matrix);
			matrixTest(matrix,
				2, 0, 0,
				0, 9, 0,
				0, 0, 1);

			matrix.set(1, 2, 3, 9, 8, 8, 4, 5, 6);
			expect(matrix.scale(-8, 9)).toBe(matrix);
			matrixTest(matrix,
				-8, 18, 3,
				-72, 72, 1,
				-32, 45, 6);
		});
		it("rotate", function(){
			//TODO
		});
		it("transpose", function(){
			var matrix = new Grape2D.Matrix();
			expect(matrix.transpose()).toBe(matrix);
			matrixTest(matrix,
				1, 0, 0,
				0, 1, 0,
				0, 0, 1);

			matrix.set(1, 2, 3, 9, 8, 8, 4, 5, 6);
			expect(matrix.transpose()).toBe(matrix);
			matrixTest(matrix,
				1, 9, 4,
				2, 8, 5,
				3, 1, 6);
		});
	});
	it("clone", function(){
		var matrix = new Grape2D.Matrix(1, 2, 3, 9, 8, 8, 4, 5, 6),
			clone = matrix.clone();
		expect(clone).not.toBe(matrix);
		matrixTest(clone,
			1, 2, 3,
			9, 8, 8,
			4, 5, 6);
	});
	it("toString", function(){
		var matrix = new Grape2D.Matrix(1, 2, 3, 9, 8, 8, 4, 5, 6);
		expect(matrix.toString()).toBe("Grape2D.Matrix\n1 2 3\n9 8 8\n4 5 6");

		matrix.identity();
		expect(matrix.toString()).toBe("Grape2D.Matrix\n1 0 0\n0 1 0\n0 0 1");
	});
	it("createFromTranslation", function(){
		var matrix = Grape2D.Matrix.createFromTranslation(-9985, 3.2);
		matrixTest(matrix,
			1, 0, -9985,
			0, 1, 3.2,
			0, 0, 1);
	});
	it("createFromScale", function(){
		var matrix = Grape2D.Matrix.createFromTranslation(-9985, 3.2);
		matrixTest(matrix,
			-9985, 0, 0,
			0, 3.2, 0,
			0, 0, 1);
	});
	it("createFromRotation", function(){
		//TODO
	});
});