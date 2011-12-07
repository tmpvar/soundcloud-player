;(function(window) {

  function Player(options) {
    $.extend(this, {
      selector      : '#player',
      width : 400,
      height: 400,
      volume : storage.volume || 70, // in percent
      soundcloud : {
        key    : 'bc73a3deaf438619d689a1100a066ce1',
      },
      soundManager  : {
        url : 'js/lib/sm2/swf/',
        flashVersion : 9,
        useFlashBlock : false
      },
      theme : {
        progress : {
          background : {
            color : 'rgba(0,0,0,1)',
            radius : 196
          },
          buffering : { // buffer bar
            radius: 110,
            color : "#b0b0b0"
          },
          playing : {
            radius: 196, // waveform highlighter height
            color: "#11db11"
          },
          bufferOverlay : { // buffer bar overlay
            radius: 110,
            color : "rgba(1, 0, 1, 0.5)"
          },
          inner : { // innermost circle
            radius : 105,
            color : 'black'
          }
        },
        waveform : {
          slices : 600, // number of slices to cut the sound cloud wave form into
          height : 100, // height of the waveform to render
          offset : 197, // translate this far off of the center
          color  : "rgba(0,0,0,1)", // color of the waveform
          background : "rgba(255,255,255,1)", // color behind the waveform
          replace : 'white', // initial color that the waveform replaces
          compositeOperations : {
            replace : 'source-over', // bottom of the stack
            background : 'source-out', // replace the waveform
            slice : 'destination-out',
          },
          outerWidth: 5 // skew the waveform slice so it is bigger on the outside of the circle
        },
        loading : {

          slices: 50, // total number of slices
          speed : 4, // fall speed of slices
          rate : 16, // time between slice changes
          fade : {
            hide : 700, // time to fade in in ms
            show : 100 // time to fade out in ms
          },
          inner: {
            radius : 50, // inner circle radius
            color : '#000', // inner circle color
          },
          slice : {
            radius : 200, // maximum size of the slices
            color : '#000', // slice color
          }
        }
      }
    }, options);

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