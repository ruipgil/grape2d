/**
 * An entity is an object with a 2D position and a position.
 * Essentially it's the basic information of an object. By itself it
 *   shouldn't rendered. To render it use a wrapper, such as
 *   {@see Grape2D.REntity}.
 *   This present in the client-side and in the server-side. While the
 *   {@see Grape2D.REntity} is only present in the client-side. This
 *   way things stay uncoupled and there isn't any unnecessary
 *   instances in either side.
 *
 * @param {!Object} options Setup options.
 * @param {!Grape2D.Vector=} options.position Center position of the
 *   entity. The default position is the origin (0,0). It will copy
 *   the object.
 * @param {!Grape2D.IShape} options.boundingBox Bounding box of the
 *   object. It's used to check for collisions. The position of the
 *   shape should always be <code>position+offset</code>.
 * @param {!Grape2D.Vector=} options.boundingBoxOffset The offset of
 *   the bounding box, relative to the entity center. The default
 *   offset is none (0,0). It will copy the object.
 *
 * @implements {Grape2D.IEntity}
 * @constructor
 */
Grape2D.Entity = function(options) {
	/**
	 * Central position of the entity.
	 *
	 * @type {!Grape2D.Vector}
	 * @private
	 */
	this.position = new Grape2D.Vector();
	if(options.position){
		this.position.set(options.position);
	}
	/**
	 * Bounding box.
	 *
	 * @type {!Grape2D.IShape}
	 * @private
	 */
	this.boundingBox = options.boundingBox;
	/**
	 * Bounding box offset, relative to the central position.
	 *
	 * @type {!Grape2D.Vector}
	 * @private
	 */
	this.boundingBoxOffset = new Grape2D.Vector();
	if(options.boundingBoxOffset){
		this.boundingBoxOffset.set(options.boundingBoxOffset);
	}

	this.computeBoundingBoxPosition();
};
Grape2D.Entity.prototype = Object.create(Grape2D.IEntity.prototype);
/**
 * @override
 */
Grape2D.Entity.prototype.getPosition = function(){
	return this.position;
};
/**
 * @override
 */
Grape2D.Entity.prototype.setPosition = function(position){
	this.position.set(position);
};
/**
 * @override
 */
Grape2D.Entity.prototype.getBoundingBox = function(){
	return this.boundingBox;
};
/**
 * @override
 */
Grape2D.Entity.prototype.setBoundingBox = function(boundingBox){
	this.boundingBox = boundingBox;
	this.computeBoundingBoxPosition();
};
/**
 * @override
 */
Grape2D.Entity.prototype.getBoundingBoxOffset = function(){
	return this.boundingBoxOffset;
};
/**
 * @override
 */
Grape2D.Entity.prototype.setBoundingBoxOffset = function(boundingBoxOffset){
	this.boundingBoxOffset.set(boundingBoxOffset);
	this.computeBoundingBoxPosition();
};
/**
 * @override
 */
Grape2D.Entity.prototype.computeBoundingBoxPosition = function(){
	this.boundingBox.setPosition(this.position.clone().add(this.boundingBoxOffset));
};
/**
 * @override
 */
Grape2D.Entity.prototype.process = function(processor){
	processor.processEntity(this);
};