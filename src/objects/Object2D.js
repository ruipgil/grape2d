/**
 * Object2D represents an object of the scene.
 *   An Object2D is a simple scene object which the main
 *   purpose is to render a texture at a position. More
 *   complex behaviors should be implemented by others
 *   objects that inherit from Object2D.
 *
 * @param {!Grape2D.Vector=} options.position The position of the shape
 * @param {!boolean=} options.visible True to render the object, false
 *		otherwise.
 * @param {!Grape2D.Texture} options.texture The texture of the object.
 * @param {!Grape2D.Vector=} options.textureOffset The offset position
 *		of the texture relative to the objects position.
 * @param {!Grape2D.Shape} options.boundingBox The primary use of the
 *		bounding box is to select the items to display in the renderer,
 *		other behaviors such as collision detection can be done with
 *		this property, in some simple cases. So the bounding box should
 *		bounded tightly to what's supposed to be seen.
 * @param {!Grape2D.Vector=} options.boundingBoxOffset The offset
 *		position of the bounding box relative to the objects position.
 * @param {!boolean=} options.castShadow Used by the IlluminatedRenderer
 *		to render this object shadow.
 * @param {!boolean=} options.receiveLight Used by the IlluminatedRenderer
 *		to render the objects texture with a light overlay, if set to true.
 *
 * @constructor
 */
Grape2D.Object2D = function (options) {

	/**
	 * Object's position.
	 *
	 * @type {!Grape2D.Vector}
	 * @private
	 */
	this.position = options.position || new Grape2D.Vector();

	/**
	 * Visible property.
	 *
	 * @type {!boolean}
	 * @private
	 */
	this.visible = options.visible || true;

	/**
	 * The texture of the object.
	 *
	 * @type {!Grape2D.Texture}
	 * @private
	 */
	this.texture = options.texture;
	/**
	 * The offset of the texture.
	 *
	 * @type {!Grape2D.Vector}
	 * @private
	 */
	this.textureOffset = options.textureOffset || new Grape2D.Vector();
	/**
	 * The position of the texture. It is computed from the object's position and the texture offset.
	 *
	 * @type {!Grape2D.Vector}
	 * @private
	 */
	this.texturePosition = new Grape2D.Vector();
	//computes the texture position.
	this.computeTexturePosition();
	/**
	 * Object's bounding box.
	 *
	 * @type {!Grape2D.Shape}
	 * @private
	 */
	this.boundingBox = options.boundingBox;
	/**
	 * Bounding box offset.
	 *
	 * @type {!Grape2D.Vector}
	 * @private
	 */
	this.boundingBoxOffset = options.boundingBoxOffset || new Grape2D.Vector();

	this.computeBoundingBoxPosition();

	/**
	 * Object cast shadow.
	 *
	 * @type {!boolean}
	 * @private
	 */
	this.castShadow = options.castShadow || false;
	/**
	 * Object can receive light.
	 *
	 * @type {!boolean}
	 * @private
	 */
	this.receiveLight = options.receiveLight || false;

};

