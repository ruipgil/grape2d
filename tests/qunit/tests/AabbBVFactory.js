function AABBTwoTest(expected, result) {
	ok(expected.getPosition().equals(result.getPosition()), "Same position passed.");
	equal(result.getWidth(), expected.getWidth(), "Same width passed.");
	equal(result.getHeight(), expected.getHeight(), "Same height passed.");
};

var aabb1 = new Grape2D.AABB({
		width: 2,
		height: 2,
		position: new Grape2D.Vector(-1, 1)
	});
module("AABB merging test");
test("Separated AABBs", function() {
	var aabb2 = new Grape2D.AABB({
			width: 2,
			height: 1,
			position: new Grape2D.Vector(1, -1.5)
		}),
		expected = new Grape2D.AABB({
			width: 4,
			height: 4,
			position: new Grape2D.Vector()
		}),
		result = Grape2D.BVFactorySingleton.getFactory().merge(aabb1, aabb2);

	AABBTwoTest(expected, result);
});

test("Overlapping AABBs (I)", function() {
	var aabb2 = new Grape2D.AABB({
			width: 2,
			height: 1,
			position: new Grape2D.Vector(-0.5, 0)
		}),
		expected = new Grape2D.AABB({
			width: 2.5,
			height: 2.5,
			position: new Grape2D.Vector(-0.75, 0.75)
		}),
		result = Grape2D.BVFactorySingleton.getFactory().merge(aabb1, aabb2);

	AABBTwoTest(expected, result);
});

test("AABOverlapping AABBs (II)", function() {
	var aabb2 = new Grape2D.AABB({
			width: 2,
			height: 1,
			position: new Grape2D.Vector(0.5, 1)
		}),
		expected = new Grape2D.AABB({
			width: 3.5,
			height: 2,
			position: new Grape2D.Vector(-0.25,1)
		}),
		result = Grape2D.BVFactorySingleton.getFactory().merge(aabb1, aabb2);

	AABBTwoTest(expected, result);
});

test("Overlapping AABBs one inside the other", function() {
	var aabb2 = new Grape2D.AABB({
			width: 2,
			height: 1,
			position: new Grape2D.Vector(-1, 1)
		}),
		expected = new Grape2D.AABB({
			width: 2,
			height: 2,
			position: new Grape2D.Vector(-1, 1)
		}),
		result = Grape2D.BVFactorySingleton.getFactory().merge(aabb1, aabb2);

	AABBTwoTest(expected, result);
});