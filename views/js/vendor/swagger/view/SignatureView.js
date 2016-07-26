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
], function ($, eventifier, Backbone, Handlebars) {
    'use strict';

    return eventifier({
        extend: function extend(SwaggerUi) {

            SwaggerUi.Views.SignatureView = Backbone.View.extend({
                events: {
                    'click a.description-link': 'switchToDescription',
                    'click a.snippet-link': 'switchToSnippet',
                    'mousedown .snippet_json': 'jsonSnippetMouseDown',
                    'mousedown .snippet_xml': 'xmlSnippetMouseDown'
                },

                initialize: function () {
                },

                render: function () {

                    $(this.el).html(Handlebars.templates.signature(this.model));

                    if (this.model.defaultRendering === 'model') {
                        this.switchToDescription();
                    } else {
                        this.switchToSnippet();
                    }

                    return this;
                },

                // handler for show signature
                switchToDescription: function (e) {
                    if (e) {
                        e.preventDefault();
                    }

                    $('.snippet', $(this.el)).hide();
                    $('.description', $(this.el)).show();
                    $('.description-link', $(this.el)).addClass('selected');
                    $('.snippet-link', $(this.el)).removeClass('selected');
                },

                // handler for show sample
                switchToSnippet: function (e) {
                    if (e) {
                        e.preventDefault();
                    }

                    $('.snippet', $(this.el)).show();
                    $('.description', $(this.el)).hide();
                    $('.snippet-link', $(this.el)).addClass('selected');
                    $('.description-link', $(this.el)).removeClass('selected');
                },

                // handler for snippet to text area
                snippetToTextArea: function (val) {
                    var textArea = $('textarea', $(this.el.parentNode.parentNode.parentNode));

                    // Fix for bug in IE 10/11 which causes placeholder text to be copied to "value"
                    if ($.trim(textArea.val()) === '' || textArea.prop('placeholder') === textArea.val()) {
                        textArea.val(val);
                        // TODO move this code outside of the view and expose an event instead
                        if (this.model.jsonEditor && this.model.jsonEditor.isEnabled()) {
                            this.model.jsonEditor.setValue(JSON.parse(this.model.sampleJSON));
                        }
                    }
                },

                jsonSnippetMouseDown: function (e) {
                    if (this.model.isParam) {
                        if (e) {
                            e.preventDefault();
                        }

                        this.snippetToTextArea(this.model.sampleJSON);
                    }
                },

                xmlSnippetMouseDown: function (e) {
                    if (this.model.isParam) {
                        if (e) {
                            e.preventDefault();
                        }

                        this.snippetToTextArea(this.model.sampleXML);
                    }
                }
            });
            
            return SwaggerUi;
        }
    });
});
