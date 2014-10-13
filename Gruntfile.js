/**
 * Created by Enrico on 13.10.2014.
 */

/*global module:false*/
module.exports = function( grunt ) {

	// Project configuration.
	grunt.initConfig( {
		pkg:  grunt.file.readJSON('package.json'),
		meta: {
			banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
			'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
			'<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
			'* Copyright (c) <%= grunt.template.today("yyyy") %>' +
			' <%= pkg.author.name %>;' +
			' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
		},

		clean: {
			build: {
				src: [ 'dist' ]
			},
			components: {
				src: [ 'dist/components/*', '!dist/components/main.min.js' ]
			},
			stylesheets: {
				src: [ 'dist/css/**/*.css', '!dist/css/style.css' ]
			},
			scripts: {
				src: [ 'dist/js/**/*.js', '!dist/js/main.js' ]
			}
		},

		copy: {
			build: {
				cwd: 'src',
				src: [
					'**',
					'!scss/**',
					'!components/**',
					'!lib/**',
					'components/jquery/dist/jquery.min.js',
					'components/angular/angular.min.js',
					'components/angular-route/angular-route.min.js',
					'components/angular-local-storage/dist/angular-local-storage.min.js',
					'components/bootstrap/dis/js/bootstrap.min.js'],
				dest: 'dist',
				expand: true
			}
		},

		cssmin: {
			build: {
				files: {
					'dist/css/style.min.css': [ 'dist/css/**/*.css' ]
				}
			}
		},

		uglify: {
			build: {
				options: {
					mangle: false
				},
				files: {
					'dist/js/main.js': [ 'dist/js/**/*.js' ]
				}
			}
		},

		concat: {
			libs: {
				src: '**',
				dest: 'dist/components/main.min.js'
			}
		},

		watch: {
			stylesheets: {
				files: 'src/**/*.scss',
				tasks: [ 'stylesheets' ]
			},
			scripts: {
				files: 'src/**/*.js',
				tasks: [ 'scripts' ]
			},
			copy: {
				files: [ 'src/**', '!src/**/*.scss', '!src/components/**', '!src/lib/**' ],
				tasks: [ 'copy' ]
			}
		}

	} );

	// load the tasks
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');

	// Default task.
	grunt.registerTask( 'default',
		''
	);

	grunt.registerTask(
		'test',
		'Compiles',
		[ 'clean', 'copy', 'concat:libs', 'clean:components' ]
	);

	grunt.registerTask(
		'build',
		'Compiles all of the assets and copies the files to the build directory.',
		[ 'clean', 'copy', 'stylesheets', 'scripts' ]
	);

	grunt.registerTask(
		'stylesheets',
		'Compiles the stylesheets.',
		[ 'cssmin', 'clean:stylesheets' ]
	);

	grunt.registerTask(
		'scripts',
		'Compiles the JavaScript files.',
		[ 'uglify', 'clean:scripts' ]
	);
};