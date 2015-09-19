﻿module.exports = function (grunt) {
    var vendorLibs = [
        "jquery",
        "vis",
        "alertifyjs",
        "lodash"];
    
    grunt.initConfig({
        connect: {
            server: {
              options: {
                port: 80,
                hostname: 'localhost'
              }
            }
        },
        concat_css: {
            options: {
              // Task-specific options go here. 
            },
            all: {
                src: [
                    "node_modules/bootstrap/dist/css/bootstrap.min.css",
                    "node_modules/alertifyjs/build/css/alertify.min.css",
                    "node_modules/alertifyjs/build/css/themes/bootstrap.min.css",
                    "node_modules/vis/dist/vis.min.css"
                ],
                dest: "dist/styles.css"
            },
        },
        browserify: {
            app: {
                options: {
                    transform: [
                        ["babelify", {
                            loose: "all"
                        }]
                    ],
                    browserifyOptions: {
                        debug: true
                    },
                    debug: true,
                    external: vendorLibs
                },
                files: {
                    "./dist/app.js": ["./src/main.js"]
                }                
            },
            vendor: {
                // External modules that don't need to be constantly re-compiled
                src: ['.'],
                dest: 'dist/vendor.js',
                options: {
                  debug: false,
                  alias: vendorLibs,
                  external: null  // Reset this here because it's not needed
                }
              }
        },
        watch: {
            scripts: {
                files: ["./src/*.js"],
                tasks: ["browserify:app"]
            },
            html: {
                files: ["*.html"]
            },
            css: {
                files: ["css/*.css"],
                tasks: ["concat_css"]
            },
            options: {
                livereload: true,
            }         
        }
    });

    grunt.loadNpmTasks("grunt-browserify");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-concat-css');

    grunt.registerTask("default", ["connect", "watch"]);
    grunt.registerTask("css", ["concat_css"]);
    grunt.registerTask("build", ["concat_css", "browserify:vendor", "browserify:app"]);
};