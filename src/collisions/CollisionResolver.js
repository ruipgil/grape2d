/**
 * CollisionResolver class.
 *
 * @constructor
 */
Grape2D.CollisionResolver = function() {};

Grape2D.CollisionResolver.prototype = {
	constructor: Grape2D.CollisionResolver,
	/**
	 * Collides an {@link Grape2D.AABB} to an {@link Grape2D.AABB}.
	 *   If they're colliding stores useful information in the manifold.
	 *
	 * @param  {!Grape2D.Manifold} m Manifold with an {@link Grape2D.AABB}
	 *   and a {@link Grape2D.AABB}.
	 * @return {!boolean} True if they collide. False otherwise.
	 * @public
	 */
	aabbVsAabb: function(m) {
		var a = m.getA(),
			b = m.getB(),
			n = b.getPosition().clone().sub(a.getPosition()),
			abox = a.getBoundingBox(),
			bbox = b.getBoundingBox(),
			aExtent = (abox.getMaxX() - abox.getMinX()) / 2,
			bExtent = (bbox.getMaxX() - bbox.getMinX()) / 2,
			xOverlap = aExtent + bExtent - Grape2D.Math.abs(n.getX());
		if (xOverlap >= 0) {
			aExtent = (abox.getMaxY() - abox.getMinY()) / 2;
			bExtent = (bbox.getMaxY() - bbox.getMinY()) / 2;
			var yOverlap = aExtent + bExtent - Grape2D.Math.abs(n.getY());
			if (yOverlap > 0) {
				if (xOverlap < yOverlap) {
					if (n.getX() < 0) {
						m.setNormal(new Grape2D.Vector(-1, 0));
					} else {
						m.setNormal(new Grape2D.Vector(1, 0));
					}
					m.setPenetration(xOverlap);
					return true;
				} else {
					if (n.getY() < 0) {
						m.setNormal(new Grape2D.Vector(0, -1));
					} else {
						m.setNormal(new Grape2D.Vector(0, 1));
					}
					m.setPenetration(yOverlap);
					return true;
				}
			}
		}
		return false;
	},
	//this method is still incongruent with the collision checker
	/**
	 * Collides an {@link Grape2D.AABB} to an {@link Grape2D.Circle}.
	 *   If they're colliding stores useful information in the manifold.
	 *
	 * @param  {!Grape2D.Manifold} m Manifold with an {@link Grape2D.AABB}
	 *   and a {@link Grape2D.Circle}.
	 * @return {!boolean} True if they collide. False otherwise.
	 * @public
	 */
	aabbVsCircle: function(m) {
		var a = m.getA().getBoundingBox(),
			b = m.getB().getBoundingBox(),
			n = b.getPosition().clone().sub(a.getPosition()),
			closest = n.clone(),
			xExtent = a.getHalfWidth(),
			yExtent = a.getHalfHeight(),
			inside = false;
		closest.setX(Grape2D.Math.clamp(closest.getX(), -xExtent, xExtent));
		closest.setY(Grape2D.Math.clamp(closest.getY(), -yExtent, yExtent));
		if (n.equals(closest)) {
			inside = true;
			if (Grape2D.Math.abs(n.getX()) > Grape2D.Math.abs(n.getY())) {
				if (closest.getX() > 0) {
					closest.setX(xExtent);
				} else {
					closest.setX(-xExtent);
				}
			} else {
				if (closest.getY() > 0) {
					closest.setY(yExtent);
				} else {
					closest.setY(-yExtent);
				}
			}
		}

		var normal = n.clone().sub(closest);
		var d = normal.lengthSquared();
		var r = b.getRadius();

		if (d > (r * r) && !inside) {
			return false;
		}

		d = Grape2D.Math.sqrt(d);
		if (inside) {
			m.setNormal(normal.normalize().negate());
			m.setPenetration(r + d);
		} else {
			m.setNormal(normal.normalize());
			m.setPenetration(r - d);
		}

		return true;
	},
	/**
	 * Collides an {@link Grape2D.AABB} to an {@link Grape2D.Polygon}.
	 *   If they're colliding stores useful information in the manifold.
	 *
	 * @param  {!Grape2D.Manifold} m Manifold with an {@link Grape2D.AABB}
	 *   and a {@link Grape2D.Polygon}.
	 * @return {!boolean} True if they collide. False otherwise.
	 * @public
	 */
	aabbVsPolygon: function(m) {
		var temp = m.getA().getBoundingBox();
		//var aabbAsPolygon = Grape2D.BVFactorySingleton.create(temp);
		var aabbAsPolygon = new Grape2D.Polygon({
			vertexList: [
				new Grape2D.Vector(-temp.getHalfWidth(), -temp.getHalfHeight()),
				new Grape2D.Vector(temp.getHalfWidth(), -temp.getHalfHeight()),
				new Grape2D.Vector(temp.getHalfWidth(), temp.getHalfHeight()),
				new Grape2D.Vector(-temp.getHalfWidth(), temp.getHalfHeight())
			]
		});
		m.getA().setBoundingBox(aabbAsPolygon);
		var result = this.polygonVsPolygon(m);
		m.getA().setBoundingBox(temp);
		return result;
	},
	/**
	 * Collides an {@link Grape2D.AABB} to an {@link Grape2D.Ray}.
	 *   If they're colliding stores useful information in the manifold.
	 *
	 * @param  {!Grape2D.Manifold} m Manifold with an {@link Grape2D.AABB}
	 *   and a {@link Grape2D.Ray}.
	 * @return {!boolean} True if they collide. False otherwise.
	 * @public
	 */
	aabbVsRay: function(m) {
		return false;
	},
	/**
	 * Collides an {@link Grape2D.Circle} to an {@link Grape2D.AABB}.
	 *   If they're colliding stores useful information in the manifold.
	 *
	 * @param  {!Grape2D.Manifold} m Manifold with a {@link Grape2D.Circle}
	 *   and a {@link Grape2D.AABB}.
	 * @return {!boolean} True if they collide. False otherwise.
	 * @public
	 */
	circleVsAabb: function(m) {
		var result = this.aabbVsCircle(m.invert());
		m.invert();
		return result;
	},
	/**
	 * Collides an {@link Grape2D.Circle} to an {@link Grape2D.Circle}.
	 *   If they're colliding stores useful information in the manifold.
	 *
	 * @param  {!Grape2D.Manifold} m Manifold with a {@link Grape2D.Circle}
	 *   and a {@link Grape2D.Circle}.
	 * @return {!boolean} True if they collide. False otherwise.
	 * @public
	 */
	circleVsCircle: function(m) {
		var a = m.getA().getBoundingBox(),
			b = m.getB().getBoundingBox(),
			n = b.getPosition().clone().sub(a.getPosition()),
			r = a.getRadius() + b.getRadius();

		if (n.lengthSquared() > Grape2D.Math.sq(r)) {
			return false;
		}

		var d = n.length();
		if (d != 0) {
			m.setPenetration(r - d);
			m.setNormal(n.normalize());
		} else {
			m.setPenetration(a.getRadius());
			m.setNormal(new Grape2D.Vector(1, 0));
		}

		return true;
	},
	/**
	 * Collides an {@link Grape2D.Circle} to an {@link Grape2D.Polygon}.
	 *   If they're colliding stores useful information in the manifold.
	 *
	 * @param  {!Grape2D.Manifold} m Manifold with a {@link Grape2D.Circle}
	 *   and a {@link Grape2D.Polygon}.
	 * @return {!boolean} True if they collide. False otherwise.
	 * @public
	 */
	circleVsPolygon: function(m) {
		var polygon = /** @type {!Grape2D.Polygon} */ (m.getB().getBoundingBox());
		var circle = /** @type {!Grape2D.Circle} */ (m.getA().getBoundingBox());
		var axisList = Grape2D.SATUtils.computePolygonAxis(polygon);
		var vertexList = polygon.getComputedVertexList();
		for (var i = 0; i < vertexList.length; i++) {
			axisList.push(circle.getPosition().clone().sub(vertexList[i]).normalize());
		}
		var axis, min = Infinity;
		var polyInterval = Grape2D.SATUtils.computeIntervals(vertexList, axisList);
		var circleInterval = [];
		for (i = 0; i < axisList.length; i++) {
			circleInterval.push({
				min: circle.getPosition().dot(axisList[i]) - circle.getRadius(),
				max: circle.getPosition().dot(axisList[i]) + circle.getRadius()
			});
		}
		for (i = 0; i < polyInterval.length; i++) {
			var overlaps = Grape2D.Math.overlaps(polyInterval[i], circleInterval[i]);
			if (overlaps < 0) {
				return false;
			}
			if (min > overlaps) {
				axis = axisList[i];
				min = overlaps;
			}
		}
		m.setPenetration(min);
		m.setNormal(axis.negate());
		return true;
	},
	/**
	 * Collides an {@link Grape2D.Circle} to an {@link Grape2D.Ray}.
	 *   If they're colliding stores useful information in the manifold.
	 *
	 * @param  {!Grape2D.Manifold} m Manifold with a {@link Grape2D.Circle}
	 *   and a {@link Grape2D.Ray}.
	 * @return {!boolean} True if they collide. False otherwise.
	 * @public
	 */
	circleVsRay: function(m) {
		return false;
	},
	/**
	 * Collides an {@link Grape2D.Polygon} to an {@link Grape2D.AABB}.
	 *   If they're colliding stores useful information in the manifold.
	 *
	 * @param  {!Grape2D.Manifold} m Manifold with a {@link Grape2D.Polygon}
	 *   and a {@link Grape2D.AABB}.
	 * @return {!boolean} True if they collide. False otherwise.
	 * @public
	 */
	polygonVsAabb: function(m) {
		var result = this.aabbVsPolygon(m.invert());
		m.invert();
		return result;
	},
	/**
	 * Collides an {@link Grape2D.Polygon} to an {@link Grape2D.Circle}.
	 *   If they're colliding stores useful information in the manifold.
	 *
	 * @param  {!Grape2D.Manifold} m Manifold with a {@link Grape2D.Polygon}
	 *   and a {@link Grape2D.Circle}.
	 * @return {!boolean} True if they collide. False otherwise.
	 * @public
	 */
	polygonVsCircle: function(m) {
		var result = this.circleVsPolygon(m.invert());
		m.invert();
		return result;
	},
	/**
	 * Collides an {@link Grape2D.Polygon} to an {@link Grape2D.Polygon}.
	 *   If they're colliding stores useful information in the manifold.
	 *
	 * @param  {!Grape2D.Manifold} m Manifold with a {@link Grape2D.Polygon}
	 *   and a {@link Grape2D.Polygon}.
	 * @return {!boolean} True if they collide. False otherwise.
	 * @public
	 */
	polygonVsPolygon: function(m) {
		var polygon1 = /** @type {!Grape2D.Polygon} */ (m.getA().getBoundingBox());
		var polygon2 = /** @type {!Grape2D.Polygon} */ (m.getB().getBoundingBox());
		var pa1 = Grape2D.SATUtils.computePolygonAxis(polygon1);
		var pa2 = Grape2D.SATUtils.computePolygonAxis(polygon2);
		var axisList = Grape2D.SATUtils.selectAxis(pa1, pa2),
			p1Intv = Grape2D.SATUtils.computeIntervals(polygon1.getComputedVertexList(), axisList),
			p2Intv = Grape2D.SATUtils.computeIntervals(polygon2.getComputedVertexList(), axisList),
			overlap, axis;

		var min = Infinity;
		for (var i = 0; i < axisList.length; i++) {
			overlap = Grape2D.Math.overlaps(p1Intv[i], p2Intv[i]);
			if (overlap < 0) {
				return false;
			}
			if (min > overlap) {
				axis = axisList[i];
				min = overlap;
			}
		}
		m.setPenetration(min);
		if (axis.dot(polygon2.getPosition().clone().sub(polygon1.getPosition())) < 0) {
			axis.negate();
		}
		m.setNormal(axis);
		return true;
	},
	/**
	 * Collides an {@link Grape2D.Polygon} to an {@link Grape2D.Ray}.
	 *   If they're colliding stores useful information in the manifold.
	 *
	 * @param  {!Grape2D.Manifold} m Manifold with a {@link Grape2D.Polygon}
	 *   and a {@link Grape2D.Ray}.
	 * @return {!boolean} True if they collide. False otherwise.
	 * @public
	 */
	polygonVsRay: function(m) {
		return false;
	}
};