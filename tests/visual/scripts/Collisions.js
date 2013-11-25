(function(Grape2D, dat, w) {
	var gui, guiObjAFolder, guiObjBFolder;
	var AabbGui = function(aabb, obj) {
		this.width = aabb.getWidth();
		this.height = aabb.getHeight();
		this.watch("width", function(id, oldval, newval) {
			aabb.setWidth(newval);
			return newval;
		});
		this.watch("height", function(id, oldval, newval) {
			aabb.setHeight(newval);
			return newval;
		});
		this.turnToCircle = function() {
			obj.setBoundingBox(new Grape2D.Circle({
				radius: 5
			}));
			obj.loadGui();
		};
		this.turnToPolygon = function() {
			console.log("to polygon");
		};
	};
	var CircleGui = function(obj) {
		this.turnToAabb = function() {
			obj.setBoundingBox(new Grape2D.AABB({
				width: 20,
				height: 20
			}));
			obj.loadGui();
		};
		this.turnToPolygon = function() {
			console.log("to polygon");
		};
	};
	var PolygonGui = function() {
		this.redraw = function() {
			console.log("redraw", arguments);
		};
		this.turnToCircle = function() {
			console.log("to circle");
		};
		this.turnToAabb = function() {
			console.log("to aabb");
		};
	};

	var Collider = function() {};
	Collider.prototype = {
		constructor: Collider,
		collide: function() {},
		render: function() {}
	};

	var ColliderChecker = function(eng) {
		this.eng = eng;
		this.instance = new Grape2D.SATCollisionChecker();
		this.result = false;
		this.renderingPosition = new Grape2D.Vector(20, 50);
	};
	ColliderChecker.prototype = Object.create(ColliderChecker.prototype);
	ColliderChecker.prototype.collide = function() {
		var first, second;
		if (this.eng.bVsA) {
			first = this.eng.objectA.getBoundingBox();
			second = this.eng.objectB.getBoundingBox();
		} else {
			second = this.eng.objectA.getBoundingBox();
			first = this.eng.objectB.getBoundingBox();
		}
		this.result = Grape2D.CollisionDispatcher.dispatch(this.instance, first, second);
	};
	ColliderChecker.prototype.render = function(renderer, camera) {
		renderer.renderText("Collision checker: " + (this.result ? "Colliding" : "Not colliding"), this.renderingPosition);
	};

	var ColliderSolver = function(eng) {
		this.eng = eng;
		this.instance = new Grape2D.CollisionResolver();
		this.booleanResult = false;
		this.manifold = new Grape2D.Manifold(eng.objectA, eng.objectB);
		this.renderingPosition = new Grape2D.Vector(20, 60);
	};
	ColliderSolver.prototype = Object.create(Collider.prototype);
	ColliderSolver.prototype.collide = function() {
		var first, second;
		if (this.eng.bVsA) {
			first = this.eng.objectA;
			second = this.eng.objectB;
		} else {
			second = this.eng.objectA;
			first = this.eng.objectB;
		}
		this.manifold = new Grape2D.Manifold(first, second);
		this.booleanResult = Grape2D.ManifoldDispatcher.dispatch(this.instance, this.manifold);
	};
	ColliderSolver.prototype.render = function(renderer, camera) {
		renderer.renderText("Collision solver: " + (this.booleanResult ? "Colliding, penetration: " + this.manifold.getPenetration() + ", normal: " + this.manifold.getNormal() : "Not colliding"), this.renderingPosition);
		if (this.booleanResult) {
			var obj;
			if (this.eng.bVsA) {
				obj = this.eng.objectB.getPosition();
			} else {
				obj = this.eng.objectA.getPosition();
			}
			renderer.renderLineSegment(obj, obj.clone().add(this.manifold.getNormal().clone().multiplyByScalar(this.manifold.getPenetration())), camera);
		}
	};

	var SelectableObject2D = function(options) {
		Grape2D.Object2D.call(this, options);
		this.color = options.color || "#ffffff";
		this.folder = options.folder;
		this.gui = null;
		this.loadGui();
	};
	SelectableObject2D.prototype = Object.create(Grape2D.Object2D.prototype);
	SelectableObject2D.prototype.render = function(renderer, camera) {
		renderer.setStrokeColor(this.color);
		Grape2D.Object2D.prototype.render.call(this, renderer, camera);
	};
	SelectableObject2D.prototype.loadGui = function() {
		this.clearGui();
		this.folder.addColor(this, 'color');
		var bbox = this.getBoundingBox();
		var shapeGui;
		if (bbox instanceof Grape2D.AABB) {
			shapeGui = new AabbGui(bbox, this);
			this.folder.add(shapeGui, 'width', 1, 100);
			this.folder.add(shapeGui, 'height', 1, 100);
			this.folder.add(shapeGui, 'turnToCircle');
			this.folder.add(shapeGui, 'turnToPolygon');
		} else if (bbox instanceof Grape2D.Circle) {
			shapeGui = new CircleGui(this);
			this.folder.add(bbox, 'radius', 1, 100);
			this.folder.add(shapeGui, 'turnToAabb');
			this.folder.add(shapeGui, 'turnToPolygon');
		} else if (bbox instanceof Grape2D.Polygon) {
			shapeGui = new PolygonGui(this);
			this.folder.add(shapeGui, 'turnToCircle');
			this.folder.add(shapeGui, 'turnToAabb');
			this.folder.add(shapeGui, 'redraw');
		}
		this.gui = shapeGui;
		this.folder.open();
	};
	SelectableObject2D.prototype.hideGui = function() {};
	SelectableObject2D.prototype.clearGui = function() {
		if (this.folder && this.gui) {
			var that = this;
			this.folder.__controllers.forEach(function(controller) {
				that.folder.remove(controller);
			});
			this.folder.__controllers = [];
		}
	};

	var Collision = function(renderer, scene, camera) {
		this.map = new Grape2D.TopDownBVHTree();
		Grape2D.SimpleGame.call(this, renderer || new Grape2D.WireframeRenderer(new Grape2D.CanvasRenderer({
			width: Grape2D.utils.getDocumentSize().width,
			height: Grape2D.utils.getDocumentSize().height
		})), scene || new Grape2D.SceneLayer({
			map: this.map
		}), camera || new Grape2D.AliasingCamera({
			scale: new Grape2D.Vector(20, 20)
		}));

		this.inputManager = new Grape2D.InputManager(this.getRenderer());
		this.checker = new ColliderChecker(this);
		this.solver = new ColliderSolver(this);

		this.objectB = new SelectableObject2D({
			position: new Grape2D.Vector(),
			boundingBox: new Grape2D.AABB({
				width: 20,
				height: 20
			}),
			color: "rgba(255,0,0,1)",
			selected: true,
			folder: guiObjBFolder
		});
		this.objectA = new SelectableObject2D({
			position: new Grape2D.Vector(-10, -10),
			boundingBox: new Grape2D.Polygon({
				vertexList: [new Grape2D.Vector(0,5), new Grape2D.Vector(2.5,2.5), new Grape2D.Vector(-0.5,-5), new Grape2D.Vector(-7,0)]
			}),
			color: "rgba(0,255,0,1)",
			selected: false,
			folder: guiObjAFolder
		});
		this.map.add(this.objectA);
		this.map.add(this.objectB);
		this.map.rebuild();

		var that = this;
		this.bVsA = true;

		this.changeCOrder = function() {
			that.bVsA = !that.bVsA;
		};
	};
	Collision.prototype = Object.create(Grape2D.SimpleGame.prototype);
	Collision.prototype.setup = function() {
		var that = this;
		/*this.inputManager.addClick(function(evnt) {
			var position = that.camera.viewportToWcs(that.renderer, evnt.getPosition());
			var objectClicked = that.map.queryPoint(position);
			if (objectClicked[0]) {
				that.selectedObject.selected = false;
				that.selectedObject = objectClicked[0];
				that.selectedObject.selected = true;

				that.selectedObject.showGui();
			} else {}
		});*/
		this.inputManager.addDrag(function(evnt) {
			var start = that.camera.viewportToWcs(that.renderer, evnt.getStart()),
				end = that.camera.viewportToWcs(that.renderer, evnt.getEnd()),
				sel;
			sel = that.map.queryPoint(start);
			if (sel && sel.length) {
				sel[0].setPosition(sel[0].getPosition().clone().add(end.sub(start)));
			}
		});
		this.inputManager.addKeyDown(Grape2D.InputManager.KEY.C, function() {
			that.solver.collide();
		});
		this.inputManager.addKeyDown(Grape2D.InputManager.KEY.A, function() {
			if (that.solver.booleanResult) {
				var obj;
				if (that.bVsA) {
					obj = that.objectB;
				} else {
					obj = that.objectA;
				}
				obj.setPosition(obj.getPosition().clone().add(that.solver.manifold.getNormal().clone().multiplyByScalar(that.solver.manifold.getPenetration())));

			}
		});
	};
	Collision.prototype.render = function() {
		Grape2D.SimpleGame.prototype.render.call(this);
		this.checker.collide();
		this.solver.collide();
		this.solver.render(this.renderer, this.camera);
		this.checker.render(this.renderer, this.camera);
	};

	w.addEventListener("load", function() {
		gui = new dat.GUI();
		guiObjAFolder = gui.addFolder("Object A");
		guiObjBFolder = gui.addFolder("Object B");
		logB = guiObjAFolder;
		var instance = new Collision();
		gui.add(instance, "changeCOrder");
		instance.getRenderer().appendToDOMElement(document.body);
		instance.setup();
		instance.start();
		log = instance;
	});
})(Grape2D, dat, window);
var log, logB;