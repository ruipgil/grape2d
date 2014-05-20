var fs = require("fs");
module.exports = function(grunt) {

	require('load-grunt-tasks')(grunt);

	var sourceFiles = grunt.file.readJSON('./utils/includes/common.json'),
		destMinFile = './build/<%= pkg.name %>.min.js',
		destFile = './build/<%= pkg.name %>.js',
		karmaFile = 'karma.conf.js';

	sourceFiles.forEach(function (file){
		if(!fs.existsSync(file)) {
			grunt.log.warn("File doesn't exist: "+file+".");
		}
	});

	grunt.initConfig({
		pkg: grunt.file.readJSON('./package.json'),
		closure: process.env.CLOSURE_PATH,
		qunit: {
			target: {
				src: ['./tests/qunit/**.html']
			}
		},
		'closure-compiler': {
			frontend: {
				js: sourceFiles,
				jsOutputFile: destMinFile,
				maxBuffer: 500,
				options: {
					"compilation_level": 'SIMPLE_OPTIMIZATIONS',
					"language_in": 'ECMASCRIPT5_STRICT',
					"summary_detail_level": 3,
					"warning_level": 'VERBOSE',
					"create_source_map": destMinFile + '.map',
					"source_map_format": 'V3',
					"output_wrapper": '(function(){ %output% })()',
					"externs": ['<%= closure %>/contrib/externs/w3c_audio.js', '<%= closure %>/contrib/externs/w3c_rtc.js']
				}
			}
		},
		jsdoc: {
			dist: {
				src: sourceFiles,
				options: {
					destination: './docs/api/'
				}
			}
		},
		concat: {
			options: {
				separator: '\n',
				banner: '(function(){\n"use strict";\n',
				footer: '\n})();'
			},
			dist: {
				src: sourceFiles,
				dest: destFile,
			}
		},
		jasmine: {
			pivotal: {
				src: "build/Grape2D.js",
				options: {
					helpers: "tests/jasmine/customMatchers.js",
					specs: "tests/jasmine/**/*Spec.js"
				}
			}
		},
		karma: {
			ci: {
				configFile: karmaFile,
				singleRun: true,
				browsers: ['PhantomJS']
			},
			start: {
				configFile: karmaFile
			},
			run: {
				singleRun: true,
				configFile: karmaFile
			}
		},
		clean: {
			build: ["./build/"],
			docs: ["./docs/"]
		}
	});

	grunt.registerTask('default', ['build']);
	grunt.registerTask('dev', 'Concatenate source files.', ['clean:build', 'concat']);
	grunt.registerTask('build', 'Builds files from source. A simple concatenation version and a minified and optimized version.', ['dev', 'closure-compiler']);
	grunt.registerTask('test', 'Runs unit tests once.', ['dev', 'karma:ci', 'qunit']);
	grunt.registerTask('doc', 'Creates documentation from source.', ['clean:docs', 'jsdoc']);
	grunt.registerTask('start-test', 'Starts karma, it watches source files and test them everytime they change.', ['dev', 'karma:start']);
	grunt.registerTask('all', 'Builds, tests and creates the documentation.' ,['build', 'test', 'jsdoc']);

	// updates version, builds, tests, generates documentation, git commands
	// grunt.registerTask('release', []);

};