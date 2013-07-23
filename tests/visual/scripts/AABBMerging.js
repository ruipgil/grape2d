/* global Grape2D */

/**
 * Represents an object that moves in a circular motion.
 *
 * @param  {Object} options Setup options.
 * @param  {Grape2D.Vector=} options.center Center of the object.
 * @param  {number} options.extension Extension relative to the center.
 *
 * @extends {ColorBox}
 * @constructor
 */
var BoxSample = function(options) {
	ColorBox.call(this, options);
	this.ap = 0;
	this.center = options.center || new Grape2D.Vector();
	this.extension = options.extension || 0;
};
BoxSample.prototype = Object.create(ColorBox.prototype);
/**
 * @override
 */
BoxSample.prototype.update = function(dt, scene) {
	this.ap = (this.ap + dt * BoxSample.CONST) % Grape2D.Math.PIx2;
	this.setPosition(
		new Grape2D.Vector(
			this.center.x + Grape2D.Math.cos(this.ap) * this.extension,
			this.center.y + Grape2D.Math.sin(this.ap) * this.extension));
};
/**
 * Constant to convert time into distance.
 *
 * @type {number}
 * @constant
 */
BoxSample.CONST = 0.002;

var aabb1 = new Grape2D.AABB({
		width: 50,
		height: 50
	}),
	aabb2 = new Grape2D.AABB({
		width: 30,
		height: 18
	}),
	voidTexture = new Grape2D.VoidTexture(),
	obj1, obj2, obj3, evtMang;

/**
 * [ description]
 *
 * @param  {!Grape2D.Renderer} renderer The renderer.
 * @param  {!Grape2D.Scene} scene The scene.
 * @param  {!Grape2D.Camera} camera The camera.
 *
 * @extends {Grape2D.SimpleGame}
 * @constructor
 */
var AABBMerging = function(renderer, scene, camera) {
	Grape2D.SimpleGame.call(this, renderer, scene, camera);
};
AABBMerging.prototype = Object.create(Grape2D.SimpleGame.prototype);
var map;
/**
 * @override
 */
AABBMerging.prototype.setup = function() {
	obj1 = new BoxSample({
		texture: voidTexture,
		boundingBox: aabb1,
		boundingBoxOffset: new Grape2D.Vector(0, 0),
		center: new Grape2D.Vector(0, 0),
		color: 'rgba(0,0,255,1)'
	});

	obj2 = new BoxSample({
		texture: voidTexture,
		boundingBox: aabb2,
		boundingBoxOffset: new Grape2D.Vector(0, 0),
		center: new Grape2D.Vector(0, 0),
		extension: 20,
		color: 'rgba(255,0,0,1)'
	});

	obj3 = new ColorBox({
		texture: voidTexture,
		boundingBox: new Grape2D.AABB({
			width: 0,
			height: 0
		}),
		position: new Grape2D.Vector(),
		color: 'rgba(0,255,0,1)'
	});

	map = this.getScene().getMap();
	map.add(obj1);
	map.add(obj2);
	map.add(obj3);
	map.rebuild();

	//console.log(debugTDBVHTree(map));

	evtMang = new Grape2D.InputManager(this.getRenderer());
	evtMang.addMouseDown(function(ev) {
		console.log(ev);
	});
};
/**
 * @override
 */
AABBMerging.prototype.update = function(dt) {
	Grape2D.SimpleGame.prototype.update.call(this, dt);
	var aabbtemp = Grape2D.BVFactorySingleton.getFactory().merge(aabb1, aabb2);
	obj3.setPosition(aabbtemp.getPosition());
	obj3.setBoundingBox(aabbtemp);
	this.getScene().getMap().rebuild();
};

var size = Grape2D.utils.getDocumentSize(),
	am = new AABBMerging(
		new Grape2D.WireframeRenderer(
			new Grape2D.CanvasRenderer({
				width: size.width,
				height: size.height
			})
		),
		new Grape2D.SceneLayer({
			map: new Grape2D.TopDownBVHTree()
		}),
		new Grape2D.AliasingCamera({
			scale: new Grape2D.Vector(5, 5)
		})
	);
window.onload = function() {
	am.getRenderer().appendToDOMElement(document.body);
	am.setup();
	am.start();
};