/**
 * Changes (AMDify) by A.Zagovorichev for Open Assessment Technologies, S.A.
 *
 * @author A.Zagovorichev, <zagovorichev@1pt.com>
 */

define([
    'jquery',
    'taoRestApiDocs/vendor/lib/backbone-min',
    'taoRestApiDocs/vendor/swagger/SwaggerUi'
],function ($, Backbone, SwaggerUi) {
    'use strict';

    SwaggerUi.Views.HeaderView = Backbone.View.extend({
        events: {
            'click #show-pet-store-icon': 'showPetStore',
            'click #explore': 'showCustom',
            'keyup #input_baseUrl': 'showCustomOnKeyup',
            'keyup #input_apiKey': 'showCustomOnKeyup'
        },

        initialize: function () {
        },

        showPetStore: function () {
            this.trigger('update-swagger-ui', {
                url: 'http://petstore.swagger.io/v2/swagger.json'
            });
        },

        showCustomOnKeyup: function (e) {
            if (e.keyCode === 13) {
                this.showCustom();
            }
        },

        showCustom: function (e) {
            if (e) {
                e.preventDefault();
            }

            this.trigger('update-swagger-ui', {
                url: $('#input_baseUrl').val()
            });
        },

        update: function (url, apiKey, trigger) {
            if (trigger === undefined) {
                trigger = false;
            }

            $('#input_baseUrl').val(url);

            if (trigger) {
                this.trigger('update-swagger-ui', {url: url});
            }
        }
    });
});
