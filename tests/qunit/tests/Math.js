module("Math");
test("abs", function() {
	equal(0, Grape2D.Math.abs(0), "Zero.");
	equal(5, Grape2D.Math.abs(5), "Positive integer.");
	equal(153.485, Grape2D.Math.abs(153.485), "Positive float.");
	equal(68942, Grape2D.Math.abs(-68942), "Negative integer.");
	equal(8553.485, Grape2D.Math.abs(-8553.485), "Negative float.");
});
test("floor", function() {
	equal(0, Grape2D.Math.floor(0), "Zero.");
	equal(48445, Grape2D.Math.floor(48445), "Positive integer.");
	equal(956348, Grape2D.Math.floor(956348), "Positive float.");
	equal(-8451232, Grape2D.Math.floor(-8451232), "Negative integer.");
	equal(-6348, Grape2D.Math.floor(-6348.8431121), "Negative float.");
});
test("ceil", function() {
	equal(0, Grape2D.Math.ceil(0), "Zero.");
	equal(48445, Grape2D.Math.ceil(48445), "Positive integer.");
	equal(956349, Grape2D.Math.ceil(956348.8431121), "Positive float.");
	equal(-8451232, Grape2D.Math.ceil(-8451232), "Negative integer.");
	equal(-6348, Grape2D.Math.ceil(-6348.8431121), "Negative float.");
});
test("round", function() {
	equal(0, Grape2D.Math.round(0), "Zero.");
	equal(48445, Grape2D.Math.round(48445), "Positive integer.");
	equal(956349, Grape2D.Math.round(956348.8431121), "Positive float, ceiled.");
	equal(956348, Grape2D.Math.round(956348.2431121), "Positive float, floored.");
	equal(-8451232, Grape2D.Math.round(-8451232), "Negative integer.");
	equal(-6349, Grape2D.Math.round(-6348.8431121), "Negative float, ceiled.");
	equal(-6348, Grape2D.Math.round(-6348.4431121), "Negative float, floored.");
});
test("clamp", function() {
	equal(-6, Grape2D.Math.clamp(-51, -6, -3), "Between negative and negative, clamped to lower bound.");
	equal(-2, Grape2D.Math.clamp(-3, -2, -3), "Between negative and negative, not clamped.");
	equal(-3, Grape2D.Math.clamp(-2, -6, -3), "Between negative and negative, clamped to higher bound.");

	equal(-84, Grape2D.Math.clamp(-848.6, -84, 0), "Between negative and zero, clamped to lower bound.");
	equal(-5.65, Grape2D.Math.clamp(-5.65, -84, 0), "Between negative and zero, not clamped.");
	equal(0, Grape2D.Math.clamp(5.112, -84, 0), "Between negative and zero, clamped to higher bound.");

	equal(0, Grape2D.Math.clamp(-848.6, 0, 0), "Between zero and zero, clamped to lower bound.");
	equal(0, Grape2D.Math.clamp(-5.65, 0, 0), "Between zero and zero, not clamped.");
	equal(0, Grape2D.Math.clamp(5.112, 0, 0), "Between zero and zero, clamped to higher bound.");

	equal(0, Grape2D.Math.clamp(-848.6, 0, 8451), "Between zero and positive, clamped to lower bound.");
	equal(87, Grape2D.Math.clamp(87, 0, 454), "Between zero and positive, not clamped.");
	equal(1254, Grape2D.Math.clamp(545654.45, 0, 1254), "Between zero and positive, clamped to higher bound.");

	equal(120, Grape2D.Math.clamp(84, 120, 135), "Between positive and positive, clamped to lower bound.");
	equal(125, Grape2D.Math.clamp(125, 120, 135), "Between positive and positive, not clamped.");
	equal(135, Grape2D.Math.clamp(158, 120, 135), "Between positive and positive, clamped to higher bound.");

	equal(-135, Grape2D.Math.clamp(-501, -135, -120), "Between negative and negative, clamped to lower bound.");
	equal(-125, Grape2D.Math.clamp(-125, -135, -120), "Between negative and negative, not clamped.");
	equal(-120, Grape2D.Math.clamp(-18, -135, -120), "Between negative and negative, clamped to higher bound.");

	equal(-135, Grape2D.Math.clamp(-501, -135, 120), "Between negative and positive, clamped to lower bound.");
	equal(12, Grape2D.Math.clamp(12, -135, 120), "Between negative and positive, not clamped.");
	equal(18, Grape2D.Math.clamp(18, -135, 120), "Between negative and positive, clamped to higher bound.");
});
test("sq", function() {
	equal(0, Grape2D.Math.sq(0), "Zero.");
	equal(85*85, Grape2D.Math.sq(85), "Positive integer.");
	equal(894.54*894.54, Grape2D.Math.sq(894.54), "Positive float.");
	equal((-8)*(-8), Grape2D.Math.sq(-8), "Negative integer.");
	equal((-34.58)*(-34.58), Grape2D.Math.sq(-34.58), "Negative float.");
});
test("overlaps", function() {
	function between(a, n, b){
		return a<= n && n <= b;
	}
	equal(1, Grape2D.Math.overlaps({min: -8, max: -3}, {min:-4, max:-1}), "Overlapping, negative intervals.");
	equal(-1, Grape2D.Math.overlaps({min: -8, max: -3}, {min:-2, max:-1}), "Non-overlapping, negative intervals.");
	equal(0, Grape2D.Math.overlaps({min: -8, max: 1}, {min:1, max:3}), "Overlapping, negative and positive intervals.");
	ok(between(-0.10001,Grape2D.Math.overlaps({min: -8, max: 1}, {min:1.1, max:8}),-0.09999), "Non-overlapping, negative and positive intervals.");
	equal(0.5, Grape2D.Math.overlaps({min: 2, max: 8}, {min:7.5, max:10}), "Overlapping, positive intervals.");
	ok(between(-0.1,Grape2D.Math.overlaps({min: 2, max: 8}, {min:8.1, max:10}),-0.098), "Non-overlapping, positive intervals.");
});