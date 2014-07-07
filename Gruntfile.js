module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		jshint: {
			options: {
				curly: true,
				eqeqeq: true,
				eqnull: true,
				node: true,
				globals: {
					
				},
		    },
		    all: ['*.js', 'lib/**/*.js', 'api/**/*js', 'test/**/*.js'],
		    testu: ['*.js', 'lib/**/*js', 'api/**/*js', 'test/unit/*js'],
		},


		mochaTest: {
	      	unit: {
	        	options: {
	          		reporter: 'spec'
	        	},
	        	src: ['test/unit/*spec.js']
	      	},

	    },


		watch: {
			options: {
				atBegin: true,
			},

			testall: {
				files: ['*.js', 'lib/**/*js', 'api/**/*js', 'test/unit/*js'],
				//tasks: ['jshint:all', 'mochaTest:unit', 'startMongo', 'wait:giveMongoSomeTimeToLoad', 'force:on','mochaTest:integration', 'force:restore', 'stopMongo'],
				tasks: ['jshint:all', 'mochaTest:unit'],
				options: {
					// spawn: false,
				},
			},


			testu: {
				files: ['*.js', 'lib/**/*js', 'api/**/*js', 'test/unit/*js'],
				tasks: ['jshint:testu', 'mochaTest:unit'],
				options: {
					//spawn: false,
				}
			},

		},


	});
	

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-contrib-watch');


	grunt.registerTask('test', 'Runs Mocha tests add --watch for continuous', function () {

	    if(grunt.option('watch')) {
      		grunt.task.run([
    			'watch:testall'
    		]);
	    } else {
		    grunt.task.run([
		        'jshint:all',
		        'mochaTest'
		    ]);
	    }
	});

};