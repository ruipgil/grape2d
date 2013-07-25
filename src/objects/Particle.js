/**
 * Particle.
 *
 * @param  {!Object=} options Setup options. See {@link Grape2D.Shape}
 * @param  {!Grape2D.Vector=} options.velocity Particle's velocity.
 * @param  {!Grape2D.Vector=} options.acceleration Particle's acceleration.
 * @param  {!number} options.lifeTime Particle's remaining time, in
 *   milliseconds.
 *
 * @extends {Grape2D.Shape}
 * @constructor
 */
Grape2D.Particle = function(options) {
	Grape2D.Shape.call(this, options);
	/**
	 * Velocity of the particle.
	 *
	 * @type {!Grape2D.Vector}
	 * @private
	 */
	this.velocity = options.velocity || new Grape2D.Vector();
	/**
	 * Acceleration of the particle.
	 *
	 * @type {!Grape2D.Vector}
	 * @private
	 */
	this.acceleration = options.acceleration || new Grape2D.Vector();
	/**
	 * Remaining life time of the particle in milliseconds.
	 *
	 * @type {!number}
	 * @private
	 */
	this.lifeTime = options.lifeTime || 250;
	//console.log(this.lifeTime);
};

Grape2D.Particle.prototype = Object.create(Grape2D.Shape.prototype);
/**
 * Gets the particle velocity.
 *
 * @return {!Grape2D.Vector} Particle velocity.
 * @public
 */
Grape2D.Particle.prototype.getVelocity = function() {
	return this.velocity;
};
/**
 * Sets the particle velocity.
 *
 * @param  {!Grape2D.Vector} velocity Velocity of the particle.
 * @public
 */
Grape2D.Particle.prototype.setVelocity = function(velocity) {
	this.velocity.set(velocity);
};
/**
 * Gets the particle acceleration.
 *
 * @return {!Grape2D.Vector} Particle acceleration.
 * @public
 */
Grape2D.Particle.prototype.getAcceleration = function() {
	return this.velocity;
};
/**
 * Sets the particle acceleration.
 *
 * @param  {!Grape2D.Vector} acceleration Acceleration of the particle.
 * @public
 */
Grape2D.Particle.prototype.setAcceleration = function(acceleration) {
	this.acceleration.set(acceleration);
};
/**
 * Gets the particle remaining life time.
 *
 * @return {!number} Particle life time.
 * @public
 */
Grape2D.Particle.prototype.getLifeTime = function() {
	return this.lifeTime;
};
/**
 * Sets the particle remaining life time.
 *
 * @param  {!number} lifeTime Remaining life time of the particle.
 * @public
 */
Grape2D.Particle.prototype.setLifeTime = function(lifeTime) {
	this.lifeTime = lifeTime;
};
/**
 * @override
 */
Grape2D.Particle.prototype.render = function(renderer, camera) {
	renderer.renderParticle(this, camera);
};
/**
 * Checks if the particle is in the alive state.
 *
 * @return {!boolean} True if it's alive.
 * @public
 */
Grape2D.Particle.prototype.isAlive = function() {
	return this.lifeTime > 0;
};
/**
 * Checks if the particle is in the dead state.
 *
 * @return {!boolean} True if it's dead.
 * @public
 */
Grape2D.Particle.prototype.isDead = function() {
	return this.lifeTime <= 0;
};
/**
 * Revives the particle according to a set of properties.
 *
 * @param  {!Grape2D.Vector} position Position of the particle.
 * @param  {!Grape2D.Vector} velocity Velocity of the particle.
 * @param  {!number} lifeTime Remaining life time of the particle.
 * @public
 */
Grape2D.Particle.prototype.revive = function(position, velocity, lifeTime) {
	this.position.set(position);
	this.velocity.set(velocity);
	this.lifeTime = lifeTime;
	this.acceleration.reset();
};
/**
 * Submits the particle to the force of fields.
 *
 * @param  {!Array.<!Grape2D.Field>} fields Fields to submit.
 * @public
 */
Grape2D.Particle.prototype.submitToFields = function(fields) {
	var accel = new Grape2D.Vector();
	for (var i = 0; i < fields.length; i++) {
		accel.add(fields[i].computeAcceleration(this.position));
	}
	this.acceleration.set(accel);
};
/**
 * Updates the particle.
 *
 * @param  {!number} dt Time elapsed since the last update.
 * @param  {!Grape2D.Scene} scene Scene where the particle is.
 * @public
 */
Grape2D.Particle.prototype.update = function(dt, scene) {
	//simple euler integration.
	this.velocity.setX(this.velocity.getX() + this.acceleration.getX() * dt);
	this.velocity.setY(this.velocity.getY() + this.acceleration.getY() * dt);
	this.position.setX(this.position.getX() + this.velocity.getX() * dt);
	this.position.setY(this.position.getY() + this.velocity.getY() * dt);
	this.lifeTime -= dt;
};