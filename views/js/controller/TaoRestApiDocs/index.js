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
    'taoRestApiDocs/vendor/swagger/view/MainView',
    'taoRestApiDocs/vendor/swagger/view/ResourceView',
    'taoRestApiDocs/vendor/swagger/view/partials/signature',
    'taoRestApiDocs/vendor/swagger/view/SignatureView',
    'taoRestApiDocs/vendor/swagger/view/OperationView',
    'taoRestApiDocs/vendor/swagger/view/ResponseContentTypeView',
    'taoRestApiDocs/vendor/swagger/view/ParameterView',
    'taoRestApiDocs/vendor/swagger/view/StatusCodeView',
    'taoRestApiDocs/vendor/lib/jsoneditor.min'
], function ($, _, __, helpers, SwaggerUi) {
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

            var swagger = new SwaggerUi({
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

            swagger.load();

            function log() {
                if ('console' in window) {
                    console.log.apply(console, arguments);
                }
            }

        }

    };
});

