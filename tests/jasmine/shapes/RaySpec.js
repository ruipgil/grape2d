/* global describe, it, expect, beforeEach, jasmine, xit, xdescribe */
var Grape2D = require("../../../build/Grape2D.js"),
	customMatchers = require("../customMatchers.js");

describe("ray shape", function(){
	it("creation", function(){
		var start = new Grape2D.Vector(56,-8),
			direction = new Grape2D.Vector(1,0),
			end = new Grape2D.Vector(61,-8),
			ray = new Grape2D.Ray(start, direction, 5);
		expect(ray.getStart().equals(start)).toBeTruthy();
		expect(ray.getStart()).not.toBe(start);
		expect(ray.getDirection().equals(direction)).toBeTruthy();
		expect(ray.getDirection()).not.toBe(direction);
		expect(ray.getLength()).toBe(5);
		expect(ray.getEnd().equals(end)).toBeTruthy();
	});

	describe("createFromPoints", function(){
		var start = new Grape2D.Vector(284, 84),
			end = new Grape2D.Vector(-98, 88),
			ray = Grape2D.Ray.createFromPoints(start, end);
		it("test start", function(){
			expect(ray.getStart().getX()).toBe(start.getX());
			expect(ray.getStart().getY()).toBe(start.getY());
		});
		it("test end", function(){
			expect(ray.getEnd().getX()).toBe(end.getX());
			expect(ray.getEnd().getY()).toBe(end.getY());
		});
		it("test length", function(){
			expect(ray.getLength()).toBe(start.distanceTo(end));
		});
	});
});