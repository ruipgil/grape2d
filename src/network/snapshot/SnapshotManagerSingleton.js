/**
 * Snapshot Manager Singleton.
 *
 * @class
 */
Grape2D.SnapshotManagerSingleton = {
	/**
	 * Snapshot Manager in use.
	 *
	 * @type {?Grape2D.SnapshotManager}
	 * @private
	 * @static
	 */
	instance: null,
	/**
	 * Sets a snapshot manager.
	 *
	 * @param {!Grape2D.SnapshotManager} instance Snapshot manager.
	 * @public
	 * @static
	 */
	setInstance: function(instance){
		Grape2D.SnapshotManagerSingleton.instance = instance;
	},
	/**
	 * Gets the snapshot manager.
	 *
	 * @return {?Grape2D.SnapshotManager} Snapshot manager.
	 * @public
	 * @static
	 */
	getInstance: function(){
		return Grape2D.SnapshotManagerSingleton.instance;
	},
	/**
	 * Gets a snapshot object by it's id. A snapshot manager must be
	 *   set before.
	 *
	 * @param {!string} id Network entity's id.
	 * @return {?Object} Network entity.
	 * @public
	 * @static
	 */
	getNetworkEntity: function(id){
		return Grape2D.SnapshotManagerSingleton.instance.getNetworkEntity(id);
	},
	/**
	 * Gets the current interpolation percentage.
	 *
	 * @return {!number} Percentage, between 0 and 1.
	 * @public
	 * @static
	 */
	getLerpPercent: function(){
		return Grape2D.SnapshotManagerSingleton.instance.getLerpPercent();
	},
	/**
	 * Updates the current snapshot manager.
	 *
	 * @public
	 * @static
	 */
	update: function(){
		Grape2D.SnapshotManagerSingleton.instance.update();
	}
};