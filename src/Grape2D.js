/**
 * @type {!boolean}
 */
var NODE;
/**
 * This is the main namespace.
 * 
 * @namespace
 * @public
 */
var Grape2D = {
	/**
	 * Grape2D's version. It follows the {@link http://semver.org/} protocol.
	 *
	 * @type {string}
	 * @public
	 * @constant
	 */
	version: '1.2.0-alpha',
	/**
	 * Constant that indicates if its not running in the browser.
	 *   False if it's not, true if it is. This is "redeclared"
	 *   to avoid <code>variable NODE is undeclared</code>
	 *   type warnings at compile time.
	 *
	 * @type {!boolean}
	 * @public
	 */
	NODE: NODE,
	/**
	 * Window object. This is an empty object if the <code>window</code>
	 *   variable is not defined.
	 *
	 * @type {!(Object|Window)}
	 * @public
	 * @constant
	 */
	WINDOW: (NODE?{}:window),
};