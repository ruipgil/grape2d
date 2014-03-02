/**
 * Sound spatialization.
 *
 * @param {!Object=} options Setup options.
 * @param {!Grape2D.Vector} options.position Sound position.
 * @param {!Grape2D.Vector} options.velocity Sound velocity.
 * @param {!Grape2D.Vector} options.orientation Sound orientation.
 * @param {!string} options.panningModel Panning model.
 * @param {!string} options.distanceModel Distance model.
 * @param {!number} options.refDistance Reference distance.
 * @param {!number} options.maxDistance Maximum distance.
 * @param {!number} options.rolloffFactor Rolloff factor.
 * @param {!number} options.coneInnerAngle Cone inner angle.
 * @param {!number} options.coneOuterAngle Cone outer angle.
 * @param {!number} options.coneOuterGain Cone outer gain.
 * @implements {Grape2D.SoundIO}
 * @constructor
 */
Grape2D.SoundPanner = function(options) {
	/**
	 * Panner node.
	 *
	 * @type {!AudioPannerNode}
	 * @private
	 */
	this.panner = Grape2D.SoundManagerSingleton.getContext().createPanner();
	/**
	 * Position of the sound.
	 *
	 * @type {!Grape2D.Vector}
	 * @private
	 */
	this.position = new Grape2D.Vector();
	if(options.position) {
		this.setPosition(options.position);
	}
	/**
	 * Velocity of the sound.
	 *
	 * @type {!Grape2D.Vector}
	 * @private
	 */
	this.velocity = new Grape2D.Vector();
	if(options.velocity) {
		this.setVelocity(options.velocity);
	}
	/**
	 * Orientation of the sound.
	 *
	 * @type {!Grape2D.Vector}
	 * @private
	 */
	this.orientation = new Grape2D.Vector();
	if(options.orientation) {
		this.setOrientation(options.orientation);
	}

	if(options.panningModel) {
		this.setPanningModel(options.panningModel);
	}
	if(options.distanceModel) {
		this.setDistanceModel(options.distanceModel);
	}
	if(options.refDistance) {
		this.setRefDistance(options.refDistance);
	}
	if(options.maxDistance) {
		this.setMaxDistance(options.maxDistance);
	}
	if(options.rolloffFactor) {
		this.setRolloffFactor(options.rolloffFactor);
	}
	if(options.coneInnerAngle) {
		this.setConeInnerAngle(options.coneInnerAngle);
	}
	if(options.coneOuterAngle) {
		this.setConeOuterAngle(options.coneOuterAngle);
	}
	if(options.coneOuterGain) {
		this.setConeOuterGain(options.coneOuterGain);
	}
};
Grape2D.SoundPanner.prototype = Object.create(Grape2D.SoundIO.prototype);
/**
 * Get sound's position.
 *
 * @return {!Grape2D.Vector} Sound's position.
 * @public
 */
Grape2D.SoundPanner.prototype.getPosition = function() {
	return this.position;
};
/**
 * Sets sound position.
 *
 * @param {!Grape2D.Vector} position Sound's position.
 * @public
 */
Grape2D.SoundPanner.prototype.setPosition = function(position) {
	this.position.set(position);
	this.panner.setPosition(position.getX(), position.getY(), 0);
};
/**
 * Get sound's velocity.
 *
 * @return {!Grape2D.Vector} Sound's velocity.
 * @public
 */
Grape2D.SoundPanner.prototype.getVelocity = function() {
	return this.velocity;
};
/**
 * Sets sound velocity.
 *
 * @param {!Grape2D.Vector} velocity Sound's velocity.
 * @public
 */
Grape2D.SoundPanner.prototype.setVelocity = function(velocity) {
	this.velocity.set(velocity);
	this.panner.setVelocity(velocity.getX(), velocity.getY(), 0);
};
/**
 * Get sound's orientation.
 *
 * @return {!Grape2D.Vector} Sound's orientation.
 * @public
 */
Grape2D.SoundPanner.prototype.getOrientation = function() {
	return this.orientation;
};
/**
 * Sets sound orientation.
 *
 * @param {!Grape2D.Vector} orientation Sound's orientation.
 * @public
 */
Grape2D.SoundPanner.prototype.setOrientation = function(orientation) {
	this.velocity.set(orientation);
	this.panner.setOrientation(orientation.getX(), orientation.getY(), 0);
};
/**
 * Gets the panning model.
 *
 * @return {!string} Panning model.
 * @public
 */
Grape2D.SoundPanner.prototype.getPanningModel = function() {
	return this.panner.panningModel;
};
/**
 * Sets panning model.
 *
 * @param {!string} panningModel Panning model.
 * @public
 */
