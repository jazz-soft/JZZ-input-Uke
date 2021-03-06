module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
        all: ['javascript/*.js']
    },
    uglify: {
      javascript: {
        expand: true,
        cwd: 'javascript',
        src: '*.js',
        dest: 'minified'
      }
    }
  });
  grunt.task.registerTask('version', 'Check version consistency', function() {
    var pkg = grunt.file.readJSON('package.json');
    var JZZ = require('.');
    require('.')(JZZ);
    var ver = JZZ.input.Uke.version();
    if (ver == pkg.version) {
       grunt.log.ok('Version:', ver);
    }
    else {
      grunt.log.error('Version:', ver, '!=', pkg.version);
      return false;
    }
  });
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.registerTask('default', ['jshint', 'uglify', 'version']);
};
