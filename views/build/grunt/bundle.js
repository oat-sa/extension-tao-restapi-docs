module.exports = function (grunt) {

    var requirejs = grunt.config('requirejs') || {};
    var clean = grunt.config('clean') || {};
    var copy = grunt.config('copy') || {};

    var root = grunt.option('root');
    var libs = grunt.option('mainlibs');
    var ext = require(root + '/tao/views/build/tasks/helpers/extensions')(grunt, root);
    var out = 'output';

    /**
     * Remove bundled and bundling files
     */
    clean.taorestapidocsbundle = [out];

    /**
     * Compile tao files into a bundle
     */
    requirejs.taorestapidocsbundle = {
        options: {
            baseUrl: '../js',
            dir: out,
            mainConfigFile: './config/requirejs.build.js',
            paths: {
                'taoRestApiDocs': root + '/taoRestApiDocs/views/js',
                'underscore': root + '/taoRestApiDocs/views/js/vendor/lib/underscore',
                'backbone': root + '/taoRestApiDocs/views/js/vendor/lib/backbone-min'
            },
            modules: [{
                name: 'taoRestApiDocs/controller/routes',
                include: ext.getExtensionsControllers(['taoRestApiDocs']),
                exclude: ['mathJax'].concat(libs)
            }],
            shim: {
                underscore: {
                    exports: 'underscore'
                },
                backbone: {
                    deps: ["underscore", "jquery"],
                    exports: "backbone"
                }
            },
            wrap: {
                start: '',
                end: ""
            },
            wrapShim: true,
            excludeShallow : ['mathJax', 'ckeditor']
        }
    };

    /**
     * copy the bundles to the right place
     */
    copy.taorestapidocsbundle = {
        files: [
            {
                src: [out + '/taoRestApiDocs/controller/routes.js'],
                dest: root + '/taoRestApiDocs/views/js/controllers.min.js'
            },
            {
                src: [out + '/taoRestApiDocs/controller/routes.js.map'],
                dest: root + '/taoRestApiDocs/views/js/controllers.min.js.map'
            }
        ]
    };

    grunt.config('clean', clean);
    grunt.config('requirejs', requirejs);
    grunt.config('copy', copy);

    // bundle task
    grunt.registerTask('taorestapidocsbundle', ['clean:taorestapidocsbundle', 'requirejs:taorestapidocsbundle', 'copy:taorestapidocsbundle']);
};
