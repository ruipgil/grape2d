/**
 * Grape2D.CollisionResolver class.
 *
 * @constructor
 */
Grape2D.CollisionResolver = function() {};

Grape2D.CollisionResolver.prototype = {
	constructor: Grape2D.CollisionResolver,
	aabbVsAabb: function(m) {
		var a = m.getA(),
			b = m.getB(),
			n = b.getPosition().clone().sub(a.getPosition()),
			abox = a.getBoundingBox(),
			bbox = b.getBoundingBox(),
			aExtent = (abox.getMaxX() - abox.getMinX()) / 2,
			bExtent = (bbox.getMaxX() - bbox.getMinX()) / 2,
			xOverlap = aExtent + bExtent - Grape2D.Math.abs(n.getX());
		if (xOverlap > 0) {
			aExtent = (abox.getMaxY() - abox.getMinY()) / 2;
			bExtent = (bbox.getMaxY() - bbox.getMinY()) / 2;
			var yOverlap = aExtent + bExtent - Grape2D.Math.abs(n.getY());
			if (yOverlap > 0) {
				if (xOverlap > yOverlap) {
					if (n.getX() < 0) {
						m.setNormal(new Grape2D.Vector(-1, 0));
					} else {
						m.setNormal(new Grape2D.Vector(1, 0)); //original : new Grape2D.Vector(0,0)
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
	aabbVsCircle: function(m) {
		var a = m.getA(),
			b = m.getB(),
			n = b.getPosition().clone().sub(a.getPosition()),
			closest = n,
			xExtent = (a.getBoundingBox().getMaxX() - a.getBoundingBox().getMinX()) / 2,
			yExtent = (a.getBoundingBox().getMaxY() - a.getBoundingBox().getMinY()) / 2,
			inside = false;
		closest.setX(Grape2D.Math.clamp(-xExtent, xExtent, closest.getX()));
		closest.sety(Grape2D.Math.clamp(-yExtent, yExtent, closest.getY()));
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

		var normal = n.sub(closest);
		var d = normal.LengthSquared();
		var r = b.getBoundingBox().getRadius();

		if (d > r * r && !inside) {
			return false;
		}

		d = Grape2D.Math.sqrt(d);
		if (inside) {
			m.setNormal(-n); //not correct!!
			m.setPenetration(r + d);
		} else {
			m.setNormal(n);
			m.penetration = r + d;
		}

		return true;
	},
	aabbVsPolygon: function(m) {
		var aabbAsPolygon = Grape2D.BVFactorySingleton.create(m.getA());
		var temp = m.getA();
		m.setA(aabbAsPolygon);
		var result = this.polygonVsPolygon(m);
		m.setA(temp);
		return result;
	},
	aabbVsRay: function(m) {},
	circleVsAabb: function(m) {
		var result = this.aabbVsCircle(m.invert());
		m.invert();
		return result;
	},
	circleVsCircle: function(m) {
		var a = m.getA(),
			b = m.getB(),
			n = b.getPosition().clone().sub(a.getPosition()),
			r = Grape2D.Math.sq(a.getBoundingBox().getRadius() + b.getBoundingBox().getRadius());

		if (n.lengthSquared() > r) {
			return false;
		}

		var d = n.length();
		if (d != 0) {
			m.setPenetration(r - d);
			m.setNormal(n.div(d)); //probably not implemented
			return true;
		} else {
			m.setPenetration(a.getRadius());
			m.setNormal(new Grape2D.Vector(1, 0));
			return true;
		}

		return false;
	},
	circleVsPolygon: function(m) {

	},
	circleVsRay: function(m) {},
	polygonVsAabb: function(m) {
		var result = this.aabbVsPolygon(m.invert());
		m.invert();
		return result;
	},
	polygonVsCircle: function(m) {
		var result = this.circleVsAabb(m.invert());
		m.invert();
		return result;
	},
	polygonVsPolygon: function(m) {
		function compileAxis(polygon) {
			var vertices = polygon.getComputedVertexList(),
				axis = [],
				b;
			//is it possible to just delete repetitions?
			for (var i = 0; i < vertices.length; i++) {
				b = new Grape2D.Vector(-(vertices[(i + 1) % vertices.length].x - vertices[i].x), -(vertices[(i + 1) % vertices.length].y - vertices[i].y));
				b.normalize();
				axis.push(b.rightNormal());
			}
			for (i = 0; i < axis.length; i++) {
				for (var j = i + 1; j < axis.length; j++) {
					if (axis[j].parallelTo(axis[i])) {
						axis.splice(j, 1);
						break;
					}
				}
			}
			return axis;
		}

		function compileIntervals(polygon) {
			var vertices = polygon.getComputedVertexList(),
				intvByAxis = [],
				aa, ab,
				temp, min, max;

			for (var i = 0; i < axis.length; i++) {
				max = -Infinity;
				min = Infinity;
				for (var j = 0; j < vertices.length; j++) {
					aa = vertices[j].dotProduct(axis[i]);
					ab = vertices[(j + 1) % axis.length].dotProduct(axis[i]);
					if (aa > max) {
						max = aa;
					}
					if (aa < min) {
						min = aa;
					}
					if (ab > max) {
						max = ab;
					}
					if (ab < min) {
						min = aa;
					}
				}
				intvByAxis.push({
					min: min,
					max: max
				});
			}

			return intvByAxis;
		}

		var axis = compileAxis(m.getA().getBoundingBox()).concat(m.getB().getBoundingBox());
		for (var i = 0; i < axis.length; i++) {
			for (var j = i + 1; j < axis.length; j++) {
				if (axis[i].equals(axis[j])) {
					axis.splice(j, 1);
				}
			}
		}

		var t = compileIntervals(m.getA().getBoundingBox());
		var s = compileIntervals(m.getB().getBoundingBox());

		var axisOl, minOl = Infinity,
			ol;

		for (i = 0; i < axis.length; i++) {
			var ol = Grape2D.Math.overlaps(s[i], t[i]);
			if (ol < 0) {
				return false;
			}
			if (minOl > ol) {
				axisOl = axis[i];
				minOl = ol;
			}
		}
		m.setNormal(axisOl);
		m.setPenetration(minOl);
	},
	polygonVsRay: function(m) {},
	rayVsAabb: function(m) {
		var result = this.aabbVsRay(m.invert());
		m.invert();
		return result;
	},
	rayVsCircle: function(m) {
		var result = this.circleVsRay(m.invert());
		m.invert();
		return result;
	},
	rayVsPolygon: function(m) {
		var result = this.polygonVsRay(m.invert());
		m.invert();
		return result;
	},
	rayVsRay: function(m) {}
};