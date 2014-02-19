/* global describe, it, expect, beforeEach, jasmine, xit, xdescribe */
var Grape2D = require("../../../build/Grape2D.js"),
	customMatchers = require("../customMatchers.js");

describe("AABB shape", function(){
	it("instantiation", function(){
		var polygon = new Grape2D.Polygon({
			vertexList: [new Grape2D.Vector(), new Grape2D.Vector(), new Grape2D.Vector()]
		});
	});
});