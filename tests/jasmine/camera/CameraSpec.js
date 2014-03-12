describe("camera", function(){
	var camera = new Grape2D.Camera(),
		renderer = {
			getWidth: function(){
				return 100;
			},
			getHalfWidth: function(){
				return 50;
			},
			getHeight: function(){
				return 100;
			},
			getHalfHeight: function(){
				return 50;
			}
		};
	it("coordinate transformation", function(){
		var wcsOriginal = new Grape2D.Vector(),
			vcs = camera.wcsToViewport(wcsOriginal),
			wcs = camera.viewportToWcs(renderer, vcs);
		expect(wcs.getX()).toBe(wcsOriginal.getX()-renderer.getHalfWidth());
		expect(wcs.getY()).toBe(wcsOriginal.getY()-renderer.getHalfHeight());

		camera.setLookAt(new Grape2D.Vector(3, 3));
		vcs = camera.wcsToViewport(wcsOriginal);
		wcs = camera.viewportToWcs(renderer, vcs);
		expect(wcs.getX()).toBe(wcsOriginal.getX()-renderer.getHalfWidth());
		expect(wcs.getY()).toBe(wcsOriginal.getY()-renderer.getHalfHeight());

		camera.setLookAt(new Grape2D.Vector());

		wcsOriginal.setXY(-87, 47);
		vcs = camera.wcsToViewport(wcsOriginal);
		wcs = camera.viewportToWcs(renderer, vcs);
		expect(wcs.getX()).toBe(wcsOriginal.getX()-renderer.getHalfWidth());
		expect(wcs.getY()).toBe(wcsOriginal.getY()-renderer.getHalfHeight());

		camera.setLookAt(new Grape2D.Vector(3, 3));
		vcs = camera.wcsToViewport(wcsOriginal);
		wcs = camera.viewportToWcs(renderer, vcs);
		expect(wcs.getX()).toBe(wcsOriginal.getX()-renderer.getHalfWidth());
		expect(wcs.getY()).toBe(wcsOriginal.getY()-renderer.getHalfHeight());

	});
});