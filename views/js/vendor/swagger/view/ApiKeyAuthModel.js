/**
 * Changes (AMDify) by A.Zagovorichev for Open Assessment Technologies, S.A.
 *
 * @author A.Zagovorichev, <zagovorichev@1pt.com>
 */

define([
    'jquery',
    'taoRestApiDocs/vendor/lib/backbone-min'
], function ($,
             Backbone) {
    'use strict';
    

    return {

        extend: function extend(SwaggerUi) {

            SwaggerUi.Models.ApiKeyAuthModel = Backbone.Model.extend({
                defaults: {
                    'in': '',
                    name: '',
                    title: '',
                    value: ''
                },

                initialize: function () {
                    this.on('change', this.validate);
                },

                validate: function () {
                    var valid = !!this.get('value');

                    this.set('valid', valid);

                    return valid;
                }
            });
    
            return SwaggerUi;
        }
    };
});
