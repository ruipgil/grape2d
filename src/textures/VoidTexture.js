/**
 * A void texture doesn't render any image, nor have any property.
 *
 * @implements {Grape2D.ITexture}
 * @constructor
 */
Grape2D.VoidTexture = function() {};

Grape2D.VoidTexture.prototype = Object.create(Grape2D.ITexture);
/**
 * @override
 */
Grape2D.VoidTexture.prototype.getWidth = function(){
	return 0;
};
/**
 * @override
 */
Grape2D.VoidTexture.prototype.getHalfWidth = function(){
	return 0;
};
/**
 * @override
 */
Grape2D.VoidTexture.prototype.setWidth = function(width){
	return;
};
/**
 * @override
 */
Grape2D.VoidTexture.prototype.getHeight = function(){
	return 0;
};
/**
 * @override
 */
Grape2D.VoidTexture.prototype.getHalfHeight = function(){
	return 0;
};
/**
 * @override
 */
Grape2D.VoidTexture.prototype.setHeight = function(height){
	return;
};
/**
 * @override
 */
Grape2D.VoidTexture.prototype.render = function(){
	return;
};