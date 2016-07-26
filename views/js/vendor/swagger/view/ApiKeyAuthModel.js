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

            var selfEvent = this;

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
    });
});
