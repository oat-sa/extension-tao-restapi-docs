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
    'taoRestApiDocs/vendor/lib/lodash.min',
    'i18n',
    'helpers',
    'taoRestApiDocs/vendor/swagger/SwaggerUi',
    'taoRestApiDocs/vendor/swagger/helpers/handlebars',
    'taoRestApiDocs/vendor/swagger/utils/utils',
    'taoRestApiDocs/vendor/lib/jsoneditor.min',
    'taoRestApiDocs/vendor/lib/SwaggerClient',
    'taoRestApiDocs/vendor/swagger/doc',
    
    // Data viewers
    'taoRestApiDocs/vendor/swagger/view/partials/signature',
    'taoRestApiDocs/vendor/swagger/view/ApiKeyAuthModel',
    'taoRestApiDocs/vendor/swagger/view/ApiKeyAuthView',
    'taoRestApiDocs/vendor/swagger/view/AuthButtonView',
    'taoRestApiDocs/vendor/swagger/view/AuthsCollection',
    'taoRestApiDocs/vendor/swagger/view/AuthsCollectionView',
    'taoRestApiDocs/vendor/swagger/view/AuthView',
    'taoRestApiDocs/vendor/swagger/view/BasicAuthModel',
    'taoRestApiDocs/vendor/swagger/view/BasicAuthView',
    'taoRestApiDocs/vendor/swagger/view/ContentTypeView',
    'taoRestApiDocs/vendor/swagger/view/HeaderView',
    'taoRestApiDocs/vendor/swagger/view/MainView',
    'taoRestApiDocs/vendor/swagger/view/Oauth2Model',
    'taoRestApiDocs/vendor/swagger/view/Oauth2View',
    'taoRestApiDocs/vendor/swagger/view/OperationView',
    'taoRestApiDocs/vendor/swagger/view/ParameterContentTypeView',
    'taoRestApiDocs/vendor/swagger/view/ParameterView',
    'taoRestApiDocs/vendor/swagger/view/PopupView',
    'taoRestApiDocs/vendor/swagger/view/ResourceView',
    'taoRestApiDocs/vendor/swagger/view/ResponseContentTypeView',
    'taoRestApiDocs/vendor/swagger/view/SignatureView',
    'taoRestApiDocs/vendor/swagger/view/StatusCodeView',
    
    // helpers
    'taoRestApiDocs/vendor/lib/helpers/object-assign-pollyfill',
    'taoRestApiDocs/vendor/lib/helpers/jquery.slideto.min',
    'taoRestApiDocs/vendor/lib/helpers/jquery.wiggle.min',
    'taoRestApiDocs/vendor/lib/helpers/highlight.9.1.0.pack'
    /*'taoRestApiDocs/vendor/lib/helpers/swagger-oauth'*/
], function (
    $, 
    _, 
    __, 
    helpers, 
    SwaggerUi,
    Handlebars,
    Utils,
    JsonEditor,
    SwaggerClient,
    Docs,

    PartialSignature,
    ApiKeyAuthModel,
    ApiKeyAuthView,
    AuthButtonView,
    AuthCollection,
    AuthCollectionView,
    AuthView,
    BasicAuthModel,
    BasicAuthView,
    ContentTypeView,
    HeaderView,
    MainView,
    Oauth2Model,
    Oauth2View,
    OperationView,
    ParameterContentTypeView,
    ParameterView,
    PopupView,
    ResourceView,
    ResponseContentTypeView,
    SignatureView,
    StatusCodeView
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
            var swaggerUi;

            require(['taoRestApiDocs/vendor/lib/helpers/highlight.9.1.0.pack_extended']);
            hljs.configure({
                highlightSizeThreshold: 5000
            });
            
            
            swaggerUi = new backBone({
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

            swaggerUi = PartialSignature.extend(swaggerUi);
            swaggerUi = ApiKeyAuthModel.extend(swaggerUi);
            swaggerUi = ApiKeyAuthView.extend(swaggerUi);
            swaggerUi = AuthButtonView.extend(swaggerUi);
            swaggerUi = AuthCollection.extend(swaggerUi);
            swaggerUi = AuthCollectionView.extend(swaggerUi);
            swaggerUi = AuthView.extend(swaggerUi);
            swaggerUi = BasicAuthModel.extend(swaggerUi);
            swaggerUi = BasicAuthView.extend(swaggerUi);
            swaggerUi = ContentTypeView.extend(swaggerUi);
            swaggerUi = HeaderView.extend(swaggerUi);
            swaggerUi = MainView.extend(swaggerUi);
            swaggerUi = Oauth2Model.extend(swaggerUi);
            swaggerUi = Oauth2View.extend(swaggerUi);
            swaggerUi = OperationView.extend(swaggerUi);
            swaggerUi = ParameterContentTypeView.extend(swaggerUi);
            swaggerUi = ParameterView.extend(swaggerUi);
            swaggerUi = PopupView.extend(swaggerUi);
            swaggerUi = ResourceView.extend(swaggerUi);
            swaggerUi = ResponseContentTypeView.extend(swaggerUi);
            swaggerUi = SignatureView.extend(swaggerUi);
            swaggerUi = StatusCodeView.extend(swaggerUi);

            swaggerUi = Utils.bind(swaggerUi);
            
            
            
            
            SwaggerUi.on('load', function(){
                // Create view to handle the header inputs
                
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
                
                MainView.on('resource', function(options) {
                    
                    var resourceView = new swaggerUi.Views.ResourceView({
                        model: options.resource,
                        router: swaggerUi,
                        tagName: 'li',
                        id: 'resource_' + options.resource.id,
                        className: 'resource',
                        auths: options.auths,
                        swaggerOptions: swaggerUi.options
                    });
                    
                    
                    ResourceView.on('operation', function(operation) {
                        
                        // Render an operation and add it to operations li
                        var operationView = new swaggerUi.Views.OperationView({
                            model: operation,
                            router: swaggerUi,
                            tagName: 'li',
                            className: 'endpoint',
                            swaggerOptions: swaggerUi.options,
                            auths: swaggerUi.auths
                        });

                        $('.endpoints', $(swaggerUi.el)).append(operationView.render().el);
                    });

                    ResourceView.on('call', function(param){
                        Docs[param.fnName](param.e.currentTarget.getAttribute('data-id'));
                    });
                    
                    $('#resources', swaggerUi.el).append(resourceView.render().el);
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
                        data: swaggerUi.utils.parseSecurityDefinitions(authsModel),
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
                swaggerUi.renderGFM();

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

