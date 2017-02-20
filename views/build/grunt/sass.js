module.exports = function(grunt) {
    'use strict';

    var sass    = grunt.config('sass') || {};
    var watch   = grunt.config('watch') || {};
    var notify  = grunt.config('notify') || {};
    var root    = grunt.option('root') + '/taoRestApiDocs/views/';

    sass.taorestapidocs = { };
    sass.taorestapidocs.files = { };
    sass.taorestapidocs.files[root + 'css/style.css'] = root + 'scss/style.scss';

    watch.taorestapidocssass = {
        files : [root + 'scss/*.scss'],
        tasks : ['sass:taorestapidocs', 'notify:taorestapidocssass'],
        options : {
            debounceDelay : 1000
        }
    };

    notify.taorestapidocssass = {
        options: {
            title: 'Grunt SASS',
            message: 'SASS files compiled to CSS'
        }
    };

    grunt.config('sass', sass);
    grunt.config('watch', watch);
    grunt.config('notify', notify);

    //register an alias for main build
    grunt.registerTask('taorestapidocssass', ['sass:taorestapidocs']);
};
