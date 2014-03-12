describe("AABB shape", function(){
	it("instantiation", function(){
		var aabb = new Grape2D.AABB({
			width: 20,
			height: 30
		});
		expect(aabb.getPosition().isZero()).toBeTruthy();
		expect(aabb.getWidth()).toBe(20);
		expect(aabb.getHeight()).toBe(30);

		var vector = new Grape2D.Vector(-464,-881024);
		aabb = new Grape2D.AABB({
			position: vector,
			width: 87654,
			height: 1124
		});
		expect(aabb.getPosition().equals(vector)).toBeTruthy();
		expect(aabb.getPosition()).not.toBe(vector);
		expect(aabb.getWidth()).toBe(87654);
		expect(aabb.getHeight()).toBe(1124);

		aabb = new Grape2D.AABB({
			position: vector,
			width: 7451,
			height: 132
		});
		expect(aabb.getPosition().equals(vector)).toBeTruthy();
		expect(aabb.getPosition()).not.toBe(vector);
		expect(aabb.getWidth()).toBe(7451);
		expect(aabb.getHeight()).toBe(132);

		aabb = new Grape2D.AABB({
			minX: 10,
			minY: 7,
			maxX: 13,
			maxY: 8
		});
		vector = new Grape2D.Vector(11.5, 7.5);
		expect(aabb.getPosition().equals(vector)).toBeTruthy();
		expect(aabb.getPosition()).not.toBe(vector);
		expect(aabb.getWidth()).toBe(3);
		expect(aabb.getHeight()).toBe(1);
	});
	it("getting and setting position", function(){
		var aabb = new Grape2D.AABB({
			width: 1,
			height: 1
		}), vector = new Grape2D.Vector(-8.1354, 8451.001);
		expect(aabb.getPosition().isZero).toBeTruthy();
		aabb.setPosition(vector);
		expect(aabb.getPosition().equals(vector)).toBeTruthy();
		expect(aabb.getPosition()).not.toBe(vector);
	});
	it("getting and setting widths, heights, mins and maxs ", function(){
		var aabb = new Grape2D.AABB({
			width: 643,
			height: 41
		});
		expect(aabb.getWidth()).toBe(643);
		expect(aabb.getHalfWidth()).toBe(321.5);
		expect(aabb.getHeight()).toBe(41);
		expect(aabb.getHalfHeight()).toBe(20.5);
		expect(aabb.getMinX()).toBe(-321.5);
		expect(aabb.getMinY()).toBe(-20.5);
		expect(aabb.getMaxX()).toBe(321.5);
		expect(aabb.getMaxY()).toBe(20.5);

		aabb = new Grape2D.AABB({
			position: new Grape2D.Vector(-98,7),
			width: 643,
			height: 41
		});
		expect(aabb.getWidth()).toBe(643);
		expect(aabb.getHalfWidth()).toBe(321.5);
		expect(aabb.getHeight()).toBe(41);
		expect(aabb.getHalfHeight()).toBe(20.5);
		expect(aabb.getMinX()).toBe(-419.5);
		expect(aabb.getMinY()).toBe(-13.5);
		expect(aabb.getMaxX()).toBe(223.5);
		expect(aabb.getMaxY()).toBe(27.5);
	});
	it("getStaticType", function(){
		expect(new Grape2D.AABB({
			width: 1,
			height: 2
		}).getStaticType()).toBe(Grape2D.AABB.TYPE);
	});
});