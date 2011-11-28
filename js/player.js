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
      this.el.trigger('loading');
      if (typeof id === 'number') {
        this.track = id;
      } else {
        // find the track via the resolver
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