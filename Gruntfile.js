var fs = require("fs");
module.exports = function(grunt) {
	var sourceFiles = grunt.file.readJSON('./utils/includes/common.json'),
		destMinFile = './build/<%= pkg.name %>.min.js',
		destFile = './build/<%= pkg.name %>.js',
		karmaFile = 'karma.conf.js';

	sourceFiles.forEach(function (file){
		if(!fs.existsSync(file)) {
			console.warn("File doesn't exist: "+file+".");
		}
	});

	grunt.initConfig({
		pkg: grunt.file.readJSON('./package.json'),
		"audioExtern": process.env.CLOSURE_PATH,
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
					"externs": ['<%= audioExtern %>/contrib/externs/w3c_audio.js', '<%= audioExtern %>/contrib/externs/w3c_rtc.js'],
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
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-closure-compiler');
	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-jsdoc');
	grunt.loadNpmTasks('grunt-contrib-jasmine');
	grunt.loadNpmTasks('grunt-karma');

	grunt.registerTask('default', ['concat', 'closure-compiler']);
	grunt.registerTask('dev', ['concat']);
	grunt.registerTask('doc', ['jsdoc']);
	grunt.registerTask('test', ['karma:ci', 'qunit']);
	grunt.registerTask('all', ['concat', 'closure-compiler', 'jsdoc', 'qunit']);
};