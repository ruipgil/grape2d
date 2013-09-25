module.exports = function(grunt) {
	var sourceFiles = grunt.file.readJSON('./includes/common.json'),
		destMinFile = '../build/<%= pkg.name %>.min.js',
		destFile = '../build/<%= pkg.name %>.js';

	grunt.initConfig({
		pkg: grunt.file.readJSON('../package.json'),
		qunit: {
			target: {
				src: ['../tests/qunit/**.html']
			}
		},
		'closure-compiler': {
			frontend: {
				js: sourceFiles,
				jsOutputFile: destMinFile,
				maxBuffer: 500,
				options: {
					compilation_level: 'SIMPLE_OPTIMIZATIONS',
					language_in: 'ECMASCRIPT5_STRICT',
					summary_detail_level: 3,
					warning_level: 'VERBOSE',
					create_source_map: destMinFile + '.map',
					source_map_format: 'V3',
					output_wrapper: '(function(){ %output% })()'
				}
			}
		},
		jsdoc: {
			dist: {
				src: sourceFiles,
				options: {
					destination: '../docs/api/'
				}
			}
		},
		concat: {
			options: {
				separator: '\n',
				banner: '(function(){\n',
				footer: '\n})()'
			},
			dist: {
				src: sourceFiles,
				dest: destFile,
			},
		}

	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-closure-compiler');
	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-jsdoc');

	grunt.registerTask('default', ['concat', 'closure-compiler']);
	grunt.registerTask('dev', ['concat']);
	grunt.registerTask('doc', ['jsdoc']);
	grunt.registerTask('test', ['qunit']);
	grunt.registerTask('all', ['concat', 'closure-compiler', 'jsdoc', 'qunit']);
};