module.exports = function(grunt) {

  grunt.initConfig({

	  	clean: ['dist'],
	  	
	  	uglify: {
	  		all: {
			  	files: {
			        'dist/jquery.loading-queue.min.js': 'src/jquery.loading-queue.js'
			    }		
	  		}
	  	}

  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  
  grunt.registerTask('default', ['clean', 'uglify']);
};