module.exports = function(grunt) {
    const pkg = grunt.file.readJSON('package.json');
    const date = grunt.template.today('yyyy-mm-dd');
    const sourceBanner = `/**\n * !${pkg.name} v${pkg.version} / ${date} / INVIDI Pulse Ad Player Base Skin\n */\n`;
    const sourceFiles = [
        'src/intro.js',
        'src/PlayButton.js',
        'src/SkipButton.js',
        'src/SkipCountdown.js',
        'src/ProgressBar.js',
        'src/LoadingSpinner.js',
        'src/AdCounter.js',
        'src/MuteButton.js',
        'src/CloseButton.js',
        'src/utility.js',
        'src/strings.js',
        'src/skin.js',
        'src/outro.js'
    ];

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-image-embed');

    grunt.initConfig({
        pkg: pkg,
        clean: {
            skin: {
                src: ['dist/']
            }
        },
        imageEmbed: {
            dist: {
                src: ['css/skin.css'],
                dest:'dist/skin64.css',
                options: {
                    maxImageSize: 0
                }
            }
        },
        cssmin: {
            target: {
                files: {
                    'dist/skin.min.css': ['dist/skin64.css']
                }
            }
        },
        concat: {
            skin: {
                options: {
                    process: function(source, filepath) {
                        if (filepath.indexOf('skin.js') > -1) {
                            return source.replace('@CSS', grunt.file.read('dist/skin.min.css'));
                        }

                        return source;
                    },
                    banner: sourceBanner
                },
                src: sourceFiles,
                dest: 'dist/skin-<%= pkg.version %>.js'
            }
        },
        uglify: {
            skin: {
                options: {
                    mangle: {
                        reserved: ['error', 'format', 'request', 'model', 'parse', 'core', 'window', 'document', 'console']
                    }
                },
                files: {
                    'dist/skin-<%= pkg.version %>.min.js': [ 'dist/skin-<%= pkg.version %>.js' ]
                }
            }
        }
    });

    grunt.registerTask('default', [ 'clean', 'imageEmbed', 'cssmin', 'concat','uglify' ]);
};