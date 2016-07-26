/**
 * Changes (AMDify) by A.Zagovorichev for Open Assessment Technologies, S.A.
 *
 * @author A.Zagovorichev, <zagovorichev@1pt.com>
 */

define([
    'jquery',
    'taoRestApiDocs/vendor/lib/lodash.min',
    'core/eventifier',
    'taoRestApiDocs/vendor/lib/backbone-min'
], function ($,
             _,
             eventifier,
             Backbone) {
    'use strict';


    return eventifier({

        extend: function extend(SwaggerUi) {

            var selfEvent = this;
            
            SwaggerUi.Models.Oauth2Model = Backbone.Model.extend({
                defaults: {
                    scopes: {}
                },

                initialize: function () {
                    this.on('change', this.validate);
                },

                setScopes: function (name, val) {
                    var auth = _.extend({}, this.attributes);
                    var index = _.findIndex(auth.scopes, function (o) {
                        return o.scope === name;
                    });
                    auth.scopes[index].checked = val;

                    this.set(auth);
                    this.validate();
                },

                validate: function () {
                    var valid = false;
                    var scp = this.get('scopes');
                    var idx = _.findIndex(scp, function (o) {
                        return o.checked === true;
                    });

                    if (scp.length > 0 && idx >= 0) {
                        valid = true;
                    }

                    if (scp.length === 0) {
                        valid = true;
                    }

                    this.set('valid', valid);

                    return valid;
                }
            });
            return SwaggerUi;
        }
    });
});
