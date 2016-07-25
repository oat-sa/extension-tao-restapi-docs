/**
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; under version 2
 * of the License (non-upgradable).
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 *
 * Copyright (c) 2016  (original work) Open Assessment Technologies SA;
 *
 * @author Alexander Zagovorichev <zagovorichev@1pt.com>
 */

define([
    'jquery',
    'lodash',
    'i18n',
    'helpers',
    'taoRestApiDocs/vendor/swagger/SwaggerUi',
    'taoRestApiDocs/vendor/swagger/helpers/handlebars',
    'taoRestApiDocs/vendor/swagger/utils/utils',
    'taoRestApiDocs/vendor/swagger/view/HeaderView',
    'taoRestApiDocs/vendor/lib/jsoneditor.min',
    'taoRestApiDocs/vendor/lib/SwaggerClient',
    'taoRestApiDocs/vendor/swagger/view/MainView',
    'taoRestApiDocs/vendor/swagger/view/ResourceView',
    'taoRestApiDocs/vendor/swagger/view/OperationView'
], function (
    $, 
    _, 
    __, 
    helpers, 
    SwaggerUi,
    Handlebars,
    Utils,
    HeaderView,
    JsonEditor,
    SwaggerClient,
    MainView,
    ResourceView,
    OperationView
) {
    'use strict';

    /**
     * The Swagger controller
     * @exports taoRestApiDocs/controller/TaoRestApiDocs/index
     */
    return {

        /**
         * controller dispatch entry point
         */
        start: function start() {

            var backBone = SwaggerUi.swagger();
            var swaggerUi = new backBone({
                url: helpers._url('docs', 'TaoRestApiDocs', 'taoRestApiDocs'),
                dom_id: "swagger-ui-container",
                supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
                onComplete: function(swaggerApi, swaggerUi){
                    if(typeof initOAuth == "function") {
                        initOAuth({
                            clientId: "your-client-id",
                            clientSecret: "your-client-secret-if-required",
                            realm: "your-realms",
                            appName: "your-app-name",
                            scopeSeparator: ",",
                            additionalQueryStringParams: {}
                        });
                    }

                    if(window.SwaggerTranslator) {
                        window.SwaggerTranslator.translate();
                    }
                },
                onFailure: function(data) {
                    log("Unable to Load SwaggerUI");
                },
                docExpansion: "none",
                jsonEditor: false,
                defaultModelRendering: 'schema',
                showRequestHeaders: false
            });

            swaggerUi.Views = {};
            swaggerUi.Models = {};
            swaggerUi.Collections = {};
            swaggerUi.partials = {};
            swaggerUi.utils = {};
            
            
            SwaggerUi.on('load', function(){
                // Create view to handle the header inputs
                swaggerUi = HeaderView.extend(swaggerUi);
                swaggerUi.headerView = new swaggerUi.Views.HeaderView({el: $('#header')});

                // Event handler for when the baseUrl/apiKey is entered by user
                swaggerUi.headerView.on('update-swagger-ui', function (data) {
                    return swaggerUi.updateSwaggerUi(data);
                });

                swaggerUi.headerView.update(swaggerUi.options.url);
                
                swaggerUi.api = new SwaggerClient(swaggerUi.options);
                
            });
            
            
            SwaggerUi.on('render', function() {
                var authsModel;

                swaggerUi = MainView.extend(swaggerUi);
                
                MainView.on('resource', function(resource, auths) {
                    
                    swaggerUi = ResourceView.extend(swaggerUi);

                    var resourceView = new swaggerUi.Views.ResourceView({
                        model: resource,
                        router: this.router,
                        tagName: 'li',
                        id: 'resource_' + resource.id,
                        className: 'resource',
                        auths: auths,
                        swaggerOptions: swaggerUi.options.swaggerOptions
                    });

                    swaggerUi = OperationView.extend(swaggerUi);
                    resourceView.on('operation', function() {
                        
                        // Render an operation and add it to operations li
                        var operationView = new swaggerUi.Views.OperationView({
                            model: operation,
                            router: swaggerUi.router,
                            tagName: 'li',
                            className: 'endpoint',
                            swaggerOptions: swaggerUi.options.swaggerOptions,
                            auths: swaggerUi.auths
                        });

                        $('.endpoints', $(this.el)).append(operationView.render().el);
                    });
                    
                    $('#resources', this.el).append(resourceView.render().el);
                });
                
                swaggerUi.mainView = new swaggerUi.Views.MainView({
                    model: swaggerUi.api,
                    el: $('#' + swaggerUi.dom_id),
                    swaggerOptions: swaggerUi.options,
                    router: swaggerUi
                }).render();
                
                if (!_.isEmpty(swaggerUi.api.securityDefinitions)) {
                    authsModel = _.map(swaggerUi.api.securityDefinitions, function (auth, name) {
                        var result = {};
                        result[name] = auth;
                        return result;
                    });
                    swaggerUi.authView = new swaggerUi.Views.AuthButtonView({
                        data: SwaggerUi.utils.parseSecurityDefinitions(authsModel),
                        router: swaggerUi
                    });
                    $('#auth_container').append(swaggerUi.authView.render().el);
                }

                swaggerUi.showMessage();
                switch (swaggerUi.options.docExpansion) {
                    case 'full':
                        swaggerUi.expandAll();
                        break;
                    case 'list':
                        swaggerUi.listAll();
                        break;
                    default:
                        break;
                }
                this.renderGFM();

                if (swaggerUi.options.onComplete) {
                    swaggerUi.options.onComplete(swaggerUi.api, swaggerUi);
                }

                setTimeout(Docs.shebang.bind(swaggerUi), 100);
            });
            
            swaggerUi.load();
            
            function log() {
                if ('console' in window) {
                    console.log.apply(console, arguments);
                }
            }

        }

    };
});

