/* global Grape2D, module, ok, test */
module("SAT Collision checking");
var satInstance = new Grape2D.SATCollisionChecker();
test("AABB vs AABB colliding", function(){
	var aabb1 = new Grape2D.AABB({
			width:4,
			height:2
		}),
		aabb2 = new Grape2D.AABB({
			width:2,
			height:4,
			position: new Grape2D.Vector(0,2.99)
		});
	ok(satInstance.aabbVsAabb(aabb1, aabb2), "They're colliding.");
});

test("AABB vs AABB non colliding", function(){
	var aabb1 = new Grape2D.AABB({
			width:4,
			height:2
		}),
		aabb2 = new Grape2D.AABB({
			width:2,
			height:4,
			position: new Grape2D.Vector(0,5)
		});
	ok(!satInstance.aabbVsAabb(aabb1, aabb2), "They're not colliding.");
});

test("AABB vs Circle colliding", function(){
	var aabb = new Grape2D.AABB({
			width:4,
			height:2
		}),
		circle = new Grape2D.Circle({
			radius: 2,
			position: new Grape2D.Vector(2,2)
		});
	ok(satInstance.aabbVsCircle(aabb, circle), "They're colliding.");
});

test("AABB vs Circle non colliding", function(){
	var aabb = new Grape2D.AABB({
			width:4,
			height:2
		}),
		circle = new Grape2D.Circle({
			radius: 2,
			position: new Grape2D.Vector(2.3,2.3)
		});
	ok(satInstance.aabbVsCircle(aabb, circle), "They're colliding.");
});

test("AABB vs Polygon colliding", function(){
	var aabb = new Grape2D.AABB({
			width:4,
			height:2
		}),
		polygon = new Grape2D.Polygon({
			vertexList: [
				new Grape2D.Vector(0,-1),
				new Grape2D.Vector(1,-1),
				new Grape2D.Vector(1,0),
				new Grape2D.Vector(0,1),
				new Grape2D.Vector(-1,1),
				new Grape2D.Vector(-1,0)
			],
			position: new Grape2D.Vector(2.5,-1.5)
		});
	ok(satInstance.aabbVsPolygon(aabb, polygon), "They're colliding.");
});

test("AABB vs Polygon non colliding", function(){
	var aabb = new Grape2D.AABB({
			width:4,
			height:2
		}),
		polygon = new Grape2D.Polygon({
			vertexList: [
				new Grape2D.Vector(0,-1),
				new Grape2D.Vector(1,-1),
				new Grape2D.Vector(1,0),
				new Grape2D.Vector(0,1),
				new Grape2D.Vector(-1,1),
				new Grape2D.Vector(-1,0)
			],
			position: new Grape2D.Vector(2.6,1.6)
		});
	ok(!satInstance.aabbVsPolygon(aabb, polygon), "They're not colliding.");
});

test("AABB vs Ray colliding", function(){
	var aabb = new Grape2D.AABB({
			width:4,
			height:2
		}),
		start = new Grape2D.Vector(-1.5, -2),
		end = new Grape2D.Vector(3,-0.5),
		direction = end.clone().sub(start).normalize(),
		ray = new Grape2D.Ray(start, direction, start.distanceTo(end));
	ok(ray.getStart().equals(start), "Start is the same.");
	ok(ray.getEnd().equals(end), "End is the same.");
	ok(ray.getDirection().equals(direction), "Dir is the same.");
	ok(satInstance.aabbVsRay(aabb, ray), "They're colliding.");
});

test("AABB vs Ray non colliding", function(){
	var aabb = new Grape2D.AABB({
			width:4,
			height:2
		}),
		start = new Grape2D.Vector(-1.5, -2),
		end = new Grape2D.Vector(2.5,-1),
		direction = end.clone().sub(start).normalize(),
		ray = new Grape2D.Ray(start, direction, start.distanceTo(end));
	ok(!satInstance.aabbVsRay(aabb, ray), "They're not colliding.");
});

test("Circle vs AABB colliding", function(){
	var aabb = new Grape2D.AABB({
			width:4,
			height:2
		}),
		circle = new Grape2D.Circle({
			radius: 2,
			position: new Grape2D.Vector(2,2)
		});
	ok(satInstance.circleVsAabb(circle, aabb), "They're colliding.");
});

test("Circle vs AABB non colliding", function(){
	var aabb = new Grape2D.AABB({
			width:4,
			height:2
		}),
		circle = new Grape2D.Circle({
			radius: 1,
			position: new Grape2D.Vector(2.3,2.3)
		});
	ok(!satInstance.circleVsAabb(circle, aabb), "They're not colliding.");
});

