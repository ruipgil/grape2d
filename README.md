Grape2D - 1.0.0-alpha
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
<ul>
<li>````nodejs```` + ````npm````
<li>closure compiler, with the environment variable ````CLOSURE_PATH```` pointing to the installation folder, not to the bin folder. See [grunt-closure-compiler page](https://github.com/gmarty/grunt-closure-compiler) for more details.
<li>run ````installDev.bat````, it downloads the required dependencies for grunt.
</ul>
With that, in the utils folder, run:
```` grunt ```` to build it
```` grunt doc ```` to build just the API documentation
```` grunt test ```` to run QUnit tests
```` grunt all ```` to build it, build the API documentation and run the tests.

#### Contributing to Grape2D ####

<ol>
<li>Have a GitHub account
<li>Fork the repository
<li>Check the [code style guideline]
<li>Make changes to your clone of the repository
<li>Submit a pull request

#### Licence ####

This project is under the [MIT License](https://github.com/ruipgil/grape2d/blob/master/LICENSE)