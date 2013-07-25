/**
 * Emits particles to the particle system.
 *
 * @param  {!Object} options Setup properties.
 * @param  {!Grape2D.Vector} options.position Position of the emitter,
 *   and initial position of the particles.
 * @param  {!Grape2D.Vector} options.velocity Initial velocity of the
 *   particles.The length of the vector indicated its speed. The angle
 *   indicates the angle.
 * @param  {!number=} options.speedVariation Variation of the length of
 *   the velocity vector. So that particles created have a speed
 *   between <code>velocity.length-speedVariation</code> and
 *   <code>velocity.length+speedVariation</code>.
 * @param  {!number=} options.spread Spread of particles relative to the
 * velocity angle. It should be in radius.
 * @param  {!number} options.particleLife Life of a particle in milliseconds.
 * @param  {!number=} options.particleLifeVariation Life variation of
 *   particles created, relative to the life property.
 * @param  {!number=} options.maxParticles Maximum number of particles
 *   that this emitter can have, dead or alive. Because the particles
 *   are instantiated at construction time.
 * @param  {!number=} options.rate Rate of particles emitted, per second.
 *
 * @constructor
 */
Grape2D.Emitter = function(options) {
	/**
	 * Position of the emitter and initial position of newly created or
	 *   revived particles.
	 *
	 * @type {!Grape2D.Vector}
	 * @private
	 */
	this.position = options.position;
	/**
	 * Initial velocity of the particles.
	 *
	 * @type {!Grape2D.Vector}
	 * @private
	 */
	this.velocity = options.velocity;
	/**
	 * Cached value, of the velocity angle.
	 *
	 * @type {!number}
	 * @private
	 */
	this.vAngle = this.velocity.getAngle();
	/**
	 * Cached value, of the magnitude of the velocity.
	 *
	 * @type {!number}
	 * @private
	 */
	this.vMagnitude = this.velocity.getMagnitude();
	/**
	 * Speed variation of created or revived particles.
	 *
	 * @type {!number}
	 * @private
	 */
	this.speedVariation = options.speedVariation || 0;
	/**
	 * Spread of the particles, in relation to the velocity vector.
	 *
	 * @type {!number}
	 * @private
	 */
	this.spread = options.spread || 0;
	/**
	 * Life of particles.
	 *
	 * @type {!number}
	 * @private
	 */
	this.particleLife = options.particleLife || 200;
	/**
	 * Life variation of particles.
	 *
	 * @type {!number}
	 * @private
	 */
	this.particleLifeVariation = options.particleLifeVariation || 0;
	/**
	 * Emitter maximum particles.
	 *
	 * @type {!number}
	 * @private
	 */
	this.maxParticles = options.maxParticles;
	/**
	 * Rate of particles to emit per second.
	 *
	 * @type {!number}
	 * @private
	 */
	this.rate = options.rate || 60;
	/**
	 * Rate of particles to emit per millisecond.
	 *
	 * @type {!number}
	 * @private
	 */
	this.mrate = this.rate / 1000;
	/**
	 * Particles of the emitter.
	 *
	 * @type {!Array.<!Grape2D.Particle>}
	 * @private
	 */
	this.particles = [];
	this.createParticles();
	/**
	 * Particle system associated with this emitter.
	 *
	 * @type {Grape2D.ParticleSystem}
	 * @private
	 */
	this.particleSystem = null;
	/**
	 * Number of particle rendered after each render cycle.
	 *
	 * @type {!number}
	 * @private
	 */
	this.renderedParticles = 0;
};

