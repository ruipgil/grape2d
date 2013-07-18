/* global Grape2D */
var evtMang;

var CollisionTest = function(renderer, scene, camera) {
	Grape2D.SimpleGame.call(this, renderer, scene, camera);
	this.firstPoint = new Grape2D.Vector();
	this.currentShape = null;
	this.currentHUDText = "";
	this.polyPoints = [];
	/**
	 * State of insertion,
	 * <ul>
	 * <li>0: Waiting to select shape type.
	 * <li>1: First point inserted.
	 * <li>2: Inserting polygon vertexes.
	 *
	 * @type {number}
	 */
	this.state = -1;
	this.collInstance = Grape2D.CollisionCheckerSingleton;
};
CollisionTest.prototype = Object.create(Grape2D.SimpleGame.prototype);
CollisionTest.prototype.collideTest = function(shapeA, shapeB){
	return this.collInstance.collide(shapeA, shapeB);
};
CollisionTest.prototype.selectShape = function(type) {
	if (type == "AABB") {
		this.currentShape = new ColorBox({
			boundingBox: new Grape2D.AABB({
				width: 0,
				height: 0
			})
		});
		this.currentHUDText = "Click to set the center of the AABB.";
	} else if (type == "Circle") {
		this.currentShape = new ColorBox({
			boundingBox: new Grape2D.Circle({
				radius: 0
			})
		});
		this.currentHUDText = "Click to set the center of the Circle.";
	}
	this.state = 0;
	this.getScene().getMap().add(this.currentShape);
}
CollisionTest.prototype.setup = function() {
	var that = this;

	evtMang = new Grape2D.InputManager(this.getRenderer());
	evtMang.addMouseDown(function(ev) {
		var point = that.camera.viewportToWcs(that.renderer, new Grape2D.Vector(ev.getRaw().layerX, ev.getRaw().layerY)),
			type = that.currentShape.getBoundingBox().getStaticType();

		if (that.state === 0) {
			console.log("position was set");
			that.currentShape.setPosition(point);
			if (type == "AABB") {
				that.currentHUDText = "Click again to set the width and height of the AABB.";
			} else if (type == "Circle") {
				that.currentHUDText = "Click again to set the radius of the Circle.";
			}
			that.state = 1;
		} else if (that.state == 1) {
			if (type == "AABB") {
				var w = Grape2D.Math.abs(point.getX() - that.currentShape.getPosition().getX()) * 2,
					h = Grape2D.Math.abs(point.getY() - that.currentShape.getPosition().getY()) * 2;
				that.currentShape.getBoundingBox().setWidth(w);
				that.currentShape.getBoundingBox().setHeight(h);
			} else if (type == "Circle") {
				var r = point.distanceTo(that.currentShape.getPosition());
				that.currentShape.setBoundingBox.setRadius(r);
			}
			that.state = -1;
		}
	});
	evtMang.addMouseMove(function(ev) {
		var point = that.camera.viewportToWcs(that.renderer, new Grape2D.Vector(ev.getRaw().layerX, ev.getRaw().layerY)),
			type = that.currentShape.getBoundingBox().getStaticType();

		if (that.state == 1) {
			if (type == "AABB") {
				var w = Grape2D.Math.abs(point.getX() - that.currentShape.getPosition().getX()) * 2,
					h = Grape2D.Math.abs(point.getY() - that.currentShape.getPosition().getY()) * 2;
				that.currentShape.getBoundingBox().setWidth(w);
				that.currentShape.getBoundingBox().setHeight(h);
			} else if (type == "Circle") {
				var r = point.distanceTo(that.currentShape.getPosition());
				that.currentShape.setBoundingBox.setRadius(r);
			}
		}
	});
};
/**
 * @override
 */
CollisionTest.prototype.update = function(dt) {
	this.scene.update(dt);
};

var size = Grape2D.utils.getDocumentSize(),
	clt = new CollisionTest(
		new Grape2D.WireframeRenderer(
			new Grape2D.CanvasRenderer({
				width: size.width,
				height: size.height
			})
		),
		new Grape2D.SceneLayer({
			map: new Grape2D.SimpleMap()
		}),
		new Grape2D.Camera({
			scale: new Grape2D.Vector(1, 1)
		})
	);
window.onload = function() {
	clt.getRenderer().appendToDOMElement(document.body);
	clt.setup();
	clt.start();
};