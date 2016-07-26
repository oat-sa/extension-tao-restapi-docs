/**
 * Changes (AMDify) by A.Zagovorichev for Open Assessment Technologies, S.A.
 *
 * @author A.Zagovorichev, <zagovorichev@1pt.com>
 */

define([
    'jquery',
    'core/eventifier',
    'taoRestApiDocs/vendor/lib/backbone-min',
    'taoRestApiDocs/vendor/swagger/SwaggerUi',
    'taoRestApiDocs/vendor/lib/handlebars-2.0.0',
    'taoRestApiDocs/vendor/swagger/templates'
], function (
    $,
    eventifier,
    Backbone,
    SwaggerUi,
    Handlebars
) {
    'use strict';

    return eventifier({

        extend: function extend(SwaggerUi) {

            var selfEvent = this;

            SwaggerUi.Views.PopupView = Backbone.View.extend({
                events: {
                    'click .api-popup-cancel': 'cancelClick'
                },

                template: Handlebars.templates.popup,
                className: 'api-popup-dialog',

                selectors: {
                    content: '.api-popup-content',
                    main: '#swagger-ui-container'
                },

                initialize: function () {
                    this.$el.html(this.template(this.model));
                },

                render: function () {
                    this.$(this.selectors.content).append(this.model.content);
                    $(this.selectors.main).first().append(this.el);
                    this.showPopup();

                    return this;
                },

                showPopup: function () {
                    this.$el.show();
                },

                cancelClick: function () {
                    this.remove();
                }

            });

            return SwaggerUi;
        }
    });
});