test("Circle vs Circle colliding", function(){
	var circle1 = new Grape2D.Circle({
			radius: 5,
			position: new Grape2D.Vector(5,5)
		}),
		circle2 = new Grape2D.Circle({
			radius: 3,
			position: new Grape2D.Vector(0.5,0.5)
		});
	ok(satInstance.circleVsCircle(circle1, circle2), "They're colliding.");
});

test("Circle vs Circle non colliding", function(){
	var circle1 = new Grape2D.Circle({
			radius: 5,
			position: new Grape2D.Vector(10,10)
		}),
		circle2 = new Grape2D.Circle({
			radius: 5,
			position: new Grape2D.Vector()
		});
	ok(!satInstance.circleVsCircle(circle1, circle2), "They're not colliding.");
});

test("Circle vs Polygon colliding", function(){
	var circle = new Grape2D.Circle({
			radius: 1.5,
			position: new Grape2D.Vector(2,-2)
		}),
		polygon = new Grape2D.Polygon({
			vertexList: [
				new Grape2D.Vector(0,-1),
				new Grape2D.Vector(1,-1),
				new Grape2D.Vector(1,0),
				new Grape2D.Vector(0,1),
				new Grape2D.Vector(-1,1),
				new Grape2D.Vector(-1,0)
			],
			position: new Grape2D.Vector()
		});
	ok(satInstance.circleVsPolygon(circle, polygon), "They're colliding.");
});

test("Circle vs Polygon non colliding", function(){
	var circle = new Grape2D.Circle({
			radius: 1.5,
			position: new Grape2D.Vector(-2,-2)
		}),
		polygon = new Grape2D.Polygon({
			vertexList: [
				new Grape2D.Vector(0,-1),
				new Grape2D.Vector(1,-1),
				new Grape2D.Vector(1,0),
				new Grape2D.Vector(0,1),
				new Grape2D.Vector(-1,1),
				new Grape2D.Vector(-1,0)
			],
			position: new Grape2D.Vector()
		});
	ok(!satInstance.circleVsPolygon(circle, polygon), "They're not colliding.");
});

test("Circle vs Ray colliding", function(){
	var circle = new Grape2D.Circle({
			radius: 1
		}),
		start = new Grape2D.Vector(1.5, 0),
		end = new Grape2D.Vector(0.6,0),
		direction = end.clone().sub(start).normalize(),
		ray = new Grape2D.Ray(start, direction, start.distanceTo(end));
	ok(satInstance.circleVsRay(circle, ray), "They're colliding.");
});

test("Circle vs Ray non colliding", function(){
	var circle = new Grape2D.Circle({
			radius: 1
		}),
		start = new Grape2D.Vector(2, 2),
		end = new Grape2D.Vector(1,1),
		direction = end.clone().sub(start).normalize(),
		ray = new Grape2D.Ray(start, direction, start.distanceTo(end));;
	ok(!satInstance.circleVsRay(circle, ray), "They're not colliding.");
});

