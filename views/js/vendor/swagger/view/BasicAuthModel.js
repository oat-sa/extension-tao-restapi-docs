/**
 * Changes (AMDify) by A.Zagovorichev for Open Assessment Technologies, S.A.
 *
 * @author A.Zagovorichev, <zagovorichev@1pt.com>
 */

define([
    'jquery',
    'core/eventifier',
    'taoRestApiDocs/vendor/lib/backbone-min'
], function ($,
             eventifier,
             Backbone) {
    'use strict';


    return eventifier({

        extend: function extend(SwaggerUi) {

            SwaggerUi.Models.BasicAuthModel = Backbone.Model.extend({
                defaults: {
                    username: '',
                    password: '',
                    title: 'basic'
                },

                initialize: function () {
                    this.on('change', this.validate);
                },

                validate: function () {
                    var valid = !!this.get('password') && !!this.get('username');

                    this.set('valid', valid);

                    return valid;
                }
            });

            return SwaggerUi;
        }
    });
});
