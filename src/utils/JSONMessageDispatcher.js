/**
 * Dispatches JSON messages, according with a property.
 *
 * @param {!string} property Property to differentiate when
 *   selecting the dispatcher.
 * @extends {Grape2D.utils.MessageDispatcher}
 * @constructor
 */
Grape2D.utils.JSONMessageDispatcher = function(property){
	Grape2D.utils.MessageDispatcher.call(this);
	this.property = property;
};

Grape2D.utils.JSONMessageDispatcher.prototype = Object.create(Grape2D.utils.MessageDispatcher.prototype);
/**
 * @override
 */
Grape2D.utils.JSONMessageDispatcher.prototype.dispatch = function(message, param){
	var parsed, currentm, testP;
	try{
		parsed = JSON.parse(message);
		testP = parsed[this.property];
	}catch(e){
		return;
	}
	for (var i = 0; i < this.stack.length; i++) {
		current = this.stack[i];
		if (current.regex.test(testP)) {
			this.stack[i].callback(parsed, param);
		}
	}
};