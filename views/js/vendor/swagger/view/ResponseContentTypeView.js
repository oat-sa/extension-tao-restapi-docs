/**
 * Changes (AMDify) by A.Zagovorichev for Open Assessment Technologies, S.A.
 *
 * @author A.Zagovorichev, <zagovorichev@1pt.com>
 */

define([
    'jquery',
    'core/eventifier',
    'taoRestApiDocs/vendor/lib/backbone-min',
    'taoRestApiDocs/vendor/lib/handlebars-2.0.0'
], function ($, eventifier, Backbone, Handlebars) {

    'use strict';

    return eventifier({
        extend: function extend(SwaggerUi) {

            var selfEvent = this;

            SwaggerUi.Views.ResponseContentTypeView = Backbone.View.extend({
                initialize: function () {
                },

                render: function () {
                    this.model.responseContentTypeId = 'rct' + Math.random();
                    $(this.el).html(Handlebars.templates.response_content_type(this.model));
                    return this;
                }
            });
            
            return SwaggerUi;
        }
    });
});
  