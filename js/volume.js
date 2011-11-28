;(function(proto) {

  function Volume(player) {
    this.player = player;
    this.render();
    this.bind();
  }

  Volume.prototype = {
    render : function() {
      if (!this.el) {
        this.el = $('<div></div>');
        this.el.addClass('volume');
        this.el.addClass('unselectable');

        for (var i=0; i<10; i++) {
          this.el.append('<div class="bar"></div>');
        }
        this.player.el.append(this.el);
        this.el.hide();
      }

      this.el.css({
        left  : this.player.center-this.el.width()/2,
        top   : this.player.center+this.player.radius/3.25
      });
    },
    bind : function() {
      var that = this;
      this.player.el.bind('soundmanager:ready', function() {
        that.el.css('display', 'block');
        that.el.css('opacity', 0.9);
      });

      var move = function(e) {
        var
        volumeWidth = that.el.width(),
        volumeOffset = that.el.offset(),
        x = e.clientX - (volumeOffset.left - window.scrollX),
        volume = (x/volumeWidth)*100;

        if (that.player.sound) {
          that.player.sound.setVolume(volume);
        }

        that.update(volume);
        return false;
      }

      $('.bar', this.el).bind('mousemove', this.animate);
      $('.bar', this.el).bind('click', this.animate);

      this.el.bind('click', move);
      this.el.bind('mousedown', function() {
        that.el.bind('mousemove', move);
        that.el.one('mouseup', function() {
          that.el.unbind('mousemove', move);
        });
        return false;
      });

    },

    animate : function() {
      if (!$(this).is('.animating')) {
        var originalHeight = $(this).height();
        $(this).addClass('animating');
        $(this).animate({ 'margin-top' : '-=15', height: '+=15', opacity: 1 }, 200, 'linear', function() {
          $(this).animate({ 'margin-top' : '+=15', height: '-=15', opacity: 0.9 }, 200, 'linear', function() {
            $(this).removeClass('animating');
            $(this).height(originalHeight);
          });
        });
      }
    },
    update : function(volume) {
      $('.bar', this.el).each(function(k) {
        if (k<volume/10) {
          $(this).addClass('active');
        } else {
          $(this).removeClass('active');
        }
      });
    }
  };

  proto.init.push(function(player) {
    new Volume(player);
  });

})(Player.prototype);