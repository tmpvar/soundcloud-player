;(function(window) {

  function Player(options) {
    $.extend(this, options);
    this.controls = {};
    this.layers = [];
    this.render();
    this.bind();

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
    width : 800,
    height : 800,
    fadeInSpeed : 100,
    fadeOutSpeed : 100,
    sound : null,
    init : [],
    render : function() {
      this.el = $(this.selector);
      this.el.addClass('container');
      this.resize();
    },
    resize : function(width, height) {
      this.width = parseInt(width || this.width, 10);
      this.height = parseInt(height || this.height, 10);
      this.el.css({
        width : this.width,
        height: this.height
      });
      this.el.trigger('resize', width);
    },

    bind : function() {
      $('.unselectable', this.el).live('dragstart', function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        return false;
      });
    },

    onTrackInfo : function(o, fn) {
      var that = this;
      this.el.trigger('trackinfo', o);
      this.createSound(o, function() {
        that.el.trigger('loaded');
        if (fn) {
          fn();
        }
      });
    },

    load : function(id, fn) {
      if (this.sound) {
        this.sound.destruct();
        this.sound = null;
      }

      var that = this;
      this.el.trigger('loading');
      if (typeof id === 'number') {
        this.track = id;

        $.ajax({
          url      : 'http://api.soundcloud.com/tracks/' + this.track + '.json?client_id=' + this.soundcloud.key,
          dataType : $.support.cors ? 'json' : 'jsonp',
          success  : function(o) {
            that.onTrackInfo(o, fn);
          }
        });

      } else {
        // find the track via the resolver
        $.ajax({
          url      : 'http://api.soundcloud.com/resolve.json?client_id=' + this.soundcloud.key + '&url=' + id,
          dataType : 'jsonp',
          success  : function(o) {
            that.onTrackInfo(o, fn);
          },
        });
      }
    },

    createSound : function(o, fn) {
      var that = this;
      soundManager.onready(function() {
        that.el.trigger('soundmanager:ready');
        if (that.sound) {
          that.sound.destruct();
        }

        that.sound = soundManager.createSound({
          id : 'soundcloud-sound',
          url: o.stream_url + '?client_id=' + that.soundcloud.key,
          autoLoad: true,
          autoPlay: false,
          stream : true,
          volume: that.volume,
          whileloading : function() {
            that.el.trigger('buffering', { value : this.bytesLoaded, total: this.bytesTotal });
          },
          onfinish : function() {
            that.el.trigger('finished');
          },
          whileplaying : function() {
            that.el.trigger('playing', { value : this.position, total: o.duration })
          }
        });
        that.sound.meta = o;
        if (fn) {
          fn();
        }
        that.el.trigger('sound:created');
      });
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