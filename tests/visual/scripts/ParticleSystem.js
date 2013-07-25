/* global Grape2D */
var particleSystem, em;
var PS = function(renderer, scene, camera) {
	Grape2D.SimpleGame.call(this, renderer, scene, camera);
};
PS.prototype = Object.create(Grape2D.SimpleGame.prototype);
PS.prototype.setup = function() {
	particleSystem = new Grape2D.ParticleSystem();
	em = new Grape2D.Emitter({
		position: new Grape2D.Vector(),
		velocity: new Grape2D.Vector(0,0.1),
		speedVariation: 0.1,
		maxParticles: 3000,
		spread: Grape2D.Math.PId4,
		particleLife: 1500,
		particleLifeVariance: 600,
		rate: 300
	});
	particleSystem.addEmitter(em);
	particleSystem.addField(new Grape2D.Field({
		mass: -2,
		position: new Grape2D.Vector(0, 100)
	}));
	this.getScene().getMap().add(particleSystem);
};
PS.prototype.update = function(dt) {
	Grape2D.SimpleGame.prototype.update.call(this, dt);
	this.getScene().getMap().rebuild();
};
PS.prototype.render = function() {
	Grape2D.SimpleGame.prototype.render.call(this);
	this.getRenderer().renderText("Particles: "+em.getRenderedParticles(), new Grape2D.Vector(20,20));
};
var psys = new PS(
	new Grape2D.CanvasRenderer({
		width: Grape2D.utils.getDocumentSize().width,
		height: Grape2D.utils.getDocumentSize().height
	}),
	new Grape2D.SceneLayer({
		map: new Grape2D.TopDownBVHTree()
	}),
	new Grape2D.Camera({
		scale: new Grape2D.Vector(1,1)
	})
);
window.onload = function() {
	psys.getRenderer().appendToDOMElement(document.body);
	psys.setup();
	psys.start();
};