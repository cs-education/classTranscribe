//var grunt = require('grunt');

var dotenv = require('dotenv');
dotenv.load();

module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);

    //var basePort = process.env.npm_package_config_basePort;
    //var addPiwikPort = process.env.npm_package_config_addPiwikPort;
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
                    hostname: "0.0.0.0",
                    port: process.env.PIWIK_PORT,
                    keepalive: true,
                    base: './piwik'
                }
            },
        }
    });

	 grunt.loadNpmTasks('grunt-contrib-watch');
	 grunt.loadNpmTasks('grunt-contrib-uglify');
  // grunt.loadNpmTasks('grunt-express-server');

   // grunt.registerTask('default', ['php']);


	grunt.loadNpmTasks('grunt-php');	

	grunt.registerTask('default', ['php']);
}
