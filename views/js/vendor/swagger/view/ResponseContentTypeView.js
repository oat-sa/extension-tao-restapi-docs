/**
 * Changes (AMDify) by A.Zagovorichev for Open Assessment Technologies, S.A.
 *
 * @author A.Zagovorichev, <zagovorichev@1pt.com>
 */

define([
  'jquery',
  'taoRestApiDocs/vendor/lib/backbone-min',
  'taoRestApiDocs/vendor/swagger/SwaggerUi',
  'taoRestApiDocs/vendor/lib/handlebars-2.0.0'
], function ($, Backbone, SwaggerUi, Handlebars) {

  'use strict';

  SwaggerUi.Views.ResponseContentTypeView = Backbone.View.extend({
    initialize: function () {
    },

    render: function () {
      this.model.responseContentTypeId = 'rct' + Math.random();
      $(this.el).html(Handlebars.templates.response_content_type(this.model));
      return this;
    }
  });
});
  