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
], function ($, eventifier, Backbone, SwaggerUi, Handlebars) {
    'use strict';


    return eventifier({
        
        extend: function extend(SwaggerUi) {

            var selfEvent = this;

            SwaggerUi.Views.ResourceView = Backbone.View.extend({
                
                initialize: function (opts) {
                    opts = opts || {};
                    this.router = opts.router;
                    this.auths = opts.auths;
                    if ('' === this.model.description) {
                        this.model.description = null;
                    }
                    if (this.model.description) {
                        this.model.summary = this.model.description;
                    }
                },

                render: function () {
                    var methods = {};


                    $(this.el).html(Handlebars.templates.resource(this.model));

                    // Render each operation
                    for (var i = 0; i < this.model.operationsArray.length; i++) {
                        var operation = this.model.operationsArray[i];
                        var counter = 0;
                        var id = operation.nickname;

                        while (typeof methods[id] !== 'undefined') {
                            id = id + '_' + counter;
                            counter += 1;
                        }

                        methods[id] = operation;

                        operation.nickname = id;
                        operation.parentId = this.model.id;
                        operation.definitions = this.model.definitions; // make Json Schema available for JSonEditor in this operation
                        this.addOperation(operation);
                    }

                    $('.toggleEndpointList', this.el).click(this.callDocs.bind(this, 'toggleEndpointListForResource'));
                    $('.collapseResource', this.el).click(this.callDocs.bind(this, 'collapseOperationsForResource'));
                    $('.expandResource', this.el).click(this.callDocs.bind(this, 'expandOperationsForResource'));

                    return this;
                },

                addOperation: function (operation) {

                    operation.number = this.number;

                    this.number++;
                    
                    selfEvent.trigger('operation');

                },
                // Generic Event handler (`Docs` is global)


                callDocs: function (fnName, e) {
                    e.preventDefault();
                    
                    selfEvent.trigger('callDocs', {fnName: fnName, e: e});
                }
            });

            return SwaggerUi;
        }
    });
});
