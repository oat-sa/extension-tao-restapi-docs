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

    SwaggerUi.Views.StatusCodeView = Backbone.View.extend({
        initialize: function (opts) {
            this.options = opts || {};
            this.router = this.options.router;
        },

        render: function () {
            var responseModel, responseModelView;
            var value = this.router.api.models[this.model.responseModel];
            $(this.el).html(Handlebars.templates.status_code(this.model));

            if (this.router.api.models.hasOwnProperty(this.model.responseModel)) {
                responseModel = {
                    sampleJSON: JSON.stringify(SwaggerUi.partials.signature.createJSONSample(value), void 0, 2),
                    sampleXML: this.model.isXML ? SwaggerUi.partials.signature.createXMLSample('', this.model.schema, this.router.api.models) : false,
                    isParam: false,
                    signature: SwaggerUi.partials.signature.getModelSignature(this.model.responseModel, value, this.router.api.models),
                    defaultRendering: this.model.defaultRendering
                };
            } else {
                responseModel = {
                    signature: SwaggerUi.partials.signature.getPrimitiveSignature(this.model.schema)
                };
            }

            responseModelView = new SwaggerUi.Views.SignatureView({model: responseModel, tagName: 'div'});
            $('.model-signature', this.$el).append(responseModelView.render().el);
            return this;
        }
    });
});
