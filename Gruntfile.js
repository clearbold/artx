module.exports = function(grunt) {

    "use strict";

    // -------------------------------------------------------------------------
    // #### Load task modules ####
    // This will load all of the modules that are defined in package.json >
    // devDependencies whose name begins with "grunt-".
    // https://github.com/tkellen/node-matchdep
    // -------------------------------------------------------------------------

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);


    // -------------------------------------------------------------------------
    // #### Project configuration ####
    // -------------------------------------------------------------------------

    grunt.initConfig({


        // ---------------------------------------------------------------------
        // #### Variables ####
        // ---------------------------------------------------------------------

        sassPath:     '_source/ui/sass/',
        cssPath:      '_source/ui/css/',
        cssPathProd:  '_site/ui/css/',
        jsPathProd:   '_site/ui/js/',
        jsPathDev:    '_source/ui/js/',
        imgPath:      '_site/ui/img/',
        imgFileTypes: 'gif,jpg,jpeg,png',
        docFileTypes: '.html,.php',
        iconSVGPath:  '_source/ui/icons/',


        // ---------------------------------------------------------------------
        // #### Get data from package.json ####
        // Get data from the package.json file and assign it to a pkg variable.
        // ---------------------------------------------------------------------

        pkg: grunt.file.readJSON('package.json'),


        // ---------------------------------------------------------------------
        // #### Build a reusable banner ####
        // A banner variable that can be utilized later via "<%= banner %>".
        // Property names (defined over in package.json) which are preceded by
        // "pkg." will output the corresponding values for those properties.
        // ---------------------------------------------------------------------

        banner: '/*!\n' +
                ' * <%= pkg.name %> | version: <%= pkg.version %> | updated: <%= grunt.template.today("yyyy-mm-dd @ h:MM:ss TT") %>\n' +
                ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.owner.name %>\n' +
                ' */\n',


        // ---------------------------------------------------------------------
        // #### Task configuration ####
        // ---------------------------------------------------------------------

        // Task: Sass compiling.
        // https://github.com/gruntjs/grunt-contrib-sass
        sass: {
            // Task-wide options.
            options: {},
            dist: {
                // Target-specific options.
                options: {
                    style: "compressed",
                    // Utilize the banner variable defined above.
                    banner: '<%= banner %>',
                    noCache: true,
                    loadPath: '<%= sassPath %>'
                },
                expand: true,
                cwd: '<%= sassPath %>',
                src: ['*.scss'],
                dest: '<%= cssPath %>',
                ext: '.css'
            }
        },

        // Task: Copy the generated CSS over to _site
        // https://github.com/gruntjs/grunt-contrib-copy
        // http://thanpol.as/jekyll/jekyll-and-livereload-flow/
        copy: {
            css : {
                files: {
                  // Copy the SCSS-generated style files to
                  // the _site/ folder
                  '<%= cssPathProd %>styles.css': '<%= cssPath %>styles.css'
                }
            },
            js: {
                files: {
                    // Copy the script files to the _site/ folder
                    '<%= jsPathProd %>scripts-concat.min.js': '<%= jsPathDev %>scripts-concat.min.js'
                }
            },
            webfonts: {
                files: [
                    // Copy the webfont files to the _site/ folder
                    {expand:true, flatten:true, src:'_source/ui/css/fonts/**', dest:'_site/ui/css/fonts/', filter: 'isFile'}
                ]
            }
        },

        // Task: JavaScript hinting.
        // https://github.com/gruntjs/grunt-contrib-jshint
        jshint: {
            // Task-wide options.
            options: {},
            // Target: all.
            all: {
                // Target-specific options.
                options: {},
                // Source file(s), in the order we want to hint them.
                src: [
                    'Gruntfile.js',
                    '<%= jsPathDev %>*.js',
                    '!<%= jsPathDev %>*.min.js', // ...but not minified files.
                    '!<%= jsPathDev %>scripts-concat.js' // ...but not the concatenated file.
                ]
            }
        },

        // Task: JavaScript file concatenation.
        // https://github.com/gruntjs/grunt-contrib-concat
        concat: {
            // Task-wide options.
            options: {},
            // Target: all.
            all: {
                // Target-specific options.
                options: {
                    // Separate each concatenated script with a semicolon.
                    separator: ';'
                },
                // Source file(s), in the order we want to concatenate them.
                src: [
                    '<%= jsPathDev %>jquery/jquery-1.10.2.js',
                    '<%= jsPathDev %>jquery/jquery.migrate.1.2.1.js',
                    '<%= jsPathDev %>plugins/*.js',
                    '<%= jsPathDev %>scripts.js'
                ],
                // Destination file.
                dest: '<%= jsPathDev %>scripts-concat.js',
                // Warn if a given file is missing or invalid.
                nonull: true
            }
        },

        // Task: JavaScript minification.
        // https://github.com/gruntjs/grunt-contrib-uglify
        uglify: {
            // Task-wide options.
            options: {
                //compress: {
                //    drop_console:true
                //}
            },
            // Target: all.
            all: {
                // Target-specific options.
                options: {
                    // Utilize the banner variable defined above.
                    banner: '<%= banner %>',
                    // Report the original vs. minified file-size.
                    report: 'min'
                },
                // Source file(s), in the order we want to minify them.
                files: {
                    '<%= jsPathDev %>scripts-concat.min.js' : '<%= jsPathDev %>scripts-concat.js'
                }
            }
        },

        // Task: image minification.
        // https://github.com/JamieMason/grunt-imageoptim
        imageoptim: {
            all: {
                options: {
                    jpegMini: false,
                    imageAlpha: true,
                    quitAfter: true
                },
                src: ['<%= imgPath %>']
            }
        },


        // Task: Icon font creation from SVG files.
        // https://github.com/sapegin/grunt-webfont
        webfont: {
            icons: {
                src: '_source/ui/icons/*.svg',
                dest: '_source/ui/css/fonts',
                destCss: '_source/ui/sass',
                options: {
                    font: 'sentinelicons',
                    stylesheet: 'scss',
                    relativeFontPath: 'fonts',
                    htmlDemo:false,
                    hashes:false,
                    templateOptions: {
                        baseClass: 'icon',
                        classPrefix: 'icon-',
                        mixinPrefix: 'icon-'
                    }
                }
            }
        },

        // Task: Call Jekyll when non-CSS and non-JS files change.
        // http://thanpol.as/jekyll/jekyll-and-livereload-flow/
        shell: {
            jekyll: {
                command: 'rm -rf _site/*; jekyll build',
                stdout: true
            }
        },

        // Task: aside from creating notifications when something fails (which
        // is this task's permanent/default behavior), also create the following
        // notifications for these custom, non-failure events. The targets below
        // are utilized by requesting them via targets found in the watch task.
        // https://github.com/dylang/grunt-notify
        notify: {
            // Target: Sass.
            sass: {
                options: {
                    title: 'CSS',
                    message: 'Compiled successfully.'
                }
            },
            // Target: JavaScript.
            js: {
                options: {
                    title: 'JavaScript',
                    message: 'Hinted, concatenated, and minified successfully.'
                }
            },
            // Target: Icon fonts.
            webfont: {
                options: {
                    title: 'Icons',
                    message: 'Icon font generated successfully.'
                }
            },
            // Target: Jekyll.
            shell: {
                options: {
                    title: 'Jekyll',
                    message: 'Jekyll site built successfully.'
                }
            },
            // Target: ready for production.
            imageoptim: {
                options: {
                    title: 'Crushing Images',
                    message: 'Images crushed successfully.'
                }
            }
        },

        // Task: when something changes, run specific task(s).
        // https://github.com/gruntjs/grunt-contrib-watch
        watch: {
            // Task-wide options.
            options: {
                livereload: 35729
            },
            // Target: Sass.
            sass: {
                // Watch all .scss files inside of sassPath.
                files: '<%= sassPath %>**/*.scss',
                // Task(s) to run.
                tasks: [
                    'sass',
                    'copy:css',
                    'notify:sass'
                ]
            },
            // Target: Jekyll sources.
            jekyllSources: {
                files: [
                    '_source/**/*.html',
                    '*.yml',
                    '_source/ui/img/*'
                ],
                tasks: [
                    'shell:jekyll',
                    'notify:shell'
                ]
            },
            // Target: css.
            css: {
                // Watch all .css files that are direct children of cssPath.
                files: '<%= cssPath %>*.css'
            },
            // Target: JavaScript.
            js: {
                // Watch all JavaScript files that are direct children of jsPath.
                files: [
                    '<%= jsPathDev %>/**/*.js',
                    '!<%= jsPathDev %>/**/*.min.js' // ...but not minified files.
                ],
                // Task(s) to run.
                tasks: [
                    'jshint:all',
                    'concat:all',
                    'uglify:all',
                    'copy:js',
                    'notify:js'
                ]
            },
            // Target: Icon fonts.
            webfont: {
                // Watch all icon files inside of iconSVGPath.
                files: [
                    '<%= iconSVGPath %>*.svg'
                ],
                // Task(s) to run.
                tasks: [
                    'webfont:icons',
                    'copy:webfonts',
                    'notify:webfont'
                ]
            },
            // Target: documents.
            docs: {
                // Watch all docFileTypes in the _site folder.
                files: '_site/**/*{<%= docFileTypes %>}'
            }
        }

    });


    // -------------------------------------------------------------------------
    // #### Define task aliases that run multiple tasks ####
    // On the command-line, type "grunt [alias]" without the square brackets or
    // double-quotes, and press return. The format is as follows:
    // grunt.registerTask('alias', [
    //     'task1',
    //     'task2:targetName',
    //     'task3'
    // ]);
    // -------------------------------------------------------------------------

    // #### Task alias: "default" ####
    // Task(s) to run when typing only "grunt" in the console.
    grunt.registerTask('default', [
        'watch'
    ]);

    // #### Task alias: "crushImages" ####
    // Tasks(s) to run when you want to crush PNGs using imageOptim
    grunt.registerTask('crushImages', [
        'imageoptim:all',
        'notify:imageoptim'
    ]);

};