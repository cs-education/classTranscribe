//var grunt = require('grunt');
module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);

    //var basePort = process.env.npm_package_config_basePort;
    //var addPiwikPort = process.env.npm_package_config_addPiwikPort;
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
	stunnel: {
		options: {
			hostname: "0.0.0.0",
			pem: './cert/stunnel/stunnel.pem',
			port: 7002,
			remote: {
				host: "192.17.96.13",
				port: 7001
			}
		},
		target: {
			base: "./piwik"
		}
	},
        uglify: {
            build: {

            }
        },
        php: {
            dist: {
                options: {

                    protocol: "https",

                    key: grunt.file.read("cert/cert/key.pem").toString(),
                    cert: grunt.file.read("cert/cert/cert.pem").toString(),
                    ca: grunt.file.read("cert/cert/cert.pem").toString(),
                    hostname: "0.0.0.0",
                    port: process.env.npm_package_config_piwikPort,
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
	grunt.loadNpmTasks('grunt-stunnel');

	grunt.registerTask('default', ['php', 'stunnel']);
}
