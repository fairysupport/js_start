module.exports = function(grunt){
  grunt.initConfig({
    copy: {
      dist: {
        files: [
          {
            cwd: 'distWork',
            src: ['img/**/*', 'js/**/*.json', 'js/**/*.min.js', 'favicon.ico'],
            expand: true,
            dest: 'dist'
          }
        ]
      },
      customize: {
        files: [
          {
            cwd: 'distWork',
            src: ['css/**/*', 'img/**/*', 'js/**/*', 'page/**/*', 'favicon.ico'],
            expand: true,
            dest: 'dist'
          }
        ]
      }
    },
    cssmin: {
      dist: {
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
      dist: {
        files: {
            cwd: 'distWork/js',
            src: ['**/*.js', '!**/*.min.js'],
            dest: 'dist/js',
            expand: true,
            ext: '.js'
        }
      }
    },
    htmlmin: {
      dist: {
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
      dist: {
        files: ['distWork/js/**/*', 'distWork/css/**/*', 'distWork/page/**/*', 'distWork/img/**/*'],
        tasks: ['copy:dist', 'cssmin:dist', 'uglify:dist', 'htmlmin:dist']
      },
      customize: {
        files: ['distWork/**/*'],
        tasks: ['copy:customize']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['copy:dist', 'cssmin:dist', 'uglify:dist', 'htmlmin:dist']);

}