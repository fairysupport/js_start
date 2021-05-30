module.exports = function(grunt){
  grunt.initConfig({
    copy: {
      target: {
        files: [
          {
            cwd: 'distWork',
            src: ['img/**/*', 'js/**/*.json', 'js/**/*.min.js', 'favicon.ico'],
            expand: true,
            dest: 'dist'
          }
        ]
      },
    },
    cssmin: {
      target: {
        files: [{
          cwd: 'distWork/css',
          src: '**/*.css',
          expand: true,
          dest: 'dist/css',
          ext: '.css'
        }]
      }
    },
    uglify: {
        files: { 
            cwd: 'distWork/js',
            src: ['**/*.js', '!**/*.min.js'],
            dest: 'dist/js',
            expand: true,
            ext: '.js'
        }
    },
    htmlmin: {
      target: {
        options: {
          removeComments: true,
          collapseWhitespace: true,
          minifyJS : true,
          minifyCSS : true
        },
        files: [{
            cwd: 'distWork/page',
            src: ['**/*'],
            expand: true,
            dest: 'dist/page'
        }]
      }
    },
    watch: {
      scripts: {
        files: ['distWork/js/**/*', 'distWork/css/**/*', 'distWork/page/**/*', 'distWork/img/**/*'],
        tasks: ['copy', 'cssmin', 'uglify', 'htmlmin'],
      },
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['copy', 'cssmin', 'uglify', 'htmlmin']);

}