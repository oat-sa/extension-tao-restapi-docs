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

            SwaggerUi.Views.BasicAuthView = Backbone.View.extend({

                initialize: function (opts) {
                    this.options = opts || {};
                    this.router = this.options.router;
                },

                events: {
                    'change .auth_input': 'inputChange'
                },

                selectors: {
                    usernameInput: '.basic_auth__username',
                    passwordInput: '.basic_auth__password'
                },

                cls: {
                    error: 'error'
                },

                template: Handlebars.templates.basic_auth,

                render: function () {
                    $(this.el).html(this.template(this.model.toJSON()));

                    return this;
                },

                inputChange: function (e) {
                    var $el = $(e.target);
                    var val = $el.val();
                    var attr = $el.prop('name');

                    if (val) {
                        $el.removeClass(this.cls.error);
                    }

                    this.model.set(attr, val);
                },

                isValid: function () {
                    return this.model.validate();
                },

                highlightInvalid: function () {
                    if (!this.model.get('username')) {
                        this.$(this.selectors.usernameInput).addClass(this.cls.error);
                    }
                }
            });

            return SwaggerUi;
        }
    });
});
