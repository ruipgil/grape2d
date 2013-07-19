/**
 * Polygon describes a polygon shape. A list of vertexes should
 *   should be provided or set afterwards.
 *
 * @param {!Grape2D.Vector=} options.position The position of the polygon
 * @param {!Array.<!Grape2D.Vector>} options.vertexList A list with the
 *   vertexes of the polygon.
 *
 * @extends Grape2D.Shape
 * @constructor
 */
Grape2D.Polygon = function(options){
	Grape2D.Shape.call(this, options);
	/**
	 * Polygon's vertexes.
	 *
	 * @type {!Array.<!Grape2D.Vector>}
	 * @private
	 */
	this.vertexList = options.vertexList;
};

Grape2D.Polygon.prototype = Object.create(Grape2D.Shape.prototype);

/**
 * Gets the list of vertexes.
 *
 * @return {!Array.<!Grape2D.Vector>} The array with the vertexes.
 * @public
 */
Grape2D.Polygon.prototype.getVertexList = function(){
	return this.vertexList;
};
/**
 * Sets a list of vertexes.
 *
 * @param  {!Array.<!Grape2D.Vector>} vertexList A list with the new
 *   vertexes.
 * @public
 */
Grape2D.Polygon.prototype.setVertexList = function(vertexList){
	this.vertexList = vertexList;
};
/**
 * @override
 */
Grape2D.Polygon.prototype.render = function(renderer, camera){
	renderer.renderPolygon(this, camera);
};
/**
 * @override
 */
Grape2D.Polygon.prototype.createBV = function(bvfactory){
	return bvfactory.createFromPolygon(this);
};
/**
 * @override
 */
Grape2D.Polygon.prototype.getStaticType = function(){
	return Grape2D.Polygon.TYPE;
};
/**
 * Type of the shape.
 *
 * @type {!string}
 * @static
 * @private
 */
Grape2D.Polygon.TYPE = "Polygon";