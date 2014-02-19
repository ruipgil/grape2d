/* global describe, it, expect, beforeEach, jasmine, xit, xdescribe */
var Grape2D = require("../../../build/Grape2D.js"),
	customMatchers = require("../customMatchers.js");

describe("circle shape", function(){
	it("instantiation", function(){
		var circle = new Grape2D.Circle({
			radius: 5
		});
		expect(circle.getPosition().isZero()).toBeTruthy();
		expect(circle.getRadius()).toBe(5);

		var vector = new Grape2D.Vector(-464,-881024);
		circle = new Grape2D.Circle({
			position: vector,
			radius: 0
		});
		expect(circle.getPosition().equals(vector)).toBeTruthy();
		expect(circle.getPosition()).not.toBe(vector);
		expect(circle.getRadius()).toBe(0);

		circle = new Grape2D.Circle({
			position: vector,
			radius: 87354
		});
		expect(circle.getPosition().equals(vector)).toBeTruthy();
		expect(circle.getPosition()).not.toBe(vector);
		expect(circle.getRadius()).toBe(87354);
	});
	it("getting and setting position", function(){
		var circle = new Grape2D.Circle({
			radius: 0
		}), vector = new Grape2D.Vector(-8.1354, 8451.001);
		expect(circle.getPosition().isZero).toBeTruthy();
		circle.setPosition(vector);
		expect(circle.getPosition().equals(vector)).toBeTruthy();
		expect(circle.getPosition()).not.toBe(vector);
	});
	it("getting and setting radius", function(){
		var circle = new Grape2D.Circle({
			radius: 0
		});
		expect(circle.getRadius()).toBe(0);
		circle.setRadius(94.864);
		expect(circle.getRadius()).toBe(94.864);
	});
	it("getStaticType", function(){
		expect(new Grape2D.Circle({
			radius: 1654
		}).getStaticType()).toBe(Grape2D.Circle.TYPE);
	});
});