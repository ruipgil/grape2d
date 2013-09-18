/**
 * This specifies an {@link Grape2D.Object2D} that is to be transmitted to the client or server, at any time.
 *
 * @param {!Object=} options Setup options. See {@link Grape2D.Object2D}.
 * @param {!(number|string)} options.id Object unique identifier.
 * @extends {Grape2D.Object2D}
 * @constructor
 */
Grape2D.NetworkObject2D = function(options) {
	Grape2D.Object2D.call(this, options);
	this.id = options.id || 0;
};

Grape2D.NetworkObject2D.prototype = Object.create(Grape2D.Object2D.prototype);
/**
 * @override
 */
Grape2D.NetworkObject2D.prototype.render = function(renderer, camera) {
	var networkClone = Grape2D.SnapshotManagerSingleton.getSnapshotNetworkObject2D(this.id);
	if (networkClone && !networkClone.getPosition().equals(this.getPosition())) {
		var lerp = Grape2D.Vector.lerp(this.getPosition(), networkClone.getPosition(), Grape2D.SnapshotManagerSingleton.getLerpPercent());
		this.renderInterpolate(renderer, camera, lerp, snapshot);
	} else {
		this.renderNormal(renderer, camera);
	}
};
/**
 * Renders an object in an interpolating position.
 *
 * @param  {!Grape2D.Renderer} renderer Renderer.
 * @param  {!Grape2D.Camera} camera Camera.
 * @param  {!Grape2D.Vector} lerpPosition Interpolating position.
 * @public
 */
Grape2D.NetworkObject2D.prototype.renderInterpolate = function(renderer, camera, lerpPosition) {
	renderer.renderNetworkObject2D(this, lerpPosition, camera);
};
Grape2D.NetworkObject2D.prototype.renderNormal = function(renderer, camera) {
	Grape2D.Object2D.prototype.render.call(this, renderer, camera);
};
/**
 * @override
 */
Grape2D.NetworkObject2D.prototype.process = function(processor) {
	processor.processNetworkObject2D(this);
};
/**
 * Gets the object's id.
 *
 * @return {!(number|string)} Object's id.
 * @public
 */
Grape2D.NetworkObject2D.prototype.getId = function() {
	return this.id;
};
/**
 * Sets the object's id.
 *
 * @param {!(number|string)} id Object's id.
 * @public
 */
Grape2D.NetworkObject2D.prototype.setId = function(id) {
	this.id = id;
};
/**
 * Creates a clone object to be passed through the network.
 *
 * @return {!Grape2D.SnapshotNetworkObject2D} Network clone.
 * @public
 */
Grape2D.NetworkObject2D.prototype.createNetworkClone = function() {
	return new Grape2D.SnapshotNetworkObject2D(this.id, this.getPosition().getX(), this.getPosition().getY());
};