test("Polygon vs AABB colliding", function(){
	var aabb = new Grape2D.AABB({
			width:4,
			height:2
		}),
		polygon = new Grape2D.Polygon({
			vertexList: [
				new Grape2D.Vector(0,-1),
				new Grape2D.Vector(1,-1),
				new Grape2D.Vector(1,0),
				new Grape2D.Vector(0,1),
				new Grape2D.Vector(-1,1),
				new Grape2D.Vector(-1,0)
			],
			position: new Grape2D.Vector(2.5,-1.5)
		});
	ok(satInstance.polygonVsAabb(polygon, aabb), "They're colliding.");
});
test("Polygon vs AABB non colliding", function(){
	var aabb = new Grape2D.AABB({
			width:4,
			height:2
		}),
		polygon = new Grape2D.Polygon({
			vertexList: [
				new Grape2D.Vector(0,-1),
				new Grape2D.Vector(1,-1),
				new Grape2D.Vector(1,0),
				new Grape2D.Vector(0,1),
				new Grape2D.Vector(-1,1),
				new Grape2D.Vector(-1,0)
			],
			position: new Grape2D.Vector(2.6,1.5)
		});
	ok(!satInstance.polygonVsAabb(polygon, aabb), "They're not colliding.");
});
test("Polygon vs Circle colliding", function(){
	var circle = new Grape2D.Circle({
			radius: 1.5,
			position: new Grape2D.Vector(2,-2)
		}),
		polygon = new Grape2D.Polygon({
			vertexList: [
				new Grape2D.Vector(0,-1),
				new Grape2D.Vector(1,-1),
				new Grape2D.Vector(1,0),
				new Grape2D.Vector(0,1),
				new Grape2D.Vector(-1,1),
				new Grape2D.Vector(-1,0)
			],
			position: new Grape2D.Vector()
		});
	ok(satInstance.polygonVsCircle(polygon, circle), "They're colliding.");
});
test("Polygon vs Circle non colliding", function(){
	var circle = new Grape2D.Circle({
			radius: 1.5,
			position: new Grape2D.Vector(-2,-2)
		}),
		polygon = new Grape2D.Polygon({
			vertexList: [
				new Grape2D.Vector(0,-1),
				new Grape2D.Vector(1,-1),
				new Grape2D.Vector(1,0),
				new Grape2D.Vector(0,1),
				new Grape2D.Vector(-1,1),
				new Grape2D.Vector(-1,0)
			],
			position: new Grape2D.Vector()
		});
	ok(!satInstance.polygonVsCircle(polygon, circle), "They're not colliding.");
});
test("Polygon vs Polygon colliding", function(){
	var polygon1 = new Grape2D.Polygon({
			vertexList: [
				new Grape2D.Vector(0,-1),
				new Grape2D.Vector(1,-1),
				new Grape2D.Vector(1,0),
				new Grape2D.Vector(0,1),
				new Grape2D.Vector(-1,1),
				new Grape2D.Vector(-1,0)
			],
			position: new Grape2D.Vector()
		}),
		polygon2 = new Grape2D.Polygon({
			vertexList: [
				new Grape2D.Vector(0,-1),
				new Grape2D.Vector(1,-1),
				new Grape2D.Vector(1,0),
				new Grape2D.Vector(0,1),
				new Grape2D.Vector(-1,1),
				new Grape2D.Vector(-1,0)
			],
			position: new Grape2D.Vector(-1.9,1.9)
		});
	ok(satInstance.polygonVsPolygon(polygon1, polygon2), "They're colliding.");
});
test("Polygon vs Polygon non colliding", function(){
	var polygon1 = new Grape2D.Polygon({
			vertexList: [
				new Grape2D.Vector(0,-1),
				new Grape2D.Vector(1,-1),
				new Grape2D.Vector(1,0),
				new Grape2D.Vector(0,1),
				new Grape2D.Vector(-1,1),
				new Grape2D.Vector(-1,0)
			],
			position: new Grape2D.Vector(0.6,0.5)
		}),
		polygon2 = new Grape2D.Polygon({
			vertexList: [
				new Grape2D.Vector(0,-1),
				new Grape2D.Vector(1,-1),
				new Grape2D.Vector(1,0),
				new Grape2D.Vector(0,1),
				new Grape2D.Vector(-1,1),
				new Grape2D.Vector(-1,0)
			],
			position: new Grape2D.Vector(-0.5,-0.5)
		});
	ok(!satInstance.polygonVsPolygon(polygon1, polygon2), "They're not colliding.");
});

test("Polygon vs Ray colliding", function(){
	var polygon = new Grape2D.Polygon({
			vertexList: [
				new Grape2D.Vector(-1, -2),
				new Grape2D.Vector(1, -2),
				new Grape2D.Vector(2, 0),
				new Grape2D.Vector(1, 2),
				new Grape2D.Vector(-1, 2),
				new Grape2D.Vector(-2, 0)
			]
		}),
		start = new Grape2D.Vector(3, 4),
		end = new Grape2D.Vector(0,1),
		direction = end.clone().sub(start).normalize(),
		ray = new Grape2D.Ray(start, direction, start.distanceTo(end));
	ok(satInstance.polygonVsRay(polygon, ray), "They're colliding.");
});

test("Polygon vs Ray non colliding", function(){
	var polygon = new Grape2D.Polygon({
			vertexList: [
				new Grape2D.Vector(-1, -2),
				new Grape2D.Vector(1, -2),
				new Grape2D.Vector(2, 0),
				new Grape2D.Vector(1, 2),
				new Grape2D.Vector(-1, 2),
				new Grape2D.Vector(-2, 0)
			]
		}),
		start = new Grape2D.Vector(0, -4),
		end = new Grape2D.Vector(0,-2.5),
		direction = end.clone().sub(start).normalize(),
		ray = new Grape2D.Ray(start, direction, start.distanceTo(end));
	ok(!satInstance.polygonVsRay(polygon, ray), "They're not colliding.");
});
