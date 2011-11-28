;(function(window) {

  function Player(options) {
    $.extend(this, options);
    this.controls = {};
    this.layers = [];
    this.render();

    this.radius = this.width/2 - 3;
    this.center = this.width/2;


    $.extend(soundManager, this.soundManager);

    var current = this.init.length;
    while(current--) {
      this.init[current](this);
    }

    var that = this;
    setInterval(function() {
      that.tick();
    }, 1000/30);
  }

  Player.prototype = {
    width : 400,
    height : 400,
    fadeInSpeed : 100,
    fadeOutSpeed : 100,
    init : [],
    render : function() {
      this.el = $('<div></div>');
      this.el.addClass('container');
      $(this.selector).append(this.el);
    },
    resize : function(width) {
      this.width = parseInt(width, 10);
      this.el.trigger('resize', width);
    },

    load : function(id) {
      var that = this;
      this.el.trigger('loading');
      if (typeof id === 'number') {
        this.track = id;


        $.ajax({
          url      : 'http://api.soundcloud.com/tracks/' + this.track + '.json?client_id=' + this.soundcloud.key,
          dataType : $.support.cors ? 'json' : 'jsonp',
          success  : function(o) {
            that.el.trigger('trackinfo', o);
          }
        });

      } else {
        // find the track via the resolver
        $.ajax({
          url      : 'http://api.soundcloud.com/resolve.json?client_id=' + this.soundcloud.key + '&url=' + id,
          dataType : 'jsonp',
          success  : function(o) {
            that.el.trigger('trackinfo', o);
          },
        });
      }
    },

    tick : function() {
      var current = this.layers.length;
      while (current--) {
        this.layers[current].tick();
      }
    }
  };

  window.Player = Player;

})(window);