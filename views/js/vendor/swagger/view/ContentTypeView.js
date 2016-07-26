/**
 * Changes (AMDify) by A.Zagovorichev for Open Assessment Technologies, S.A.
 *
 * @author A.Zagovorichev, <zagovorichev@1pt.com>
 */

define([
    'jquery',
    'core/eventifier',
    'taoRestApiDocs/vendor/lib/backbone-min',
    'taoRestApiDocs/vendor/swagger/helpers/handlebars',
    'taoRestApiDocs/vendor/swagger/templates'
], function ($,
             eventifier,
             Backbone,
             Handlebars) {
    'use strict';


    return eventifier({

        extend: function extend(SwaggerUi) {

            SwaggerUi.Views.ContentTypeView = Backbone.View.extend({
                initialize: function () {
                },

                render: function () {
                    this.model.contentTypeId = 'ct' + Math.random();
                    $(this.el).html(Handlebars.templates.content_type(this.model));
                    return this;
                }
            });
            return SwaggerUi;
        }
    });
});
