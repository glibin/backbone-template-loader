Template loader for Backbone JS
=======

This loader used to make easier to handle templates in Backbone.

Example page available http://glibin.github.com/backbone-template-loader

Usage
============

    window.AppView = Core.View.extend({
        el: $("#all"),

        // Url to template
        templateUrl: '/templates/app.html',

        initialize: function() {
          AppView.__super__.initialize.apply(this); // Call parent initializator

          ...
        },
        // You should rename render function to _render
        _render: function() {
          // Render here, template available in this.template variable (this.template(model))
          this.$('.container').html(this.template({...}));
        },

        ...

    });