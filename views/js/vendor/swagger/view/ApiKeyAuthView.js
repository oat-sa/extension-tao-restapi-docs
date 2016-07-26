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

            SwaggerUi.Views.ApiKeyAuthView = Backbone.View.extend({ // TODO: append this to global SwaggerUi

                events: {
                    'change .input_apiKey_entry': 'apiKeyChange'
                },

                selectors: {
                    apikeyInput: '.input_apiKey_entry'
                },

                template: Handlebars.templates.apikey_auth,

                initialize: function (opts) {
                    this.options = opts || {};
                    this.router = this.options.router;
                },

                render: function () {
                    this.$el.html(this.template(this.model.toJSON()));

                    return this;
                },

                apiKeyChange: function (e) {
                    var val = $(e.target).val();
                    if (val) {
                        this.$(this.selectors.apikeyInput).removeClass('error');
                    }

                    this.model.set('value', val);
                },

                isValid: function () {
                    return this.model.validate();
                },

                highlightInvalid: function () {
                    if (!this.isValid()) {
                        this.$(this.selectors.apikeyInput).addClass('error');
                    }
                }

            });

            return SwaggerUi;
        }
    });
});
