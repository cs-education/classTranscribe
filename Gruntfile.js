/** Copyright 2015 Board of Trustees of University of Illinois
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// Creates the piwik server on PIWIK_PORT

var dotenv = require('dotenv');
dotenv.load();

module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            build: {

            }
        },
        php: {
            dist: {
                options: {
                    key: grunt.file.read("cert/cert/key.pem").toString(),
                    cert: grunt.file.read("cert/cert/cert.pem").toString(),
                    ca: grunt.file.read("cert/cert/cert.pem").toString(),
                    hostname: "0.0.0.0", //allows external networks to access
                    port: process.env.PIWIK_PORT,
                    keepalive: true,
                    base: './piwik'
                }
            },
        }
    });

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.loadNpmTasks('grunt-php');	
	grunt.registerTask('default', ['php']);
}
