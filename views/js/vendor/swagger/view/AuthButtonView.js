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
], function (
    $, 
    eventifier, 
    Backbone, 
    Handlebars
) {
    'use strict';


    return eventifier({
        
        extend: function extend(SwaggerUi) {

            SwaggerUi.Views.AuthButtonView = Backbone.View.extend({
                events: {
                    'click .authorize__btn': 'authorizeBtnClick'
                },

                tpls: {
                    popup: Handlebars.templates.popup,
                    authBtn: Handlebars.templates.auth_button,
                    authBtnOperation: Handlebars.templates.auth_button_operation
                },

                initialize: function (opts) {
                    this.options = opts || {};
                    this.options.data = this.options.data || {};
                    this.isOperation = this.options.isOperation;
                    this.model = this.model || {};
                    this.router = this.options.router;
                    this.auths = this.options.data.oauth2.concat(this.options.data.auths);
                },

                render: function () {
                    var tplName = this.isOperation ? 'authBtnOperation' : 'authBtn';

                    this.$authEl = this.renderAuths(this.auths);
                    this.$el.html(this.tpls[tplName](this.model));

                    return this;
                },

                authorizeBtnClick: function (e) {
                    var authsModel;

                    e.preventDefault();

                    authsModel = {
                        title: 'Available authorizations',
                        content: this.$authEl
                    };

                    // The content of the popup is removed and all events unbound after clicking the 'Cancel' button of the popup.
                    // We'll have to re-render the contents before creating a new popup view.
                    this.render();
                    

                    this.popup = new SwaggerUi.Views.PopupView({model: authsModel});
                    this.popup.render();
                },

                renderAuths: function (auths) {
                    var $el = $('<div>');
                    var isLogout = false;
                    
                    auths.forEach(function (auth) {
                        var authView = new SwaggerUi.Views.AuthView({data: auth, router: this.router});
                        var authEl = authView.render().el;
                        $el.append(authEl);
                        if (authView.isLogout) {
                            isLogout = true;
                        }
                    }, this);

                    this.model.isLogout = isLogout;

                    return $el;
                }

            });
            
            return SwaggerUi;
        }
    });

});