Grape2D.Emitter.prototype = {
	constructor: Grape2D.Emitter,
	/**
	 * Gets the position of the emitter.
	 *
	 * @return {!Grape2D.Vector} Position of the emitter.
	 * @public
	 */
	getPosition: function() {
		return this.position;
	},
	/**
	 * Sets the position of the emitter.
	 *
	 * @param  {!Grape2D.Vector} position Position of the emitter.
	 * @public
	 */
	setPosition: function(position) {
		this.position.set(position);
	},
	/**
	 * Gets the velocity of the emitter.
	 *
	 * @return {!Grape2D.Vector} Velocity of the emitter.
	 * @public
	 */
	getVelocity: function() {
		return this.velocity;
	},
	/**
	 * Sets the velocity of the emitter.
	 *
	 * @param  {!Grape2D.Vector} velocity Velocity of the emitter.
	 * @public
	 */
	setVelocity: function(velocity) {
		this.velocity.set(velocity);
	},
	/**
	 * Gets the speed variation of the created particles.
	 *
	 * @return {!number} Speed variation.
	 * @public
	 */
	getSpeedVariation: function() {
		return this.speedVariation;
	},
	/**
	 * Sets the speed variation of the created particles.
	 *
	 * @param  {!number} speedVariation Speed variation.
	 * @public
	 */
	setSpeedVariation: function(speedVariation) {
		this.speedVariation = speedVariation;
	},
	/**
	 * Gets the spread of the created particles, relative to the
	 *   velocity vector angle.
	 *
	 * @return {!number} Spread of the created particles.
	 * @public
	 */
	getSpread: function() {
		return this.spread;
	},
	/**
	 * Sets the spread of the created particles, relative to the
	 *   velocity vector angle.
	 *
	 * @param  {!number} spread Spread of the created particles.
	 * @public
	 */
	setSpread: function(spread) {
		this.spread = spread;
	},
	/**
	 * Gets the particle life of the created particles.
	 *
	 * @return {!number} Particle life.
	 * @public
	 */
	getParticleLife: function() {
		return this.particleLife;
	},
	/**
	 * Sets the particle life of the created particles.
	 *
	 * @param  {!number} particleLife Particle life.
	 * @public
	 */
	setParticleLife: function(particleLife) {
		this.particleLife = particleLife;
	},
	/**
	 * Gets the particle life variation of the created particles,
	 *   relative to the particle life.
	 *
	 * @return {!number} Particle life variation.
	 * @public
	 */
	getParticleLifeVariation: function() {
		return this.particleLifeVariation;
	},
	/**
	 * Sets the particle life variation of the created particles,
	 *   relative to the particle life.
	 *
	 * @param  {!number} particleLifeVariation Particle life variation.
	 * @public
	 */
	setParticleLifeVariation: function(particleLifeVariation) {
		this.particleLifeVariation = particleLifeVariation;
	},
	/**
	 * Gets the rate that the emitter emits particles.
	 *
	 * @return {!number} Emission rate.
	 * @public
	 */
	getRate: function() {
		return this.rate;
	},
	/**
	 * Sets the rate that the emitter emits particles.
	 *
	 * @param  {!number} rate Emission rate.
	 * @public
	 */
	setRate: function(rate) {
		this.rate = rate;
	},
	/**
	 * Gets the particles associated with this emitter, they can be
	 *   either dead or alive.
	 *
	 * @return {!Array.<!Grape2D.Particle>} Particles.
	 * @public
	 */
	getParticles: function() {
		return this.particles;
	},
	/**
	 * Gets the particle system associated with this emitter.
	 *
	 * @return {?Grape2D.ParticleSystem} Particle system.
	 * @public
	 */
	getParticleSystem: function() {
		return this.particleSystem;
	},
	/**
	 * Sets the particle system associated with this emitter.
	 *
	 * @param  {!Grape2D.ParticleSystem} ps Particle system.
	 * @public
	 */
	setParticleSystem: function(ps) {
		this.particleSystem = ps;
	},
	/**
	 * Gets the number of particles rendered in the last call to the
	 *   {@link Grape2D.Emitter.render} method.
	 *
	 * @return {!number} Number of particles rendered.
	 */
	getRenderedParticles: function(){
		return this.renderedParticles;
	},
	/**
	 * Create particles. Up to the maximum number of particles of the
	 *   emitter.
	 *
	 * @protected
	 */
	createParticles: function() {
		for (var i = 0; i < this.maxParticles; i++) {
			this.particles.push(new Grape2D.Particle({
				position: this.position.clone(),
				velocity: Grape2D.Vector.createFromAngle(
					this.vAngle + Grape2D.Math.randFloat(-this.spread, this.spread),
					this.vMagnitude + Grape2D.Math.randFloat(-this.speedVariation, this.speedVariation)),
				lifeTime: -1
			}));
		}
	},
	/**
	 * Revives a particle according to the emitter properties.
	 *
	 * @param  {!Grape2D.Particle} particle Particle to revive.
	 * @protected
	 */
	reviveParticle: function(particle) {
		particle.revive(
			this.position,
			Grape2D.Vector.createFromAngle(this.vAngle + Grape2D.Math.randFloat(-this.spread, this.spread), this.vMagnitude + Grape2D.Math.randFloat(-this.speedVariation, this.speedVariation)),
			this.particleLife + Grape2D.Math.randInt(-this.particleLifeVariation, this.particleLifeVariation));

	},
	/**
	 * Updates an emitter. If there are particles dead, it revives them
	 *   according to the rate specified.
	 *   The emitter should have a particle system associated, if this
	 *   method is to be called, it could be done through <code>
	 *   emitter.setParticleSystem(particleSystem);</code>
	 *
	 * @param  {!number} dt Time elapsed since the last update.
	 * @param  {!Grape2D.Scene} scene Scene of the emitter.
	 * @public
	 */
	update: function(dt, scene) {
		var dead = [],
			rate = Grape2D.Math.floor(this.mrate * dt),
			fields = this.particleSystem.getFields(),
			particle;
		for (var i = 0; i < this.particles.length; i++) {
			particle = this.particles[i];
			if (particle.isDead()) {
				if (rate>=0) {
					this.reviveParticle(particle);
					rate--;
					this.particleSystem.submitParticle(particle);
				}
			} else {
				particle.submitToFields(fields);
				particle.update(dt, scene);
				this.particleSystem.submitParticle(particle);
			}
		}
	},
	/**
	 * Renders the particles into a renderer.
	 *
	 * @param  {!Grape2D.Renderer} renderer Renderer.
	 * @param  {!Grape2D.Camera} camera Camera.
	 * @public
	 */
	render: function(renderer, camera) {
		this.renderedParticles = 0;
		for (var i = 0; i < this.particles.length; i++) {
			if (this.particles[i].isAlive()) {
				this.particles[i].render(renderer, camera);
				this.renderedParticles++;
			}
		}
	}
};