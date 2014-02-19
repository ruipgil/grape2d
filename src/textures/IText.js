/**
 * Text's interface.
 * 
 * @extends {Grape2D.ITexture}
 * @class
 * @interface
 */
Grape2D.IText = function(){
	Grape2D.ITexture.call(this);
};
Grape2D.IText.prototype = Object.create(Grape2D.ITexture.prototype);
/**
 * Gets text string.
 *
 * @return {!string} Text string.
 * @public
 */
Grape2D.IText.prototype.getText = function(){};
/**
 * Sets the text string.
 *
 * @param {!string} text Text string.
 * @public
 */
Grape2D.IText.prototype.setText = function(text){};
/**
 * Gets text color.
 *
 * @return {!Grape2D.Color} Text color.
 * @public
 */
Grape2D.IText.prototype.getColor = function(){};
/**
 * Sets the text color.
 *
 * @param {!Grape2D.Color} color Text color.
 * @public
 */
Grape2D.IText.prototype.setColor = function(color){};
/**
 * Sets text size.
 *
 * @return {!number} Text size.
 * @public
 */
Grape2D.IText.prototype.getSize = function(){};
/**
 * Sets the text size.
 *
 * @param {!number} size Text size.
 * @public
 */
Grape2D.IText.prototype.setSize = function(size){};
/**
 * Sets text font.
 *
 * @return {!string} Text font.
 * @public
 */
Grape2D.IText.prototype.getFont = function(){};
/**
 * Gets text font.
 *
 * @param {!string} font Text font.
 * @public
 */
Grape2D.IText.prototype.setFont = function(font){};