/**
 * Changes (AMDify) by A.Zagovorichev for Open Assessment Technologies, S.A.
 *
 * @author A.Zagovorichev, <zagovorichev@1pt.com>
 */

define([
    'jquery',
    'core/eventifier',
    'taoRestApiDocs/vendor/lib/backbone-min',
    'taoRestApiDocs/vendor/lib/handlebars-2.0.0',
    'taoRestApiDocs/vendor/swagger/templates'
], function ($,
             eventifier,
             Backbone,
             Handlebars) {
    'use strict';


    return eventifier({

        extend: function extend(SwaggerUi) {

            SwaggerUi.Views.Oauth2View = Backbone.View.extend({
                events: {
                    'change .oauth-scope': 'scopeChange'
                },

                template: Handlebars.templates.oauth2,

                render: function () {
                    this.$el.html(this.template(this.model.toJSON()));

                    return this;
                },

                scopeChange: function (e) {
                    var val = $(e.target).prop('checked');
                    var scope = $(e.target).data('scope');

                    this.model.setScopes(scope, val);
                }
            });

            return SwaggerUi;
        }
    });
});
