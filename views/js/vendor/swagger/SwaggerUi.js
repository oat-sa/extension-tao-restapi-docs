/**
 * Changes (AMDify) by A.Zagovorichev for Open Assessment Technologies, S.A.
 *
 * @author A.Zagovorichev, <zagovorichev@1pt.com>
 */

/*global JSONEditor*/
define([
    'jquery',
    'lodash',
    'taoRestApiDocs/vendor/lib/backbone-min',
    'taoRestApiDocs/vendor/swagger/doc',
    'taoRestApiDocs/vendor/lib/marked',
    'taoRestApiDocs/vendor/lib/SwaggerClient'
], function ($, _, Backbone, Docs, marked, SwaggerClient) {
    'use strict';

    var SwaggerUi;

    Backbone.View = (function(View) {
        return View.extend({
            constructor: function(options) {
                this.options = options || {};
                View.apply(this, arguments);
            }
        });
    })(Backbone.View);

    //window.SwaggerUi
    SwaggerUi = Backbone.Router.extend({

        dom_id: 'swagger_ui',

        // Attributes
        options: null,
        api: null,
        headerView: null,
        mainView: null,

        // SwaggerUi accepts all the same options as SwaggerApi
        initialize: function (options) {
            var self = this;
            options = options || {};

            if (options.defaultModelRendering !== 'model') {
                options.defaultModelRendering = 'schema';
            }

            if (!options.highlightSizeThreshold) {
                options.highlightSizeThreshold = 100000;
            }

            // Allow dom_id to be overridden
            if (options.dom_id) {
                this.dom_id = options.dom_id;
                delete options.dom_id;
            }

            if (!options.supportedSubmitMethods) {
                options.supportedSubmitMethods = [
                    'get',
                    'put',
                    'post',
                    'delete',
                    'head',
                    'options',
                    'patch'
                ];
            }

            if (typeof options.oauth2RedirectUrl === 'string') {
                window.oAuthRedirectUrl = options.oauth2RedirectUrl;
            }

            // Create an empty div which contains the dom_id
            if (!$('#' + this.dom_id).length) {
                $('body').append('<div id="' + this.dom_id + '"></div>');
            }

            this.options = options;

            // set marked options
            marked.setOptions({gfm: true});

            // Set the callbacks
            this.options.success = function () {
                return self.render();
            };
            this.options.progress = function (d) {
                return self.showMessage(d);
            };
            this.options.failure = function (d) {
                return self.onLoadFailure(d);
            };

            // Create view to handle the header inputs
            this.headerView = new SwaggerUi.Views.HeaderView({el: $('#header')});

            // Event handler for when the baseUrl/apiKey is entered by user
            this.headerView.on('update-swagger-ui', function (data) {
                return self.updateSwaggerUi(data);
            });

            // JSon Editor custom theming
            JSONEditor.defaults.iconlibs.swagger = JSONEditor.AbstractIconLib.extend({
                mapping: {
                    collapse: 'collapse',
                    expand: 'expand'
                },
                icon_prefix: 'swagger-'
            });

        },

        // Set an option after initializing
        setOption: function (option, value) {
            this.options[option] = value;
        },

        // Get the value of a previously set option
        getOption: function (option) {
            return this.options[option];
        },

        // Event handler for when url/key is received from user
        updateSwaggerUi: function (data) {
            this.options.url = data.url;
            this.load();
        },

        // Create an api and render
        load: function () {
            var url = this.options.url;

            // Initialize the API object
            if (this.mainView) {
                this.mainView.clear();
            }

            if (this.authView) {
                this.authView.remove();
            }
            if (url && url.indexOf('http') !== 0) {
                url = this.buildUrl(window.location.href.toString(), url);
            }
            if (this.api) {
                this.options.authorizations = this.api.clientAuthorizations.authz;
            }
            this.options.url = url;
            this.headerView.update(url);

            this.api = new SwaggerClient(this.options);
        },

        // collapse all sections
        collapseAll: function () {
            Docs.collapseEndpointListForResource('');
        },

        // list operations for all sections
        listAll: function () {
            Docs.collapseOperationsForResource('');
        },

        // expand operations for all sections
        expandAll: function () {
            Docs.expandOperationsForResource('');
        },

        // This is bound to success handler for SwaggerApi
        //  so it gets called when SwaggerApi completes loading
        render: function () {
            var authsModel;
            this.showMessage('Finished Loading Resource Information. Rendering Swagger UI...');
            this.mainView = new SwaggerUi.Views.MainView({
                model: this.api,
                el: $('#' + this.dom_id),
                swaggerOptions: this.options,
                router: this
            }).render();
            if (!_.isEmpty(this.api.securityDefinitions)) {
                authsModel = _.map(this.api.securityDefinitions, function (auth, name) {
                    var result = {};
                    result[name] = auth;
                    return result;
                });
                this.authView = new SwaggerUi.Views.AuthButtonView({
                    data: SwaggerUi.utils.parseSecurityDefinitions(authsModel),
                    router: this
                });
                $('#auth_container').append(this.authView.render().el);
            }
            this.showMessage();
            switch (this.options.docExpansion) {
                case 'full':
                    this.expandAll();
                    break;
                case 'list':
                    this.listAll();
                    break;
                default:
                    break;
            }
            this.renderGFM();

            if (this.options.onComplete) {
                this.options.onComplete(this.api, this);
            }

            setTimeout(Docs.shebang.bind(this), 100);
        },

        buildUrl: function (base, url) {
            if (url.indexOf('/') === 0) {
                var parts = base.split('/');
                base = parts[0] + '//' + parts[2];
                return base + url;
            } else {
                var endOfPath = base.length;

                if (base.indexOf('?') > -1) {
                    endOfPath = Math.min(endOfPath, base.indexOf('?'));
                }

                if (base.indexOf('#') > -1) {
                    endOfPath = Math.min(endOfPath, base.indexOf('#'));
                }

                base = base.substring(0, endOfPath);

                if (base.indexOf('/', base.length - 1) !== -1) {
                    return base + url;
                }

                return base + '/' + url;
            }
        },

        // Shows message on topbar of the ui
        showMessage: function (data) {
            var $msgbar = $('#message-bar');

            if (data === undefined) {
                data = '';
            }
            $msgbar.removeClass('message-fail');
            $msgbar.addClass('message-success');
            $msgbar.text(data);
            if (window.SwaggerTranslator) {
                window.SwaggerTranslator.translate($msgbar);
            }
        },

        // shows message in red
        onLoadFailure: function (data) {
            if (data === undefined) {
                data = '';
            }
            $('#message-bar').removeClass('message-success');
            $('#message-bar').addClass('message-fail');

            var val = $('#message-bar').text(data);

            if (this.options.onFailure) {
                this.options.onFailure(data);
            }

            return val;
        },

        // Renders GFM for elements with 'markdown' class
        renderGFM: function () {
            $('.markdown').each(function () {
                $(this).html(marked($(this).html()));
            });

            $('.propDesc', '.model-signature .description').each(function () {
                $(this).html(marked($(this).html())).addClass('markdown');
            });
        }

    });

    SwaggerUi.Views = {};
    SwaggerUi.Models = {};
    SwaggerUi.Collections = {};
    SwaggerUi.partials = {};
    SwaggerUi.utils = {};

    // UMD
    (function (root, factory) {
        if (typeof define === 'function' && define.amd) {
            // AMD. Register as an anonymous module.
            define(['b'], function (b) {
                return (root.SwaggerUi = factory(b));
            });
        } else if (typeof exports === 'object') {
            // Node. Does not work with strict CommonJS, but
            // only CommonJS-like environments that support module.exports,
            // like Node.
            module.exports = factory(require('b'));
        } else {
            // Browser globals
            root.SwaggerUi = factory(root.b);
        }
    }(this, function () {
        return SwaggerUi;
    }));

    return SwaggerUi;
});