Grape2D.SoundPanner.prototype.setPanningModel = function(panningModel) {
	this.panner.panningModel = panningModel;
};
/**
 * Gets the distance model.
 *
 * @return {!string} Distance model.
 * @public
 */
Grape2D.SoundPanner.prototype.getDistanceModel = function() {
	return this.panner.distanceModel;
};
/**
 * Sets distance model.
 *
 * @param {!string} distanceModel Distance model.
 * @public
 */
Grape2D.SoundPanner.prototype.setDistanceModel = function(distanceModel) {
	this.panner.distanceModel = distanceModel;
};
/**
 * Gets the reference distance.
 *
 * @return {!number} Reference distance.
 * @public
 */
Grape2D.SoundPanner.prototype.getRefDistance = function() {
	return this.panner.refDistance;
};
/**
 * Sets the reference distance.
 *
 * @param {!number} refDistance Reference distance.
 * @public
 */
Grape2D.SoundPanner.prototype.setRefDistance = function(refDistance) {
	this.panner.refDistance = refDistance;
};
/**
 * Gets the maximum distance.
 *
 * @return {!number} Maximum distance.
 * @public
 */
Grape2D.SoundPanner.prototype.getMaxDistance = function() {
	return this.panner.maxDistance;
};
/**
 * Sets the maximum distance.
 *
 * @param {!number} maxDistance Maximum distance.
 * @public
 */
Grape2D.SoundPanner.prototype.setMaxDistance = function(maxDistance) {
	this.panner.maxDistance = maxDistance;
};
/**
 * Gets the rolloff distance.
 *
 * @return {!number} Rolloff distance.
 * @public
 */
Grape2D.SoundPanner.prototype.getRolloffFactor = function() {
	return this.panner.rolloffFactor;
};
/**
 * Sets the rolloff factor.
 *
 * @param {!number} rolloffFactor Rolloff factor.
 * @public
 */
Grape2D.SoundPanner.prototype.setRolloffFactor = function(rolloffFactor) {
	this.panner.rolloffFactor = rolloffFactor;
};
/**
 * Gets the cone inner angle.
 *
 * @return {!number} Cone inner angle.
 * @public
 */
Grape2D.SoundPanner.prototype.getConeInnerAngle = function() {
	return this.panner.coneInnerAngle;
};
/**
 * Sets the cone inner angle.
 *
 * @param {!number} coneInnerAngle Cone inner angle.
 * @public
 */
Grape2D.SoundPanner.prototype.setConeInnerAngle = function(coneInnerAngle) {
	this.panner.coneInnerAngle = coneInnerAngle;
};
/**
 * Gets the cone outer angle.
 *
 * @return {!number} Cone outer angle.
 * @public
 */
Grape2D.SoundPanner.prototype.getConeOuterAngle = function() {
	return this.panner.coneOuterAngle;
};
/**
 * Sets the cone outer angle.
 *
 * @param {!number} coneOuterAngle Cone outer angle.
 * @public
 */
Grape2D.SoundPanner.prototype.setConeOuterAngle = function(coneOuterAngle) {
	this.panner.coneOuterAngle = coneOuterAngle;
};
/**
 * Gets the cone outer gain.
 *
 * @return {!number} Cone outer gain.
 * @public
 */
Grape2D.SoundPanner.prototype.getConeOuterGain = function() {
	return this.panner.coneOuterGain;
};
/**
 * Sets the cone outer gain.
 *
 * @param {!number} coneOuterGain Cone outer gain.
 * @public
 */
Grape2D.SoundPanner.prototype.setConeOuterGain = function(coneOuterGain) {
	this.panner.coneOuterGain = coneOuterGain;
};
/**
 * @override
 */
Grape2D.SoundPanner.prototype.connect = function(toConnect) {
	this.panner.connect(toConnect);
	return this;
};
/**
 * @override
 */
Grape2D.SoundPanner.prototype.getDestination = function() {
	return this.panner;
};
/**
 * Panning model.
 *
 * @type {!Object.<!string, !string>}
 * @public
 * @constant
 */
Grape2D.SoundPanner.PANNING_MODEL = {
	EQUALPOWER: "equalpower",
	HRTF: "hrtf"
};
/**
 * Distance model.
 *
 * @type {!Object.<!string, !string>}
 * @public
 * @constant
 */
Grape2D.SoundPanner.DISTANCE_MODEL = {
	LINEAR: "linear",
	INVERSE: "inverse",
	EXPONENTIAL: "exponential"
};