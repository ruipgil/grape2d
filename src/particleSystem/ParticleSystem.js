/**
 * Particle system.
 *
 * @extends {Grape2D.Entity}
 * @constructor
 */
Grape2D.ParticleSystem = function(){
	Grape2D.Entity.call(this, {
		boundingBox: new Grape2D.AABB({
			width: 0,
			height: 0
		})
	});
	/**
	 * Emitters of particles of the system.
	 *
	 * @type {!Array.<!Grape2D.Emitter>}
	 * @private
	 */
	this.emitters = [];
	/**
	 * Fields that interact with the particles of the system.
	 *
	 * @type {!Array.<!Grape2D.Field>}
	 * @private
	 */
	this.fields = [];
	/**
	 * Value of the minimum x coordinate of the particles of the system.
	 *   Used for a faster creation of the bounding box of the system.
	 *
	 * @type {!number}
	 * @private
	 */
	this.minx = +Infinity;
	/**
	 * Value of the minimum y coordinate of the particles of the system.
	 *   Used for a faster creation of the bounding box of the system.
	 *
	 * @type {!number}
	 * @private
	 */
	this.miny = +Infinity;
	/**
	 * Value of the maximum x coordinate of the particles of the system.
	 *   Used for a faster creation of the bounding box of the system.
	 *
	 * @type {!number}
	 * @private
	 */
	this.maxx = -Infinity;
	/**
	 * Value of the maximum y coordinate of the particles of the system.
	 *   Used for a faster creation of the bounding box of the system.
	 *
	 * @type {!number}
	 * @private
	 */
	this.maxy = -Infinity;
};

Grape2D.ParticleSystem.prototype = Object.create(Grape2D.Entity.prototype);
/**
 * Adds an emitter to the system.
 *
 * @param  {!Grape2D.Emitter} emitter Emitter to add.
 * @public
 */
Grape2D.ParticleSystem.prototype.addEmitter = function(emitter){
	emitter.setParticleSystem(this);
	this.emitters.push(emitter);
};
/**
 * Removes an emitter from the system.
 *
 * @param  {!Grape2D.Emitter} emitter An emitter that is in the system.
 * @public
 */
Grape2D.ParticleSystem.prototype.removeEmitter = function(emitter){
	this.emitters.splice(this.emitters.indexOf(emitter), 1);
};
/**
 * Gets the emitter list.
 *
 * @return {!Array.<!Grape2D.Emitter>} Emitters of the system.
 * @public
 */
Grape2D.ParticleSystem.prototype.getEmitters = function(){
	return this.emitters;
};
/**
 * Adds a field to the system.
 *
 * @param  {!Grape2D.Field} field Field to add.
 * @public
 */
Grape2D.ParticleSystem.prototype.addField = function(field){
	this.fields.push(field);
};
/**
 * Removes a field from the system.
 *
 * @param  {!Grape2D.Field} field A field that is in the system.
 * @public
 */
Grape2D.ParticleSystem.prototype.removeField = function(field){
	this.fields.splice(this.fields.indexOf(field), 1);
};
/**
 * Gets the fields list.
 *
 * @return {!Array.<!Grape2D.Field>} Fields of the system.
 * @public
 */
Grape2D.ParticleSystem.prototype.getFields = function(){
	return this.fields;
};
/**
 * @override
 */
Grape2D.ParticleSystem.prototype.update = function(dt, scene){
	this.minx = +Infinity;
	this.miny = +Infinity;
	this.maxx = -Infinity;
	this.maxy = -Infinity;
	for(var i=0; i<this.emitters.length;i++){
		this.emitters[i].update(dt, scene);
	}
	var w = this.maxx-this.minx,
		h = this.maxy-this.miny,
		center = new Grape2D.Vector(this.minx+w/2, this.miny+h/2),
		bbox = this.getBoundingBox();
	bbox.setWidth(w);
	bbox.setHeight(h);
	bbox.setPosition(center);
};
/**
 * Submits a particle to the system. This method is used mainly
 *   to keep an updated bounding box.
 *
 * @param  {!Grape2D.Particle} particle Particle inside the system.
 * @public
 */
Grape2D.ParticleSystem.prototype.submitParticle = function(particle){
	var x = particle.getPosition().getX(),
		y = particle.getPosition().getY();
	if(this.minx>x){
		this.minx = x;
	}
	if(this.miny>y){
		this.miny = y;
	}
	if(this.maxx<x){
		this.maxx = x;
	}
	if(this.maxy<y){
		this.maxy = y;
	}
};
/**
 * @override
 */
Grape2D.ParticleSystem.prototype.getPosition = function(){
	return this.getBoundingBox().getPosition();
};
/**
 * @override
 */
Grape2D.ParticleSystem.prototype.render = function(renderer){
	for(var i=0; i<this.emitters.length;i++){
		this.emitters[i].render(renderer);
	}
	this.getBoundingBox().render(renderer);
};
