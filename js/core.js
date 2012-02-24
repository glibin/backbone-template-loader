(function(){
    var Core = this.Core = {};

    Core.Model = Backbone.Model.extend({
        urlRoot : '/data',
        defaults: {
            id: null,
            name: ''
        },

        clear: function() {
            this.destroy();
            this.view.remove();
        }
    });

    Core.Collection = Backbone.Collection.extend({
        model: Core.Model,
        url: '/data',
        /* To prevent JSON array hijacking (http://haacked.com/archive/2009/06/25/json-hijacking.aspx)
         all collection data returned from the server should look like: {data : [...]}
         */
        parse : function(resp, xhr) {
            if (resp.data) {
                return resp.data;
            }
            return [];
        }
    });

    Core.Template = {
        cache: {}, //cached templates
        pending: {}, // queue of callbacks, waiting for template to load
        load: function(url, callback) {
            callback = callback || function() {};

            if (this.cache[url]) { //template loaded, call cb
                callback(this.cache[url]);
                return;
            }

            if (this.pending[url]) {
                this.pending[url].push(callback);
                return;
            }

            this.pending[url] = [callback];

            jQuery.ajax({ //load template
                url : url,
                dataType: 'text',
                complete: function(resp) {
                    var cache =
                        this.cache[url] = _.template(resp.responseText); // cache it

                    // proccess all pending callbacks
                    _.each(this.pending[url], function(cb) {
                        cb(cache);
                    });

                    delete this.pending[url];
                }.bind(this),
                error: function() {
                    throw new Error("Could not load " + url);
                }
            });
        }
    };

    Core.View = Backbone.View.extend({
        el: null,
        renderQueue: false,

        initialize: function() {
            if (this.templateUrl) {
                Core.Template.load(this.templateUrl, function(data) {
                    this.template = data;
                    if (this.renderQueue !== false) {
                        _.each(this.renderQueue, function(item) {
                            this._render.apply(this, item);
                        }.bind(this));

                        this.renderQueue = false;
                    }
                }.bind(this));
            }
        },

        _render: function() {}, //Override this for render proccess

        render: function() {
            if (!this.template) {
                this.renderQueue = this.renderQueue || [];
                this.renderQueue.push(arguments);
                return this;
            }
            return this._render.apply(this, arguments);
        }
    });

})();