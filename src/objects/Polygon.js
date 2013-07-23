/**
 * Polygon describes a polygon shape. A list of vertexes should
 *   should be provided or set afterwards.
 *
 * @param {!Grape2D.Vector=} options.position The position of the polygon
 * @param {!Array.<!Grape2D.Vector>} options.vertexList A list with the
 *   vertexes of the polygon. They're position should be relative to the
 *   position. This means that a vertex at (0,0) is at the same position
 *   that <code>polygon.getPosition()</code>.
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
	/**
	 * Polygon's vertexes. Relative to the world.
	 *
	 * @type {!Array.<!Grape2D.Vector>}
	 * @private
	 */
	this.computedVertexList = [];
	this.computeVertexList();
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
	this.computeVertexList();
};
/**
 * Gets the vertex list relative to the world.
 *
 * @return {!Array.<!Grape2D.Vector>} Array with the vertexes.
 * @public
 */
Grape2D.Polygon.prototype.getComputedVertexList = function(){
	return this.computedVertexList;
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
 * Computes the original vertex coordinates, to be relative to the
 *   world position.
 * 
 * @protected
 */
Grape2D.Polygon.prototype.computeVertexList = function(){
	this.computedVertexList = [];
	for(var i=0; i<this.vertexList.length; i++){
		this.computedVertexList.push(this.getPosition().clone().add(this.vertexList[i]));
	}
};
/**
 * @override
 */
Grape2D.Polygon.prototype.setPosition = function(vector){
	Grape2D.Shape.prototype.setPosition.call(this, vector);
	this.computeVertexList();
};
/**
 * Type of the shape.
 *
 * @type {!string}
 * @static
 * @private
 */
Grape2D.Polygon.TYPE = "Polygon";