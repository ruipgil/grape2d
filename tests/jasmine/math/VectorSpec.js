describe("Vector class", function(){
	addCustomMatchers();
	describe("creation", function(){
		it("with no params", function(){
			var vector = new Grape2D.Vector();
			expect(vector.getX()).toBe(0);
			expect(vector.getY()).toBe(0);
		});
		it("with just one param", function(){
			var vector = new Grape2D.Vector(1);
			expect(vector.getX()).toBe(1);
			expect(vector.getY()).toBe(0);

			vector = new Grape2D.Vector(null, 2);
			expect(vector.getX()).toBe(0);
			expect(vector.getY()).toBe(2);

			vector = new Grape2D.Vector(undefined, 3);
			expect(vector.getX()).toBe(0);
			expect(vector.getY()).toBe(3);
		});
		it("both params", function(){
			var vector = new Grape2D.Vector(-4354,4212);
			expect(vector.getX()).toBe(-4354);
			expect(vector.getY()).toBe(4212);
		});
	});
	describe("setters", function(){
		it("for the components", function(){
			var vector = new Grape2D.Vector(123, 321);
			expect(vector.getX()).toBe(123);
			expect(vector.getY()).toBe(321);
			vector.setX(-8874);
			vector.setY(9835);
			expect(vector.getX()).toBe(-8874);
			expect(vector.getY()).toBe(9835);
		});
		it("for the entire vector", function(){
			var vector = new Grape2D.Vector();
			expect(vector.getX()).toBe(0);
			expect(vector.getY()).toBe(0);
			vector.set(new Grape2D.Vector(3695, 8745));
			expect(vector.getX()).toBe(3695);
			expect(vector.getY()).toBe(8745);
		});
	});
	it("comparison", function(){
		var v1 = new Grape2D.Vector(8,98.8),
			v2 = new Grape2D.Vector();
		expect(v1.equals(v2)).toBe(v2.equals(v1));
		expect(v1.equals(v2)).toBe(false);
		v2.set(v1);
		expect(v1.equals(v2)).toBe(v2.equals(v1));
		expect(v1.equals(v2)).toBe(true);
	});
	it("clone", function(){
		var temp = new Grape2D.Vector(846, -986),
			clone = temp.clone();
		expect(temp).not.toBe(clone);
		expect(clone.getX()).toBe(846);
		expect(clone.getY()).toBe(-986);
	});
	describe("math operations", function(){
		describe("between a scalar", function(){
			var temp;
			it("multiplyByScalar", function(){
				temp = new Grape2D.Vector();
				//adds and checks return value
				expect(temp.multiplyByScalar(5)).toBe(temp);
				//checks values
				expect(temp.getX()).toBe(0);
				expect(temp.getY()).toBe(0);
				expect(temp.set(new Grape2D.Vector(3,7)).multiplyByScalar(11)).toBe(temp);
				//adds and checks return value
				//checks values
				expect(temp.getX()).toBe(33);
				expect(temp.getY()).toBe(77);
			});
			it("divideByScalar", function(){
				temp = new Grape2D.Vector();
				//adds and checks return value
				expect(temp.divideByScalar(5)).toBe(temp);
				//checks values
				expect(temp.getX()).toBe(0);
				expect(temp.getY()).toBe(0);
				expect(temp.set(new Grape2D.Vector(3,7)).divideByScalar(5)).toBe(temp);
				//adds and checks return value
				//checks values
				expect(temp.getX()).toBe(0.6);
				expect(temp.getY()).toBe(1.4);
			});
		});
		describe("between another vector", function(){
			var vector = new Grape2D.Vector(5,1),
				temp;
			it("add", function(){
				temp = new Grape2D.Vector();
				//adds and checks return value
				expect(temp.add(vector)).toBe(temp);
				//checks values
				expect(temp.getX()).toBe(5);
				expect(temp.getY()).toBe(1);
				//checks if they're equal
				expect(temp.equals(vector)).toBeTruthy();
				//adds and checks return value
				expect(temp.add(vector)).not.toBe(vector);
				//checks values
				expect(temp.getX()).toBe(10);
				expect(temp.getY()).toBe(2);
				//checks integrety of the original
				expect(vector.getX()).toBe(5);
				expect(vector.getY()).toBe(1);
			});
			it("sub", function(){
				temp = new Grape2D.Vector(30, 8);
				//adds and checks return value
				expect(temp.sub(vector)).toBe(temp);
				//checks values
				expect(temp.getX()).toBe(25);
				expect(temp.getY()).toBe(7);
				//checks if they're equal
				expect(temp.equals(vector)).not.toBeTruthy();
				//adds and checks return value
				expect(temp.sub(vector)).not.toBe(vector);
				//checks values
				expect(temp.getX()).toBe(20);
				expect(temp.getY()).toBe(6);
				//checks integrety of the original
				expect(vector.getX()).toBe(5);
				expect(vector.getY()).toBe(1);
			});
			it("dot", function(){
				temp = new Grape2D.Vector();
				expect(temp.dot(temp)).toBe(0);
				temp = new Grape2D.Vector(3,7);
				expect(temp.dot(temp)).toBe(58);
				expect(temp.dot(new Grape2D.Vector(1.5, 5))).toBe(39.5);
			});
			it("project", function(){
				var proTemp = new Grape2D.Vector(73, 9);
				temp = proTemp.project(vector);
				expect(temp).not.toBe(proTemp);
				expect(temp).not.toBe(vector);
				expect(temp.getX()).toBe(1870);
				expect(temp.getY()).toBe(374);
			});
			it("isParallelTo", function(){
				expect(new Grape2D.Vector(3, 1).isParallelTo(new Grape2D.Vector(-3, -1))).toBeTruthy();
				expect(new Grape2D.Vector(3, 1).isParallelTo(new Grape2D.Vector(-3, -1.0001))).not.toBeTruthy();
			});
			it("distanceTo", function(){
				expect(vector.distanceTo(new Grape2D.Vector(5, 1))).toBe(0);
				expect(vector.distanceTo(new Grape2D.Vector(0, 8))).toBeApproximately(8.602325267);
				expect(vector.distanceTo(new Grape2D.Vector(-660, 87345))).toBeApproximately(87346.53148);
			});
			it("sqDistanceTo", function(){
				expect(vector.sqDistanceTo(new Grape2D.Vector(5, 1))).toBe(0);
				expect(vector.sqDistanceTo(new Grape2D.Vector(0, 8))).toBeApproximately(74);
				expect(vector.sqDistanceTo(new Grape2D.Vector(-660, 87345))).toBeApproximately(7629416561);
			});
			it("xDistanceTo", function(){
				expect(vector.xDistanceTo(new Grape2D.Vector(5, 1))).toBe(0);
				expect(vector.xDistanceTo(new Grape2D.Vector(0, 8))).toBeApproximately(5);
				expect(vector.xDistanceTo(new Grape2D.Vector(-660, 87345))).toBeApproximately(655);
			});
			it("yDistanceTo", function(){
				expect(vector.yDistanceTo(new Grape2D.Vector(5, 1))).toBe(0);
				expect(vector.yDistanceTo(new Grape2D.Vector(0, 8))).toBeApproximately(7);
				expect(vector.yDistanceTo(new Grape2D.Vector(-660, 87345))).toBeApproximately(87340);
			});
		});
		describe("with it's own components", function(){
			var temp;
			it("negate", function(){
				temp = new Grape2D.Vector(6, -8);
				expect(temp.negate()).toBe(temp);
				expect(temp.getX()).toBe(-6);
				expect(temp.getY()).toBe(8);

				temp = new Grape2D.Vector(-6, 8);
				expect(temp.negate()).toBe(temp);
				expect(temp.getX()).toBe(6);
				expect(temp.getY()).toBe(-8);

				temp = new Grape2D.Vector(-6, -8);
				expect(temp.negate()).toBe(temp);
				expect(temp.getX()).toBe(6);
				expect(temp.getY()).toBe(8);

				temp = new Grape2D.Vector(6, 8);
				expect(temp.negate()).toBe(temp);
				expect(temp.getX()).toBe(-6);
				expect(temp.getY()).toBe(-8);
				expect(temp.negate()).toBe(temp);
				expect(temp.getX()).toBe(6);
				expect(temp.getY()).toBe(8);
			});
			it("normalize", function(){
				temp = new Grape2D.Vector(1, 0);
				expect(temp.normalize()).toBe(temp);
				expect(temp.getX()).toBe(1);
				expect(temp.getY()).toBe(0);

				temp = new Grape2D.Vector(356, 564).normalize();
				expect(temp.getX()).toBeApproximately(0.5337673282);
				expect(temp.getY()).toBeApproximately(0.8456313851);
			});
			it("getMagnitude", function(){
				temp = new Grape2D.Vector(0, 0);
				expect(temp.getMagnitude()).toBe(0);
				temp = new Grape2D.Vector(1, 0);
				expect(temp.getMagnitude()).toBe(1);
				temp = new Grape2D.Vector(84, 11);
				expect(temp.getMagnitude()).toBeApproximately(84.71717653);
			});
			it("length", function(){
				temp = new Grape2D.Vector(0, 0);
				expect(temp.length()).toBe(0);
				temp = new Grape2D.Vector(1, 0);
				expect(temp.length()).toBe(1);
				temp = new Grape2D.Vector(84, 11);
				expect(temp.getMagnitude()).toBeApproximately(84.71717653);
			});
			it("lengthSquared", function(){
				temp = new Grape2D.Vector(0, 0);
				expect(temp.lengthSquared()).toBe(0);
				temp = new Grape2D.Vector(1, 0);
				expect(temp.lengthSquared()).toBe(1);
				temp = new Grape2D.Vector(84, 11);
				expect(temp.lengthSquared()).toBe(7177);
			});
			it("getAngle", function(){
				temp = new Grape2D.Vector(1, 0);
				expect(temp.getAngle()).toBe(0);
				temp = new Grape2D.Vector(0, 1);
				expect(temp.getAngle()).toBe(Grape2D.Math.PId2);
				temp = new Grape2D.Vector(1, 1);
				expect(temp.getAngle()).toBe(Grape2D.Math.PId4);
				temp = new Grape2D.Vector(-1, 0);
				expect(temp.getAngle()).toBe(Grape2D.Math.PI);
				temp = new Grape2D.Vector(0, -1);
				expect(temp.getAngle()).toBe(3*Grape2D.Math.PId2);
			});
			it("rightNormal", function(){
				temp = new Grape2D.Vector();
				var normal = temp.rightNormal();
				expect(temp).not.toBe(normal);
				expect(temp.getX()).toBe(0);
				expect(temp.getY()).toBe(0);
				expect(normal.getX()).toBe(0);
				expect(normal.getY()).toBe(0);
				temp = new Grape2D.Vector(541, 135).rightNormal();
				expect(temp.getX()).toBe(-135);
				expect(temp.getY()).toBe(541);
				temp = new Grape2D.Vector(-88, -74).rightNormal();
				expect(temp.getX()).toBe(74);
				expect(temp.getY()).toBe(-88);
			});
			it("leftNormal", function(){
				temp = new Grape2D.Vector();
				var normal = temp.leftNormal();
				expect(temp).not.toBe(normal);
				expect(temp.getX()).toBe(0);
				expect(temp.getY()).toBe(0);
				expect(normal.getX()).toBe(0);
				expect(normal.getY()).toBe(0);
				temp = new Grape2D.Vector(541, 135).leftNormal();
				expect(temp.getX()).toBe(135);
				expect(temp.getY()).toBe(-541);
				temp = new Grape2D.Vector(-88, -74).leftNormal();
				expect(temp.getX()).toBe(-74);
				expect(temp.getY()).toBe(88);
			});
		});
	});
	it("use", function(){
		var temp = new Grape2D.Vector(1234.359,-584.7379);
		expect(temp.use(Grape2D.Math.round)).toBe(temp);
		expect(temp.getX()).toBe(1234);
		expect(temp.getY()).toBe(-585);
	});
	it("toString", function(){
		var temp = new Grape2D.Vector(-3.365,985);
		expect(temp.toString()).toBe("Grape2D.Vector (-3.365,985)");
		temp = new Grape2D.Vector();
		expect(temp.toString()).toBe("Grape2D.Vector (0,0)");
		temp = new Grape2D.Vector(1);
		expect(temp.toString()).toBe("Grape2D.Vector (1,0)");
		temp = new Grape2D.Vector(null, 9);
		expect(temp.toString()).toBe("Grape2D.Vector (0,9)");
		temp = new Grape2D.Vector(undefined, -11);
		expect(temp.toString()).toBe("Grape2D.Vector (0,-11)");
	});
	it("reset", function(){
		var temp = new Grape2D.Vector(846, 9854);
		expect(temp.reset()).toBe(temp);
		expect(temp.getX()).toBe(0);
		expect(temp.getY()).toBe(0);
	});
	it("isZero", function(){
		var temp = new Grape2D.Vector();
		expect(temp.isZero()).toBeTruthy();
		temp = new Grape2D.Vector(1,0);
		expect(temp.isZero()).not.toBeTruthy();
		temp = new Grape2D.Vector(0,1);
		expect(temp.isZero()).not.toBeTruthy();
		temp = new Grape2D.Vector(-897,845351);
		expect(temp.isZero()).not.toBeTruthy();
	});
	it("getStaticType", function(){
		var temp = new Grape2D.Vector(84, 951);
		expect(temp.getStaticType()).toBe(Grape2D.Vector.STATIC_TYPE);
	});
	describe("static functions", function(){
		it("createFromPoints", function(){
			var temp = Grape2D.Vector.createFromPoints(new Grape2D.Vector(), new Grape2D.Vector());
			expect(temp.getX()).toBe(0);
			expect(temp.getY()).toBe(0);
			temp = Grape2D.Vector.createFromPoints(new Grape2D.Vector(3, -9), new Grape2D.Vector());
			expect(temp.getX()).toBe(-3);
			expect(temp.getY()).toBe(9);
			temp = Grape2D.Vector.createFromPoints(new Grape2D.Vector(3, -9), new Grape2D.Vector(-874,45));
			expect(temp.getX()).toBe(-877);
			expect(temp.getY()).toBe(54);
		});
		it("createFromAngle", function(){
			var temp = Grape2D.Vector.createFromAngle(0, 1);
			expect(temp.equals(new Grape2D.Vector(1, 0))).toBeTruthy();
			temp = Grape2D.Vector.createFromAngle(Grape2D.Math.PI, 1);
			expect(temp.getX()).toBeApproximately(-1);
			expect(temp.getY()).toBeApproximately(0);
			temp = Grape2D.Vector.createFromAngle(Grape2D.Math.PIx2, 1);
			expect(temp.getX()).toBeApproximately(1);
			expect(temp.getY()).toBeApproximately(0);
		});
		it("lerp", function(){
			var temp = Grape2D.Vector.lerp(new Grape2D.Vector(1,5), new Grape2D.Vector(), 0);
			expect(temp.getX()).toBe(1);
			expect(temp.getY()).toBe(5);
			temp = Grape2D.Vector.lerp(new Grape2D.Vector(1,5), new Grape2D.Vector(), 0.35);
			expect(temp.getX()).toBe(0.65);
			expect(temp.getY()).toBe(3.25);
			temp = Grape2D.Vector.lerp(new Grape2D.Vector(1,5), new Grape2D.Vector(), 1);
			expect(temp.getX()).toBe(0);
			expect(temp.getY()).toBe(0);
		});
	});
});