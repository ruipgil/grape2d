/**
 * Camera is used to select the objects to display in a scene.
 *   A camera doesn't rotate or scale objects in the x and y axis,
 *   only the coordinates are changed to the transformation defined.
 *
 * @param {!Object=} options Setup options.
 * @param {!Grape2D.Vector=} options.scale The scale to be applied. There
 *		are two ways to define the scale. This method is one, the other
 *		is defined it directly in the transformation. If the two are set,
 *		then the two are applied.
 * @param {!Grape2D.Vector=} options.lookAt Defines the (center) position,
 *		to where the camera is looking at.
 * @param {!Grape2D.Matrix=} options.transformation Transformation matrix
 *		to be applied to the object coordinates.
 * @constructor
 */
Grape2D.Camera = function(options) {
	options = options || {};
	/**
	 * Scale relative to the camera initialization.
	 *
	 * @type {!Grape2D.Vector}
	 * @private
	 */
	this.rscale = new Grape2D.Vector(1, 1);
	/**
	 * Scale set by the user, should be defined in the matrix.
	 *
	 * @type {!Grape2D.Vector}
	 * @private
	 */
	this.scale = options.scale || new Grape2D.Vector(1, 1);
	/**
	 * The position to where the camera is looking at.
	 *
	 * @type {!Grape2D.Vector}
	 * @private
	 */
	this.lookAt = options.lookAt || new Grape2D.Vector();
	/**
	 * The transformation matrix to aply to the object coordinates.
	 *
	 * @type {!Grape2D.Matrix}
	 * @private
	 */
	this.transformation = options.transformation || new Grape2D.Matrix();

	/**
	 * Computed matrix
	 *
	 * @type {!Grape2D.Matrix}
	 * @private
	 */
	this.cM = new Grape2D.Matrix();
	/**
	 * Inverse of the computed matrix
	 *
	 * @type {!Grape2D.Matrix}
	 * @private
	 */
	this.icM = new Grape2D.Matrix();
	this.computeMatrix();
};

Grape2D.Camera.prototype = {
	constructor: Grape2D.Camera,
	/**
	 * Computes the matrix for better performances.
	 *
	 * @protected
	 */
	computeMatrix: function() {
		this.cM = this.transformation.clone();
		//This operations should work fine, and it avoids a multiplication
		//between the _cM matrix and a vector when converting coordinates
		this.cM.v[0] *= this.scale.getX() * this.rscale.getX();
		this.cM.v[1] *= this.scale.getX() * this.rscale.getX();
		this.cM.v[2] *= this.scale.getX() * this.rscale.getX();

		this.cM.v[3] *= this.scale.getY() * this.rscale.getY();
		this.cM.v[4] *= this.scale.getY() * this.rscale.getY();
		this.cM.v[5] *= this.scale.getY() * this.rscale.getY();

		this.icM = this.cM.clone().invert();
	},
	/**
	 * Applies the transformation, on a vector in the World Coordinate
	 * System (WCS), to get a vector in the Viewport (Renderer) Coordinate
	 * System (VSC).
	 *
	 * @param  {!Grape2D.Renderer} renderer The viewport.
	 * @param  {!Grape2D.Vector} vector Vector in the WCS.
	 * @return {!Grape2D.Vector} A vector in the VCS
	 * @public
	 */
	wcsToViewport: function(renderer, vector) {
		var v = this.cM.multiplyByVector(vector.clone().sub(this.getLookAt()));

		v.setX(v.getX()+renderer.getHalfWidth());
		v.setY(v.getY()+renderer.getHalfHeight());

		return v;
	},
	/**
	 * Applies the transformation, on a vector in the Viewport Coordinate
	 * System (VCS), to get a vector in the World Coordinate System (WSC).
	 *
	 * @param  {!Grape2D.Renderer} renderer The viewport.
	 * @param  {!Grape2D.Vector} vector Vector in the VCS.
	 * @return {!Grape2D.Vector} A vector in the WCS
	 * @public
	 */
	viewportToWcs: function(renderer, vector) {
		var v = vector.clone();

		v.setX(v.getX()-renderer.getHalfWidth());
		v.setY(v.getY()-renderer.getHalfHeight());

		v = this.icM.multiplyByVector(v).sub(this.getLookAt());

		return v;
	},
	/**
	 * Sets a new scale.
	 *
	 * @param  {!Grape2D.Vector} scale The new scale.
	 * @public
	 */
	rescale: function(scale) {
		this.rscale.setX( scale.getX() / this.scale.getX() );
		this.rscale.setY( scale.getY() / this.scale.getY() );
		this.computeMatrix();
	},
	/**
	 * Sets the center position to where the camera is looking at.
	 *
	 * @param  {!Grape2D.Vector} position The new look at.
	 * @public
	 */
	setLookAt: function(position) {
		this.lookAt.set(position);
	},
	/**
	 * Gets the look at property.
	 *
	 * @return {!Grape2D.Vector} The look at.
	 */
	getLookAt: function() {
		return this.lookAt;
	},
	/**
	 * Gets the current scale. Scale defined in the transformation is
	 * not taken into account.
	 *
	 * @return {!Grape2D.Vector} Scale
	 */
	getScale: function() {
		return this.scale;
	},
	/**
	 * Creates a shape, based on the camera transformation and
	 *   renderer properties.
	 *
	 * @param  {!Grape2D.Renderer} renderer The renderer.
	 * @return {!Grape2D.Shape} A bounding volume representing the
	 *   camera view region.
	 */
	computeShape: function(renderer) {
		var pos = new Grape2D.Vector().set(this.lookAt),
			w = renderer.getWidth() / this.scale.getX(),
			h = renderer.getHeight() / this.scale.getY();

		return new Grape2D.AABB({
			position: pos,
			width: w,
			height: h
		});
	}
};