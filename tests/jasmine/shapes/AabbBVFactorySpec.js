describe("AabbBVFactory", function() {
	var f = new Grape2D.AabbBVFactory(),
		compareAABBs = function(result, expected, same) {
			expect(result.getPosition().equals(expected.getPosition())).toBeTruthy();
			expect(result.getMinX()).toBe(expected.getMinX());
			expect(result.getMaxX()).toBe(expected.getMaxX());
			expect(result.getMinY()).toBe(expected.getMinY());
			expect(result.getMaxY()).toBe(expected.getMaxY());
			if (same) {
				expect(result).toBe(expected);
			} else {
				expect(result).not.toBe(expected);
			}
		};
	it("get placeholder", function() {
		var temp = f.getPlaceHolder();
		expect(temp.getStaticType()).toBe(Grape2D.AABB.TYPE);
		expect(f.getPlaceHolder()).toBe(temp);
	});
	it("create from aabb", function() {
		var aabb = new Grape2D.AABB({
				width: 10,
				height: 7,
				position: new Grape2D.Vector(-1, 11)
			}),
			result = f.createFromAABB(aabb);
		expect(result).toBe(aabb);
	});
	it("create from circle", function() {

		compareAABBs(f.createFromCircle(new Grape2D.Circle({
			radius: 3
		})), new Grape2D.AABB({
			width: 6,
			height: 6
		}));

		compareAABBs(f.createFromCircle(new Grape2D.Circle({
			radius: 8,
			position: new Grape2D.Vector(-7, 3)
		})), new Grape2D.AABB({
			width: 16,
			height: 16,
			position: new Grape2D.Vector(-7, 3)
		}));
	});
	it("create from polygon", function() {

		compareAABBs(f.createFromPolygon(new Grape2D.Polygon({
			vertexList: [new Grape2D.Vector(-8, 3), new Grape2D.Vector(3, 4), new Grape2D.Vector(-1, -2)]
		})), new Grape2D.AABB({
			width: 11,
			height: 6,
			position: new Grape2D.Vector(-2.5, 1)
		}));

		compareAABBs(f.createFromPolygon(new Grape2D.Polygon({
			vertexList: [new Grape2D.Vector(-8, 3), new Grape2D.Vector(3, 4), new Grape2D.Vector(-1, -2)],
			position: new Grape2D.Vector(6, 5)
		})), new Grape2D.AABB({
			width: 11,
			height: 6,
			position: new Grape2D.Vector(3.5, 6)
		}));

	});

	//TODO
	//it("create scene BV", function() {});
	
	describe("merge", function() {
		var quadrants = [
			new Grape2D.Vector(),
			new Grape2D.Vector(8, 7),
			new Grape2D.Vector(-5, 3),
			new Grape2D.Vector(-9, -4),
			new Grape2D.Vector(9, -4),
		];
		var mergeTest = function(a, b, expected) {
			var result1 = f.merge(a, b),
				result2 = f.merge(b, a);

			compareAABBs(result1, expected);
			compareAABBs(result2, expected);
			compareAABBs(result1, result2);
		};

		it("AABBs with same properties", function() {
			for (var i = 0, quad; quad = quadrants[i]; i++) {
				mergeTest(new Grape2D.AABB({
					width: 5,
					height: 6,
					position: new Grape2D.Vector(0 + quad.getX(), 0 + quad.getY())
				}), new Grape2D.AABB({
					width: 5,
					height: 6,
					position: new Grape2D.Vector(0 + quad.getX(), 0 + quad.getY())
				}), new Grape2D.AABB({
					width: 5,
					height: 6,
					position: new Grape2D.Vector(0 + quad.getX(), 0 + quad.getY())
				}));
			}
		});

		it("one AABB is smaller and completely inside the other", function() {
			for (var i = 0, quad; quad = quadrants[i]; i++) {
				mergeTest(new Grape2D.AABB({
					width: 5,
					height: 6,
					position: new Grape2D.Vector(0 + quad.getX(), 0 + quad.getY())
				}), new Grape2D.AABB({
					width: 1,
					height: 1,
					position: new Grape2D.Vector(2 + quad.getX(), 2.5 + quad.getY())
				}), new Grape2D.AABB({
					width: 5,
					height: 6,
					position: new Grape2D.Vector(0 + quad.getX(), 0 + quad.getY())
				}));
			}
		});

		it("the two AABBs overlap", function() {
			mergeTest(new Grape2D.AABB({
				width: 5,
				height: 6,
				position: new Grape2D.Vector(0, 0)
			}), new Grape2D.AABB({
				width: 1,
				height: 1,
				position: new Grape2D.Vector(2.5, 3)
			}), new Grape2D.AABB({
				width: 5.5,
				height: 6.5,
				position: new Grape2D.Vector(0.25, 0.25)
			}));
		});

		it("the two AABBs are separated", function() {
			mergeTest(new Grape2D.AABB({
				width: 5,
				height: 6,
				position: new Grape2D.Vector(-8, 10)
			}), new Grape2D.AABB({
				width: 5,
				height: 6,
				position: new Grape2D.Vector(8, -10)
			}), new Grape2D.AABB({
				width: 21,
				height: 26,
				position: new Grape2D.Vector(0, 0)
			}));
		});

	});
});