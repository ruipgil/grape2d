Grape2D - 1.3.0-alpha [![Build Status](https://travis-ci.org/ruipgil/grape2d.png?branch=dev)](https://travis-ci.org/ruipgil/grape2d)
========

Be aware that it is in its early stages, and a lot may change, and a lot will be added.

#### JavaScript 2D Game Engine ####

Grape2D is a complete and very modular game engine for 2D graphics, but with lot of room for improvement. Providing unique features in the "javascript world".
Grape2D is great for beginners, but even better for developers that are more experienced, because of it's modularity. Because of it's careful design (based in a OO approach) almost everything can be changed to fit your needs, with little effort integrating it back into the structure.

#### Docs ####

Right now there is only available [API documentation](https://rawgithub.com/ruipgil/grape2d/master/docs/api/index.html), generated through JSDoc.

#### Usage ####

Include Grape2D into your HTML page from the [build directory](https://github.com/ruipgil/grape2d/tree/master/build).
The next step is up to you. I personally recommend extending Grape2D.SimpleGame or implement the interface Grape2D.Game. If you're not certain the best method to extends a function or implement a class see [code style guideline].

In this example we extend the SimpleGame class.
````HTML
<script>
/**
 * @extends {Grape2D.SimpleGame}
 * @constructor
 */
var MyGameLoop = function(renderer, scene, camera) {
  Grape2D.SimpleGame.call(this, renderer, scene, camera);
};
MyGameLoop.prototype = Object.create(Grape2D.SimpleGame.prototype);
/**
 * @override
 */
MyGameLoop.prototype.setup = function() {
  this.getScene().getMap().add(
    new Grape2D.Object2D({
      position: new Grape2D.Vector(),
      boundingBox: new Grape2D.AABB({
        width: 10,
        height: 10
      }),
      texture: Grape2D.Texture.createFromImage('imgs/an_image.jpg')
    })
  );
  map.rebuild();
};
/**
 * @override
 */
MyGameLoop.prototype.update = function(dt) {
  Grape2D.SimpleGame.prototype.update.call(this, dt);
};

var mgl = new MyGameLoop({
  new Grape2D.CanvasRenderer({
    width: Grape2D.utils.getDocumentSize().width,
    height: Grape2D.utils.getDocumentSize().height
  }),
  new Grape2D.SceneLayer({
		map: new Grape2D.SimpleMap()
	}),
  new Grape2D.Camera({
		scale: new Grape2D.Vector(5, 5)
	})
});

window.onload = function(){
  mgl.getRenderer().appendToDOMElement(document.body);
  mgl.setup();
  mgl.start();
}
</script>
````
#### Building Grape2D ####

Grape2D is easy to build and only requires some pre-requirements:

* ```` nodejs ```` + ```` npm ````
* closure compiler, with the environment variable ````CLOSURE_PATH```` pointing to the installation folder, not to the bin folder. See [grunt-closure-compiler page](https://github.com/gmarty/grunt-closure-compiler) for more details.
* run ````npm install````, it downloads the required dependencies for grunt.

With that, in the utils folder, run:

* ```` grunt ```` to build it with uglify and closure-compiler,
* ```` grunt dev ```` to build it with uglify,
* ```` grunt doc ```` to build just the API documentation,
* ```` grunt test ```` to run QUnit tests,
* ```` grunt all ```` to build it, build the API documentation and run the tests.

#### Contributing to Grape2D ####

1. Have a GitHub account
2. Fork the repository
3. Check the [code style guideline]
4. Make changes to your clone of the repository
5. Submit a pull request

#### Licence ####

This project is under the [MIT License](https://github.com/ruipgil/grape2d/blob/master/LICENSE)