Grape2D.Object2D.prototype = {
	constructor: Grape2D.Object2D,
	/**
	 * Checks if the object should be rendered.
	 *
	 * @return {!boolean} True if it can be rendered.
	 * @public
	 */
	isVisible: function () {
		return this.visible;
	},
	/**
	 * Sets if an object should be rendered.
	 *
	 * @param  {!boolean} visible True, so that it renders, false
	 *   otherwise.
	 * @public
	 */
	setVisible: function (visible) {
		this.visible = visible;
		return;
	},
	/**
	 * Gets the texture of the object.
	 *
	 * @return {!Grape2D.Texture} The texture of the object.
	 * @public
	 */
	getTexture: function () {
		return this.texture;
	},
	/**
	 * Sets the texture of the object.
	 *
	 * @param  {!Grape2D.Texture} texture The texture.
	 * @public
	 */
	setTexture: function (texture) {
		this.texture = texture;
		return;
	},
	/**
	 * Gets the bounding box of the object.
	 *
	 * @return {!Grape2D.Shape} The shape of the object.
	 * @public
	 */
	getBoundingBox: function () {
		return this.boundingBox;
	},
	/**
	 * Sets the bounding box of the object.
	 * Also, the position of the new bounding box, will be transformed
	 *   in the default offset of the bounding box.
	 *
	 * @param  {!Grape2D.Shape} boundingBox The bounding box.
	 * @public
	 */
	setBoundingBox: function (boundingBox) {
		this.boundingBox = boundingBox;
		this.computeBoundingBoxPosition();
		return;
	},
	/**
	 * Checks if the object can cast shadows.
	 *
	 * @return {!boolean} True if it cast shadows, false otherwise.
	 * @public
	 */
	canCastShadow: function () {
		return this.castShadow;
	},
	/**
	 * Sets if an object can cast shadows.
	 *
	 * @param  {!boolean} castShadow True to cast shadows, false
	 *   otherwise.
	 * @public
	 */
	setCastShadow: function (castShadow) {
		this.castShadow = castShadow;
		return;
	},
	/**
	 * Checks if an object can receive light.
	 *
	 * @return {!boolean} True if it receives light.
	 * @public
	 */
	canReceiveLight: function () {
		return this.receiveLight;
	},
	/**
	 * Sets if the object can receive light.
	 *
	 * @param  {!boolean} receiveLight True if it receives light.
	 * @public
	 */
	setReceiveLight: function (receiveLight) {
		this.receiveLight = receiveLight;
		return;
	},
	/**
	 * Gets the object position. Be careful, because it returns the
	 *   vector used by the object, and not a copy. Use it wisely.
	 *
	 * @return {!Grape2D.Vector} The position of the object.
	 * @public
	 */
	getPosition: function () {
		return this.position;
	},
	/**
	 * Sets the object position.
	 *
	 * @param  {!Grape2D.Vector} position The position of the object.
	 * @public
	 */
	setPosition: function (position) {
		this.position.set(position);
		this.computeBoundingBoxPosition();
		this.computeTexturePosition();
	},
	/**
	 * Sets the texture offset.
	 *
	 * @param  {!Grape2D.Vector} offset The offset of the texture, from
	 *   the object's position.
	 * @public
	 */
	setTextureOffset: function (offset) {
		this.textureOffset.set(offset);
		this.computeTexturePosition();
	},
	/**
	 * Gets the texture offset
	 *
	 * @return {!Grape2D.Vector} The texture offset.
	 * @public
	 */
	getTextureOffset: function () {
		return this.textureOffset;
	},
	/**
	 * Sets the bounding box offset.
	 *
	 * @param  {!Grape2D.Vector} offset The offset of the bounding
	 *   box, from the object's position.
	 * @public
	 */
	setBoundingBoxOffset: function (offset) {
		this.boundingBoxOffset.set(offset);
		this.computeBoundingBoxPosition();
	},
	/**
	 * Gets the bounding box offset
	 *
	 * @return {!Grape2D.Vector} The bounding box offset.
	 * @public
	 */
	getBoundingBoxOffset: function () {
		return this.boundingBoxOffset;
	},
	/**
	 * Computes the bounding box position, from the object's position
	 *   and bounding box offset.
	 * @protected
	 */
	computeBoundingBoxPosition: function () {
		this.boundingBox.setPosition(this.position);
		this.boundingBox.getPosition().add(this.boundingBoxOffset);
	},
	/**
	 * Gets the bounding box position.
	 *
	 * @return {!Grape2D.Vector} The center position of the bounding box.
	 * @public
	 */
	getBoundingBoxPosition: function () {
		return this.boundingBox.getPosition();
	},
	/**
	 * Computes the texture position of the object, from the object's
	 *   position and texture offset.
	 * @protected
	 */
	computeTexturePosition: function () {
		this.texturePosition.set(this.position).add(this.textureOffset);
	},
	/**
	 * Gets the texture position.
	 *
	 * @return {!Grape2D.Vector} The position of the texture
	 * @public
	 */
	getTexturePosition: function () {
		return this.texturePosition;
	},
	/**
	 * Renders the object to a renderer.
	 *
	 * @param  {!Grape2D.Renderer} renderer The place to render the
	 *   object.
	 * @param  {!Grape2D.Camera} camera The camera, that will
	 *   transform the positions.
	 * @public
	 */
	render: function (renderer, camera) {
		renderer.renderObject2D(this, camera);
	},
	/**
	 * Updates the object. This method should be refined in further
	 *   subclasses if needed be.
	 *
	 * @param  {!number} dt Time interval.
	 * @param  {!Grape2D.Scene} scene Scene where this object is.
	 * @public
	 */
	update: function (dt, scene) {},
	/**
	 * Processes this object thought a processor. Same as a visitor
	 *   pattern.
	 *
	 * @param  {Grape2D.Object2DProcessor} processor A processor.
	 * @public
	 */
	process: function(processor) {
		processor.processObject2D(this);
	}
};